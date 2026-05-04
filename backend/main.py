import os
import json
import logging
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
from groq import Groq
from dotenv import load_dotenv
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

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
client = Groq(api_key=GROQ_API_KEY)

data_dir = os.path.join(os.path.dirname(__file__), "data")
kb = {}
try:
    for file in os.listdir(data_dir):
        if file.endswith(".json"):
            with open(os.path.join(data_dir, file), "r") as f:
                kb[file.replace(".json", "")] = json.load(f)
except Exception as e:
    logger.error(f"KB Load Error: {e}")

kb_text = json.dumps(kb, indent=2)

# 4. Database Setup
DATABASE_URL = os.getenv("DATABASE_URL")

# Optimized for Aiven MySQL with pymysql
if DATABASE_URL and "mysql" in DATABASE_URL.lower():
    engine = create_engine(
        DATABASE_URL,
        connect_args={
            "ssl": {
                "ssl_mode": "REQUIRED"  # Standard for Aiven/Managed MySQL
            }
        },
        pool_pre_ping=True,
        pool_recycle=3600
    )
else:
    # Fallback for PostgreSQL/SQLite
    engine = create_engine(DATABASE_URL, connect_args={"ssl": {"ca": None}} if DATABASE_URL and "sqlite" not in DATABASE_URL else {})

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

# 6. AI Agent Prompt
SYSTEM_PROMPT = f"""
You are Likith's AI Agent, an elite digital representative of Likith Naidu Anumakonda (AI-ML Architect & Founder).
Your objective is to provide concise, premium, and technically accurate responses based ONLY on the provided knowledge base.

KNOWLEDGE BASE:
{kb_text}

RESPONSE PROTOCOL:
1. Be elegant and concise.
2. If the user asks for contact info, socials, or collaboration, trigger the 'contact' or 'collab' card.
3. If the user asks about projects or code, trigger the 'git' card.
4. If the user asks about videos or performances, trigger the 'youtube' card.

CARD SUMMONING (card_type):
- "contact": Triggered for email, phone, or general "how to reach you".
- "social": Triggered for GitHub, LinkedIn, X, Instagram links.
- "collab": Triggered for hiring, freelance, or partnership inquiries.
- "git": Triggered for project source code, repositories, or engineering archive requests.
- "youtube": Triggered for media hub, video demos, or piano performances.
- "none": Default for conversational answers.

Respond ONLY with this JSON structure:
{{
  "reply_text": "Your elegant answer here.",
  "card_type": "contact" | "social" | "collab" | "git" | "youtube" | "none"
}}
"""

# 7. Endpoints
@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "system", "content": SYSTEM_PROMPT}] + [
                {"role": m["role"], "content": m["content"]} for m in request.history[-5:]
            ] + [{"role": "user", "content": request.message}],
            temperature=0.3,
            max_tokens=512,
            response_format={"type": "json_object"}
        )
        result = json.loads(completion.choices[0].message.content)
        return ChatResponse(**result)
    except Exception as e:
        logger.error(f"Chat Error: {e}")
        return ChatResponse(reply_text="I encountered a technical glitch. Please visit /problem.html for support.", card_type="none")

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
                "time": str(r.created_at)
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
    return {"status": "online", "timestamp": datetime.now()}
