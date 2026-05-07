import os
import json
import logging
from groq import Groq

logger = logging.getLogger("LLMService")

class LLMService:
    def __init__(self, api_key, system_prompt):
        self.api_key = api_key
        self.client = None
        if api_key and "YOUR_GROQ_API_KEY" not in api_key:
            try:
                self.client = Groq(api_key=api_key, max_retries=1)
            except Exception as e:
                logger.error(f"Failed to init Groq client: {e}")
        self.system_prompt = system_prompt

    async def stream_chat(self, message, history, context=""):
        if not self.client:
            yield "The AI brain is currently offline (missing API key). Please contact Likith directly. [[CARD:contact]]"
            return

        # Inject context into the system prompt for RAG effect
        grounded_prompt = self.system_prompt
        if context:
            grounded_prompt += f"\n\nRELEVANT CONTEXT:\n{context}"

        try:
            completion = self.client.chat.completions.create(
                model="llama-3.1-8b-instant",
                messages=[{"role": "system", "content": grounded_prompt}] + [
                    {"role": m["role"], "content": m["content"]} for m in history[-5:]
                ] + [{"role": "user", "content": message}],
                temperature=0.2,
                max_tokens=512,
                stream=True
            )
            for chunk in completion:
                if chunk.choices[0].delta.content:
                    yield chunk.choices[0].delta.content
        except Exception as e:
            logger.error(f"Groq Error: {e}")
            if "429" in str(e):
                yield "I'm receiving high traffic. Here's a quick summary based on Likith's offline knowledge: " + context[:200] + "... [[CARD:none]]"
            else:
                yield "I encountered a technical glitch. Please try again or contact Likith directly. [[CARD:error]]"
