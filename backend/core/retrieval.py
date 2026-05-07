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
        if intent == "projects" or any(word in message for word in ["project", "build", "resolvit", "prometheus", "bench"]):
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

        # 5. Education & Achievements context
        if intent in ["education", "achievements"] or any(word in message for word in ["school", "college", "award", "prize"]):
            edu = self.knowledge.get("education", {})
            ach = self.knowledge.get("achievements", {})
            context_parts.append(json.dumps({"education": edu, "achievements": ach}))

        # If no specific context found, provide a general profile summary
        if not context_parts:
            context_parts.append(json.dumps(self.knowledge.get("profile", {}))[:500])

        return "\n---\n".join(context_parts)
