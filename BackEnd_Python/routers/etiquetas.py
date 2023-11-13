from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.encoders import jsonable_encoder
from fastapi.security import OAuth2PasswordBearer
from database.models.etiqueta import Etiqueta
from database.schemas.etiqueta import etiquetaSchema
from database.connectDB import db_client
from bson import ObjectId

from routers.novedades import validate_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


router = APIRouter(prefix="/etiquetas", 
                   tags=["etiquetas"], 
                   responses={status.HTTP_404_NOT_FOUND: {"message":"No encontrado."}})


@router.get("/listado", response_model=List[Etiqueta], status_code=status.HTTP_200_OK)
async def findAll(token: str = Depends(oauth2_scheme)):
    
    validated_token = validate_token(token)
    
    if validated_token:
    
        list = db_client.etiquetas.find()
        listSort = sorted(list, key=lambda etiqueta:etiqueta['name'])
        result = [Etiqueta(**etiquetaSchema(item)) for item in listSort]
    
        return result

@router.post("/crearEtiqueta", response_model=Etiqueta, status_code=status.HTTP_201_CREATED)
async def createEtiqueta(etiqueta:Etiqueta, token: str = Depends(oauth2_scheme)):
    
    validated_token = validate_token(token)
    
    if validated_token:
    
        etiqueta_dict = dict(etiqueta)
    
        #Eliminamos el id null que agrega.
        del etiqueta_dict["id"]
    
        #Obtenermos el id una vez que ya lo inserta en la db.
        id = db_client.etiquetas.insert_one(etiqueta_dict).inserted_id
    
        #Buscamos ese usuario almacenado mediante el id creado por mongo (devuelve json).
        #Lo transformamos en Novedad para devolverlo -> schema.
        newEtiqueta = etiquetaSchema(db_client.etiquetas.find_one({"_id":id}))
    
        return Etiqueta(**newEtiqueta)

@router.delete("/eliminarEtiqueta/{id}", status_code=status.HTTP_200_OK)
async def eliminarEtiqueta(id:str, token: str = Depends(oauth2_scheme)):
    
    validated_token = validate_token(token)
    
    if validated_token:
    
        etiquetaExist = db_client.etiquetas.find_one_and_delete({"_id":ObjectId(id)})
    
        if not etiquetaExist:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                                detail= 'No se encontró la etiqueta a eliminar.')
        else:
            return {"Eliminación":"La etiqueta ha sido eliminada."}
    
@router.put("/editarEtiqueta/{id}", response_model=Etiqueta, status_code=status.HTTP_200_OK)
async def editEtiqueta(etiqueta:Etiqueta, id:str, token: str = Depends(oauth2_scheme)):
    
    validated_token = validate_token(token)
    
    if validated_token:
    
        etiqueta_dict = dict(etiqueta)
        del etiqueta_dict["id"];
        
        try:
            db_client.etiquetas.find_one_and_replace({"_id":ObjectId(id)},etiqueta_dict)
        except:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                                detail= 'No se encontró la etiqueta a editar.')
        
        return buscarEtiqueta("_id", ObjectId(id))

def buscarEtiqueta(campo:str, key):
    try:
        etiqueta = db_client.etiquetas.find_one({campo:key})
        return Etiqueta(**etiquetaSchema(etiqueta))
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                            detail= 'No existe la etiqueta con dicho id.')