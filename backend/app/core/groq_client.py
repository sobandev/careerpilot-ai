from groq import AsyncGroq
from app.core.config import settings
from typing import Tuple, Dict

_groq_client: AsyncGroq | None = None


def get_groq() -> AsyncGroq:
    global _groq_client
    if _groq_client is None:
        _groq_client = AsyncGroq(api_key=settings.GROQ_API_KEY)
    return _groq_client


async def chat_completion(system_prompt: str, user_prompt: str, max_tokens: int = 2048) -> Tuple[str, Dict[str, int]]:
    client = get_groq()
    response = await client.chat.completions.create(
        model=settings.GROQ_MODEL,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        max_tokens=max_tokens,
        temperature=0.7,
    )
    content = response.choices[0].message.content or ""
    usage = {
        "prompt_tokens": response.usage.prompt_tokens if response.usage else 0,
        "completion_tokens": response.usage.completion_tokens if response.usage else 0,
        "total_tokens": response.usage.total_tokens if response.usage else 0
    }
    return content, usage
