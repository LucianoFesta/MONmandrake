from typing import List


def etiquetaSchema(etiqueta) -> dict:
    return {"id":str(etiqueta["_id"]), #Es un objeto en mongo y me asuguro que devuelva un string porque asi es el modelo.
            "name":etiqueta["name"]
            }
    
def etiquetasSchema(etiqueta) -> list:
    return [etiquetaSchema(etiqueta) for etiqueta in etiqueta]