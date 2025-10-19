from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.models.users import User
from app.core.db import get_db

SECRET_KEY = "f25fdf3b-f1c0-4be3-96f1-ddf9ea9a3bce-71268aea-85b9-62f29b6bd52a"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

blacklisted_tokens = set()

def hash_password(password: str) -> str:
    if not (8 <= len(password) <= 16):
        raise ValueError("Password must be between 8 and 16 characters long")
    return generate_password_hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return check_password_hash(hashed_password, plain_password)

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """
    Create a JWT token with the provided payload.
    Expected keys in data: sub (email), role, id
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_access_token(token: str) -> dict:
    """
    Verify JWT and return the payload.
    Raises HTTPException if token is invalid or revoked.
    """
    if token in blacklisted_tokens:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has been revoked")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

def revoke_token(token: str):
    blacklisted_tokens.add(token)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/users/login")


def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    """
    Retrieve the current user from the token.
    Token payload includes 'user_id' (from login) or 'id'.
    """
    payload = verify_access_token(token)
    user_id = payload.get("user_id") or payload.get("id") 
    email = payload.get("sub")
    if user_id:
        try:
            user = db.query(User).filter(User.id == user_id).first()
            if user:
                return user
        except Exception as e:
            print(f"Error finding user by ID: {e}")
    if email:
        user = db.query(User).filter(User.email == email).first()
        if user:
            return user
    
    raise HTTPException(status_code=401, detail="Invalid token payload: unable to identify user")


def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """
    Dependency to ensure the authenticated user has the 'admin' role.
    Raises 401 Unauthorized if the user is not an admin.
    """
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Operation restricted to administrators."
        )
    return current_user