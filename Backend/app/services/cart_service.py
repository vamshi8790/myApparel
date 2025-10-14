from sqlalchemy.orm import Session
from app.models.cart import Cart
from app.schemas.cart import CartCreate

def get_user_cart_items(db: Session, user_id):
    """Fetch all cart items for a specific user"""
    return db.query(Cart).filter(Cart.user_id == user_id).all()

def add_to_cart(db: Session, cart_data: CartCreate):
    """Add product to cart or increase quantity if already present"""
    existing_item = db.query(Cart).filter(
        Cart.user_id == cart_data.user_id,
        Cart.product_id == cart_data.product_id
    ).first()

    if existing_item:
        existing_item.quantity += cart_data.quantity
        db.commit()
        db.refresh(existing_item)
        return existing_item

    new_item = Cart(
        user_id=cart_data.user_id,
        product_id=cart_data.product_id,
        quantity=cart_data.quantity,
    )
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

def delete_cart_item(db: Session, cart_id):
    """Delete an item from the cart"""
    cart_item = db.query(Cart).filter(Cart.id == cart_id).first()
    if not cart_item:
        return False
    db.delete(cart_item)
    db.commit()
    return True
