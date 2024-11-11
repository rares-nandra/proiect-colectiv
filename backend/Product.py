from flask import Blueprint, jsonify, current_app, request
from bson import ObjectId
from Mongodb import MongoDB  # Import MongoDB class

product_bp = Blueprint('product', __name__)

@product_bp.before_app_first_request
def init_db():
    current_app.mongo = MongoDB(current_app, db_name='mydatabase')  # Set the database

def get_products_collection():
    return current_app.mongo.get_collection('products')

# Route to get products by genre
@product_bp.route('/products/genre/<genre>', methods=['GET'])
def get_products_by_genre(genre):
    products = list(get_products_collection().find({"keywords": genre}))
    for product in products:
        product['_id'] = str(product['_id'])  # Convert ObjectId to string for JSON serialization
    return jsonify(products), 200

# Route to get products by type
@product_bp.route('/products/type/<product_type>', methods=['GET'])
def get_products_by_type(product_type):
    products = list(get_products_collection().find({"keywords": product_type}))
    for product in products:
        product['_id'] = str(product['_id'])  # Convert ObjectId to string for JSON serialization
    return jsonify(products), 200

# Route to get a product by ID
@product_bp.route('/products/<product_id>', methods=['GET'])
def get_product_by_id(product_id):
    try:
        product = get_products_collection().find_one({'_id': ObjectId(product_id)})
        if product:
            product['_id'] = str(product['_id'])  # Convert ObjectId to string for JSON serialization
            return jsonify(product), 200
        return jsonify({'error': 'Product not found'}), 404
    except Exception as e:
        return jsonify({'error': 'Invalid product ID format'}), 400

