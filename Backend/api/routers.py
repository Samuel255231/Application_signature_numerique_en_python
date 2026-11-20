from fastapi import APIRouter
from api.routes import health, signe, verify, sign_file, verify_files

router = APIRouter()

router.include_router(health.router)
router.include_router(signe.router)
router.include_router(verify.router)
router.include_router(sign_file.router)
router.include_router(verify_files.router)