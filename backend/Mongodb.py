from flask_pymongo import PyMongo
from pymongo.collection import Collection
from pymongo.database import Database
from flask import Flask

class MongoDB:
    def __init__(self, app: Flask, db_name: str):
        self.mongo = PyMongo(app)
        self.db_name = db_name

    def get_database(self) -> Database:
        return self.mongo.cx[self.db_name]

    def get_collection(self, collection_name: str) -> Collection:
        return self.get_database()[collection_name]
