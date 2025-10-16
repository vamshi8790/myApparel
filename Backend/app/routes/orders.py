from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid

from app.core.db import get_db
from app.services import orders_service
from app.schemas.orders import CheckoutRequest, CheckoutResponse, UserOrderResponse, AdminOrderResponse
from app.core.security import get_current_user
from app.models.users import User

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/checkout", response_model=CheckoutResponse)
def checkout(
    request: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orders, total_amount, error = orders_service.checkout_cart_items(db, request.cart_ids, current_user.id)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return CheckoutResponse(orders=orders, total_amount=total_amount, message=f"Successfully placed {len(orders)} order(s)")

@router.get("/user", response_model=List[UserOrderResponse])
def get_user_orders(
    product_id: Optional[uuid.UUID] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    orders = orders_service.get_user_orders_by_product(db, current_user.id, product_id)
    if not orders:
        raise HTTPException(status_code=404, detail="No orders found for this user")
    return orders

@router.get("/admin/all", response_model=List[AdminOrderResponse])
def get_all_orders_admin(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    orders = orders_service.get_all_orders_admin(db)
    return orders
