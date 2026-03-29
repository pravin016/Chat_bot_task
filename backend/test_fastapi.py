from main import chat, app, ChatRequest
from fastapi.testclient import TestClient

client = TestClient(app)
try:
    response = client.post("/chat", json={"message": "Hello"})
    print("STATUS CODE:", response.status_code)
    print("RESPONSE JSON:", response.json())
except Exception as e:
    import traceback
    traceback.print_exc()
