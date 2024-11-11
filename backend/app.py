# app.py

from flask import Flask, jsonify
from flask_cors import CORS
from Mongodb import MongoDB  # Import MongoDB class
from User import user_bp  # Import user blueprint
from Product import products_bp  # Import the products Blueprint

def create_app():
    # Initialize Flask app
    app = Flask(__name__)

    # Set up CORS to allow requests from localhost:3000
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    # Register blueprints
    app.register_blueprint(user_bp, url_prefix='/auth')
    app.register_blueprint(products_bp)

    # Test route
    @app.route('/ping', methods=['GET'])
    def pong():
        data = {
            "ping": "pong"
        }
        return jsonify(data)

    return app


# Run the app if this file is executed directly
if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5001)

