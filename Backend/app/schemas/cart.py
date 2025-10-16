import uuid
from pydantic import BaseModel, Field, validator
from typing import Optional
from uuid import UUID

class CartBase(BaseModel):
    user_id: Optional[UUID] = None
    product_id: UUID
    quantity: int = Field(default=1, ge=1, le=3, description="Quantity must be between 1 and 3")

class ProductInCart(BaseModel):
    id: UUID
    product_name: str
    cost: float
    category: str
    quantity: int
    image_base64: str

class CartCreate(BaseModel):
    product_id: UUID
    quantity: int = Field(default=1, ge=1, le=3)

    @validator("quantity")
    def validate_quantity(cls, v):
        if v < 1 or v > 3:
            raise ValueError("Quantity must be between 1 and 3")
        return v

class CartUpdateQuantity(BaseModel):
    quantity: int = Field(..., ge=1, le=3)

    @validator("quantity")
    def validate_quantity(cls, v):
        if v < 1 or v > 3:
            raise ValueError("Quantity must be between 1 and 3")
        return v

class CartResponse(BaseModel):
    id: UUID
    user_id: UUID
    product_id: UUID
    quantity: int
    product: ProductInCart

    class Config:
        orm_mode = True

class CartItemAdded(BaseModel):
    id: UUID
    user_id: UUID
    product_id: UUID
    quantity: int
    message: str

    class Config:
        orm_mode = True
