import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv(override=True)
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-latest")

print(f"Key: {GEMINI_API_KEY[:5]}... Model: {GEMINI_MODEL}")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(GEMINI_MODEL)
try:
    response = model.generate_content("Hello")
    print("Success:", response.text)
except Exception as e:
    print("Error:", e)
