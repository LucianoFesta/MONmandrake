from typing import List
from fastapi import APIRouter, HTTPException, status, Query, Depends
from database.models.novedad import Novedad
from database.connectDB import db_client
from database.schemas.novedad import novedadSchema
from bson import ObjectId
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt.exceptions import DecodeError

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

router = APIRouter(prefix="/novedades", 
                   tags=["novedades"], 
                   responses={status.HTTP_404_NOT_FOUND: {"message":"No encontrado."}})


@router.get("/listado", response_model=List[Novedad], status_code=status.HTTP_200_OK)
async def findAll(token: str = Depends(oauth2_scheme)):
    
    validated_token = validate_token(token)
    
    if validated_token:
        
        list = db_client.novedads.find()
        listSort = sorted(list, key=lambda novedad: novedad['fechaNovedad'], reverse=True)
        result = [Novedad(**novedadSchema(item)) for item in listSort]

        return result


@router.get("/listByKeyword", response_model=List[Novedad], status_code=status.HTTP_200_OK)
async def getListFilteredByKeyword(token: str = Depends(oauth2_scheme), keyword: str = Query(..., description='Palabra clave')):
    validated_token = validate_token(token)
    
    if not keyword:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='No existe palabra clave a buscar.')
    
    if validated_token:
        query = {
            "$or": [
                {"descripcion": {'$regex': keyword, '$options': 'i'}},
                {"titulo": {'$regex': keyword, '$options': 'i'}}
            ]
        }

        listFiltered = db_client.novedads.find(query)
        listFiltered = sorted(listFiltered, key=lambda novedad: novedad['fechaNovedad'], reverse=True)
        
        result = [Novedad(**novedadSchema(item)) for item in listFiltered]
        
        return result


@router.get("/listByTags", response_model=List[Novedad], status_code=status.HTTP_200_OK)
async def getListFilteredByTags(token: str = Depends(oauth2_scheme), tags:List[str] = Query(..., description='Lista de Tags')):
    validated_token = validate_token(token)
    
    if not tags:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='No existen tags a buscar.')
    
    if validated_token:
    
        listFiltered = db_client.novedads.find({'etiquetas':{'$all':tags}}) #All hace que devuelva los que tienen todos los tags.
        listFiltered = sorted(listFiltered, key=lambda novedad:novedad['fechaNovedad'], reverse=True)
        
        result = [Novedad(**novedadSchema(item)) for item in listFiltered]

        return result
  

@router.get("/listByKeywordAndTags", response_model=List[Novedad], status_code=status.HTTP_200_OK)
async def getListFilteredByKeywordAndTags(keyword:str, tags:List[str] = Query(..., description='Palabra clave y tags'), token: str = Depends(oauth2_scheme)):
    validated_token = validate_token(token)
    
    if not keyword and tags:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='No existen tags y palabra clave a buscar.')
    
    if validated_token:
    
        query = {
            "$or": [
                {"descripcion": {'$regex': keyword, '$options': 'i'}},
                {"titulo": {'$regex': keyword, '$options': 'i'}}
            ],
            'etiquetas':{'$all':tags}
        }
        
        listFiltered = db_client.novedads.find(query)
        listFiltered = sorted(listFiltered, key=lambda novedad:novedad['fechaNovedad'], reverse=True)
        
        result = [Novedad(**novedadSchema(item)) for item in listFiltered]
        
        return result  


@router.get("/buscarNovedad/{id}", response_model=Novedad, status_code=status.HTTP_200_OK)
async def findById(id:str, token: str = Depends(oauth2_scheme)):
    validated_token = validate_token(token)
    
    if validated_token:
        
        return buscarNovedad("_id", ObjectId(id))


@router.post("/crearNovedad", response_model=Novedad, status_code=status.HTTP_201_CREATED)
async def createNovedad(novedad:Novedad, token: str = Depends(oauth2_scheme)):
    validated_token = validate_token(token)
    
    if validated_token:
        novedad_dict = dict(novedad)
        
        #Eliminamos el id null que agrega.
        del novedad_dict["id"]
        
        #Obtenermos el id una vez que ya lo inserta en la db.
        id = db_client.novedads.insert_one(novedad_dict).inserted_id
        
        #Buscamos ese usuario almacenado mediante el id creado por mongo (devuelve json).
        #Lo transformamos en Novedad para devolverlo -> schema.
        newNovedad = novedadSchema(db_client.novedads.find_one({"_id":id}))
        
        return Novedad(**newNovedad)


@router.delete("/eliminarNovedad/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def deleteNovedad(id:str, token: str = Depends(oauth2_scheme)):
    
    novedadExist = db_client.novedads.find_one_and_delete({"_id":ObjectId(id)})
    
    validated_token = validate_token(token)
    
    if validated_token:
    
        if not novedadExist:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                                detail= 'No se encontró la novedad a eliminar.')
        else:
            return {"Eliminación":"La novedad ha sido eliminada."}
    

@router.put("/editarNovedad/{id}", response_model=Novedad, status_code=status.HTTP_200_OK)
async def editNovedad(novedad:Novedad, id:str, token: str = Depends(oauth2_scheme)):
    
    novedad_dict = dict(novedad)
    del novedad_dict["id"];
    
    validated_token = validate_token(token)
    
    if validated_token:
         
        try:
            db_client.novedads.find_one_and_replace({"_id":ObjectId(id)},novedad_dict)
        except:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                                detail= 'No se encontró la novedad a editar.')
        
        return buscarNovedad("_id", ObjectId(id))



def validate_token(token: str):
    try:
        decode_jwt = jwt.decode(token, options={"verify_signature": False})

        if 'resource_access' in decode_jwt:
            monstatuspage_data = decode_jwt['resource_access']['monstatuspage']

            if 'ADMIN' in monstatuspage_data['roles']:
                return True
            else:
                raise HTTPException(status_code=403, detail='No tienes permisos para acceder a esta ruta')
        else:
            raise HTTPException(status_code=403, detail='No tienes permisos para acceder a esta ruta')
    except jwt.exceptions.DecodeError:
        raise HTTPException(status_code=401, detail='Token inválido')


def buscarNovedad(campo:str, key):
    try:
        novedad = db_client.novedads.find_one({campo:key})
        return Novedad(**novedadSchema(novedad))
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                            detail= 'No existe la novedad con dicho id.')

