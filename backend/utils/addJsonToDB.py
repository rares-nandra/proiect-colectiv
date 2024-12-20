import json
from pymongo import MongoClient

# MongoDB connection (use the service name "mongodb" defined in docker-compose.yml)
client = MongoClient("mongodb://mongodb:27017/")  # Change "localhost" to "mongodb"
db = client["SPS"]  # Replace with your database name
collection = db["products"]  # Replace with your collection name

# Load data from file and insert into MongoDB
def load_json_to_mongodb(filename):
    # Delete all existing documents in the collection
    collection.delete_many({})
    print("All existing documents deleted.")

    # Load the JSON array from the file and insert each document
    with open(filename, 'r', encoding='utf-8') as file:
        data = json.load(file)

    for document in data:
        try:
            collection.insert_one(document)
            print(f"Inserted: {document['name']}")
        except Exception as e:
            print(f"Failed to insert document: {e}")

# Specify your file name
filename = './utils/db.json'  # Update the path to match your container's structure
load_json_to_mongodb(filename)
