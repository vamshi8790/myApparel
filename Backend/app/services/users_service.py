import uuid
from sqlalchemy.orm import Session
from app.models.users import User
from app.schemas.users import UserCreate, UserResponse, UserUpdate
from app.core.security import hash_password


def get_users(db: Session):
    """Retrieve all users without passwords"""
    users = db.query(User).all()
    return [UserResponse.model_validate(u) for u in users]


def get_user_by_id(db: Session, user_id: uuid.UUID):
    """Retrieve a single user by ID"""
    user = db.query(User).filter(User.id == user_id).first()
    if user:
        return UserResponse.model_validate(user)
    return None


def create_user(db: Session, user: UserCreate):
    """Create a new user with hashed password"""
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        phone_number=user.phone_number,
        password=hash_password(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return UserResponse.model_validate(db_user)


def update_user(db: Session, user_id: uuid.UUID, user_update: UserUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None

    update_data = user_update.dict(exclude_unset=True)

    if "password" in update_data:
        from app.core.security import hash_password
        update_data["password"] = hash_password(update_data["password"])

    for key, value in update_data.items():
        setattr(db_user, key, value)

    db.commit()
    db.refresh(db_user)
    return UserResponse.model_validate(db_user)



def delete_user(db: Session, user_id: uuid.UUID):
    """Delete a user by ID"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return False
    db.delete(db_user)
    db.commit()
    return True
