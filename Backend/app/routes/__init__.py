# app/routes/__init__.py
from fastapi import APIRouter

from .user import router as user_router
# from .product import router as product_router
# from .order import router as order_router


# Master router
router = APIRouter()
router.include_router(user_router, prefix="/users", tags=["Users"])
# router.include_router(product_router, prefix="/products", tags=["Products"])
# router.include_router(order_router, prefix="/orders", tags=["Orders"])
