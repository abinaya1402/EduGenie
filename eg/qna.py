from gemini_client import generate


def answer(question: str) -> str:
    return generate(
        "Answer this student's question clearly. Give a short direct answer first, "
        "then a brief explanation. Use simple markdown.\n\n"
        f"Question: {question}"
    )
