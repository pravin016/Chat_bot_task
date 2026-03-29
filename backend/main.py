import os
# Forces uvicorn reload
from datetime import datetime, timezone
from typing import Any
import tempfile
import sys
import logging
from functools import lru_cache

# Configure logging
logging.basicConfig(level=logging.DEBUG, format='[%(name)s] %(message)s', force=True)
logger = logging.getLogger(__name__)

import sentry_sdk
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import Depends, FastAPI, Header, HTTPException, WebSocket, WebSocketDisconnect, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from pydantic import BaseModel
from supabase import Client, create_client

# Disable buffering for real-time logging
sys.stdout.flush()
sys.stderr.flush()

# Load .env from backend directory (wherever main.py is located)
backend_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(backend_dir, ".env")
load_dotenv(env_path, override=True)

# Print debug info for troubleshooting
print(f"[Startup] Backend directory: {backend_dir}")
print(f"[Startup] .env path: {env_path}")
print(f"[Startup] .env file exists: {os.path.exists(env_path)}")
print(f"[Startup] GEMINI_API_KEY loaded: {len(os.getenv('GEMINI_API_KEY', '')) > 0}")
SENTRY_DSN = (os.getenv("SENTRY_DSN") or "").strip()
if SENTRY_DSN.startswith("https://"):
    sentry_sdk.init(
        dsn=SENTRY_DSN,
        traces_sample_rate=1.0,
    )

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-flash-latest")

_supabase: Client | None = None
_gen_model: genai.GenerativeModel | None = None


def require_supabase() -> Client:
    global _supabase
    if _supabase is None:
        if not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
            raise HTTPException(
                status_code=503,
                detail="Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in backend/.env",
            )
        _supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    return _supabase


def require_gemini_model() -> genai.GenerativeModel:
    global _gen_model
    if _gen_model is None:
        logger.info(f"Initializing model: {GEMINI_MODEL}")
        logger.info(f"API Key available: {bool(GEMINI_API_KEY)}, length: {len(GEMINI_API_KEY)}")
        if not GEMINI_API_KEY:
            raise HTTPException(
                status_code=503,
                detail="Configure GEMINI_API_KEY in backend/.env",
            )
        try:
            logger.info(f"Configuring genai with API key...")
            genai.configure(api_key=GEMINI_API_KEY)
            logger.info(f"Creating GenerativeModel...")
            _gen_model = genai.GenerativeModel(GEMINI_MODEL)
            logger.info(f"Model created successfully")
        except Exception as e:
            logger.error(f"Error during model initialization: {type(e).__name__}: {e}", exc_info=True)
            raise HTTPException(
                status_code=503,
                detail=f"Failed to initialize Gemini model: {str(e)}",
            )
    return _gen_model

app = FastAPI(title="ChatBot Backend")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    reply: str


def clean_markdown(text: str) -> str:
    """Remove markdown formatting from text"""
    text = text.replace("**", "")  # Remove bold
    text = text.replace("*", "")   # Remove italic
    text = text.replace("##", "")  # Remove headings
    text = text.replace("- ", "")  # Remove bullet points
    return text.strip()


def verify_user_optional(authorization: str = Header(default="")) -> dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        return {"id": None, "email": "anonymous"}

    token = authorization.replace("Bearer ", "")
    try:
        result = require_supabase().auth.get_user(token)
        user = result.user
        if user is None:
            return {"id": None, "email": "anonymous"}
        return {"id": user.id, "email": user.email}
    except Exception:
        return {"id": None, "email": "anonymous"}


@app.get("/health")
def health() -> dict[str, Any]:
    def looks_configured(value: str) -> bool:
        v = (value or "").strip()
        if not v:
            return False
        if "YOUR_" in v.upper():
            return False
        return True

    configured = (
        looks_configured(SUPABASE_URL)
        and looks_configured(SUPABASE_SERVICE_ROLE_KEY)
        and looks_configured(GEMINI_API_KEY)
    )
    return {"status": "ok", "chat_ready": configured}


