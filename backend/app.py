from flask import Flask, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from User import user_bp, mongo
from backend.Product import product_bp

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app.config["MONGO_URI"] = 'mongodb://mongodb:27017/example_db'
mongo.init_app(app)  

app.register_blueprint(user_bp, url_prefix='/auth')
app.register_blueprint(product_bp)

@app.route('/ping', methods=['GET'])
def pong():
    data = {
        "ping": "pong"
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
