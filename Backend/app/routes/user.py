import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.db import get_db
from app.schemas.users import UserCreate, UserResponse
from app.services import users_service

router = APIRouter()

@router.get("/all", response_model=List[UserResponse])
def read_users(db: Session = Depends(get_db)):
    return users_service.get_users(db)

@router.get("/get/{user_id}", response_model=UserResponse)
def read_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    db_user = users_service.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.post("/create", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return users_service.create_user(db, user)

@router.put("/update/{user_id}", response_model=UserResponse)
def update_user(user_id: uuid.UUID, user: UserCreate, db: Session = Depends(get_db)):
    updated_user = users_service.update_user(db, user_id, user)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.delete("/delete/{user_id}")
def delete_user(user_id: uuid.UUID, db: Session = Depends(get_db)):
    deleted = users_service.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}
