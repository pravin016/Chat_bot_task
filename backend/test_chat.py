import urllib.request
import json

req = urllib.request.Request(
    'http://127.0.0.1:8000/chat',
    data=json.dumps({"message": "test"}).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    resp = urllib.request.urlopen(req)
    print("SUCCESS:", resp.read().decode())
except Exception as e:
    print("ERROR:", e)
    if hasattr(e, 'read'):
        print("DETAILS:", e.read().decode())
