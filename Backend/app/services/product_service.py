import uuid
import base64
from sqlalchemy.orm import Session
from app.models.products import Product
from app.schemas.products_schemas import ProductResponse

def encode_image(image_bytes: bytes) -> str:
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
            image_base64=encode_image(p.product_image)
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
        image_base64=encode_image(product.product_image)
    )

def create_product(db: Session, product_data: dict, image_bytes: bytes):
    if not image_bytes:
        raise ValueError("Product image is required")
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

def update_product(db: Session, product_id: uuid.UUID, product_data: dict, image_bytes: bytes | None):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return None

    for key, value in product_data.items():
        if hasattr(product, key) and value is not None:
            setattr(product, key, value)

    if image_bytes:
        product.product_image = image_bytes

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
