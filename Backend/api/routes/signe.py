from fastapi import APIRouter
from schemas.output_schemas import signRequest
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes

from services.gerate_key import private_keys

router = APIRouter()


@router.post("/sign" ,
             summary="Signer un message ou document")
async def signe(data:signRequest) :
    signature = private_keys.sign(
        data.message.encode(),
        padding.PSS(
            mgf= padding.MGF1(hashes.SHA256()),
            salt_length= padding.PSS.MAX_LENGTH
        ),
        hashes.SHA256()
    )
    return {"Signature" : signature.hex()}
