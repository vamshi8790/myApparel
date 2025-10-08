from fastapi import FastAPI
from app.core.db import engine, Base
from fastapi.openapi.docs import get_swagger_ui_html
from app.routes import router as api_router


Base.metadata.create_all(bind=engine)

app = FastAPI(title="MyApparel API", version="1.0.0")
app.include_router(api_router)

@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/", include_in_schema=False)
def overridden_swagger():
    return get_swagger_ui_html(openapi_url="/openapi.json", title="MyApparel API Docs")








##### code to run backend:  "uvicorn app.appMain.main:app --reload"
