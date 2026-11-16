import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException

from app import db
from app.errors import ApiError
from app.routes.tasks import router as tasks_router
from app.seed import seed_if_empty


@asynccontextmanager
async def lifespan(app: FastAPI):
    database = await db.connect()
    if os.getenv("SEED_ON_STARTUP", "true").lower() != "false":
        await seed_if_empty(database)
    yield
    await db.close()


app = FastAPI(title="Task Tracker API", lifespan=lifespan)


@app.get("/api/health")
async def health():
    return {"status": "ok"}


app.include_router(tasks_router)


# ---------- uniform error format: {"error": "..."} ----------


@app.exception_handler(ApiError)
async def api_error_handler(request: Request, exc: ApiError):
    return JSONResponse(status_code=exc.status, content={"error": exc.message})


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError):
    # FastAPI would return 422 - the API contract requires 400
    first = exc.errors()[0] if exc.errors() else {}
    field = ".".join(str(p) for p in first.get("loc", []) if p != "body")
    message = first.get("msg", "Invalid request").removeprefix("Value error, ")
    return JSONResponse(status_code=400, content={"error": f"{field}: {message}" if field else message})


@app.exception_handler(StarletteHTTPException)
async def http_error_handler(request: Request, exc: StarletteHTTPException):
    detail = "Not found" if exc.status_code == 404 else str(exc.detail)
    return JSONResponse(status_code=exc.status_code, content={"error": detail})


@app.exception_handler(Exception)
async def unhandled_error_handler(request: Request, exc: Exception):
    print(f"[api] Unhandled error: {exc!r}")
    return JSONResponse(status_code=500, content={"error": "Internal server error"})
