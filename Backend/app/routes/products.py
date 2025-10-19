from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from uuid import UUID
from typing import Optional, List
import base64

from app.core.db import get_db
from app.schemas.products_schemas import ProductResponse
from app.services import product_service
from app.core.security import get_current_admin
from app.models.users import User

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("/create", response_model=ProductResponse)
async def create_product(
    product_name: str = Form(...),
    category: str = Form(...),
    cost: float = Form(...),
    quantity: int = Form(...),
    product_image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    image_bytes = await product_image.read()
    image_base64 = base64.b64encode(image_bytes).decode('utf-8')

    product_data = {
        "product_name": product_name,
        "category": category,
        "cost": cost,
        "quantity": quantity,
        "image": f"data:image/jpeg;base64,{image_base64}"
    }
    
    return product_service.create_product(db, product_data)

@router.put("/update/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: UUID,
    product_name: str = Form(...),
    category: str = Form(...),
    cost: float = Form(...),
    quantity: int = Form(...),
    product_image: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    image_base64 = None
    if product_image:
        image_bytes = await product_image.read()
        image_base64 = base64.b64encode(image_bytes).decode('utf-8')
        image_base64 = f"data:image/jpeg;base64,{image_base64}"

    product_data = {
        "product_name": product_name,
        "category": category,
        "cost": cost,
        "quantity": quantity,
    }
    if image_base64:
        product_data["image"] = image_base64

    updated = product_service.update_product(db, product_id, product_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated

@router.delete("/delete/{product_id}")
def delete_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    deleted = product_service.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": f"Product with ID {product_id} deleted successfully"}

@router.get("/all", response_model=List[ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    return product_service.get_all_products(db)
