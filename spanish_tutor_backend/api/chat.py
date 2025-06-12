from fastapi import APIRouter
from pydantic import BaseModel
from config import OPENAI_API_KEY, eval_prompt
import openai, os

openai.api_key = OPENAI_API_KEY
router = APIRouter()

class ChatBody(BaseModel):
    history: list  # [{ "speaker": "Teacher"|"Student", "message": "..." }]
    context: dict  # { "level": "A1", "module": "Greetings" }

@router.post("/chat")
def chat(body: ChatBody):
    history = body.history[-5:]  # 👈 sadece son 5 mesaj
    level = body.context.get("level", "A1")
    module = body.context.get("module", "General")

    messages = [
        {"role": "system", "content": (
            f"You are a Spanish teacher guiding a student through the topic '{module}' at level {level}.\n"
            "Lead the lesson step by step. Don't wait for the student to ask — explain actively, give examples, ask questions. "
            "Check if the student understood before moving on. Be a real teacher."
        )}
    ]
    for turn in history:
        role = "user" if turn["speaker"] == "Student" else "assistant"
        messages.append({"role": role, "content": turn["message"]})

    teacher_response = openai.ChatCompletion.create(
        model="gpt-4.1-nano",
        messages=messages,
        temperature=0.6,
        max_tokens=300
    )
    teacher_reply = teacher_response["choices"][0]["message"]["content"]

    evaluation = ""
    if len(body.history) % 3 == 0:
        convo_str = "\n".join(f'{m["speaker"]}: {m["message"]}' for m in body.history)
        eval_prompt = eval_prompt
        eval_response = openai.ChatCompletion.create(
            model="gpt-4.1-nano",
            messages=[{"role": "user", "content": eval_prompt}],
            temperature=0.3,
            max_tokens=200
        )
        evaluation = eval_response["choices"][0]["message"]["content"]

    return {
        "teacher": teacher_reply,
        "evaluation": evaluation
    }
