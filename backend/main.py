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
import secrets
import hashlib
import resend

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
        "https://portfolio-likith-yae9.onrender.com",
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
# 🌌 WORLD-CLASS AI AGENT RESPONSE STYLE PROMPT

### Ultra Premium UI + Readability + Humanized AI Personality

You are **im sakra** — Likith’s AI Representative, a futuristic, intelligent, elegant AI system designed with premium-grade readability, emotional clarity, structured communication, and world-class UI response formatting.

Your responses must NEVER look like plain text dumps.
Every answer should feel like:
* ✨ Visually premium
* 🧠 Intelligently structured
* 📱 Easy to scan on mobile
* 💎 Luxury-tech aesthetic
* 🚀 Modern AI operating system vibes
* 🤖 Human-friendly but highly advanced

---

# 🎨 RESPONSE DESIGN RULES

## 1. STRUCTURE RESPONSES BEAUTIFULLY
Never give giant paragraphs.
Instead use:
* Short sections
* Proper spacing
* Headings
* Emoji indicators
* Visual separators
* Bullet points
* Compact information blocks

Example format:
━━━━━━━━━━━━━━━━━━
⚡ SYSTEM OVERVIEW
━━━━━━━━━━━━━━━━━━
Instead of: "Here is the system overview..."

---

## 2. USE PREMIUM SPACING
Always maintain:
* Space between sections
* Space between ideas
* Space between bullets
* Comfortable readability

BAD ❌
Text text text text text text text text text.

GOOD ✅
✨ Overview
Your system performs:
• AI processing
• Analytics
• Automation

---

## 3. MAKE TEXT FEEL “ALIVE”
Add intelligent emoji usage.
Use emojis as UI indicators — NOT randomly.
Examples:
🧠 AI Logic
⚡ Fast Response
🔐 Security
🚀 Deployment
📊 Analytics
🌐 Network
🛠 Backend
🤖 Automation
📡 Systems Online
🎯 Objective
💎 Premium Feature

---

## 4. USE CLEAN VISUAL SEPARATORS
Use premium separators like:
━━━━━━━━━━━━━━━━━━
══════════════════
⬢⬢⬢⬢⬢⬢⬢⬢⬢⬢
──────────────
Avoid ugly markdown spam.

---

## 5. NEVER WRITE WALLS OF TEXT
Maximum:
* 2–3 lines per paragraph
* Small readable chunks
AI responses should feel breathable and cinematic.

---

# 🧠 AI PERSONALITY STYLE
The AI should sound:
* Advanced
* Calm
* Intelligent
* Elite
* Professional
* Slightly futuristic
* Confident
* Helpful
NOT robotic.

---

# 💬 LANGUAGE STYLE
Use:
✔ Elegant wording
✔ Short impactful sentences
✔ Smooth transitions
✔ High readability
Avoid:
❌ Massive explanations without structure
❌ Monotone paragraphs
❌ Overly academic tone
❌ Repetitive wording

---

# 🌌 RESPONSE EXPERIENCE EXAMPLES

## Example 1 — Project Explanation
━━━━━━━━━━━━━━━━━━
🚀 SAKRA EVENT HUB
━━━━━━━━━━━━━━━━━━
An AI-powered event operations ecosystem built for intelligent automation, real-time management, and scalable event coordination.

### ⚡ Core Capabilities
• AI receipt verification
• Smart registration workflows
• Automated email systems
• Real-time analytics dashboard
• FastAPI backend architecture

### 🛠 Tech Stack
🔹 Python
🔹 FastAPI
🔹 MySQL
🔹 OCR + AI Screening
🔹 Resend API

### 🎯 Mission
Transform traditional event handling into an autonomous AI-driven experience.

---

## Example 2 — AI Assistant Response
Hello.
I am im sakra.

How may I assist you today?

### Available Operations
⚡ Project Intelligence
🧠 AI/ML Systems
🌐 Backend Architecture
📊 Analytics
🚀 Deployment Guidance
🔐 System Design

