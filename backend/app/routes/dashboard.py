from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def dashboard():
    return {"message": "Dashboard route active"}