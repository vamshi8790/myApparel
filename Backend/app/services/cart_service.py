from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.cart import Cart
from app.models.products import Product
from app.schemas.cart import CartCreate
import base64
import uuid

def _encode_image(image_bytes: bytes) -> str:
    return base64.b64encode(image_bytes).decode("utf-8") if image_bytes else ""

def get_user_cart_items(db: Session, user_id: uuid.UUID):
    cart_items = db.query(Cart).filter(Cart.user_id == user_id).all()
    result = []
    for item in cart_items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            continue
        product_data = {
            "id": product.id,
            "product_name": product.product_name,
            "cost": product.cost,
            "category": product.category,
            "quantity": item.quantity,
            "image_base64": _encode_image(product.product_image)
        }
        result.append({
            "id": item.id,
            "user_id": item.user_id,
            "product_id": item.product_id,
            "quantity": item.quantity,
            "product": product_data
        })
    return result

def add_to_cart(db: Session, user_id: uuid.UUID, cart_data: CartCreate):
    if cart_data.quantity < 1 or cart_data.quantity > 3:
        raise HTTPException(status_code=400, detail="Quantity must be between 1 and 3")

    product = db.query(Product).filter(Product.id == cart_data.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    existing_item = db.query(Cart).filter(
        Cart.user_id == user_id,
        Cart.product_id == cart_data.product_id
    ).first()

    if existing_item:
        new_quantity = existing_item.quantity + cart_data.quantity
        existing_item.quantity = 3 if new_quantity > 3 else new_quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item

    new_item = Cart(
        user_id=user_id,
        product_id=cart_data.product_id,
        quantity=cart_data.quantity
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

def update_cart_quantity(db: Session, cart_id: uuid.UUID, user_id: uuid.UUID, quantity: int):
    if quantity < 1 or quantity > 3:
        raise HTTPException(status_code=400, detail="Quantity must be between 1 and 3")

    cart_item = db.query(Cart).filter(Cart.id == cart_id, Cart.user_id == user_id).first()
    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    cart_item.quantity = quantity
    db.commit()
    db.refresh(cart_item)
    return cart_item

def delete_cart_item(db: Session, cart_id: uuid.UUID, user_id: uuid.UUID):
    cart_item = db.query(Cart).filter(Cart.id == cart_id, Cart.user_id == user_id).first()
    if not cart_item:
        return False
    db.delete(cart_item)
    db.commit()
    return True

def clear_user_cart(db: Session, user_id: uuid.UUID):
    db.query(Cart).filter(Cart.user_id == user_id).delete()
    db.commit()
    return True
