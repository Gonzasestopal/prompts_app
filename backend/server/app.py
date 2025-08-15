from contextlib import asynccontextmanager

from bson.errors import InvalidId
from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from backend.server.config import initiate_database
from backend.server.exceptions import (invalid_objectid_handler,
                                       validation_exception_handler)
from backend.server.routes import router as MessageRouter


@asynccontextmanager
async def lifespan(app: FastAPI):
    await initiate_database()
    yield

app = FastAPI(lifespan=lifespan)

ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def ping():
    return {"ping": "pong"}

app.include_router(MessageRouter, tags=["Messages"], prefix="/messages")


app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(InvalidId, invalid_objectid_handler)
