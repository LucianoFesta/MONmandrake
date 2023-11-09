from pydantic import BaseModel

class Etiqueta(BaseModel):
    id:str | None = None
    name:str