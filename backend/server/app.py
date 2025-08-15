from contextlib import asynccontextmanager

from fastapi import FastAPI

from backend.server.config import initiate_database
from backend.server.routes import router as MessageRouter


@asynccontextmanager
async def lifespan(app: FastAPI):
    await initiate_database()
    yield

app = FastAPI(lifespan=lifespan)


@app.get("/")
async def ping():
    return {"ping": "pong"}

app.include_router(MessageRouter, tags=["Messages"], prefix="/messages")
