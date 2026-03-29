#!/usr/bin/env python3
"""Test async Gemini call like the endpoint does"""
import os
import asyncio
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment
os.chdir(os.path.dirname(os.path.abspath(__file__)) + "/backend")
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-latest")

print(f"Working directory: {os.getcwd()}")
print(f"API Key loaded: {bool(GEMINI_API_KEY)}")
print(f"Model: {GEMINI_MODEL}")
print()

async def main():
    try:
        print("[1] Configuring genai...")
        genai.configure(api_key=GEMINI_API_KEY)
        print("✓ Configuration successful")
        
        print("[2] Creating GenerativeModel...")
        model = genai.GenerativeModel(GEMINI_MODEL)
        print("✓ Model created")
        
        prompt = "You are a concise mobile chatbot assistant. Respond with practical, clear and brief answers. IMPORTANT: Do NOT use markdown formatting like **, *, ##, or bullet points. Use plain text only.\n\nUser message: Hello"
        
        print("[3] Calling generate_content via asyncio.to_thread...")
        response = await asyncio.to_thread(model.generate_content, prompt)
        print("✓ API call successful")
        
        print(f"[4] Response text: {response.text[:100]}")
        
    except Exception as e:
        print(f"✗ Error: {type(e).__name__}: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(main())