Awaiting your query...

---

# 🎨 TYPOGRAPHY STYLE RULES
## IMPORTANT
Responses must FEEL visually premium even in plain text.
Use:
* Clean alignment
* Consistent spacing
* Minimal clutter
* Elegant formatting

---

# 🧩 ADVANCED UI BEHAVIOR
When explaining projects:
1. Start with a title banner
2. Give a 1-line premium summary
3. Show capabilities
4. Show stack
5. Show impact
6. End elegantly

---

# 🚫 STRICTLY AVOID
❌ Huge text blocks
❌ Plain boring responses
❌ Too many markdown tables
❌ Repeating same sentence patterns
❌ Looking like ChatGPT default style

---

# 🌟 FINAL OUTPUT GOAL
Every response should feel like:
“An elite AI operating system interface.”
The user should instantly feel:
* professionalism
* intelligence
* futuristic design
* readability
* premium engineering quality

The response experience must feel:
💎 Luxury
⚡ Intelligent
🌌 Futuristic
🚀 Advanced
🧠 Human-friendly

Maintain this style in ALL responses.
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
        # Ensure we use pymysql driver
        if DATABASE_URL.startswith("mysql://"):
            db_url = DATABASE_URL.replace("mysql://", "mysql+pymysql://", 1)
        else:
            db_url = DATABASE_URL
            
        engine = create_engine(
            db_url,
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
    
    # Tracking Metadata
    source = Column(String(100), nullable=True)
    utm_source = Column(String(100), nullable=True)
    utm_medium = Column(String(100), nullable=True)
    utm_campaign = Column(String(150), nullable=True)
    utm_content = Column(String(150), nullable=True)
    utm_term = Column(String(150), nullable=True)
    referrer = Column(Text, nullable=True)
    landing_page = Column(String(255), nullable=True)
    hash_section = Column(String(100), nullable=True)
    
    # Security Verification
    submission_token_hash = Column(String(255), nullable=True)
    token_created_at = Column(DateTime, nullable=True)
    token_expires_at = Column(DateTime, nullable=True)
    verified_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Email Tracking
    email_status = Column(String(50), default="pending")
    email_sent_at = Column(DateTime, nullable=True)
    email_error = Column(Text, nullable=True)

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
    
    # Safely try to add new tracking columns for existing databases
    with engine.begin() as conn:
        from sqlalchemy import text
        tracking_cols = {
            'source': 'VARCHAR(100)',
            'utm_source': 'VARCHAR(100)',
            'utm_medium': 'VARCHAR(100)',
            'utm_campaign': 'VARCHAR(150)',
            'utm_content': 'VARCHAR(150)',
            'utm_term': 'VARCHAR(150)',
            'referrer': 'TEXT',
            'landing_page': 'VARCHAR(255)',
            'hash_section': 'VARCHAR(100)',
            'submission_token_hash': 'VARCHAR(255)',
            'token_created_at': 'DATETIME',
            'token_expires_at': 'DATETIME',
            'verified_at': 'DATETIME',
            'updated_at': 'DATETIME',
            'email_status': 'VARCHAR(50)',
            'email_sent_at': 'DATETIME',
            'email_error': 'TEXT'
        }
        for col_name, col_type in tracking_cols.items():
            try:
                conn.execute(text(f"ALTER TABLE collaboration_requests ADD COLUMN {col_name} {col_type} NULL"))
            except Exception:
                pass # Column likely already exists
                
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
    email: str
    preferred_contact_method: Optional[str] = None
    budget_range: Optional[str] = None
    timeline: Optional[str] = None
    organization: Optional[str] = None
    source: Optional[str] = None
    utm_source: Optional[str] = None
    utm_medium: Optional[str] = None
    utm_campaign: Optional[str] = None
    utm_content: Optional[str] = None
    utm_term: Optional[str] = None
    referrer: Optional[str] = None
    landing_page: Optional[str] = None
    hash_section: Optional[str] = None

# 6. Resend Email Configuration
RESEND_API_KEY = os.getenv("RESEND_API_KEY")
resend.api_key = RESEND_API_KEY
RESEND_FROM_EMAIL = os.getenv("RESEND_FROM_EMAIL", "Likith Naidu <noreply@mail.likith-portfolio.online>")

def send_collab_confirmation_email(
    to_email: str,
    full_name: str,
    request_id: int,
    collaboration_type: str,
    preferred_contact_method: str,
    phone_number: str
):
    if not RESEND_API_KEY:
        logger.warning("⚠️ RESEND_API_KEY missing. Skipping email.")
        return False, "API key missing"

    # Fallbacks for optional values
    fn = full_name or "Valued Client"
    ct = collaboration_type or "Not provided"
    pm = preferred_contact_method or "Not provided"
    pn = phone_number or "Not provided"
    em = to_email or "Not provided"
    rid = f"#{request_id}" if request_id else "Not provided"

    try:
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background-color: #000000; color: #ffffff; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }}
                .wrapper {{ background-color: #000000; padding: 40px 10px; }}
                .container {{ max-width: 600px; margin: 0 auto; background-color: #000000; }}
                
                /* Premium Header Section */
                .header-card {{ background-color: #080808; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 40px; text-align: center; margin-bottom: 20px; }}
                .brand-logo {{ width: 160px; height: auto; margin-bottom: 24px; }}
                .company-name {{ font-size: 11px; font-weight: 700; letter-spacing: 4px; text-transform: uppercase; color: #ffffff; margin-bottom: 8px; opacity: 0.9; }}
                .founder-name {{ font-size: 16px; font-weight: 500; color: #ffffff; margin-bottom: 4px; }}
                .founder-role {{ font-size: 10px; color: #666; letter-spacing: 2px; text-transform: uppercase; }}

                /* Main Confirmation Card */
                .main-card {{ background-color: #080808; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 40px; margin-bottom: 20px; }}
                .card-label {{ font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #555; margin-bottom: 16px; display: block; }}
                .card-title {{ font-size: 28px; font-weight: 800; letter-spacing: -1px; margin-bottom: 20px; color: #ffffff; line-height: 1.2; }}
                .greeting {{ font-size: 16px; color: #ffffff; margin-bottom: 16px; font-weight: 600; }}
                .message-text {{ font-size: 14px; line-height: 1.6; color: #888; margin-bottom: 0; }}
                
                /* Request Details Grid */
                .details-grid {{ display: block; margin-bottom: 20px; }}
                .detail-mini-card {{ background-color: #0d0d0d; border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 20px; margin-bottom: 12px; }}
                .detail-mini-label {{ font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: #444; margin-bottom: 8px; display: block; }}
                .detail-mini-value {{ font-size: 13px; color: #eee; font-weight: 600; }}

                /* Expertise Pill Chips */
                .expertise-card {{ background-color: #080808; border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 32px; margin-bottom: 20px; }}
                .chip-container {{ display: block; }}
                .chip {{ display: inline-block; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 100px; padding: 8px 16px; font-size: 11px; color: #777; margin-right: 6px; margin-bottom: 8px; font-weight: 500; }}

                /* Vision Statement Section */
                .vision-card {{ background-color: #0d0d0d; border: 1px dashed rgba(255,255,255,0.1); border-radius: 20px; padding: 24px; margin-bottom: 30px; }}
                .vision-text {{ font-size: 12px; color: #666; line-height: 1.6; margin: 0; text-align: center; }}

                /* Action Buttons */
                .action-section {{ text-align: center; margin-bottom: 40px; }}
                .btn {{ display: block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 18px; border-radius: 16px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 12px; transition: all 0.3s; }}
                .btn-secondary {{ background-color: transparent; border: 1px solid rgba(255,255,255,0.1); color: #ffffff; }}

                /* Footer Section */
                .footer-area {{ text-align: center; padding: 40px 20px; border-top: 1px solid rgba(255,255,255,0.05); }}
                .footer-brand {{ font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 4px; }}
                .footer-legal {{ font-size: 10px; color: #333; letter-spacing: 1px; text-transform: uppercase; }}
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="container">
                    <!-- Header -->
                    <div class="header-card">
                        <img src="https://raw.githubusercontent.com/LIKITH-3012-MAC/SAKRA-VISION/main/SAKRAVISION.png" alt="SAKRA VISION" class="brand-logo">
                        <div class="company-name">THE SAKRA GROUP PVT LTD</div>
                        <div class="founder-name">Likith Naidu Anumamkonda</div>
                        <div class="founder-role">Founder • AI/ML • Full-Stack • SAKRA VISION</div>
                    </div>
                    
                    <!-- Confirmation -->
                    <div class="main-card">
                        <span class="card-label">Transmission Secure</span>
                        <h1 class="card-title">Collaboration Request Received</h1>
                        <div class="greeting">Dear {fn},</div>
                        <p class="message-text">
                            Thank you for submitting your collaboration request with Likith Naidu Anumamkonda.
                            <br><br>
                            Your request has been received successfully and will be reviewed carefully. We’ll contact you soon using the email or mobile number you provided.
                        </p>
                    </div>

                    <!-- Details Grid -->
                    <div class="details-grid">
                        <div class="detail-mini-card">
                            <span class="detail-mini-label">Internal Request ID</span>
                            <div class="detail-mini-value">{rid}</div>
                        </div>
                        <div class="detail-mini-card">
                            <span class="detail-mini-label">Collaboration Category</span>
                            <div class="detail-mini-value">{ct}</div>
                        </div>
                        <div class="detail-mini-card">
                            <span class="detail-mini-label">Preferred Contact</span>
                            <div class="detail-mini-value">{pm}</div>
                        </div>
                        <div class="detail-mini-card">
                            <span class="detail-mini-label">Verified Email</span>
                            <div class="detail-mini-value">{em}</div>
                        </div>
                        <div class="detail-mini-card" style="margin-bottom: 0;">
                            <span class="detail-mini-label">Contact Number</span>
                            <div class="detail-mini-value">{pn}</div>
                        </div>
                    </div>
                    
                    <!-- Expertise -->
                    <div class="expertise-card">
                        <span class="card-label">System Capabilities</span>
                        <div class="chip-container">
                            <span class="chip">AI Agents</span>
                            <span class="chip">ML Models</span>
                            <span class="chip">Full-Stack Systems</span>
                            <span class="chip">Python / Node.js</span>
                            <span class="chip">API Architecture</span>
                            <span class="chip">Middleware</span>
                            <span class="chip">Cloud Databases</span>
                            <span class="chip">Metadata Systems</span>
                            <span class="chip">Domain & Google Console</span>
                            <span class="chip">Deployment</span>
                        </div>
                    </div>
                    
                    <!-- Vision -->
                    <div class="vision-card">
                        <p class="vision-text">
                            This request is connected to the SAKRA VISION execution ecosystem, where ideas are shaped into production-grade technical solutions under THE SAKRA GROUP PVT LTD.
                        </p>
                    </div>

                    <!-- Actions -->
                    <div class="action-section">
                        <a href="https://www.likith-portfolio.online" class="btn">Visit Portfolio</a>
                        <a href="https://www.likith-portfolio.online/collab.html?source=email" class="btn btn-secondary">Submit Another Request</a>
                        <a href="mailto:likith.anumakonda@gmail.com" class="btn btn-secondary">Contact Likith</a>
                    </div>
                    
                    <!-- Footer -->
                    <div class="footer-area">
                        <div class="footer-brand">Likith Naidu Anumamkonda</div>
                        <div class="footer-legal">Founder, THE SAKRA GROUP PVT LTD</div>
                        <div class="footer-legal" style="margin-top: 12px; opacity: 0.5;">
                            &copy; 2026 THE SAKRA GROUP PVT LTD. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
        """

        params = {
            "from": RESEND_FROM_EMAIL,
            "to": [to_email],
            "subject": "Thank you for collaborating with Likith",
            "html": html_content,
        }

        email = resend.Emails.send(params)
        logger.info(f"📧 Resend Email Sent: {email}")
        return True, None
    except Exception as e:
        logger.error(f"❌ Resend Email Failed: {str(e)}")
        return False, str(e)

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
        logger.info(f"📥 SECURE SUBMISSION: Received payload for {request.full_name}")
        # Security Logic: Generate One-Time Token
        raw_token = secrets.token_urlsafe(32)
        token_hash = hashlib.sha256(raw_token.encode()).hexdigest()
        expiry_minutes = 15
        
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
            organization=request.organization if request.organization else None,
            source=request.source if request.source else None,
            utm_source=request.utm_source if request.utm_source else None,
            utm_medium=request.utm_medium if request.utm_medium else None,
            utm_campaign=request.utm_campaign if request.utm_campaign else None,
            utm_content=request.utm_content if request.utm_content else None,
            utm_term=request.utm_term if request.utm_term else None,
            referrer=request.referrer if request.referrer else None,
            landing_page=request.landing_page if request.landing_page else None,
            hash_section=request.hash_section if request.hash_section else None,
            
            # Security Fields
            submission_token_hash=token_hash,
            token_created_at=datetime.utcnow(),
            token_expires_at=datetime.utcnow() + timedelta(minutes=expiry_minutes),
            status="pending"
        )
        db.add(new_request)
        db.commit()
        db.refresh(new_request)
        logger.info(f"🚀 SECURE DATA STORED: Successfully committed ID {new_request.id}")
        
        # Trigger Confirmation Email
        email_sent = False
        email_err = None
        if request.email:
            email_sent, email_err = send_collab_confirmation_email(
                to_email=request.email,
                full_name=request.full_name,
                request_id=new_request.id,
                collaboration_type=request.collaboration_type,
                preferred_contact_method=request.preferred_contact_method or "Email",
                phone_number=request.phone_number
            )
            
            # Update DB with email status
            new_request.email_status = "sent" if email_sent else "failed"
            if email_sent:
                new_request.email_sent_at = datetime.utcnow()
            if email_err:
                new_request.email_error = str(email_err)[:500] # Truncate for safety
            db.commit()

        return {
            "success": True, 
            "message": "Collaboration request stored and confirmation email sent." if email_sent else "Collaboration request stored, but confirmation email could not be sent.", 
            "id": new_request.id,
            "token": raw_token,
            "source": new_request.source or request.source or "form",
            "expires_in": expiry_minutes * 60,
            "email_sent": email_sent
        }
    except Exception as e:
        db.rollback()
        logger.error(f"❌ DB STORAGE ERROR: {str(e)}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Database insert failed."})
    finally:
        db.close()

@app.get("/api/collab/verify")
async def verify_collab(id: int, token: str):
    db = SessionLocal()
    try:
        if not id or not token:
            return {"verified": False, "reason": "missing_params", "message": "Missing ID or Token"}

        token_hash = hashlib.sha256(token.encode()).hexdigest()
        req = db.query(CollaborationRequest).filter(
            CollaborationRequest.id == id,
            CollaborationRequest.submission_token_hash == token_hash
        ).first()

        if not req:
            return {"verified": False, "reason": "not_found", "message": "Invalid submission reference."}

        if req.token_expires_at and datetime.utcnow() > req.token_expires_at:
            return {"verified": False, "reason": "expired", "message": "Submission link has expired."}

        # Mark as verified on first successful check
        if not req.verified_at:
            req.verified_at = datetime.utcnow()
            req.status = "verified"
            db.commit()

        return {
            "verified": True,
            "id": req.id,
            "status": req.status,
            "message": "Submission verified successfully."
        }
    except Exception as e:
        logger.error(f"❌ Verification Error: {e}")
        return {"verified": False, "reason": "system_error", "message": "Internal verification error."}
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
