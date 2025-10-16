from pydantic import BaseModel
import uuid
from typing import Optional, List

class OrderBase(BaseModel):
    user_id: uuid.UUID
    product_id: uuid.UUID
    quantity: int = 1
    status: str = "Pending"

class OrderResponse(OrderBase):
    id: uuid.UUID
    cart_id: Optional[uuid.UUID]
    total_price: float

    class Config:
        from_attributes = True

class CheckoutRequest(BaseModel):
    cart_ids: List[uuid.UUID]
    user_id: uuid.UUID

class CheckoutResponse(BaseModel):
    orders: List[OrderResponse]
    total_amount: float
    message: str

class UserOrderResponse(BaseModel):
    id: uuid.UUID
    product_id: uuid.UUID
    product_name: str
    product_image: Optional[str]
    quantity: int
    cost: float
    total_price: float
    status: str

    class Config:
        from_attributes = True

class AdminOrderResponse(BaseModel):
    order_id: uuid.UUID
    user_name: str
    user_email: str
    user_address: Optional[str]
    product_name: str
    product_image: Optional[str]
    cost: float
    quantity: int
    total_price: float
    status: str

    class Config:
        from_attributes = True
