from datetime import datetime, timezone
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from backend.server.app import app

client = TestClient(app)


# ----- Helpers -----
def now_utc():
    return datetime(2025, 8, 14, 12, 0, 0, tzinfo=timezone.utc)


def test_create_message_success():
    from backend.server import routes

    fake = {
            "id": "64e3f1e25a0f0a0012abc123",
            "content": "random prompt",
            "status": "active",
            "created_at": datetime(2025, 8, 14, 15, 42, 30, tzinfo=timezone.utc),
            "updated_at": datetime(2025, 8, 14, 15, 42, 30, tzinfo=timezone.utc),
    }

    async def fake_insert_message(message_in):
        return fake

    with patch.object(routes, "insert_message", new=fake_insert_message):
        payload = {"content": "hello world"}
        res = client.post("/messages/", json=payload)
        assert res.status_code == 201
        body = res.json()
        assert body["id"] == "64e3f1e25a0f0a0012abc123"
        assert body["content"] == "random prompt"


def test_create_message_returns_500_on_exception():
    from backend.server import routes

    async def fake_insert_message(message_in):
        raise Exception("Database error")

    # Patch the symbol that the route calls
    with patch.object(routes, "insert_message", new=fake_insert_message):
        with pytest.raises(Exception) as exc_info:
            client.post("/messages/", json={"content": "boom"})

    assert "Database error" in str(exc_info.value)
