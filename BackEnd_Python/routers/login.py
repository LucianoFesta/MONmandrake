import requests
import json
from fastapi import APIRouter, Form, status, HTTPException

router = APIRouter(prefix="/login", 
                   responses={status.HTTP_404_NOT_FOUND: {"message":"No encontrado."}})

cookie = '75f8e7a40913f5de3f1eac946a82305a=034a6f312e4f581a16776ed53ccb0f17'
client_id = "monstatuspage"

@router.post("/")
def get_token(username: str = Form(...), password:str = Form(...)):
    grant_type = 'password'
    keycloak_url = "https://sso-test.sancorsalud.com.ar/auth/realms/sancorsalud/protocol/openid-connect/token"
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
