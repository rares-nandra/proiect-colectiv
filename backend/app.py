from flask import Flask, jsonify
from flask_cors import CORS

from Collections.User import user_bp
from Collections.Product import products_bp
from Collections.Cart import checkout_bp
from Collections.Favorites import favorites_bp
from Spotify.Auth import spotify_auth_bp, set_spotify_auth_obj
from flask_jwt_extended import JWTManager

from dotenv import load_dotenv
import os


def create_app():
    app = Flask(__name__)
    app.config['JWT_SECRET_KEY'] = 'secret-key'
    jwt = JWTManager(app)

    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"]
        }
    })
    app.register_blueprint(user_bp, url_prefix='/auth')
    app.register_blueprint(products_bp)
    app.register_blueprint(favorites_bp)
    app.register_blueprint(checkout_bp)
    app.register_blueprint(spotify_auth_bp, url_prefix='/spotify-auth')
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5001)

