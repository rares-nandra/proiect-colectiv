from json import dumps
from bson.json_util import dumps
import bson
from flask import Blueprint, jsonify, request
from utils.Mongodb import MongoDB  # Import the MongoDB class

# Initialize the Blueprint for cart
cart_bp = Blueprint('cart', __name__)

# Initialize MongoDB connections
mongo_products = MongoDB(db_name="SPS", collection_name="products")
mongo_users = MongoDB(db_name="SPS", collection_name="users")
mongo_carts = MongoDB(db_name="SPS", collection_name="carts")  # Carts collection

def authenticate_user(email, password):
    """Verify if a user exists in the users collection with the provided password."""
    user_doc = mongo_users.find_by_field("email", email)
    if user_doc and user_doc.get("password") == password:
        return user_doc  # Return the user document
    return None

@cart_bp.before_request
def check_authentication():
    """Middleware to check user and password for all routes."""
    email = request.headers.get('email')  # Get 'email' from headers
    password = request.headers.get('password')  # Get 'password' from headers

    if not email or not password:
        return jsonify({"error": "Authentication required"}), 401

    user = authenticate_user(email, password)
    if not user:
        return jsonify({"error": "Invalid username or password"}), 403

    request.user = user  # Attach the user document to the request

@cart_bp.route('/cart', methods=['GET'])
def get_cart():
    """Retrieve the current user's cart."""
    user_id = request.user['_id']
    cart = mongo_carts.find_by_field("user_id", user_id)
    if not cart:
        return jsonify({"message": "Cart is empty"}), 200
    return jsonify(cart), 200

@cart_bp.route('/cart', methods=['POST'])
def add_to_cart():
    """Add a product to the user's cart."""
    user_id = request.user['_id']
    product_id = request.json.get('product_id')
    quantity = request.json.get('quantity', 1)

    try:
        product = mongo_products.find_by_id(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
    except (TypeError, ValueError, bson.errors.InvalidId):
        return jsonify({"error": "Invalid product ID"}), 400

    cart = mongo_carts.find_by_field("user_id", user_id) or {"user_id": user_id, "items": []}

    # Check if product already exists in the cart
    for item in cart['items']:
        if item['product_id'] == product_id:
            item['quantity'] += quantity
            break
    else:
        cart['items'].append({"product_id": product_id, "quantity": quantity})

    mongo_carts.update_or_insert({"user_id": user_id}, cart)
    return jsonify({"message": "Product added to cart"}), 200

@cart_bp.route('/cart', methods=['DELETE'])
def remove_from_cart():
    """Remove a product from the user's cart."""
    user_id = request.user['_id']
    product_id = request.json.get('product_id')

    cart = mongo_carts.find_by_field("user_id", user_id)
    if not cart:
        return jsonify({"error": "Cart not found"}), 404

    cart['items'] = [item for item in cart['items'] if item['product_id'] != product_id]

    mongo_carts.update_or_insert({"user_id": user_id}, cart)
    return jsonify({"message": "Product removed from cart"}), 200

@cart_bp.route('/cart/checkout', methods=['POST'])
def checkout_cart():
    """Checkout the user's cart."""
    user_id = request.user['_id']
    cart = mongo_carts.find_by_field("user_id", user_id)
    if not cart or not cart['items']:
        return jsonify({"error": "Cart is empty"}), 400

    # Implement checkout logic here (e.g., payment processing, order creation)
    mongo_carts.delete_by_field("user_id", user_id)  # Clear the cart after checkout
    return jsonify({"message": "Checkout successful"}), 200

