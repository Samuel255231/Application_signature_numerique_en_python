from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from api.routers import router

app = FastAPI(
    title="API Signature Numérique",
    description="API Backend pour la signature numérique et la vérification de l'authenticité de documents/textes. Créé pour le projet 'Sécurité Web à l'école'.",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

# RUN
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)