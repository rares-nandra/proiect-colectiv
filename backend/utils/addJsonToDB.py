import json
from pymongo import MongoClient

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")
db = client["SPS"]  # replace with your database name
collection = db["products"]  # replace with your collection name

# Load data from file and insert into MongoDB
def load_json_to_mongodb(filename):
    with open(filename, 'r', encoding='utf-8') as file:
        data = json.load(file)  # Load the JSON array from the file

    # Insert each document from the JSON array
    for document in data:
        try:
            collection.insert_one(document)
            print(f"Inserted: {document['name']}")
        except Exception as e:
            print(f"Failed to insert document: {e}")
# Specify your file name
filename = 'message.txt'  # replace with your file path
load_json_to_mongodb(filename)
