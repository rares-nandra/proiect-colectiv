from flask import Blueprint, request, jsonify, current_app
import datetime

user_bp = Blueprint('user', __name__)

def get_user_collection():
    """Access the MongoDB instance via `current_app`."""
    return current_app.mongo.get_collection('users')

@user_bp.route('/register', methods=['POST'])
def register():
    """Register a new user."""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing required fields'}), 400

    # Check if the user already exists
    if get_user_collection().find_one({'email': email}):
        return jsonify({'error': 'User with this email already exists'}), 409

    new_user = {
        'email': email,
        'password': password,
        'created_at': datetime.datetime.utcnow()
    }

    get_user_collection().insert_one(new_user)
    return jsonify({'message': 'User registered successfully'}), 201

@user_bp.route('/login', methods=['POST'])
def login():
    """Log in a user."""
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'error': 'Missing email or password'}), 400

    user = get_user_collection().find_one({'email': email})

    if not user or user['password'] != password:
        return jsonify({'error': 'Invalid email or password'}), 401

    return jsonify({'message': 'Login successful'}), 200

