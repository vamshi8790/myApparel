from fastapi import APIRouter

from .user import router as user_router
from .products import router as product_router
from .cart import router as cart_router
from .orders import router as order_router


router = APIRouter()

router.include_router(user_router, prefix="/users", tags=["Users"])
router.include_router(product_router, prefix="/products", tags=["Products"])
router.include_router(cart_router, prefix="/cart", tags=["Cart"])
router.include_router(order_router, prefix="/orders", tags=["Orders"])
