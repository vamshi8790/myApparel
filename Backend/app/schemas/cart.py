import uuid
from pydantic import BaseModel

class CartBase(BaseModel):
    user_id: uuid.UUID
    product_id: uuid.UUID
    quantity: int = 1

class CartCreate(CartBase):
    pass

class CartResponse(CartBase):
    id: uuid.UUID

    class Config:
        orm_mode = True
