from flask import Flask, jsonify
from flask_cors import CORS

from pymongo import MongoClient

CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

app = Flask(__name__)

client = MongoClient('mongodb://mongodb:27017/')
db = client['example_db']

@app.route('/ping', methods=['GET'])
def pong():
    data = {
        "ping": "pong"
    }

    return jsonify(data)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)