import os
import logging
from groq import Groq

logger = logging.getLogger("LLMService")

FALLBACK_MODELS = (
    "qwen/qwen3.8-27b",
    "openai/gpt-oss-20b",
    "openai/gpt-oss-120b",
)


class LLMService:
    """Streams grounded Sakra AI responses through Groq with ordered model fallback."""

    def __init__(self, api_key, system_prompt, model=None):
        self.api_key = api_key
        self.client = None
        if api_key and "YOUR_GROQ_API_KEY" not in api_key:
            try:
                self.client = Groq(api_key=api_key, max_retries=0, timeout=12.0)
            except Exception as e:
                logger.error(f"Failed to init Groq client: {e}")
        self.system_prompt = system_prompt
        configured = (model or os.getenv("GROQ_MODEL") or FALLBACK_MODELS[0]).strip()
        self.models = [configured] + [m for m in FALLBACK_MODELS if m != configured]

    def _build_messages(self, message, history, context, language="en"):
        grounded_prompt = self.system_prompt
        if language and language.lower().startswith("te"):
            grounded_prompt += "\n\nLANGUAGE REQUIREMENT:\nRespond naturally and clearly in Telugu script (తెలుగు), while keeping proper names (Likith Naidu Anumakonda, SAKRA VISION, PBR VITS), project names, technologies, and URLs accurate."
        if context:
            grounded_prompt += f"\n\nRELEVANT CONTEXT:\n{context}"

        sanitized_history = [
            {"role": m["role"], "content": m["content"]}
            for m in (history or [])[-5:]
            if isinstance(m, dict) and m.get("role") in ("user", "assistant") and m.get("content")
        ]
        return [{"role": "system", "content": grounded_prompt}, *sanitized_history, {"role": "user", "content": message}]

    async def stream_chat(self, message, history, context="", language="en"):
        """Stream completion text from Groq, falling back across configured models on pre-stream failures."""
        if not self.client:
            yield "The assistant backend is currently offline (missing API key). Please contact Likith directly. [[CARD:contact]]"
            return

        messages = self._build_messages(message, history, context, language=language)
        last_error = None

        for model_name in self.models:
            yielded_any = False
            try:
                completion = self.client.chat.completions.create(
                    model=model_name,
                    messages=messages,
                    temperature=0.2,
                    max_tokens=1024,
                    stream=True,
                )
                for chunk in completion:
                    if chunk.choices and chunk.choices[0].delta.content:
                        yielded_any = True
                        yield chunk.choices[0].delta.content
                return
            except Exception as e:
                last_error = e
                logger.error(f"Groq Error ({model_name}): {e}")
                if yielded_any:
                    break

        if last_error and "429" in str(last_error):
            yield "I'm receiving high traffic. Here's a quick summary based on Likith's offline knowledge: " + context[:200] + "... [[CARD:none]]"
        else:
            yield "I encountered a technical glitch. Please try again or contact Likith directly. [[CARD:error]]"
