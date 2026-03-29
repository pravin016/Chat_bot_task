import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
try:
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    models = genai.list_models()
    with open("models_list.txt", "w") as f:
        for m in models:
            if "generateContent" in m.supported_generation_methods:
                f.write(f"{m.name}\n")
except Exception as e:
    print(f"Error listing models: {e}")
