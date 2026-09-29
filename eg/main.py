from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from explanation_module import explain
from learning_path import path
from qna import answer
from quiz_module import quiz
from summary_module import summarize

BASE = Path(__file__).parent
app = FastAPI(title="EduGenie")
app.mount("/static", StaticFiles(directory=BASE / "static"), name="static")


class Req(BaseModel):
    task: str
    text: str


@app.get("/", response_class=HTMLResponse)
def home():
    return (BASE / "templates" / "index.html").read_text(encoding="utf-8")


@app.post("/api/generate")
def generate_api(req: Req):
    text = req.text.strip()
    if not text:
        return JSONResponse({"error": "Please enter a topic or text first."}, status_code=400)
    try:
        if req.task == "explain":
            return {"type": "text", "result": explain(text)}
        if req.task == "qa":
            return {"type": "text", "result": answer(text)}
        if req.task == "summary":
            return {"type": "text", "result": summarize(text)}
        if req.task == "path":
            return {"type": "text", "result": path(text)}
        if req.task == "quiz":
            return {"type": "quiz", "result": quiz(text)}
        return JSONResponse({"error": "Unknown task"}, status_code=400)
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=500)
