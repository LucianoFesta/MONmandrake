from typing import List


def novedadSchema(novedad) -> dict:
    return {"id":str(novedad["_id"]), #Es un objeto en mongo y me asuguro que devuelva un string porque asi es el modelo.
            "autor":novedad["autor"],
            "responsable":novedad["responsable"],
            "created_at":novedad["created_at"],
            "updated_at":novedad["updated_at"],
            "descripcion":novedad["descripcion"],
            "etiquetas":novedad["etiquetas"],
            "estado":novedad["estado"],
            }
    
def novedadesSchema(novedades) -> list:
    return [novedadSchema(novedad) for novedad in novedades]