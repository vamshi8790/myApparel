from sqlalchemy.orm import Session
import uuid
from typing import List, Dict, Any, Tuple

from app.models.cart import Cart
from app.models.products import Product
from app.models.orders import Order


def place_orders(db: Session, cart_ids: List[uuid.UUID]) -> Tuple[List[Dict[str, Any]], float, str]:
    """
    Place orders for multiple cart items.
    Returns: (list of order info, total amount for all items, error message if any)
    """
    orders = []
    total_amount = 0.0

    try:
        for cart_id in cart_ids:
            cart_item = db.query(Cart).filter(Cart.id == cart_id).first()
            if not cart_item:
                return [], 0.0, f"Cart item {cart_id} not found"
            
            product = db.query(Product).filter(Product.id == cart_item.product_id).first()
            if not product:
                return [], 0.0, f"Product {cart_item.product_id} not found"

            order_total = float(product.cost * cart_item.quantity)

            new_order = Order(
                id=uuid.uuid4(),
                cart_id=cart_item.id,
                user_id=cart_item.user_id,
                product_id=cart_item.product_id,
                quantity=cart_item.quantity,
                status="Pending"
            )
            db.add(new_order)

            orders.append({
                "id": new_order.id,
                "cart_id": new_order.cart_id,
                "user_id": new_order.user_id,
                "product_id": new_order.product_id,
                "quantity": new_order.quantity,
                "status": new_order.status,
                "total_price": order_total
            })

            total_amount += order_total

            db.delete(cart_item)

        db.commit()
        return orders, total_amount, None

    except Exception as e:
        db.rollback()
        return [], 0.0, str(e)


def get_orders_by_user(db: Session, user_id: uuid.UUID) -> List[Dict[str, Any]]:
    """
    Fetch all orders placed by a specific user (with total_price calculated).
    """
    orders = db.query(Order).filter(Order.user_id == user_id).all()
    result = []

    for order in orders:
        product = db.query(Product).filter(Product.id == order.product_id).first()
        total_price = float(product.cost * order.quantity) if product else 0.0
        result.append({
            "id": order.id,
            "cart_id": order.cart_id,
            "user_id": order.user_id,
            "product_id": order.product_id,
            "quantity": order.quantity,
            "status": order.status,
            "total_price": total_price
        })

    return result


def get_all_orders(db: Session) -> List[Dict[str, Any]]:
    """
    Admin: Fetch all orders for all users (with total_price calculated).
    """
    orders = db.query(Order).all()
    result = []

    for order in orders:
        product = db.query(Product).filter(Product.id == order.product_id).first()
        total_price = float(product.cost * order.quantity) if product else 0.0
        result.append({
            "id": order.id,
            "cart_id": order.cart_id,
            "user_id": order.user_id,
            "product_id": order.product_id,
            "quantity": order.quantity,
            "status": order.status,
            "total_price": total_price
        })

    return result
