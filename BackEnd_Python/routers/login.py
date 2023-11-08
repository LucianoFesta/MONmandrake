import requests
import json
from fastapi import APIRouter, Form, status, HTTPException
import os
from dotenv import load_dotenv
from configparser import ConfigParser

configFile = 'config.ini'

config = ConfigParser()
config.read(configFile)


# load_dotenv()
client_id = config.get('configuration', 'client_id')
cookie = config.get('configuration', 'cookie')
keycloak_url = config.get('configuration', 'keycloak_url')
grant_type= config.get('configuration', 'grant_type')


router = APIRouter(prefix="/login", 
                   responses={status.HTTP_404_NOT_FOUND: {"message":"No encontrado."}})

@router.post("/")
def get_token(username: str = Form(...), password:str = Form(...)):
    
    payload = f"client_id={client_id}&username={username}&grant_type={grant_type}&password={password}"
    headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookie
    }
    requests.packages.urllib3.disable_warnings()
    response = requests.request("POST", keycloak_url, headers=headers, data=payload, verify=False)
    token =json.loads(response.text)
    
    if "access_token" not in token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Usuario no autorizado')
    
    return token
