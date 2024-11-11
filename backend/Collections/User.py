from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

user_bp = Blueprint('user', __name__)
SECRET_KEY = "njcplmsps"

def get_user_collection():
    # Access the MongoDB instance via `current_app`
    return current_app.mongo.get_collection('users')

@user_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    hashed_password = generate_password_hash(password, method='sha256')

    new_user = {
        'username': username,
        'email': email,
        'password': hashed_password,
        'created_at': datetime.datetime.utcnow()
    }

    get_user_collection().insert_one(new_user)
    return jsonify({'message': 'User registered successfully'}), 201

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = get_user_collection().find_one({'email': email})
    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid email or password'}), 401

    token = jwt.encode(
        {'user_id': str(user['_id']), 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)},
        SECRET_KEY,
        algorithm="HS256"
    )
    return jsonify({'token': token}), 200

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('x-access-token')
        if not token:
            return jsonify({'error': 'Token is missing'}), 403

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = get_user_collection().find_one({'_id': data['user_id']})
        except:
            return jsonify({'error': 'Token is invalid or expired'}), 403

        return f(current_user, *args, **kwargs)
    return decorated

@user_bp.route('/user', methods=['GET'])
@token_required
def get_user(current_user):
    return jsonify({
        'username': current_user['username'],
        'email': current_user['email']
    })
