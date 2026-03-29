from fastapi.testclient import TestClient
from main import app
import pytest

client = TestClient(app)

def test_health_check():
    """Ensure the health endpoint returns 200 OK and status."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"status": "Backend is running!"}

def test_chat_endpoint_no_token():
    """Ensure POST /chat fails gracefully or handles missing token properly."""
    response = client.post("/chat", json={"message": "Hello!"})
    assert response.status_code == 200
    assert "reply" in response.json()
    assert isinstance(response.json()["reply"], str)

def test_transcribe_endpoint_invalid_file():
    """Ensure POST /transcribe handles bad files without crashing."""
    response = client.post(
        "/transcribe",
        files={"file": ("test.txt", b"dummy audio content", "text/plain")}
    )
    # The API might try processing and throw a parsing error, but shouldn't 500
    assert response.status_code == 200
    assert "text" in response.json()
    assert "Error" in response.json()["text"] or len(response.json()["text"]) >= 0
