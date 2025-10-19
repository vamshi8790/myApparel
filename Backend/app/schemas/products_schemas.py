from pydantic import BaseModel, Field
from typing import Optional
from uuid import UUID

class ProductBase(BaseModel):
    product_name: str = Field(..., example="Nike T-shirt")
    cost: float = Field(..., example=999.99)
    category: str = Field(..., example="men's clothing")
    quantity: int = Field(..., example=10)

class ProductCreate(ProductBase):
    image: str = Field(..., description="Base64 encoded image string")

class ProductUpdate(BaseModel):
    product_name: Optional[str] = None
    cost: Optional[float] = None
    category: Optional[str] = None
    quantity: Optional[int] = None
    image: Optional[str] = None

class ProductResponse(ProductBase):
    id: UUID
    image: str

    class Config:
        orm_mode = True
