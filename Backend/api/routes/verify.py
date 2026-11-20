from fastapi import APIRouter
from schemas.output_schemas import verifyRequest
from services.gerate_key import public_keys
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives import hashes

router = APIRouter()

@router.post("/verify", summary="Verification signatutre")
async def verify(data : verifyRequest):
    try:
        public_keys.verify(
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