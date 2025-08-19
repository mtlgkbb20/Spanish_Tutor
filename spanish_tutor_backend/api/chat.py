from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from config import OPENAI_API_KEY, eval_prompt
import openai
import json
from sqlalchemy.orm import Session as OrmSession
from db import SessionLocal
from models import User, UserInterest

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
    level = body.context.get("level", "A1")
    module = body.context.get("module", "General")

    # (2) Teacher prompt’u
    messages = [
        {"role": "system", "content": f"""
        You are a Spanish teacher (user_id={user_id}) guiding a beginner student through the topic '{module}' at level {level}.

        FORMAT YOUR LESSON in clear sections:

        1. **Introduction**  
        – Briefly introduce the topic in English.
        2. **Vocabulary**  
        – Present new Spanish words or phrases, with English glosses, in a bullet list.
        3. **Examples**  
        – Show 2–3 simple Spanish sentences using the new vocabulary.
        4. **Practice**  
        – Ask the student to repeat or use the phrases.
        5. **Context & Interests**  
        – Ask: “¿En qué situación te gustaría practicar esta frase? (por ejemplo: en un café, en la escuela, al hacer deporte)” in English.
        – Note the student’s answer and incorporate that setting into subsequent examples.
        6. **Check Understanding**  
        – Ask a short question in Spanish (“¿Entiendes?”) and confirm before moving on.

        OTHER RULES:
        - Explain grammar points in English but always use Spanish for all example words, short phrases and questions.
        - Lead the lesson actively: don’t wait for the student to ask—explain, give examples, then ask.
        - Keep sentences short and simple.
        - After you read the student’s chosen context (e.g. “en un café”), adapt your next examples to that setting.

        Start now with **Introduction**, then **Vocabulary**. Don't forget the student doesn't know Spanish, so explain everything in simple English and use very basic Spanish words.
        """}
    ]

    # geçmiş mesajları ekle
    for turn in history:
        role = "user" if turn.get("speaker") == "Student" else "assistant"
        messages.append({"role": role, "content": turn.get("message")})

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
        convo_str = "\n".join(f"{m['speaker']}: {m['message']}" for m in body.history)
        filled = eval_prompt.replace("{history}", convo_str)

        eval_resp = openai.ChatCompletion.create(
            model="gpt-4.1-mini",
            messages=[{"role": "user", "content": filled}],
            temperature=0.1,
            max_tokens=400
        )
        evaluation = eval_resp.choices[0].message.content

        # --- user_interests'i yeni tabloya kaydet ---
        try:
            eval_obj = json.loads(evaluation)
            interests = eval_obj.get("user_interests")
            if isinstance(interests, list) and interests:
                db: OrmSession = SessionLocal()
                try:
                    user = db.query(User).filter(User.id == user_id).first()
                    user_name = user.name if user else ""

                    ui = UserInterest(
                        user_id=user_id,
                        user_name=user_name,
                        interests=",".join(interests)
                    )
                    db.add(ui)
                    db.commit()
                finally:
                    db.close()
        except Exception:
            pass

    # (5) Yanıtı dön
    return {
        "teacher": teacher_reply,
        "evaluation": evaluation
    }
