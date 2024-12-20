import bson
from flask import Blueprint, jsonify, request
from utils.Mongodb import MongoDB
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

checkout_bp = Blueprint('checkout', __name__)

# Initialize MongoDB connections
mongo_cart = MongoDB(db_name="SPS", collection_name="cart")
mongo_orders = MongoDB(db_name="SPS", collection_name="orders")
mongo_products = MongoDB(db_name="SPS", collection_name="products")

@checkout_bp.route('/cart', methods=['GET'])
@jwt_required()
def get_cart():
    """Retrieve the current user's cart."""
    user_id = get_jwt_identity()
    cart = mongo_cart.find_one({"user_id": user_id})

    if not cart or "items" not in cart:
        return jsonify({"message": "Cart is empty"}), 200

    return jsonify(cart["items"]), 200


@checkout_bp.route('/checkout', methods=['POST'])
@jwt_required()
def checkout():
    """Place an order for the items in the cart, with validation for all provided fields."""
    user_id = get_jwt_identity()
    data = request.json

    # Extract data
    shipping = data.get("shipping", {})
    billing = data.get("billing", {})
    payment = data.get("payment", {})
    payment_method = data.get("paymentMethod")

    # Define required fields
    required_shipping_fields = ["fullName", "address", "city", "zipCode", "country", "phone"]
    required_billing_fields = ["fullName", "address", "city", "zipCode", "country"]
    required_payment_fields = ["cardNumber", "cardName", "expiryDate", "cvc"]
    
    # Validate that paymentMethod is provided
    if not payment_method:
        return jsonify({"error": "Payment method is required."}), 400

    # Validate shipping fields
    for field in required_shipping_fields:
        if not shipping.get(field):
            return jsonify({"error": f"Missing required shipping field: {field}"}), 400

    # Validate billing fields
    for field in required_billing_fields:
        if not billing.get(field):
            return jsonify({"error": f"Missing required billing field: {field}"}), 400

    # Validate payment fields
    for field in required_payment_fields:
        if not payment.get(field):
            return jsonify({"error": f"Missing required payment field: {field}"}), 400

    # Additional optional checks:
    # For example, validate format of expiryDate, cardNumber length, phone format, etc.
    # These can be implemented as per your business logic, for example:
    # if len(payment.get("cardNumber")) < 16:
    #     return jsonify({"error": "Invalid card number. Must be at least 16 digits."}), 400

    # Check the cart items
    cart = mongo_cart.find_one({"user_id": user_id})
    if not cart or "items" not in cart or len(cart["items"]) == 0:
        return jsonify({"error": "Your cart is empty."}), 400

    # Everything is valid, create the order
    order = {
        "user_id": user_id,
        "items": cart["items"],
        "shipping": shipping,
        "billing": billing,
        "payment_info": payment,
        "payment_method": payment_method,
        "status": "pending",
        "created_at": datetime.utcnow()
    }

    mongo_orders.insert_one(order)

    # Clear the user's cart after placing the order
    mongo_cart.update_one({"user_id": user_id}, {"$set": {"items": []}})

    return jsonify({"message": "Order placed successfully", "order_id": str(order["_id"])}), 200


@checkout_bp.route('/cart/update', methods=['POST'])
@jwt_required()
def update_cart_item():
    """Update the quantity of a product in the user's cart or add it if it doesn't exist."""
    user_id = get_jwt_identity()
    data = request.json

    product_id = data.get("product_id")
    quantity = data.get("quantity")

    if not product_id or quantity is None:
        return jsonify({"error": "Product ID and quantity are required"}), 400

    # Find the cart
    cart = mongo_cart.find_one({"user_id": user_id})
    if not cart:
        # Create a new cart for the user if none exists
        mongo_cart.insert_one({"user_id": user_id, "items": []})
        cart = {"user_id": user_id, "items": []}

    # Check if product is in the cart
    item = next((item for item in cart["items"] if item["product_id"] == product_id), None)

    if item:
        # If product exists, update its quantity
        new_quantity = quantity
        if new_quantity <= 0:
            # Remove product if quantity ≤ 0
            mongo_cart.update_one(
                {"user_id": user_id},
                {"$pull": {"items": {"product_id": product_id}}}
            )
        else:
            mongo_cart.update_one(
                {"user_id": user_id, "items.product_id": product_id},
                {"$set": {"items.$.quantity": new_quantity}}
            )
    else:
        # Product not in cart, add with given quantity (if quantity > 0)
        if quantity > 0:
            new_item = {
                "product_id": product_id,
                "name": data.get("name"),
                "price": data.get("price"),
                "quantity": quantity,
                "image": data.get("image")
            }
            mongo_cart.update_one(
                {"user_id": user_id},
                {"$push": {"items": new_item}}
            )

    return jsonify({"message": "Cart updated successfully"}), 200
