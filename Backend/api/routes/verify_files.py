from fastapi import APIRouter, File ,UploadFile , Form
from services.gerate_key import public_keys
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes

router = APIRouter()

# VERIFY FILE
@router.post("/verify_file", summary="Vérifier la signature d'un fichier")
async def verify_file(signature: str = Form(...), file: UploadFile = File(...)):
    """
    Vérifie l'authenticité d'un fichier uploadé (ex: PDF) par rapport à 
    la signature hexadécimale fournie.
    """
    content = await file.read()
    try:
        public_keys.verify(
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