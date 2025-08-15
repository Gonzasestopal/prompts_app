from datetime import datetime, timezone
from unittest.mock import patch

from fastapi.testclient import TestClient

from backend.server.app import app

client = TestClient(app)


def test_get_messages():
    from backend.server import routes

    fake = [
        {
            "id": "64e3f1e25a0f0a0012abc123",
            "content": "random prompt",
            "status": "active",
            "createdAt": datetime(2025, 8, 14, 15, 42, 30, tzinfo=timezone.utc),
            "updatedAt": datetime(2025, 8, 14, 15, 42, 30, tzinfo=timezone.utc),
        }
    ]

    async def fake_retrieve_messages():
        return fake

    with patch.object(routes, "retrieve_messages", new=fake_retrieve_messages):
        r = client.get("/messages/")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert data[0]["content"] == "random prompt"
        assert data[0]["status"] == "active"
