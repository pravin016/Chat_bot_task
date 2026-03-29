#!/usr/bin/env python3
import requests
import json

url = "http://localhost:8000/chat"
messages = [
    "What is machine learning?",
    "Tell me a joke",
    "How do I learn Python?"
]

for msg in messages:
    payload = {"message": msg}
    try:
        response = requests.post(url, json=payload, timeout=60)  # 60 second timeout
        data = response.json()
        print(f"Q: {msg}")
        print(f"A: {data.get('reply')}")
        print()
    except Exception as e:
        print(f"Error: {e}")
        break
