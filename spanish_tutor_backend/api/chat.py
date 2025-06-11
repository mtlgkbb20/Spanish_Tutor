from fastapi import APIRouter
from pydantic import BaseModel
import openai, os
openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter()

class ChatBody(BaseModel):
    message: str
    context: dict | None = None

@router.post("/chat")
def chat(body: ChatBody):
    prompt = f"{body.message}"
    resp = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[
            {"role":"system","content":"You are a helpful Spanish tutor."},
            {"role":"user","content":prompt}
        ],
        temperature=0.7,
        max_tokens=150
    )
    reply = resp["choices"][0]["message"]["content"]
    return {"reply": reply}
