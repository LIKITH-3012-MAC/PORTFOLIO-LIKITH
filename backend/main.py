import os
import json
import logging
from fastapi import FastAPI, Request, HTTPException, Header, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
from groq import Groq
from dotenv import load_dotenv
from datetime import datetime, timedelta
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi import Header
from core.router import IntentRouter
from core.retrieval import RetrievalService
from core.llm_service import LLMService
import pytz

# Timezone Configuration
IST = pytz.timezone('Asia/Kolkata')

def format_to_ist(dt: datetime):
    if not dt:
        return None
    # Assume naive datetimes are UTC
    if dt.tzinfo is None:
        dt = pytz.utc.localize(dt)
    return dt.astimezone(IST).strftime('%d/%m/%Y, %I:%M:%S %p')

# 1. Setup & Environment
env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=env_path)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("API")

app = FastAPI(title="Likith Portfolio API")

# 2. Production-Ready Middleware
FRONTEND_URL = os.getenv("FRONTEND_URL", "https://likith-portfolio.online")
FRONTEND_WWW_URL = os.getenv("FRONTEND_WWW_URL", "https://www.likith-portfolio.online")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        FRONTEND_URL,
        FRONTEND_WWW_URL,
        "https://portfolio-likith.onrender.com",
        "https://likith-portfolio.vercel.app",
        "http://localhost:3000",
        "http://localhost:8080",
        "null",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Logging Middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = datetime.now()
    response = await call_next(request)
    duration = datetime.now() - start_time
    logger.info(f"Method: {request.method} Path: {request.url.path} Status: {response.status_code} Duration: {duration}")
    return response

# Global Error Handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global Error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"success": False, "message": "Internal server error. Please check /problem.html on the frontend."},
    )

# 3. Knowledge Base Initialization
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# Initialize client only if key exists, otherwise log warning
client = None
if GROQ_API_KEY and "YOUR_GROQ_API_KEY" not in GROQ_API_KEY:
    try:
        client = Groq(api_key=GROQ_API_KEY, max_retries=1)
        logger.info("✅ Groq AI Client initialized.")
    except Exception as e:
        logger.error(f"❌ Failed to initialize Groq Client: {e}")
else:
    logger.warning("⚠️ GROQ_API_KEY is missing or invalid. AI features will be limited.")

data_dir = os.path.join(os.path.dirname(__file__), "data")
kb = {}
try:
    for file in os.listdir(data_dir):
        if file.endswith(".json"):
            with open(os.path.join(data_dir, file), "r") as f:
                kb[file.replace(".json", "")] = json.load(f)
except Exception as e:
    logger.error(f"KB Load Error: {e}")

# 3.1 Initialize Services
router = IntentRouter(kb)
retriever = RetrievalService(kb)

BASE_PROMPT = """
You are Likith's AI Agent, an elite digital representative of Likith Naidu (AI-ML Architect & Founder).
Your objective is to provide concise, premium, and technically accurate responses.
Always maintain an elegant, founder-grade tone.
"""

llm_service = LLMService(api_key=GROQ_API_KEY, system_prompt=BASE_PROMPT)

# 3.2 Admin Auth
ADMIN_TOKEN = os.getenv("ADMIN_TOKEN", "Mahitha")

def get_admin_auth(x_admin_token: str = Header(None)):
    actual_token = x_admin_token.strip() if x_admin_token else ""
    if actual_token != ADMIN_TOKEN:
        logger.warning(f"⚠️ Unauthorized admin access attempt with token length: {len(actual_token)}")
        raise HTTPException(status_code=401, detail="Unauthorized Admin Access")
    return True

# 4. Database Setup
DATABASE_URL = os.getenv("DATABASE_URL")

