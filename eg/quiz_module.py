import json
import re
from gemini_client import generate


def quiz(topic: str) -> list:
    raw = generate(
        f"Create a 5-question multiple-choice quiz about: {topic}. Reply ONLY with JSON, no markdown fences, "
        'in this shape: [{"q":"question","options":["A","B","C","D"],"answer":0,"why":"short explanation"}] '
        "where answer is the index (0-3) of the correct option."
    )
    raw = re.sub(r"```json|```", "", raw).strip()
    return json.loads(raw)
