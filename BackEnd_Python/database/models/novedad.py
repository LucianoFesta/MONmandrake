from typing import List
from pydantic import BaseModel

class Novedad(BaseModel):
    id:str | None = None
    autor:str
    responsable:str
    created_at:str
    updated_at:str
    descripcion:str
    etiquetas:List[str]
    estado:int