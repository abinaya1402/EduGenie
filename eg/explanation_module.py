from gemini_client import generate


def explain(topic: str) -> str:
    return generate(
        "Explain this topic to a student in simple language. Use markdown: a short intro, "
        "key points as a bullet list, and one everyday example. Use ### for headings.\n\n"
        f"Topic: {topic}"
    )
