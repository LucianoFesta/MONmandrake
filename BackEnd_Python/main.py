from fastapi import FastAPI
from routers import novedades

app = FastAPI()

app.include_router(novedades.router)