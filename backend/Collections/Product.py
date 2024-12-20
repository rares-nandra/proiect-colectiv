from json import dumps
from bson.json_util import dumps
import bson
from flask import Blueprint, jsonify, request
from utils.Mongodb import MongoDB  # Import the MongoDB class
from utils import product_user_match
from flask_jwt_extended import jwt_required, get_jwt_identity

# Initialize the Blueprint for products
products_bp = Blueprint('products', __name__)

# Initialize MongoDB connections
mongo_products = MongoDB(db_name="SPS", collection_name="products")
mongo_users = MongoDB(db_name="SPS", collection_name="users")  # Users collection
mongo_favorites = MongoDB(db_name="SPS", collection_name="favorites")  # Favorites collection



@products_bp.route('/products', methods=['GET'])
@jwt_required()
def get_all_products():
    """Retrieve all products from the products collection."""
    user_id = get_jwt_identity()

    favorites_doc = mongo_favorites.find_one({"user_id": user_id})
    favorite_product_ids = {fav['_id'] for fav in favorites_doc['favorites']} if favorites_doc else set()

    products = mongo_products.find_all()
    for product in products:
        product['is_favorite'] = product['_id'] in favorite_product_ids

    return jsonify(product_user_match.sort_by_match(products)), 200


@products_bp.route('/products/category/<category>', methods=['GET'])
@jwt_required()
def get_products_by_category(category):
    user_id = get_jwt_identity()
    favorites_doc = mongo_favorites.find_one({"user_id": user_id})
    favorite_product_ids = {fav['_id'] for fav in favorites_doc['favorites']} if favorites_doc else set()

    products = mongo_products.find_by_field("category", category)
    for product in products:
        product['is_favorite'] = product['_id'] in favorite_product_ids

    return jsonify(product_user_match.sort_by_match(products)), 200



@products_bp.route('/search_products', methods=['GET'])
@jwt_required()
def get_products_by_type():
    user_id = get_jwt_identity()
    favorites_doc = mongo_favorites.find_one({"user_id": user_id})
    favorite_product_ids = {fav['_id'] for fav in favorites_doc['favorites']} if favorites_doc else set()

    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    filter_query = {}
    if min_price is not None and max_price is not None:
        filter_query['price'] = {'$gte': min_price, '$lte': max_price}
    elif min_price is not None:
        filter_query['price'] = {'$gte': min_price}
    elif max_price is not None:
        filter_query['price'] = {'$lte': max_price}

    products = mongo_products.find(filter_query)
    for product in products:
        product['is_favorite'] = product['_id'] in favorite_product_ids

    return jsonify(product_user_match.sort_by_match(products)), 200


@products_bp.route('/products/<product_id>', methods=['GET'])
@jwt_required()
def get_product_by_id(product_id):
    user_id = get_jwt_identity()

    favorites_doc = mongo_favorites.find_one({"user_id": user_id})
    favorite_product_ids = {fav['_id'] for fav in favorites_doc['favorites']} if favorites_doc else set()

    try:
        product = mongo_products.find_by_id(product_id)
        if product:
            product['is_favorite'] = product['_id'] in favorite_product_ids
            return jsonify(product), 200
        else:
            return jsonify({"error": "Product not found"}), 404
    except (TypeError, ValueError, bson.errors.InvalidId):
        return jsonify({"error": "Invalid product ID"}), 400
