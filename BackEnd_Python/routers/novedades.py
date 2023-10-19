from typing import List
from fastapi import APIRouter, HTTPException, status
from database.models.novedad import Novedad
from database.connectDB import db_client
from database.schemas.novedad import novedadSchema, novedadesSchema
from bson import ObjectId

router = APIRouter(prefix="/novedades", 
                   tags=["novedades"], 
                   responses={status.HTTP_404_NOT_FOUND: {"message":"No encontrado."}})


@router.get("/listado", response_model=List[Novedad], status_code=status.HTTP_200_OK)
async def findAll():
    return novedadesSchema(db_client.novedads.find())


@router.get("/buscarNovedad/{id}", response_model=Novedad, status_code=status.HTTP_200_OK)
async def findById(id:str):
    return buscarNovedad("_id", ObjectId(id))


@router.post("/crearNovedad", response_model=Novedad, status_code=status.HTTP_201_CREATED)
async def createNovedad(novedad:Novedad):
    
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
async def deleteNovedad(id:str):
    
    novedadExist = db_client.novedads.find_one_and_delete({"_id":ObjectId(id)})
    
    if not novedadExist:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                            detail= 'No se encontró la novedad a eliminar.')
    else:
        return {"Eliminación":"La novedad ha sido eliminada."}
    

@router.put("/editarNovedad/{id}", response_model=Novedad, status_code=status.HTTP_200_OK)
async def editNovedad(novedad:Novedad, id:str):
    
    novedad_dict = dict(novedad)
    del novedad_dict["id"];
    
    try:
        db_client.novedads.find_one_and_replace({"_id":ObjectId(id)},novedad_dict)
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                            detail= 'No se encontró la novedad a editar.')
    
    return buscarNovedad("_id", ObjectId(id))


def buscarNovedad(campo:str, key):
    try:
        novedad = db_client.novedads.find_one({campo:key})
        return Novedad(**novedadSchema(novedad))
    except:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, 
                            detail= 'No existe la novedad con dicho id.')

