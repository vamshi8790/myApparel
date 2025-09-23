import uuid
from sqlalchemy.orm import Session
from app.models.users import User
from app.schemas.users import UserCreate, UserResponse
from app.core.security import hash_password


def get_users(db: Session):
    """Retrieve all users without password"""
    users = db.query(
        User.id,
        User.username,
        User.email,
        User.full_name
    ).all()

    return [
        UserResponse(
            id=u.id,
            username=u.username,
            email=u.email,
            full_name=u.full_name
        )
        for u in users
    ]


def get_user_by_id(db: Session, user_id: uuid.UUID):
    """Retrieve a single user without password"""
    user = db.query(
        User.id,
        User.username,
        User.email,
        User.full_name
    ).filter(User.id == user_id).first()

    if user:
        return UserResponse(
            id=user.id,
            username=user.username,
            email=user.email,
            full_name=user.full_name
        )
    return None


def create_user(db: Session, user: UserCreate):
    """Create a new user with hashed password"""
    db_user = User(
        username=user.username,
        email=user.email,
        full_name=user.full_name,
        password=hash_password(user.password)  # 🔑 hash password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Return response without password
    return UserResponse(
        id=db_user.id,
        username=db_user.username,
        email=db_user.email,
        full_name=db_user.full_name
    )


def update_user(db: Session, user_id: uuid.UUID, user: UserCreate):
    """Update an existing user and hash password if changed"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return None

    db_user.username = user.username
    db_user.email = user.email
    db_user.full_name = user.full_name
    db_user.password = hash_password(user.password)

    db.commit()
    db.refresh(db_user)

    return UserResponse(
        id=db_user.id,
        username=db_user.username,
        email=db_user.email,
        full_name=db_user.full_name
    )


def delete_user(db: Session, user_id: uuid.UUID):
    """Delete a user by ID"""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return False

    db.delete(db_user)
    db.commit()
    return True