from fastapi import FastAPI, File, UploadFile, Form
from pydantic import BaseModel
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

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

# MODELS
class SignRequest(BaseModel):
    message: str

class VerifyRequest(BaseModel):
    message: str
    signature: str

# KEYS
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)

public_key = private_key.public_key()

# ROUTES
@app.get("/", summary="Vérification de l'état de l'API")
async def home():
    """
    Vérifie si l'API est en ligne et accessible.
    """
    return {"message": "API Signature numérique OK"}

# SIGN
@app.post("/sign", summary="Signer un document/message")
def sign(data: SignRequest):
    """
    Génère une signature numérique pour le message fourni,
    en utilisant la clé privée RSA générée au lancement de l'application.
    La signature est retournée au format hexadécimal.
    """
    signature = private_key.sign(
        data.message.encode(),
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    return {"signature": signature.hex()}

# VERIFY
@app.post("/verify", summary="Vérifier une signature")
def verify(data: VerifyRequest):
    """
    Vérifie l'authenticité d'un message donné par rapport à sa signature,
    en utilisant la clé publique correspondante.
    Retourne `{"valid": True}` si la vérification est réussie, `{"valid": False}` sinon.
    """
    try:
        public_key.verify(
            bytes.fromhex(data.signature),
            data.message.encode(),
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return {"valid": True}
    except:
        return {"valid": False}

# RUN
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

# SIGN FILE
@app.post("/sign_file", summary="Signer un fichier/document")
async def sign_file(file: UploadFile = File(...)):
    """
    Génère une signature numérique pour le fichier uploadé (ex: PDF, Word, etc),
    en utilisant la clé privée RSA générée au lancement de l'application.
    La signature est retournée au format hexadécimal.
    """
    content = await file.read()
    signature = private_key.sign(
        content,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    return {"signature": signature.hex()}

# VERIFY FILE
@app.post("/verify_file", summary="Vérifier la signature d'un fichier")
async def verify_file(signature: str = Form(...), file: UploadFile = File(...)):
    """
    Vérifie l'authenticité d'un fichier uploadé (ex: PDF) par rapport à 
    la signature hexadécimale fournie.
    """
    content = await file.read()
    try:
        public_key.verify(
            bytes.fromhex(signature),
            content,
            padding.PSS(
                mgf=padding.MGF1(hashes.SHA256()),
                salt_length=padding.PSS.MAX_LENGTH
            ),
            hashes.SHA256()
        )
        return {"valid": True}
    except:
        return {"valid": False}