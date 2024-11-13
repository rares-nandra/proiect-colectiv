from json import dumps
from bson.json_util import dumps
import bson
from flask import Blueprint, jsonify, request
from backend.utils.Mongodb import MongoDB  # Import the MongoDB class
from backend.utils import product_user_match

# Initialize the Blueprint for products
products_bp = Blueprint('products', __name__)

# Initialize MongoDB connection with the "products" collection
mongo = MongoDB(db_name="SPS", collection_name="products")

@products_bp.route('/products', methods=['GET'])
def get_all_products():
    """Retrieve all products from the products collection."""
    products = mongo.find_all()

    #     # id: string;
    #     # name: string;
    #     # description: string;
    #     # imageUrl: string;
    #     # price: number;
    #     # category: string;
    #     # additional: any;
    #     # matchPercentage: number;
    #     # keywords: Array<string>;

    return jsonify(product_user_match.sort_by_match(products)), 200

@products_bp.route('/products/category/<category>', methods=['GET'])
def get_products_by_genre(category):
    products = mongo.find_by_field("category", category)
    return jsonify(product_user_match.sort_by_match(products)), 200

#search_products?min_price=60&max_price=70
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
    products = mongo.find(filter_query)

    return jsonify(product_user_match.sort_by_match(products)), 200

@products_bp.route('/products/<product_id>', methods=['GET'])
def get_product_by_id(product_id):
    try:
        product = mongo.find_by_id(product_id)
    except (TypeError, ValueError, bson.errors.InvalidId):
        return jsonify({"error": "Invalid product ID"}), 400
    if product:
        return jsonify(product), 200
    else:
        return jsonify({"error": "Product not found"}), 404