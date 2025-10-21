from typing import List, Dict
from app.GenAI.llm_chain import product_chain
from app.core.security import verify_access_token
from fastapi import HTTPException
from app.models.products import Product
from app.core.db import SessionLocal
import threading, requests, time

ALL_PRODUCTS: List[Dict] = []
USER_SESSIONS: Dict[str, Dict] = {}


def fetch_all_products() -> List[Dict]:
    global ALL_PRODUCTS
    if not ALL_PRODUCTS:
        try:
            db = SessionLocal()
            products = db.query(Product).all()
            ALL_PRODUCTS = [
                {
                    "id": str(p.id),
                    "name": p.product_name,
                    "category": p.category,
                    "price": p.cost,
                    "image": p.product_image,
                }
                for p in products
            ]
            product_chain.load_data(ALL_PRODUCTS)
            db.close()
            print("All products loaded into GenAI successfully.")
        except Exception as e:
            print(f"Failed to fetch products from DB: {e}")
            ALL_PRODUCTS = []
    return ALL_PRODUCTS


def store_user_session(token: str) -> str:
    payload = verify_access_token(token)
    user_id = payload.get("user_id") or payload.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    USER_SESSIONS[user_id] = {"jwt": token, "data": None, "suggestions": None}
    return user_id


def remove_user_session(user_id: str):
    USER_SESSIONS.pop(user_id, None)


def fetch_user_cart_and_orders(user_id: str) -> Dict:
    if user_id not in USER_SESSIONS:
        return {}
    jwt_token = USER_SESSIONS[user_id]["jwt"]
    headers = {"Authorization": f"Bearer {jwt_token}"}

    cart_resp = requests.get("http://127.0.0.1:8000/cart/cart/user", headers=headers)
    cart_resp.raise_for_status()
    cart = cart_resp.json()

    orders_resp = requests.get("http://127.0.0.1:8000/orders/orders/user", headers=headers)
    orders_resp.raise_for_status()
    orders = orders_resp.json()

    user_data = {"cart": cart, "orders": orders}
    USER_SESSIONS[user_id]["data"] = user_data
    return user_data


def background_generate_suggestions(user_id: str):
    """Runs in a background thread to generate suggestions"""
    try:
        user_data = USER_SESSIONS[user_id]["data"]
        suggestions = product_chain.predict(user_data)
        USER_SESSIONS[user_id]["suggestions"] = suggestions
        print(f"Suggestions generated for user {user_id}")
    except Exception as e:
        print(f"Suggestion generation failed for {user_id}: {e}")


def get_suggestions(user_id: str) -> Dict:
    """Return suggestions or indicate if still generating"""
    if user_id not in USER_SESSIONS:
        raise HTTPException(status_code=404, detail="User session not found")

    if USER_SESSIONS[user_id]["suggestions"] is None:
        thread = threading.Thread(target=background_generate_suggestions, args=(user_id,))
        thread.start()
        return {"status": "loading", "message": "Suggestions are being generated, please wait..."}

    return {"status": "ready", "suggestions": USER_SESSIONS[user_id]["suggestions"]}
