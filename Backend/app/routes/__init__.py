from fastapi import APIRouter

from .user import router as user_router
from .products import router as product_router

router = APIRouter()

router.include_router(user_router, prefix="/users", tags=["Users"])
router.include_router(product_router, prefix="/products", tags=["Products"])
