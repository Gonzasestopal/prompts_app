from datetime import datetime, timezone
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

from backend.server.app import app

client = TestClient(app)


def test_edit_message():
    from backend.server import routes

    fake = {
            "id": "64e3f1e25a0f0a0012abc123",
            "content": "random prompt",
            "status": "active",
            "createdAt": datetime(2025, 8, 14, 15, 42, 30, tzinfo=timezone.utc),
            "updatedAt": datetime(2025, 8, 14, 15, 42, 30, tzinfo=timezone.utc),
        }

    async def fake_retrieve_message(message_id, content, status):
        fake["content"] = content
        return fake

    with patch.object(routes, "update_message", new=fake_retrieve_message):
        r = client.put("/messages/64e3f1e25a0f0a0012abc123", json={"content": "updated prompt"})
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, dict)
        assert data["content"] == "updated prompt"
        assert data["status"] == "active"


def test_edit_message_raises_500():
    from backend.server import routes

    async def fake_retrieve_message_error(message_id, content, status):
        raise Exception("Database error")

    with patch.object(routes, "get_message", new=fake_retrieve_message_error):
        with pytest.raises(Exception) as exc_info:
            client.put("/messages/64e3f1e25a0f0a0012abc123", json={"content": "updated prompt"})

            assert "Database error" in str(exc_info.value)
