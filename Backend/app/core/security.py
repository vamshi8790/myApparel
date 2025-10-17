from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.models.users import User
from app.core.db import get_db

SECRET_KEY = "f25fdf3b-f1c0-4be3-96f1-ddf9ea9a3bce-71268aea-6cec-4c8a-85b9-62f29b6bd52a"
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


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/login")

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    """
    Retrieve the current user from the token.
    Token payload now includes 'id'.
    """
    payload = verify_access_token(token)
    user_id = payload.get("id")

    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    
    user = db.query(User).filter(User.id == id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return user
