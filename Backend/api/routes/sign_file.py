from fastapi import APIRouter ,File ,UploadFile
from services.gerate_key import private_keys
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes

router = APIRouter()

@router.post("/sign_file", summary="Signer un fichier/document")
async def sign_file(file: UploadFile = File(...)):
  
    content = await file.read()
    signature = private_keys.sign(
        content,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    return {"signature": signature.hex()}