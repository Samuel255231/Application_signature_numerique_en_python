from fastapi import FastAPI
from pydantic import BaseModel
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

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
@app.get("/")
async def home():
    return {"message": "API Signature numérique OK"}

# SIGN
@app.post("/sign")
def sign(data: SignRequest):
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
@app.post("/verify")
def verify(data: VerifyRequest):
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