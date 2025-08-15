from typing import Optional

from beanie import init_beanie
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic_settings import BaseSettings

from backend.server.models import Message


class Settings(BaseSettings):
    # database configurations
    MONGO_URL: Optional[str] = None

    class Config:
        env_file = ".env"
        from_attributes = True


async def initiate_database():
    client = AsyncIOMotorClient(Settings().MONGO_URL)
    await init_beanie(
        database=client.get_default_database(), document_models=[Message]
    )
