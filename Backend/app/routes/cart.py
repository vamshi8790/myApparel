from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import uuid

from app.core.db import get_db
from app.schemas.cart import CartCreate, CartResponse, CartItemAdded, CartUpdateQuantity
from app.services import cart_service
from app.core.security import get_current_user
from app.models.users import User

router = APIRouter(prefix="/cart", tags=["Cart"])

@router.get("/user", response_model=List[CartResponse])
def get_user_cart(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    items = cart_service.get_user_cart_items(db, current_user.id)
    return items

@router.post("/add", response_model=CartItemAdded, status_code=status.HTTP_201_CREATED)
def add_to_cart(
    cart: CartCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart_item = cart_service.add_to_cart(db, current_user.id, cart)
    return CartItemAdded(
        id=cart_item.id,
        user_id=cart_item.user_id,
        product_id=cart_item.product_id,
        quantity=cart_item.quantity,
        message="Product added to cart successfully"
    )

@router.patch("/{cart_id}/quantity", response_model=CartItemAdded)
def update_quantity(
    cart_id: uuid.UUID,
    update: CartUpdateQuantity,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    cart_item = cart_service.update_cart_quantity(db, cart_id, current_user.id, update.quantity)
    return CartItemAdded(
        id=cart_item.id,
        user_id=cart_item.user_id,
        product_id=cart_item.product_id,
        quantity=cart_item.quantity,
        message="Cart quantity updated successfully"
    )

@router.delete("/{cart_id}", status_code=200)
def delete_cart_item(
    cart_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted = cart_service.delete_cart_item(db, cart_id, current_user.id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Cart item not found or you don't have permission to delete it")
    return {"message": "Cart item deleted successfully", "cart_id": cart_id}
