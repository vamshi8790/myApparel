from werkzeug.security import generate_password_hash, check_password_hash

def hash_password(password: str) -> str:
    """Hash a plain password (8–16 characters)."""
    if not (8 <= len(password) <= 16):
        raise ValueError("Password must be between 8 and 16 characters long")
    return generate_password_hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hash."""
    return check_password_hash(hashed_password, plain_password)
