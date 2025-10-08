from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Response
from sqlalchemy.orm import Session
from uuid import UUID
from typing import List
from app.core.db import get_db
from app.schemas.products_schemas import ProductResponse
from app.services import product_service

router = APIRouter(prefix="/products", tags=["Products"])


@router.post("/create", response_model=ProductResponse, status_code=201)
async def create_product(
    product_name: str = Form(...),
    cost: float = Form(...),
    category: str = Form(...),
    product_image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """Create a new product with optional image upload."""
    image_bytes = await product_image.read() if product_image else None
    product_data = {
        "product_name": product_name,
        "cost": cost,
        "category": category
    }
    return product_service.create_product(db, product_data, image_bytes)


@router.get("/all", response_model=List[ProductResponse])
def get_all_products(db: Session = Depends(get_db)):
    """Retrieve all products."""
    return product_service.get_all_products(db)


@router.get("/get/{product_id}", response_model=ProductResponse)
def get_product_by_id(product_id: UUID, db: Session = Depends(get_db)):
    """Retrieve a single product by its unique ID."""
    product = product_service.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.get("/image/{product_id}")
def get_product_image(product_id: UUID, db: Session = Depends(get_db)):
    """Retrieve the stored product image by product ID."""
    product = db.query(product_service.Product).filter(product_service.Product.id == product_id).first()
    if not product or not product.product_image:
        raise HTTPException(status_code=404, detail="Image not found")
    return Response(content=product.product_image, media_type="image/jpeg")


@router.put("/update/{product_id}", response_model=ProductResponse)
async def update_product(
    product_id: UUID,
    product_name: str = Form(...),
    cost: float = Form(...),
    category: str = Form(...),
    product_image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    """Update an existing product by ID."""
    image_bytes = await product_image.read() if product_image else None
    product_data = {
        "product_name": product_name,
        "cost": cost,
        "category": category
    }
    updated = product_service.update_product(db, product_id, product_data, image_bytes)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated


@router.delete("/delete/{product_id}")
def delete_product(product_id: UUID, db: Session = Depends(get_db)):
    """Delete a product from the database."""
    deleted = product_service.delete_product(db, product_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": f"Product with ID {product_id} deleted successfully"}
