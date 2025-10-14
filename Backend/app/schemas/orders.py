from pydantic import BaseModel
import uuid
from typing import Optional

class OrderBase(BaseModel):
    user_id: uuid.UUID
    product_id: uuid.UUID
    quantity: int = 1
    status: str = "Pending"

class OrderCreate(OrderBase):
    cart_id: Optional[uuid.UUID]

class OrderResponse(OrderBase):
    id: uuid.UUID
    cart_id: Optional[uuid.UUID]
    total_price: float

    class Config:
        from_attributes = True
