from pydantic import BaseModel, Field
from uuid import UUID
from typing import Optional
from datetime import datetime


class ProductBase(BaseModel):
    product_name: str = Field(..., example="Nike T-shirt")
    cost: float = Field(..., example=999.99)
    category: str = Field(..., example="men's clothing")


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    product_name: Optional[str] = Field(None, example="Puma Hoodie")
    cost: Optional[float] = Field(None, example=1299.50)
    category: Optional[str] = Field(None, example="men's clothing")


class ProductResponse(ProductBase):
    id: UUID
    image_url: Optional[str] = Field(
        None,
        example="http://localhost:8000/products/image/123e4567-e89b-12d3-a456-426614174000"
    )
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        orm_mode = True
        from_attributes = True
