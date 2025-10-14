from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import uuid

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=50)
    phone_number: str = Field(..., min_length=10, max_length=15)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=16, description="Password must be 8-16 characters long")

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, min_length=2, max_length=50)
    phone_number: Optional[str] = Field(None, min_length=10, max_length=15)
    password: Optional[str] = Field(None, min_length=8, max_length=16)

class UserResponse(UserBase):
    id: uuid.UUID

    model_config = {
        "from_attributes": True
    }