@app.get("/auth/me")
def me(user: dict[str, Any] = Depends(verify_user_optional)) -> dict[str, Any]:
    return {"user": user}


@app.post("/auth/verify-token")
def verify_token(authorization: str = Header(default="")) -> dict[str, Any]:
    """Verify if a token is valid"""
    user = verify_user_optional(authorization)
    is_valid = user.get("id") is not None
    return {
        "valid": is_valid,
        "user": user,
    }


@app.post("/auth/health")
def auth_health(user: dict[str, Any] = Depends(verify_user_optional)) -> dict[str, Any]:
    """Check auth service health"""
    try:
        supabase = require_supabase()
        return {
            "status": "healthy",
            "supabase_connected": True,
            "user": user,
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "supabase_connected": False,
            "error": str(e),
        }


@app.post("/chat")
async def chat(payload: ChatRequest, user: dict[str, Any] = Depends(verify_user_optional), background_tasks: BackgroundTasks = None) -> ChatResponse:
    """Chat endpoint with optimized async handling for Gemini API"""
    prompt = (
        "You are a concise mobile chatbot assistant. "
        "Respond with practical, clear and brief answers. "
        "IMPORTANT: Do NOT use markdown formatting like **, *, ##, or bullet points. Use plain text only.\n\n"
        f"User message: {payload.message}"
    )

    try:
        # Get the configured model
        model = require_gemini_model()
        
        # Run the API call in a thread pool executor to avoid blocking the event loop
        # Use a custom function that preserves the model instance
        def generate_response():
            return model.generate_content(prompt)
        
        # Run in thread with no timeout
        response = await asyncio.to_thread(generate_response)
        reply = (response.text or "").strip() or "I could not generate a response."
        reply = clean_markdown(reply)  # Remove any markdown that slipped through
            
    except Exception as e:
        error_type = type(e).__name__
        error_msg = str(e)
        
        logger.error(f"Chat Error - {error_type}: {error_msg}", exc_info=True)
        
        # Handle specific error types
        if "ResourceExhausted" in error_type or "429" in error_msg:
            reply = "API quota exceeded. Please wait a moment and try again later, or check your API plan."
        elif "DefaultCredentialsError" in error_type or "No API_KEY" in error_msg:
            reply = "API key not configured properly. Please check your backend/.env file."
        elif "AuthenticationError" in error_type or "401" in error_msg or "403" in error_msg:
            reply = "API authentication failed. Please verify your API key is valid."
        else:
            reply = "I'm having trouble processing that right now. Could you please rephrase?"

    # Log to Supabase in background (doesn't block response)
    def log_to_supabase():
        try:
            record = {
                "prompt": payload.message,
                "reply": reply,
                "created_at": datetime.now(timezone.utc).isoformat(),
            }
            if user.get("id"):
                record["user_id"] = user["id"]
                record["user_email"] = user["email"]
                
            require_supabase().table("chat_messages").insert(record).execute()
        except Exception as e:
            print(f"Supabase log skipped: {e}")

    if background_tasks:
        background_tasks.add_task(log_to_supabase)
    else:
        # Fallback if background_tasks is None
        try:
            log_to_supabase()
        except:
            pass

    return ChatResponse(reply=reply)

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    tmp_path = None
    try:
        print(f"\n[STT] Received file: {file.filename}, size estimate: {file.size}")
        print(f"[STT] GEMINI_API_KEY loaded: {len(GEMINI_API_KEY) > 0}")
        
        # Create temp file with proper suffix
        with tempfile.NamedTemporaryFile(delete=False, suffix=".m4a") as tmp:
            content = await file.read()
            print(f"[STT] File content size: {len(content)} bytes")
            
            if len(content) == 0:
                return {"text": "Error: Empty audio file received"}
            
            tmp.write(content)
            tmp_path = tmp.name
            print(f"[STT] Saved to temp file: {tmp_path}")

        # Verify API key
        if not GEMINI_API_KEY or GEMINI_API_KEY.startswith("YOUR_"):
            print("[STT] ERROR: GEMINI_API_KEY is not configured!")
            return {"text": "Error: Gemini API key not configured. Please set GEMINI_API_KEY in .env"}

        # Upload to Gemini
        try:
            print("[STT] Uploading to Gemini...")
            audio_file = genai.upload_file(path=tmp_path, mime_type="audio/mpeg")
            print(f"[STT] Gemini file uploaded: {audio_file.name}")
        except Exception as upload_error:
            print(f"[STT] Upload error: {upload_error}")
            return {"text": f"Error uploading file to Gemini: {str(upload_error)}"}
        
        # Get model
        try:
            model = require_gemini_model()
            print(f"[STT] Model loaded: {GEMINI_MODEL}")
        except Exception as model_error:
            print(f"[STT] Model error: {model_error}")
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
            return {"text": f"Error loading Gemini model: {str(model_error)}"}
        
        # Generate content with audio
        try:
            print("[STT] Generating transcription...")
            response = await asyncio.to_thread(
                model.generate_content,
                ["Transcribe this audio accurately and completely. Output ONLY the transcribed text, nothing else.", audio_file]
            )
            
            text_result = (response.text or "").strip()
            print(f"[STT] Transcription success! Length: {len(text_result)} chars")
            print(f"[STT] Result: {text_result[:100]}...")
        except Exception as gen_error:
            print(f"[STT] Generation error: {gen_error}")
            if os.path.exists(tmp_path):
                os.remove(tmp_path)
            return {"text": f"Error generating transcription: {str(gen_error)}"}
        
        # Clean up
        try:
            genai.delete_file(audio_file.name)
            print(f"[STT] Cleaned up Gemini file")
        except Exception as cleanup_error:
            print(f"[STT] Cleanup warning: {cleanup_error}")
        
        try:
            os.remove(tmp_path)
        except:
            pass
        
        return {"text": text_result if text_result else "Error: Empty transcription result"}
        
    except Exception as e:
        print(f"[STT] FATAL ERROR: {str(e)}")
        import traceback
        traceback.print_exc()
        return {"text": f"Error: {str(e)}"}

