import re

class IntentRouter:
    def __init__(self, knowledge):
        self.knowledge = knowledge
        self.intents = {
            "contact": [r"email", r"contact", r"phone", r"reach", r"call"],
            "projects": [r"project", r"portfolio", r"build", r"repo", r"github"],
            "identity": [r"who is", r"about", r"likith", r"background"],
            "collab": [r"hire", r"work with", r"collab", r"partnership", r"freelance"],
            "skills": [r"skill", r"tech stack", r"technologies", r"know", r"expert"],
            "youtube": [r"video", r"youtube", r"watch", r"performance", r"piano"],
            "resume": [r"resume", r"cv", r"experience"],
            "achievements": [r"award", r"achievement", r"prize", r"win", r"won", r"sih"],
            "education": [r"education", r"degree", r"university", r"college", r"iit", r"study"],
            "stack": [r"tech stack", r"languages", r"python", r"javascript", r"framework"]
        }

    def classify(self, message: str):
        message = message.lower()
        for intent, patterns in self.intents.items():
            for pattern in patterns:
                if re.search(pattern, message):
                    return intent
        return "general"

    def get_static_answer(self, intent: str, message: str):
        """Returns a static answer if an exact FAQ match or high-confidence intent is found."""
        # 1. Check FAQ first (highest precision)
        faqs = self.knowledge.get("faq", {}).get("faq", [])
        for faq in faqs:
            if faq["question"].lower() in message.lower() or message.lower() in faq["question"].lower():
                return faq["answer"], self._map_intent_to_card(intent)

        # 2. Return intent-based static responses if LLM bypass is desired
        if intent == "contact":
            c = self.knowledge.get("contact", {}).get("contact", {})
            return f"You can reach Likith at {c.get('primary_email')} or call {c.get('phone')}. He is open to high-stakes collaborations.", "contact"
        
        if intent == "youtube":
            return "You can watch Likith's technical deep-dives and piano performances on his Media Hub.", "youtube"

        if intent == "projects":
            # If asking about a specific project, let the LLM generate a tailored response using RAG context
            msg_lower = message.lower()
            specific_keywords = ["sakra", "event hub", "sentinel", "aquasentinel", "benchai", "prometheus", "resolvit", "gui utility"]
            if any(kw in msg_lower for kw in specific_keywords):
                return None, "none"
            return "Likith has built several production-grade systems including RESOLVIT and Prometheus AI. Check out his Engineering Archive.", "git"

        if intent == "achievements":
            return "Likith's achievements include leading a team in SIH 2025, winning 1st prize in CodeClash, and being recognized for innovative software engineering.", "none"

        if intent == "education":
            return "Likith is pursuing a B.Tech in CSE (AI) and holds an Advanced AIML Specialization from IIT Patna (I-HUB).", "none"

        if intent == "identity":
            return "Likith Naidu Anumamkonda is a premium AI-ML Architect, Full Stack Systems Architect, and the Founder of SAKRA VISION. He specializes in designing autonomous AI agents, machine learning models, and building end-to-end full-stack systems with rigorous engineering discipline.", "none"

        if intent == "collab":
            return "Likith is open to high-stakes collaborations, technical architecture design, and AI agent implementations. You can pitch your project through the secure Collab Portal.", "collab"

        if intent in ["skills", "stack"]:
            return "Likith specializes in AI/ML (Agent Development, RAG, Computer Vision), Full Stack Systems (Python, Node.js, FastAPI, Next.js), and complete infrastructure deployment (Cloud Databases, Secure APIs, Domain setups). Check out the Technical Ecosystem section on the homepage.", "none"

        if intent == "resume":
            return "You can view Likith's experience and download his resume through the Contact section.", "contact"

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
