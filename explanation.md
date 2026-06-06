# Likith OS: Backend Master Architecture Guide
**A Comprehensive Walkthrough from A to Z**

---

## 1. BIG PICTURE OVERVIEW
### What this backend is overall
Your backend is the "brain" and "engine room" of your digital ecosystem. While your frontend (the HTML/CSS) is what the world sees, this backend is where all the actual thinking, storing, and security happens. It acts as the bridge between your users and your data.

### Its main purpose
1.  **AI Representation:** Powering an intelligent agent that represents you 24/7.
2.  **Data Persistence:** Ensuring that collaboration requests and analytics aren't lost when a browser closes.
3.  **Security Gating:** Protecting your private data from the public internet.

### Technologies used
-   **FastAPI:** A high-performance web framework for building APIs with Python.
-   **SQLAlchemy:** An Object-Relational Mapper (ORM) that lets you talk to your database using Python classes instead of raw SQL strings.
-   **MySQL (Aiven):** A production-grade, managed cloud database.
-   **Groq Cloud:** The hardware provider that runs your AI models (Llama 3) at lightning speed.

### Problems it solves
-   **Interactivity:** Turns a static portfolio into a conversational experience.
-   **Visibility:** Provides a dashboard so you can see who is visiting and why.
-   **Organization:** Automatically categorizes chat intents and partnership requests.

---

## 2. PROJECT STRUCTURE
Here is every folder and file explained:

-   **`backend/main.py`**: **The Heart.** This is the primary entry point. It contains the API routes, database models, and the core server logic.
-   **`backend/core/`**: **The Brain Modules.**
    -   **`router.py`**: Decides *what* the user is asking about (Intent Classification).
    -   **`retrieval.py`**: Finds the *facts* needed to answer the question (Context Retrieval).
    -   **`llm_service.py`**: Connects to the Large Language Model (Groq) to generate the response.
-   **`backend/data/`**: **The Memory.** A collection of JSON files that act as your primary knowledge source (Resume, Projects, FAQ).
-   **`backend/.env`**: **The Secret Safe.** Stores sensitive keys like your `DATABASE_URL` and `GROQ_API_KEY`.
-   **`backend/requirements.txt`**: **The Toolkit.** Lists every Python library required to run the project.

---

## 3. BACKEND START FLOW
When you run the command to start your backend (usually `uvicorn main:app`), here is the sequence:

1.  **Environment Setup:** `main.py` loads your secret keys from the `.env` file.
2.  **Logging Init:** The system sets up a logger so you can see "INFO" and "ERROR" messages in your terminal.
3.  **FastAPI Init:** The `app = FastAPI()` command creates the web server instance.
4.  **Service Loading:** The `IntentRouter` and `RetrievalService` load your JSON data files into memory for instant access.
5.  **Database Connection:** The system connects to your MySQL database and verifies that all tables (`chat_logs`, `visitor_analytics`, etc.) exist. If they don't, it creates them automatically.
6.  **Ready:** The server starts "listening" on a port (like 8080) for incoming web requests.

---

## 4. REQUEST FLOW
When a user clicks "Send" in your chat, here is the full journey:

1.  **Frontend to Backend:** The browser sends a `POST` request to `/api/chat` with the user's message.
2.  **Route Handler:** In `main.py`, the `chat()` function receives the message.
3.  **Intent Classification:** The `router.py` checks if the message matches a known topic (like "contact").
4.  **Retrieval:** If needed, `retrieval.py` searches your JSON files for facts about that topic.
5.  **AI Generation:** The `llm_service.py` sends the message + facts to Groq.
6.  **Database Logging:** The backend saves the message and the AI's reply to the `chat_logs` table.
7.  **Response:** The backend "streams" the text back to the browser word-by-word.

---

## 5. API ROUTES
-   **`POST /api/chat` (Public):** The main chat interface. Expects a message; returns a stream of AI text.
-   **`POST /api/collab` (Public):** Receives partnership form data. Returns a success confirmation.
-   **`POST /api/analytics/visit` (Public):** Records a page visit silently.
-   **`GET /api/admin/*` (Admin-Only):** A series of routes (`/responses`, `/collabs`, `/visitors`) that return the raw data stored in your database. Requires the `X-Admin-Token` header.

---

## 6. AUTHENTICATION AND AUTHORIZATION
### How it works (The Simple Version)
Think of Authentication like a **Building Badge**. 

1.  **The Secret:** You have a master password (`ADMIN_TOKEN`) in your `.env`.
2.  **The Check:** Every time you try to access an "Admin" route, the backend looks for a header called `X-Admin-Token`.
3.  **The Comparison:** It compares the header value with your secret password.
4.  **The Result:** If they match exactly, you are "Authorized" to see the data. If not, the backend says "401 Unauthorized" and sends you away.

