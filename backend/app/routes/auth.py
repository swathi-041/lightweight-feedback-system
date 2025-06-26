from fastapi import APIRouter, HTTPException
from app.db.mongodb import db
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.utils.auth import hash_password, verify_password, create_access_token
from bson import ObjectId

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate):
    existing = await db["users"].find_one({"email": user.email})
    if existing:
        raise HTTPException(status_code=400, detail="User already exists")

    user_dict = user.dict()
    user_dict["password"] = hash_password(user.password)
    result = await db["users"].insert_one(user_dict)
    user_dict["id"] = str(result.inserted_id)
    return user_dict

@router.post("/login")
async def login(login_data: UserLogin):
    user = await db["users"].find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({
        "sub": str(user["_id"]),
        "email": user["email"],
        "role": user["role"]
    })

    return {
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }
@router.get("/employees")
async def get_all_employees():
    users = await db["users"].find({"role": "employee"}).to_list(100)
    return [{"id": str(u["_id"]), "name": u["name"]} for u in users]