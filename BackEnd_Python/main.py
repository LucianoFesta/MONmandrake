from fastapi import FastAPI
from routers import novedades
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

#Configuración de CORS
origins = [
    "http://localhost",
    "http://localhost:4200"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(novedades.router)