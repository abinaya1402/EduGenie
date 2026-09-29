from gemini_client import generate


def summarize(text: str) -> str:
    return generate(
        "Summarize the following study material: a 2-3 sentence overview, then 5 key bullet points. "
        "Use simple markdown with ### headings.\n\n" + text
    )
