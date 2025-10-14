import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.core.db import get_db
from app.schemas.cart import CartCreate, CartResponse
from app.services import cart_service

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("/all", response_model=List[CartResponse])
def read_cart_items(user_id: uuid.UUID, db: Session = Depends(get_db)):
    """Fetch all cart items for the logged-in user"""
    return cart_service.get_user_cart_items(db, user_id)

@router.post("/add", response_model=CartResponse)
def add_cart_item(cart: CartCreate, db: Session = Depends(get_db)):
    """Add a product or increase quantity if it already exists"""
    return cart_service.add_to_cart(db, cart)

@router.delete("/delete/{cart_id}")
def remove_cart_item(cart_id: uuid.UUID, db: Session = Depends(get_db)):
    """Delete a specific item from the cart"""
    deleted = cart_service.delete_cart_item(db, cart_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Cart item deleted successfully"}
