from pymongo import MongoClient
from bson.objectid import ObjectId
import os

class MongoDB:
    def __init__(self, db_name, collection_name, uri=None):
        self.uri = uri or os.getenv("MONGO_URI", "mongodb://localhost:27017")
        self.client = MongoClient(self.uri)
        self.db = self.client[db_name]
        self.collection = self.db[collection_name]

    def _convert_objectid(self, doc):
        """Convert ObjectId fields to strings in a MongoDB document."""
        if '_id' in doc:
            doc['_id'] = str(doc['_id'])
        return doc

    def find_all(self):
        """Retrieve all documents and convert ObjectId fields."""
        documents = self.collection.find({})
        return [self._convert_objectid(doc) for doc in documents]

    def find_one(self, query):
        """Find a single document and convert ObjectId fields."""
        document = self.collection.find_one(query)
        return self._convert_objectid(document) if document else None

    def find_by_id(self, document_id):
        """Retrieve a document by its ObjectId and convert ObjectId fields."""
        document = self.collection.find_one({"_id": ObjectId(document_id)})
        return self._convert_objectid(document) if document else None

    def insert_one(self, document):
        """Insert a single document into the collection."""
        return self.collection.insert_one(document).inserted_id

    def update_one(self, query, update_values):
        """Update a single document in the collection."""
        return self.collection.update_one(query, {"$set": update_values}).modified_count

    def delete_one(self, query):
        """Delete a single document from the collection."""
        return self.collection.delete_one(query).deleted_count

    def find_by_field(self, field, value):
        """Retrieve documents based on a field-value match."""
        result = list(self.collection.find({field: value}))
        return [self._convert_objectid(doc) for doc in result]

    def find(self, value):
        """Retrieve documents based on a field-value match."""
        result = list(self.collection.find(value))
        return [self._convert_objectid(doc) for doc in result]

