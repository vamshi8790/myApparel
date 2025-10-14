from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List, Dict, Any
import uuid

from app.core.db import get_db
from app.services import orders_service
from app.schemas.orders import OrderResponse

router = APIRouter(prefix="/orders", tags=["Orders"])


class CheckoutResponse(BaseModel):
    orders: List[OrderResponse]
    total_amount: float


@router.post("/checkout", response_model=CheckoutResponse)
def checkout(cart_ids: List[uuid.UUID], db: Session = Depends(get_db)):
    """
    Place orders from multiple cart items at once.
    Each product gets its own order ID.
    Returns orders with total price per item and combined total amount.
    """
    orders, total_amount, error = orders_service.place_orders(db, cart_ids)
    if error:
        raise HTTPException(status_code=404, detail=error)
    return {"orders": orders, "total_amount": total_amount}


@router.get("/my-orders", response_model=List[OrderResponse])
def get_user_orders(user_id: uuid.UUID = Query(...), db: Session = Depends(get_db)):
    """
    Fetch all orders placed by a specific user.
    """
    orders = orders_service.get_orders_by_user(db, user_id)
    if not orders:
        raise HTTPException(status_code=404, detail="No orders found for this user")
    return orders


@router.get("/all", response_model=List[OrderResponse])
def get_all_orders(db: Session = Depends(get_db)):
    """
    Admin route: Fetch all orders placed by all users.
    """
    orders = orders_service.get_all_orders(db)
    return orders
