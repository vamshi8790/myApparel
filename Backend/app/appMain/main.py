from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from app.routes import router as api_router
from app.models import *
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="MyApparel API", version="1.0.0")
app.include_router(api_router)


@app.get("/", include_in_schema=False)
def overridden_swagger():
    return get_swagger_ui_html(openapi_url="/openapi.json", title="MyApparel API Docs")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)







##### alembic revision --autogenerate -m "initial tables"
####  alembic upgrade head
##### code to run backend:  "uvicorn app.appMain.main:app --reload"