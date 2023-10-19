from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()
mongo_url = os.getenv("MONGODB_URI")

#Base de datos local
db_client = MongoClient()

#Base de datos remota
db_client = MongoClient(mongo_url).Novedades
