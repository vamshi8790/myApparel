from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import uuid

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=50)
    phone_number: str = Field(..., min_length=10, max_length=15)
    address: str = Field(..., min_length=5, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=16)

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, min_length=2, max_length=50)
    phone_number: Optional[str] = Field(None, min_length=10, max_length=15)
    password: Optional[str] = Field(None, min_length=8, max_length=16)
    address: Optional[str] = Field(None, min_length=5, max_length=100)

class UserResponse(UserBase):
    id: uuid.UUID
    role: str

    model_config = {
        "from_attributes": True
    }
