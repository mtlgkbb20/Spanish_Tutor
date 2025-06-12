from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from config import OPENAI_API_KEY, eval_prompt
import openai

openai.api_key = OPENAI_API_KEY
router = APIRouter()

class ChatBody(BaseModel):
    user_id: int
    history: list   # [{ "speaker": "Teacher"|"Student", "message": "..." }]
    context: dict   # { "level": "A1", "module": "Greetings" }

@router.post("/chat")
def chat(body: ChatBody):
    # (1) İsteği ayıklıyoruz
    user_id = body.user_id
    history = body.history[-5:]
    level   = body.context.get("level", "A1")
    module  = body.context.get("module", "General")

    # (2) Teacher prompt’u
    messages = [
        {"role": "system", "content":
            f"You are a Spanish teacher (user_id={user_id}) guiding a student through "
            f"the topic '{module}' at level {level}.\n"
            "Lead the lesson step by step. Don't wait for the student to ask — explain actively, "
            "give examples, ask questions. Check if the student understood before moving on."
        }
    ]
    for turn in history:
        role = turn["speaker"] == "Student" and "user" or "assistant"
        messages.append({"role": role, "content": turn["message"]})

    # (3) Teacher cevabı
    teacher_resp = openai.ChatCompletion.create(
        model="gpt-4.1-nano",
        messages=messages,
        temperature=0.6,
        max_tokens=300
    )
    teacher_reply = teacher_resp.choices[0].message.content

    # (4) Gerekiyorsa değerlendirme
    evaluation = ""
    if len(body.history) % 3 == 0:
        convo_str = "\n".join(f'{m["speaker"]}: {m["message"]}' for m in body.history)
        eval_resp = openai.ChatCompletion.create(
            model="gpt-4.1-nano",
            messages=[{"role":"user","content": eval_prompt.format(history=convo_str)}],
            temperature=0.3,
            max_tokens=200
        )
        evaluation = eval_resp.choices[0].message.content

    return {
        "teacher": teacher_reply,
        "evaluation": evaluation
    }
