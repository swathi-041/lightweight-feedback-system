from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str  # 'manager' or 'employee'

class UserCreate(UserBase):
    password: str
    team: Optional[List[str]] = []

class UserResponse(UserBase):
    id: Optional[str]
    team: Optional[List[str]] = []

class UserLogin(BaseModel):
    email: EmailStr
    password: str