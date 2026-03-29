#!/usr/bin/env python3
"""Test Gemini API directly"""
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-latest")

print(f"API Key length: {len(GEMINI_API_KEY) if GEMINI_API_KEY else 0}")
print(f"Model: {GEMINI_MODEL}")
print()

try:
    print("[1] Configuring genai...")
    genai.configure(api_key=GEMINI_API_KEY)
    print("✓ Configuration successful")
    print()
    
    print("[2] Creating GenerativeModel...")
    model = genai.GenerativeModel(GEMINI_MODEL)
    print("✓ Model created")
    print()
    
    print("[3] Calling generate_content...")
    response = model.generate_content("Hello")
    print("✓ API call successful")
    print()
    
    print(f"[4] Response text: {response.text}")
    
except Exception as e:
    print(f"✗ Error: {type(e).__name__}: {e}")
    import traceback
    print()
    traceback.print_exc()
