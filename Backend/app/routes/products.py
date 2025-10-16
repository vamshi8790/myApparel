from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from app.core.db import get_db
from app.schemas.products_schemas import ProductResponse
from app.services import product_service
from app.core.security import get_current_user
from app.models.users import User

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/create", response_model=ProductResponse)
async def create_product(
    product_name: str = Form(...),
    cost: float = Form(...),
    category: str = Form(...),
    quantity: int = Form(...),
    product_image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_bytes = await product_image.read()
    return product_service.create_product(db, {
        "product_name": product_name,
        "cost": cost,
        "category": category,
        "quantity": quantity
    }, image_bytes)


@router.put("/update/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: UUID,
    product_name: str = Form(None),
    cost: float = Form(None),
    category: str = Form(None),
    quantity: int = Form(None),
    product_image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    image_bytes = await product_image.read() if product_image else None
    product_data = {k: v for k, v in {
        "product_name": product_name,
        "cost": cost,
        "category": category,
        "quantity": quantity
    }.items() if v is not None}

    updated = product_service.update_product(db, product_id, product_data, image_bytes)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated


@router.delete("/delete/{product_id}")
def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted = product_service.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": f"Product with ID {product_id} deleted successfully"}


@router.get("/all", response_model=List[ProductResponse])
def get_all_products(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return product_service.get_all_products(db)
