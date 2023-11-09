from pymongo import MongoClient
from configparser import ConfigParser

configFile = 'configuration.ini'

config = ConfigParser()
config.read(configFile)

mongo_url = config.get('configuration', 'MONGODB_URI')

#Base de datos local
db_client = MongoClient()

#Base de datos remota
db_client = MongoClient(mongo_url).Novedades
