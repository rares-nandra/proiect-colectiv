import bson
from flask import Blueprint, jsonify
from backend.utils.Mongodb import MongoDB  # Import the MongoDB class

# Initialize the Blueprint for products
products_bp = Blueprint('products', __name__)

# Initialize MongoDB connection with the "products" collection
mongo = MongoDB(db_name="mydatabase", collection_name="Products")


@products_bp.route('/products', methods=['GET'])
def get_all_products():
    """Retrieve all products from the products collection."""
    products = mongo.find_all()
    return jsonify(products), 200

@products_bp.route('/products/genre/<genre>', methods=['GET'])
def get_products_by_genre(genre):
    products = mongo.find_by_field("keywords", genre)
    return jsonify(products), 200

@products_bp.route('/products/type/<product_type>', methods=['GET'])
def get_products_by_type(product_type):
    products = mongo.find_by_field("keywords", product_type)
    return jsonify(products), 200

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




