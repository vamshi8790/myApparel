import uuid
from sqlalchemy.orm import Session
from app.models.products import Product
from app.schemas.products_schemas import ProductResponse


def get_all_products(db: Session):
    """Retrieve all products with image URLs"""
    products = db.query(Product).all()
    return [
        ProductResponse(
            id=p.id,
            product_name=p.product_name,
            cost=p.cost,
            category=p.category,
            image_url=f"/products/image/{p.id}" if p.product_image else None,
            created_at=p.created_at,
            updated_at=p.updated_at
        )
        for p in products
    ]


def get_product_by_id(db: Session, product_id: uuid.UUID):
    """Retrieve a single product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return None

    return ProductResponse(
        id=product.id,
        product_name=product.product_name,
        cost=product.cost,
        category=product.category,
        image_url=f"/products/image/{product.id}" if product.product_image else None,
        created_at=product.created_at,
        updated_at=product.updated_at
    )


def create_product(db: Session, product_data: dict, image_bytes: bytes | None):
    """Create a new product with optional image"""
    new_product = Product(
        product_name=product_data["product_name"],
        cost=product_data["cost"],
        category=product_data["category"],
        product_image=image_bytes,
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return ProductResponse(
        id=new_product.id,
        product_name=new_product.product_name,
        cost=new_product.cost,
        category=new_product.category,
        image_url=f"/products/image/{new_product.id}" if new_product.product_image else None,
        created_at=new_product.created_at,
        updated_at=new_product.updated_at
    )


def update_product(db: Session, product_id: uuid.UUID, product_data: dict, image_bytes: bytes | None):
    """Update an existing product"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return None

    product.product_name = product_data.get("product_name", product.product_name)
    product.cost = product_data.get("cost", product.cost)
    product.category = product_data.get("category", product.category)

    if image_bytes:
        product.product_image = image_bytes

    db.commit()
    db.refresh(product)

    return ProductResponse(
        id=product.id,
        product_name=product.product_name,
        cost=product.cost,
        category=product.category,
        image_url=f"/products/image/{product.id}" if product.product_image else None,
        created_at=product.created_at,
        updated_at=product.updated_at
    )


def delete_product(db: Session, product_id: uuid.UUID):
    """Delete a product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        return False

    db.delete(product)
    db.commit()
    return True
