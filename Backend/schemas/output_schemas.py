from pydantic import BaseModel


class signRequest(BaseModel):
    message : str

class verifyRequest(BaseModel):
    message : str
    signature : str