@app.websocket("/ws/chat")
async def websocket_chat(websocket: WebSocket, token: str = ""):
    await websocket.accept()
    user_info = verify_user_optional(f"Bearer {token}" if token else "")
    model = require_gemini_model()
    
    try:
        while True:
            # Wait for any message
            data = await websocket.receive_text()
            prompt = (
                "You are a concise mobile chatbot assistant. "
                "Respond with practical, clear and brief answers. "
                "IMPORTANT: Do NOT use markdown formatting like **, *, ##, or bullet points. Use plain text only.\n\n"
                f"User message: {data}"
            )
            
            # Use asyncio to_thread to prevent blocking the async FastAPI event loop
            try:
                response = await asyncio.to_thread(model.generate_content, prompt)
                reply = (response.text or "").strip() or "I could not generate a response."
                reply = clean_markdown(reply)  # Remove any markdown that slipped through
            except Exception as e:
                print(f"Gemini API Error: {e}")
                reply = "I'm having trouble processing that right now."
                
            await websocket.send_json({"reply": reply})

            # Fire and forget supabase logging
            try:
                record = {
                    "prompt": data,
                    "reply": reply,
                    "created_at": datetime.now(timezone.utc).isoformat(),
                }
                if user_info.get("id"):
                    record["user_id"] = user_info["id"]
                    record["user_email"] = user_info["email"]
                await asyncio.to_thread(lambda: require_supabase().table("chat_messages").insert(record).execute())
            except Exception as e:
                print(f"Supabase log skipped: {e}")

    except WebSocketDisconnect:
        print("Client disconnected from websocket")

