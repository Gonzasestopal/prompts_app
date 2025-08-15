import pytest
from beanie import init_beanie
from mongomock_motor import AsyncMongoMockClient


@pytest.fixture(scope="session")
def anyio_backend():
    return "asyncio"


@pytest.fixture(scope="session")
async def beanie_init():
    """
    Initialize Beanie once per test session against in-memory Mongo.
    """
    # Import INSIDE the fixture (avoids init-at-import issues)
    from backend.server.models import Message

    client = AsyncMongoMockClient()
    db = client["semantiks_test"]
    await init_beanie(database=db, document_models=[Message])
    yield
    client.close()
