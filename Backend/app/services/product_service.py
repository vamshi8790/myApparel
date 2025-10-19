import uuid
import base64
from sqlalchemy.orm import Session
from app.models.products import Product
from app.schemas.products_schemas import ProductResponse

def decode_image(base64_str: str) -> bytes:
    """Convert base64 string to bytes."""
    try:
        return base64.b64decode(base64_str.split(",")[-1])
    except Exception:
        raise ValueError("Invalid image format")

def encode_image(image_bytes: bytes) -> str:
    """Convert image bytes to base64 string."""
    return base64.b64encode(image_bytes).decode("utf-8")

def get_all_products(db: Session):
    products = db.query(Product).all()
    return [
        ProductResponse(
            id=p.id,
            product_name=p.product_name,
            cost=p.cost,
            category=p.category,
            quantity=p.quantity,
            image=encode_image(p.product_image)
        )
        for p in products
    ]

def get_product_by_id(db: Session, product_id: uuid.UUID):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return None
    return ProductResponse(
        id=product.id,
        product_name=product.product_name,
        cost=product.cost,
        category=product.category,
        quantity=product.quantity,
        image=encode_image(product.product_image)
    )

def create_product(db: Session, product_data: dict):
    if not product_data.get("image"):
        raise ValueError("Product image is required")

    image_bytes = decode_image(product_data["image"])

    new_product = Product(
        product_name=product_data["product_name"],
        cost=product_data["cost"],
        category=product_data["category"],
        quantity=product_data.get("quantity", 1),
        product_image=image_bytes
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return get_product_by_id(db, new_product.id)

def update_product(db: Session, product_id: uuid.UUID, product_data: dict):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return None

    for key, value in product_data.items():
        if hasattr(product, key) and value is not None and key != "image":
            setattr(product, key, value)

    if product_data.get("image"):
        product.product_image = decode_image(product_data["image"])

    db.commit()
    db.refresh(product)
    return get_product_by_id(db, product_id)

def delete_product(db: Session, product_id: uuid.UUID):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return False
    db.delete(product)
    db.commit()
    return True
