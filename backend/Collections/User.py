from flask import Blueprint, request, jsonify, current_app
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, verify_jwt_in_request
import datetime
from utils.Mongodb import MongoDB

user_bp = Blueprint('user', __name__)
bcrypt = Bcrypt()
jwt = JWTManager()
users_collection = MongoDB(db_name="SPS", collection_name="users")

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if users_collection.find_one({'email': username}):
        return jsonify({"msg": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    users_collection.insert_one({'email': username, 'password': hashed_password})
    return jsonify({"msg": "User registered successfully"}), 201


@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = users_collection.find_one({'email': username})
    if not user or not bcrypt.check_password_hash(user['password'], password):
        return jsonify({"msg": "Invalid username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify({"access_token": access_token}), 200

@user_bp.route('/validate-token', methods=['POST'])
@jwt_required()
def validate_token():
    try:
        verify_jwt_in_request()
        return jsonify({"message": "Token is valid"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 401