---

## 7. DATABASE SYSTEM
### The "Filing Cabinet"
-   **Engine:** We use **SQLAlchemy** to talk to **MySQL**.
-   **Tables:**
    -   `visitor_analytics`: Every row is a visit. It stores the time, page path, OS (Windows/Mac), and Browser.
    -   `chat_logs`: Every row is a conversation. It stores what the user said and how the AI responded.
    -   `collaboration_requests`: Every row is a potential project. Stores contact info and project descriptions.
-   **Flow:** When you want to save data, you create a "Session," tell it to "add" an object, and then "commit" (save) it forever.

---

## 8. AI / RAG / AGENT FLOW
### How the AI stays accurate
We use **RAG** (Retrieval-Augmented Generation):
1.  **Retrieve:** Find the facts in your `.json` files.
2.  **Augment:** Combine those facts with a "System Prompt" that tells the AI to be professional.
3.  **Generate:** Send this combined prompt to **Groq**.
4.  **Outcome:** The AI answers using *your* specific information rather than guessing. It knows *you* because the backend gives it the data in real-time.

---

## 9. ADMIN SYSTEM
-   **Authentication:** Enforced by the `get_admin_auth` function in `main.py`.
-   **Dashboard:** The file `likith-response-db.html` on the frontend calls the admin APIs.
-   **Security:** These routes are invisible to normal users and search engines because they aren't linked anywhere on the public site.

---

## 10. VISITOR TRACKING FLOW
1.  **Collection:** `analytics.js` on the frontend captures `navigator.userAgent`.
2.  **Transmission:** It sends a background request to the backend.
3.  **Storage:** The backend saves this in the `visitor_analytics` table.
4.  **Deduplication:** The backend checks the `session_id`. If the same user refreshes the page within 5 minutes, it doesn't create a new record. This keeps your stats clean.

---

## 11. ENVIRONMENT VARIABLES
-   **`DATABASE_URL`**: Critical for startup. The "address" of your MySQL database.
-   **`GROQ_API_KEY`**: Critical for chat. Allows the backend to use the AI brain.
-   **`ADMIN_TOKEN`**: Critical for security. Your private password.
-   **`FRONTEND_URL`**: Used for CORS. Ensures only your website can talk to your backend.

---

## 12. ERROR HANDLING
-   **Global Exception Handler:** If any code crashes, the backend catches it and sends a polite JSON error instead of a white "Server Error" screen.
-   **AI Fallback:** If Groq is down or you hit a rate limit, the `llm_service.py` is programmed to say: *"I encountered a technical glitch. Please try again."*

---

## 13. SECURITY
-   **Secrets:** Never kept in the code; always in `.env`.
-   **SQL Injection:** Prevented by SQLAlchemy's automatic parameterization.
-   **CORS:** A security policy that prevents other websites from "stealing" your API.
-   **Auth Guards:** Every sensitive piece of data is protected by a token check.

---

## 14. FULL END-TO-END EXAMPLES
### Example: Visitor Opens Portfolio
1.  Browser loads `index.html`.
2.  `analytics.js` triggers.
3.  `POST /api/analytics/visit` is sent.
4.  Backend saves: `Home Page | MacOS | Chrome | 10:00 AM`.

### Example: User sends Chat
1.  User types "Hi".
2.  `POST /api/chat` sent.
3.  Router says "Intent: Greeting".
4.  Retrieval pulls "Likith's Name" context.
5.  Groq generates: "Hello! I am im sakra...".
6.  User sees the message stream.

---

## 15. WHAT I SHOULD LEARN FIRST
1.  **Python Dictionaries & Lists:** This is how JSON data is handled.
2.  **FastAPI Decorators:** Understand what `@app.post()` and `@app.get()` mean.
3.  **SQLAlchemy Sessions:** Learn how to `add`, `commit`, and `query` data.

---

## 16. WHAT CAN BREAK
-   **Missing `.env`:** If you deploy to a server and forget to set the environment variables, nothing will work.
-   **Groq API Limits:** If your portfolio goes viral, the AI might stop responding if you reach your free tier limit.
-   **Database SSL:** Managed databases (like Aiven) require SSL. The code handles this, but changing providers might require a config tweak.

---

## 17. FINAL SUMMARY
Your backend is a **highly organized, AI-powered system** that makes your portfolio "alive." It manages your memory (Database), your thinking (AI), and your security (Auth). It is built with professional-grade tools that are used by top-tier engineering teams.

---
*Created for Likith Naidu | 2026 Edition*
