from flask import Flask, jsonify
from flask_cors import CORS
from Collections.User import user_bp  # Import user blueprint
from Collections.Product import products_bp  # Import the products Blueprint

def create_app():
    app = Flask(__name__)

    CORS(app, resources={
        r"/*": {
            "origins": ["http://localhost:3000", "http://127.0.0.1:3000"]
        }
    })

    app.register_blueprint(user_bp, url_prefix='/auth')
    app.register_blueprint(products_bp)

    @app.route('/ping', methods=['GET'])
    def pong():
        data = {
            "ping": "pong"
        }
        return jsonify(data)

    return app


if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=5000)

