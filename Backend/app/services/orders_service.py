from sqlalchemy.orm import Session, joinedload
import uuid
from typing import List, Tuple, Optional

from app.models.cart import Cart
from app.models.products import Product
from app.models.orders import Order
from app.models.users import User
from app.schemas.orders import OrderResponse, UserOrderResponse, AdminOrderResponse

def checkout_cart_items(db: Session, cart_ids: List[uuid.UUID], user_id: uuid.UUID) -> Tuple[List[OrderResponse], float, Optional[str]]:
    if not cart_ids:
        return [], 0.0, "No cart items provided"

    try:
        cart_items = (
            db.query(Cart)
            .options(joinedload(Cart.product))
            .filter(Cart.id.in_(cart_ids), Cart.user_id == user_id)
            .all()
        )

        if len(cart_items) != len(cart_ids):
            found_ids = {item.id for item in cart_items}
            missing_ids = set(cart_ids) - found_ids
            return [], 0.0, f"Cart items not found or unauthorized: {missing_ids}"

        orders, total_amount = [], 0.0

        for item in cart_items:
            if not item.product:
                db.rollback()
                return [], 0.0, f"Product {item.product_id} not found"

            order_total = float(item.product.cost * item.quantity)
            new_order = Order(
                cart_id=item.id,
                user_id=item.user_id,
                product_id=item.product_id,
                quantity=item.quantity,
                status="Pending"
            )
            db.add(new_order)
            db.flush()

            orders.append(OrderResponse(
                id=new_order.id,
                cart_id=new_order.cart_id,
                user_id=new_order.user_id,
                product_id=new_order.product_id,
                quantity=new_order.quantity,
                status=new_order.status,
                total_price=order_total
            ))

            total_amount += order_total
            db.delete(item)

        db.commit()
        return orders, total_amount, None

    except Exception as e:
        db.rollback()
        return [], 0.0, f"Error during checkout: {str(e)}"


def get_user_orders_by_product(db: Session, user_id: uuid.UUID, product_id: Optional[uuid.UUID] = None) -> List[UserOrderResponse]:
    query = db.query(Order).options(joinedload(Order.product)).filter(Order.user_id == user_id)
    if product_id:
        query = query.filter(Order.product_id == product_id)

    orders = query.all()
    result = []

    for order in orders:
        if order.product:
            total_price = float(order.product.cost * order.quantity)
            result.append(UserOrderResponse(
                id=order.id,
                product_id=order.product_id,
                product_name=order.product.name,
                product_image=getattr(order.product, "image", None),
                quantity=order.quantity,
                cost=float(order.product.cost),
                total_price=total_price,
                status=order.status
            ))
    return result


def get_all_orders_admin(db: Session) -> List[AdminOrderResponse]:
    orders = db.query(Order).options(joinedload(Order.product), joinedload(Order.user)).all()
    result = []

    for order in orders:
        if order.product and order.user:
            total_price = float(order.product.cost * order.quantity)
            user_address = getattr(order.user, "address", None) or getattr(order.user, "shipping_address", None)

            result.append(AdminOrderResponse(
                order_id=order.id,
                user_name=getattr(order.user, "name", getattr(order.user, "username", "")),
                user_email=order.user.email,
                user_address=user_address,
                product_name=order.product.name,
                product_image=getattr(order.product, "image", None),
                cost=float(order.product.cost),
                quantity=order.quantity,
                total_price=total_price,
                status=order.status
            ))

    return result
