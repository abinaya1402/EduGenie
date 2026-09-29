from gemini_client import generate


def path(topic: str) -> str:
    return generate(
        f"Create a step-by-step learning path for: {topic}. Give 6 stages from beginner to advanced. "
        "For each stage give a ### title, what to learn, estimated time, and one practice idea."
    )
