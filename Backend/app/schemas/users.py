import uuid
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str | None = None

class UserCreate(UserBase):
    password: str   # plain password received from API

class UserResponse(UserBase):
    id: uuid.UUID   # matches DB

    class Config:
        from_attributes = True  # for SQLAlchemy ORM compatibility
