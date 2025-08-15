from fastapi.testclient import TestClient

from backend.server.app import app

client = TestClient(app)


def test_ping():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"ping": "pong"}
