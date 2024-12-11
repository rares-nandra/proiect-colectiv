from flask import Flask, jsonify
from flask_cors import CORS

from Collections.User import user_bp
from Collections.Product import products_bp
from Collections.Cart import cart_bp
from Collections.Favorites import favorites_bp
from Spotify.Auth import spotify_auth_bp, set_spotify_auth_obj

from dotenv import load_dotenv
import os

def create_app():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    env_path = os.path.join(base_dir, '.env')
    load_dotenv(env_path)
    set_spotify_auth_obj()

    app = Flask(__name__)

    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"]
        }
    })

    app.register_blueprint(user_bp, url_prefix='/auth')
    app.register_blueprint(products_bp)
    app.register_blueprint(favorites_bp)
    app.register_blueprint(cart_bp)
    app.register_blueprint(spotify_auth_bp, url_prefix='/spotify-auth')
    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)

