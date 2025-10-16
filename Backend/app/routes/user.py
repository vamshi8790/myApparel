from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
import uuid

from app.core.db import get_db
from app.core.security import hash_password, verify_password, create_access_token, revoke_token
from app.core.dependencies import get_current_user
from app.schemas.users import UserCreate, UserResponse, UserUpdate
from app.services import users_service
from app.models.users import User

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/login")
def login_user(email: str = Form(...), password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token_expires = timedelta(hours=1)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)

    return {"access_token": access_token, "token_type": "bearer", "role": user.role, "user_id": str(user.id)}

@router.post("/logout")
def logout_user(token: str = Depends(lambda: None)):
    revoke_token(token)
    return {"message": "Logged out successfully"}

@router.get("/all", response_model=List[UserResponse])
def read_users(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return users_service.get_users(db)

@router.get("/get/{user_id}", response_model=UserResponse)
def read_user(user_id: uuid.UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    db_user = users_service.get_user_by_id(db, user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.post("/create", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return users_service.create_user(db, user)

@router.put("/update/{user_id}", response_model=UserResponse)
def update_user(user_id: uuid.UUID, user: UserUpdate, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    updated_user = users_service.update_user(db, user_id, user)
    if not updated_user:
        raise HTTPException(status_code=404, detail="User not found")
    return updated_user

@router.delete("/delete/{user_id}")
def delete_user(user_id: uuid.UUID, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    deleted = users_service.delete_user(db, user_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@router.post("/reset-password")
def reset_password(email: str = Form(...), new_password: str = Form(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User with this email not found")

    user.password = hash_password(new_password)
    db.commit()
    db.refresh(user)
    return {"message": "Password reset successful"}
