import re

class IntentRouter:
    def __init__(self, knowledge):
        self.knowledge = knowledge
        self.intents = {
            "projects": [
                r"resolvit", r"prometheus", r"benchai", r"bench ai", r"student bench",
                r"event hub", r"aquasentinel", r"sentinel", r"gui utility",
                r"project", r"portfolio", r"repo", r"github", r"\bbuild\b", r"\bbuilt\b"
            ],
            "creative": [r"\bbook\b", r"\bauthor\b", r"echoes", r"unsaid goodbye", r"\bpiano\b", r"writing", r"creative"],
            "education": [r"education", r"degree", r"university", r"college", r"\biit\b", r"study", r"studying", r"pbr", r"b\.?tech"],
            "achievements": [r"award", r"achievement", r"prize", r"\bwin\b", r"\bwon\b", r"\bsih\b", r"codeclash", r"technova", r"solution challenge"],
            "skills": [r"skill", r"tech stack", r"technologies", r"framework", r"tools", r"database"],
            "stack": [r"\bpython\b", r"javascript", r"react", r"fastapi", r"node\.?js", r"tensorflow", r"scikit"],
            "collab": [r"\bhire\b", r"work with", r"collab", r"partnership", r"freelance"],
            "youtube": [r"\bvideo\b", r"youtube", r"watch", r"performance"],
            "contact": [r"email", r"contact", r"phone", r"reach", r"\bcall\b"],
            "resume": [r"resume", r"\bcv\b", r"experience"],
            "identity": [r"who is", r"about likith", r"background", r"introduce", r"bio", r"^\s*likith\s*\??$"]
        }

    def classify(self, message: str):
        message = message.lower()
        for intent, patterns in self.intents.items():
            for pattern in patterns:
                if re.search(pattern, message):
                    return intent
        return "general"

    def get_static_answer(self, intent: str, message: str, language: str = "en"):
        """Returns a static answer if an exact FAQ match or high-confidence intent is found."""
        # Skip English static shortcuts when Telugu output is requested so the LLM answers naturally in Telugu.
        if language and language.lower().startswith("te"):
            return None, "none"

        # 1. Check FAQ first (highest precision)
        faqs = self.knowledge.get("faq", {}).get("faq", [])
        for faq in faqs:
            if faq["question"].lower() in message.lower() or message.lower() in faq["question"].lower():
                return faq["answer"], self._map_intent_to_card(intent)

        # 2. Return intent-based static responses if LLM bypass is desired
        if intent == "contact":
            c = self.knowledge.get("contact", {}).get("contact", {})
            return f"You can reach Likith at {c.get('primary_email')} or call {c.get('phone')}. He is open to AI/ML engineering roles and project collaborations.", "contact"
        
        if intent == "youtube":
            return "You can watch Likith's project demos and piano performances on the Media Hub.", "youtube"

        if intent == "creative":
            return "Alongside engineering, Likith Naidu Anumakonda is a classical pianist and the author of the book \"Echoes of an Unsaid Goodbye.\" You can explore his Piano Studio and video performances from the Media Hub.", "youtube"

        if intent == "projects":
            # If asking about a specific project, let the LLM generate a tailored response using RAG context
            msg_lower = message.lower()
            specific_keywords = ["sakra", "event hub", "sentinel", "aquasentinel", "benchai", "prometheus", "resolvit", "gui utility", "student"]
            if any(kw in msg_lower for kw in specific_keywords):
                return None, "none"
            return "Likith has developed projects including RESOLVIT, SAKRA VISION Event Hub, Student Bench AI, Prometheus AI, and AquaSentinel AI. You can explore public code repositories on the GitHub Repositories page.", "git"

        if intent == "achievements":
            return "Likith led a 5-member team in SIH 2025, contributed RESOLVIT for the GDG Solution Challenge 2026 (Under Evaluation), won 1st Prize at CodeClash 2025, and received the Best Concept award at Technova2K25.", "none"

        if intent == "education":
            return "Likith Naidu Anumakonda is currently pursuing a B.Tech in Computer Science and Engineering (Artificial Intelligence) at Parvatha Reddy Babul Reddy Visvodaya Institute of Technology and Science (PBR VITS), Kavali, Andhra Pradesh, India. He also completed an Advanced AI/ML Specialization programme (non-degree) at IIT Patna (I-HUB).", "none"

        if intent == "identity":
            return "Likith Naidu Anumakonda is an AI/ML Engineer and the Founder & CEO of SAKRA VISION. Currently pursuing a B.Tech in CSE (AI) at PBR VITS, Kavali (alongside an IIT Patna I-HUB AI/ML specialization programme), he works on machine learning, computer vision, RAG pipelines, and full-stack web applications. Beyond technology, he is a classical pianist and the author of \"Echoes of an Unsaid Goodbye.\"", "none"

        if intent == "collab":
            return "Likith is open to AI/ML engineering roles, product collaborations, and software development discussions. You can submit an inquiry through the Collaboration Form.", "collab"

        if intent in ["skills", "stack"]:
            return "Likith works across AI & Machine Learning (Python, Scikit-Learn, TensorFlow, NLP, Computer Vision, RAG, AI Agents), Application Development (FastAPI, Node.js, React, Next.js, Java OOP), Databases (SQL, PostgreSQL, MySQL), and Deployment & APIs (Resend, Twilio, Git/GitHub, Vercel, Render, DNS, and SEO metadata).", "none"

        if intent == "resume":
            return "You can review Likith's background and access his contact details or collaboration portal below.", "contact"

        return None, "none"

    def _map_intent_to_card(self, intent: str):
        mapping = {
            "contact": "contact",
            "projects": "git",
            "youtube": "youtube",
            "collab": "collab",
            "identity": "none",
            "skills": "none",
            "resume": "contact"
        }
        return mapping.get(intent, "none")
