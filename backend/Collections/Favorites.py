import bson
from flask import Blueprint, jsonify, request
from utils.Mongodb import MongoDB

favorites_bp = Blueprint('favorites', __name__)

# Initialize MongoDB connections
mongo_products = MongoDB(db_name="SPS", collection_name="products")
mongo_users = MongoDB(db_name="SPS", collection_name="users")
mongo_favorites = MongoDB(db_name="SPS", collection_name="favorites")

def authenticate_user(email, password):
    """Verify if a user exists in the users collection with the provided password."""
    user_doc = mongo_users.find_by_field("email", email)
    if user_doc and user_doc.get("password") == password:
        return user_doc  # Return the user document
    return None

@favorites_bp.before_request
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

@favorites_bp.route('/favorites', methods=['GET'])
def get_favorites():
    """Retrieve the current user's favorite products."""
    user_id = request.user['_id']
    favorites = mongo_favorites.find_by_field("user_id", user_id)
    if not favorites:
        return jsonify({"message": "No favorite products found"}), 200
    return jsonify(favorites), 200

@favorites_bp.route('/favorites', methods=['POST'])
def add_to_favorites():
    """Add a product to the user's favorite list."""
    user_id = request.user['_id']
    product_id = request.json.get('product_id')

    try:
        product = mongo_products.find_by_id(product_id)
        if not product:
            return jsonify({"error": "Product not found"}), 404
    except (TypeError, ValueError, bson.errors.InvalidId):
        return jsonify({"error": "Invalid product ID"}), 400

    favorites = mongo_favorites.find_by_field("user_id", user_id) or {"user_id": user_id, "items": []}

    # Check if product already exists in favorites
    if product_id in [item['product_id'] for item in favorites['items']]:
        return jsonify({"message": "Product already in favorites"}), 200

    favorites['items'].append({"product_id": product_id})
    mongo_favorites.update_or_insert({"user_id": user_id}, favorites)
    return jsonify({"message": "Product added to favorites"}), 200

@favorites_bp.route('/favorites', methods=['DELETE'])
def remove_from_favorites():
    """Remove a product from the user's favorite list."""
    user_id = request.user['_id']
    product_id = request.json.get('product_id')

    favorites = mongo_favorites.find_by_field("user_id", user_id)
    if not favorites:
        return jsonify({"error": "Favorites not found"}), 404

    favorites['items'] = [item for item in favorites['items'] if item['product_id'] != product_id]

    mongo_favorites.update_or_insert({"user_id": user_id}, favorites)
    return jsonify({"message": "Product removed from favorites"}), 200
