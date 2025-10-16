import uuid
from sqlalchemy import Column, Integer, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.db import Base

class Order(Base):
    __tablename__ = "orders"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    cart_id = Column(UUID(as_uuid=True), ForeignKey("cart.id", ondelete="SET NULL"), nullable=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=False, index=True)
    quantity = Column(Integer, nullable=False, default=1)
    status = Column(String, nullable=False, default="Pending", index=True)

    user = relationship("User", backref="orders")
    product = relationship("Product", backref="orders")
    cart = relationship("Cart", backref="orders", passive_deletes=True)
