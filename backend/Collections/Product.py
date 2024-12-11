from json import dumps
from bson.json_util import dumps
import bson
from flask import Blueprint, jsonify, request
from utils.Mongodb import MongoDB  # Import the MongoDB class
from utils import product_user_match

# Initialize the Blueprint for products
products_bp = Blueprint('products', __name__)

# Initialize MongoDB connections
mongo_products = MongoDB(db_name="SPS", collection_name="products")
mongo_users = MongoDB(db_name="SPS", collection_name="users")  # Users collection
mongo_favorites = MongoDB(db_name="SPS", collection_name="favorites")  # Favorites collection

def authenticate_user(email, password):
    """Verify if a user exists in the users collection with the provided password."""
    user_doc = mongo_users.find_by_field("email", email)
    if user_doc and user_doc.get("password") == password:
        return user_doc
    return None

@products_bp.before_request
def check_authentication():
    """Middleware to check user and password for all routes."""
    user = request.headers.get('email')  # Get 'user' from headers
    password = request.headers.get('password')  # Get 'password' from headers

    if not user or not password:
        return jsonify({"error": "Authentication required"}), 401

    if not authenticate_user(user, password):
        return jsonify({"error": "Invalid username or password"}), 403

@products_bp.route('/products', methods=['GET'])
def get_all_products():
    """Retrieve all products from the products collection."""
    user_email = request.headers.get('email')
    user = mongo_users.find_by_field("email", user_email)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_id = user['_id']
    favorites = mongo_favorites.find_by_field("user_id", user_id)
    favorite_product_ids = {item['product_id'] for item in favorites['items']} if favorites else set()

    products = mongo_products.find_all()
    for product in products:
        product['is_favorite'] = product['_id'] in favorite_product_ids

    return jsonify(product_user_match.sort_by_match(products)), 200

@products_bp.route('/products/category/<category>', methods=['GET'])
def get_products_by_genre(category):
    products = mongo_products.find_by_field("category", category)
    return jsonify(product_user_match.sort_by_match(products)), 200

@products_bp.route('/search_products', methods=['GET'])
def get_products_by_type():
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)

    # Build the filter query
    filter_query = {}

    if min_price is not None and max_price is not None:
        filter_query['price'] = {'$gte': min_price, '$lte': max_price}
    elif min_price is not None:
        filter_query['price'] = {'$gte': min_price}
    elif max_price is not None:
        filter_query['price'] = {'$lte': max_price}

    # Fetch products matching the filter
    products = mongo_products.find(filter_query)
    return jsonify(product_user_match.sort_by_match(products)), 200

@products_bp.route('/products/<product_id>', methods=['GET'])
def get_product_by_id(product_id):
    user_email = request.headers.get('email')
    user = mongo_users.find_by_field("email", user_email)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user_id = user['_id']
    favorites = mongo_favorites.find_by_field("user_id", user_id)
    favorite_product_ids = {item['product_id'] for item in favorites['items']} if favorites else set()

    try:
        product = mongo_products.find_by_id(product_id)
        if product:
            product['is_favorite'] = product['_id'] in favorite_product_ids
            return jsonify(product), 200
        else:
            return jsonify({"error": "Product not found"}), 404
    except (TypeError, ValueError, bson.errors.InvalidId):
        return jsonify({"error": "Invalid product ID"}), 400
