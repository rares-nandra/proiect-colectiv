import bson
from flask import Blueprint, jsonify, request
from utils.Mongodb import MongoDB
from flask_jwt_extended import jwt_required, get_jwt_identity

favorites_bp = Blueprint('favorites', __name__)

# Initialize MongoDB connections
mongo_products = MongoDB(db_name="SPS", collection_name="products")
mongo_users = MongoDB(db_name="SPS", collection_name="users")
mongo_favorites = MongoDB(db_name="SPS", collection_name="favorites")

@favorites_bp.route('/favorites', methods=['GET'])
@jwt_required()
def get_favorites():
    """Retrieve the current user's favorite products."""
    user_id = get_jwt_identity()
    
    # Query to find the favorites based on user ID
    favorites_list = mongo_favorites.find_by_field("user_id", user_id)

    # Handle the case where no document is found
    if not favorites_list:
        return jsonify({"message": "No favorite products found"}), 200

    # Extract the first document (assuming one document per user)
    favorites = favorites_list[0]  # Access the first item in the list

    # Check if 'favorites' key exists in the document
    if 'favorites' not in favorites:
        return jsonify({"message": "Favorites key is missing"}), 500

    # Return the 'favorites' list
    return jsonify(favorites['favorites']), 200



@favorites_bp.route('/addFavorites', methods=['POST'])
@jwt_required()
def add_to_favorites():
    """Add a product to the user's favorite list."""
    user_id = get_jwt_identity()
    data = request.json

    product = data.get('product')
    if not product:
        return jsonify({"error": "Invalid product data"}), 400

    mongo_favorites.update_one(
        {"user_id": user_id},
        {"$addToSet": {"favorites": product}},
        upsert=True
    )

    return jsonify({"message": "Product added to favorites"}), 200


@favorites_bp.route('/deleteFavorites', methods=['POST'])
@jwt_required()
def delete_favorites():
    user_id = get_jwt_identity()
    data = request.json

    product_id = data.get('product', {}).get('_id')  # Extract product ID
    if not product_id:
        return jsonify({"error": "Invalid product data"}), 400

    print("Product ID to delete:", product_id)  # Debugging

    mongo_favorites.update_one(
        {"user_id": user_id},
        {"$pull": {"favorites": {"_id": product_id}}}  # Match by ID
    )

    return jsonify({"message": "Product removed from favorites"}), 200

@favorites_bp.route('/isFavorite/<product_id>', methods=['GET'])
@jwt_required()
def is_favorite(product_id):
    user_id = get_jwt_identity()
    favorites = mongo_favorites.find_one({"user_id": user_id, "items.product_id": product_id})

    if favorites:
        return jsonify({"isFavorite": True}), 200
    return jsonify({"isFavorite": False}), 200