# Optimized for Aiven MySQL with pymysql or SQLite fallback
try:
    if DATABASE_URL and "mysql" in DATABASE_URL.lower():
        engine = create_engine(
            DATABASE_URL,
            connect_args={
                "ssl": {
                    "ssl_mode": "REQUIRED"
                }
            },
            pool_pre_ping=True,
            pool_recycle=3600
        )
        logger.info("✅ MySQL Engine initialized.")
    else:
        # Fallback to local SQLite if MySQL URL is missing or invalid
        sqlite_path = os.path.join(os.path.dirname(__file__), "local.db")
        engine = create_engine(f"sqlite:///{sqlite_path}", connect_args={"check_same_thread": False})
        logger.warning(f"⚠️ DATABASE_URL missing or invalid. Falling back to local SQLite: {sqlite_path}")
except Exception as e:
    logger.error(f"❌ Failed to initialize database engine: {e}")
    # Final fallback to memory SQLite
    engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    logger.warning("⚠️ Using in-memory SQLite (DATA WILL NOT PERSIST).")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class CollaborationRequest(Base):
    __tablename__ = "collaboration_requests"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(50), nullable=False)
    country = Column(String(100), nullable=False)
    state = Column(String(100), nullable=True)
    district = Column(String(100), nullable=True)
    mandal_or_subregion = Column(String(100), nullable=True)
    village_or_town = Column(String(100), nullable=True)
    purpose = Column(Text, nullable=False)
    collaboration_type = Column(String(100), nullable=False)
    email = Column(String(255), nullable=True)
    preferred_contact_method = Column(String(100), nullable=True)
    budget_range = Column(String(100), nullable=True)
    timeline = Column(String(100), nullable=True)
    organization = Column(String(255), nullable=True)
    status = Column(String(50), default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatLog(Base):
    __tablename__ = "chat_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_message = Column(Text, nullable=False)
    ai_response = Column(Text, nullable=False)
    intent = Column(String(100), nullable=True)
    card_type = Column(String(50), nullable=True)
    latency_ms = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class VisitorAnalytics(Base):
    __tablename__ = "visitor_analytics"
    id = Column(Integer, primary_key=True, index=True)
    visited_at = Column(DateTime, default=datetime.utcnow)
    page_path = Column(String(255), nullable=True)
    os_name = Column(String(100), nullable=True)
    device_type = Column(String(50), nullable=True)
    browser_name = Column(String(100), nullable=True)
    user_agent_summary = Column(Text, nullable=True)
    referrer = Column(String(255), nullable=True)
    session_id = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Startup Table Verification
try:
    Base.metadata.create_all(bind=engine)
    logger.info("✅ Database tables verified/created successfully.")
except Exception as e:
    logger.error(f"❌ Table Creation Error: {str(e)}")

# 5. Pydantic Models
class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    reply_text: str
    card_type: Optional[str] = "none"

class VisitRequest(BaseModel):
    page_path: str
    os_name: Optional[str] = None
    device_type: Optional[str] = None
    browser_name: Optional[str] = None
    user_agent_summary: Optional[str] = None
    referrer: Optional[str] = None
    session_id: Optional[str] = None

class CollabRequest(BaseModel):
    full_name: str
    phone_number: str
    country: str
    state: Optional[str] = None
    district: Optional[str] = None
    mandal_or_subregion: Optional[str] = None
    village_or_town: Optional[str] = None
    purpose: str
    collaboration_type: str
    email: Optional[str] = None
    preferred_contact_method: Optional[str] = None
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    organization: Optional[str] = None

# 6. AI Agent Logic (Removed legacy prompt)

# 7. Endpoints
@app.get("/")
async def root():
    return {"message": "Likith Portfolio API is active.", "status": "online"}

@app.post("/api/chat")
async def chat(request: ChatRequest):
    start_time = datetime.now()
    
    # Layer 1: Intent Routing & Static Answers
    intent = router.classify(request.message)
    static_answer, card = router.get_static_answer(intent, request.message)
    
    final_response_text = ""
    
    if static_answer:
        final_response_text = static_answer
        logger.info(f"🚀 Intent: {intent} (Static Match)")
        
        # Log to DB (Sync for static)
        _log_chat(request.message, static_answer, intent, card, 0)
        
        return StreamingResponse(self_stream(static_answer, card), media_type="text/plain")

    # Layer 2: RAG Context Retrieval
    context = retriever.get_context(request.message, intent)
    logger.info(f"🧠 Intent: {intent} (RAG Mode)")

    # Layer 3: Selective LLM Generation
    async def log_and_stream():
        full_text = ""
        async for chunk in llm_service.stream_chat(request.message, request.history, context):
            full_text += chunk
            yield chunk
        
        # Calculate latency and log
        duration = (datetime.now() - start_time).total_seconds() * 1000
        _log_chat(request.message, full_text, intent, "none", int(duration))

    return StreamingResponse(log_and_stream(), media_type="text/plain")

def _log_chat(msg, resp, intent, card, latency):
    try:
        db = SessionLocal()
        # Clean the response from CARD tags for logging
        clean_resp = resp.split("[[CARD:")[0].strip()
        log = ChatLog(
            user_message=msg,
            ai_response=clean_resp,
            intent=intent,
            card_type=card,
            latency_ms=latency
        )
        db.add(log)
        db.commit()
        db.close()
    except Exception as e:
        logger.error(f"Failed to log chat: {e}")

async def self_stream(text, card):
    """Helper to stream static text to maintain frontend consistency."""
    yield text
    if card != "none":
        yield f" [[CARD:{card}]]"

@app.post("/api/collab")
async def create_collab(request: CollabRequest):
    db = SessionLocal()
    try:
        logger.info(f"📥 RECEIVED PAYLOAD: {request.dict()}")
        new_request = CollaborationRequest(
            full_name=request.full_name,
            phone_number=request.phone_number,
            country=request.country,
            state=request.state if request.state else None,
            district=request.district if request.district else None,
            mandal_or_subregion=request.mandal_or_subregion if request.mandal_or_subregion else None,
            village_or_town=request.village_or_town if request.village_or_town else None,
            purpose=request.purpose,
            collaboration_type=request.collaboration_type,
            email=request.email if request.email else None,
            preferred_contact_method=request.preferred_contact_method if request.preferred_contact_method else None,
            budget_range=request.budget_range if request.budget_range else None,
            timeline=request.timeline if request.timeline else None,
            organization=request.organization if request.organization else None
        )
        db.add(new_request)
        db.commit()
        db.refresh(new_request)
        logger.info(f"🚀 DATA STORED: Successfully committed ID {new_request.id}")
        return {"success": True, "message": "Collaboration logged successfully.", "entry_id": new_request.id}
    except Exception as e:
        db.rollback()
        logger.error(f"❌ DB STORAGE ERROR: {str(e)}")
        return JSONResponse(status_code=500, content={"success": False, "message": f"Database error: {str(e)}"})
    finally:
        db.close()

# 8. Admin Endpoints
@app.get("/api/admin/responses")
async def get_admin_responses(limit: int = 50, offset: int = 0, authenticated: bool = Depends(get_admin_auth)):
    db = SessionLocal()
    try:
        logs = db.query(ChatLog).order_by(ChatLog.id.desc()).offset(offset).limit(limit).all()
        total = db.query(ChatLog).count()
        return {
            "success": True,
            "data": [
                {
                    "id": l.id,
                    "message": l.user_message,
                    "response": l.ai_response,
                    "intent": l.intent,
                    "latency": l.latency_ms,
                    "time": format_to_ist(l.created_at)
                } for l in logs
            ],
            "pagination": {"total": total, "limit": limit, "offset": offset}
        }
    finally:
        db.close()

@app.get("/api/admin/collabs")
async def get_admin_collabs(limit: int = 50, offset: int = 0, authenticated: bool = Depends(get_admin_auth)):
    db = SessionLocal()
    try:
        collabs = db.query(CollaborationRequest).order_by(CollaborationRequest.id.desc()).offset(offset).limit(limit).all()
        total = db.query(CollaborationRequest).count()
        return {
            "success": True,
            "data": [
                {
                    "id": c.id,
                    "name": c.full_name,
                    "email": c.email,
                    "phone": c.phone_number,
                    "type": c.collaboration_type,
                    "purpose": c.purpose,
                    "time": format_to_ist(c.created_at)
                } for c in collabs
            ],
            "pagination": {"total": total, "limit": limit, "offset": offset}
        }
    finally:
        db.close()

@app.post("/api/analytics/visit")
async def record_visit(request: VisitRequest):
    db = SessionLocal()
    try:
        # Deduplication check: if same session visited same path in last 5 minutes, skip
        five_mins_ago = datetime.utcnow() - timedelta(minutes=5)
        duplicate = db.query(VisitorAnalytics).filter(
            VisitorAnalytics.session_id == request.session_id,
            VisitorAnalytics.page_path == request.page_path,
            VisitorAnalytics.created_at >= five_mins_ago
        ).first()

        if duplicate:
            return {"success": True, "message": "Duplicate visit suppressed."}

        new_visit = VisitorAnalytics(
            page_path=request.page_path,
            os_name=request.os_name,
            device_type=request.device_type,
            browser_name=request.browser_name,
            user_agent_summary=request.user_agent_summary,
            referrer=request.referrer,
            session_id=request.session_id
        )
        db.add(new_visit)
        db.commit()
        return {"success": True, "message": "Visit recorded."}
    except Exception as e:
        db.rollback()
        logger.error(f"Failed to record visit: {e}")
        return {"success": False, "message": "Internal error."}
    finally:
        db.close()

@app.get("/api/admin/visitors")
async def get_admin_visitors(limit: int = 50, offset: int = 0, authenticated: bool = Depends(get_admin_auth)):
    db = SessionLocal()
    try:
        visits = db.query(VisitorAnalytics).order_by(VisitorAnalytics.id.desc()).offset(offset).limit(limit).all()
        total = db.query(VisitorAnalytics).count()
        return {
            "success": True,
            "data": [
                {
                    "id": v.id,
                    "path": v.page_path,
                    "os": v.os_name,
                    "device": v.device_type,
                    "browser": v.browser_name,
                    "referrer": v.referrer,
                    "time": format_to_ist(v.created_at)
                } for v in visits
            ],
            "pagination": {"total": total, "limit": limit, "offset": offset}
        }
    finally:
        db.close()

@app.get("/api/admin/visitor-stats")
async def get_admin_visitor_stats(authenticated: bool = Depends(get_admin_auth)):
    db = SessionLocal()
    try:
        total_visits = db.query(VisitorAnalytics).count()
        unique_sessions = db.query(VisitorAnalytics.session_id).distinct().count()
        
        # Simple stats for dashboard
        return {
            "success": True,
            "stats": {
                "total_visits": total_visits,
                "unique_visitors": unique_sessions,
                "uptime": "99.9%"
            }
        }
    finally:
        db.close()

@app.get("/api/debug-db")
async def debug_db():
    try:
        db = SessionLocal()
        # Check connection
        db.execute(text("SELECT 1"))
        # Get last 3 entries
        results = db.query(CollaborationRequest).order_by(CollaborationRequest.id.desc()).limit(3).all()
        entries = []
        for r in results:
            entries.append({
                "id": r.id,
                "name": r.full_name,
                "time": format_to_ist(r.created_at)
            })
        db.close()
        return {
            "status": "connected",
            "database_type": "mysql" if DATABASE_URL and "mysql" in DATABASE_URL.lower() else "other",
            "recent_entries": entries
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.get("/api/health")
async def health():
    return {"status": "online", "timestamp": format_to_ist(datetime.utcnow())}
