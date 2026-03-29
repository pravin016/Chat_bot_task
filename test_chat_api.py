#!/usr/bin/env python3
import requests
import json

# Test the chat endpoint
url = "http://localhost:8000/chat"
payload = {"message": "Hello, how are you?"}

print(f"Sending request to {url}")
print(f"Payload: {json.dumps(payload)}")

try:
    response = requests.post(url, json=payload, timeout=30)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    if response.status_code == 200:
        data = response.json()
        print(f"Chat Reply: {data.get('reply')}")
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
