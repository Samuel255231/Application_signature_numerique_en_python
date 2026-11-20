from fastapi import APIRouter

router = APIRouter()

@router.get("/",summary="Verification état de l'API")
async def home():
    return {"Message":"API fonctionne normalement"}