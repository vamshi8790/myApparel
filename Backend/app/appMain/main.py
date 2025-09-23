from fastapi import FastAPI
from app.core.db import engine, Base
from app.routes import user
from fastapi.openapi.docs import get_swagger_ui_html
from app.routes import router as api_router


# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Endpoints")

# Register routes
app.include_router(api_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/", include_in_schema=False)
def overridden_swagger():
    return get_swagger_ui_html(openapi_url="/openapi.json", title="API Docs")








##### code to run backend:  "uvicorn app.appMain.main:app --reload"
