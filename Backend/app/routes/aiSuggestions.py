from fastapi import APIRouter, Header, HTTPException
from app.GenAI.GenAI_Service import (
    store_user_session,
    fetch_user_cart_and_orders,
    remove_user_session,
    fetch_all_products,
    USER_SESSIONS,
)
from app.GenAI.llm_chain import product_chain
from app.core.security import verify_access_token
from starlette.responses import StreamingResponse
import time
import json

router = APIRouter(prefix="/genai", tags=["GenAI"])
fetch_all_products()


@router.post("/login")
def login_genai_route(authorization: str = Header(...)):
    token = authorization.split(" ")[1] if "Bearer" in authorization else authorization
    user_id = store_user_session(token)
    user_data = fetch_user_cart_and_orders(user_id)
    USER_SESSIONS[user_id] = {"data": user_data}

    return {
        "message": "JWT stored, user data loaded. Call /genai/suggestions to get GenAI output.",
        "user_id": user_id,
        "user_data": user_data,
    }


def suggestion_stream(user_id: str):
    """Generator to stream suggestions in chunks"""
    if user_id not in USER_SESSIONS:
        try:
            user_data = fetch_user_cart_and_orders(user_id)
            USER_SESSIONS[user_id] = {"data": user_data}
        except Exception:
            yield json.dumps({"status": "error", "message": "User session not found"}) + "\n"
            return
    else:
        user_data = USER_SESSIONS[user_id]["data"]

    yield json.dumps({"status": "loading", "message": "Generating suggestions..."}) + "\n"
    for s in product_chain.predict(user_data):
        suggestion = json.loads(s) if isinstance(s, str) else s
        yield json.dumps({"status": "partial", "suggestion": suggestion}) + "\n"
        time.sleep(0.5)
    yield json.dumps({"status": "ready", "message": "All suggestions generated."}) + "\n"


@router.get("/suggestions")
def genai_suggestions_route(authorization: str = Header(...)):
    token = authorization.split(" ")[1] if "Bearer" in authorization else authorization
    payload = verify_access_token(token)
    user_id = payload.get("user_id") or payload.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid token")

    return StreamingResponse(
        suggestion_stream(user_id),
        media_type="application/json",
    )


@router.post("/logout")
def logout_genai_route(authorization: str = Header(...)):
    token = authorization.split(" ")[1] if "Bearer" in authorization else authorization
    payload = verify_access_token(token)
    user_id = payload.get("user_id") or payload.get("id")

    remove_user_session(user_id)
    USER_SESSIONS.pop(user_id, None)

    return {"message": "User logged out"}
