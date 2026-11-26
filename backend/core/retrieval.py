import json

class RetrievalService:
    def __init__(self, knowledge):
        self.knowledge = knowledge

    def get_context(self, message: str, intent: str):
        """Simple keyword-based context retrieval from the knowledge base."""
        message = message.lower()
        context_parts = []

        # 1. Identity context
        if intent == "identity" or any(word in message for word in ["who", "likith", "background"]):
            profile = self.knowledge.get("profile", {})
            context_parts.append(json.dumps(profile))

        # 2. Project context
        if intent == "projects" or any(word in message for word in ["project", "build", "resolvit", "prometheus", "bench", "sakra", "sentinel", "event"]):
            projects = self.knowledge.get("projects", {})
            context_parts.append(json.dumps(projects))

        # 3. Skills context
        if intent == "skills" or "skill" in message or "stack" in message:
            skills = self.knowledge.get("skills", {})
            context_parts.append(json.dumps(skills))

        # 4. Collaboration context
        if intent == "collab" or "work" in message or "hire" in message:
            collab = self.knowledge.get("collaboration", {})
            context_parts.append(json.dumps(collab))

        # 5. Education, Internship & Achievements context
        if intent in ["education", "achievements", "internship", "resume"] or any(word in message for word in ["school", "college", "award", "prize", "pbr", "iit", "degree", "vishlesan", "patna", "vins", "vicharanashala", "ropar", "intern", "experience", "certificate"]):
            edu = self.knowledge.get("education", {})
            ach = self.knowledge.get("achievements", {})
            profile = self.knowledge.get("profile", {})
            context_parts.append(json.dumps({"education": edu, "achievements": ach, "experience": profile.get("experience", [])}))

        # 6. Creative & Founder / SAKRA VISION context
        if intent in ["creative", "identity", "sakra"] or any(word in message for word in ["book", "author", "echoes", "piano", "music", "writing", "sakra", "studio", "venture"]):
            creative = self.knowledge.get("creative", {})
            founder = self.knowledge.get("founder", {})
            context_parts.append(json.dumps({"creative": creative, "founder": founder}))

        # If no specific context found, provide full profile and creative summary
        if not context_parts:
            context_parts.append(json.dumps({
                "profile": self.knowledge.get("profile", {}),
                "creative": self.knowledge.get("creative", {}),
                "education": self.knowledge.get("education", {}),
                "contact": self.knowledge.get("contact", {})
            }))

        return "\n---\n".join(context_parts)
