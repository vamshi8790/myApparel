import uuid
from sqlalchemy import Column, String, Float, LargeBinary, Integer
from sqlalchemy.dialects.postgresql import UUID
from app.core.db import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    product_name = Column(String, unique=True, index=True, nullable=False)
    cost = Column(Float, nullable=False)
    category = Column(String, nullable=False)
    product_image = Column(LargeBinary, nullable=False)
    quantity = Column(Integer, nullable=False, default=1)