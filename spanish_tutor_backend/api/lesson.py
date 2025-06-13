from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os 
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config import OPENAI_API_KEY
from db import SessionLocal
from models import LessonContent
import openai, os, json
openai.api_key = OPENAI_API_KEY

router = APIRouter()
def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

class LessonRequest(BaseModel):
    user_id: int
    curriculum_id: str
    module_title: str
    level: str

@router.post("/lesson")
def get_lesson(body: LessonRequest, db: Session = Depends(get_db)):
    row = db.query(LessonContent).filter(
        LessonContent.user_id==body.user_id,
        LessonContent.curriculum_id==body.curriculum_id
    ).first()
    if row:
        return row.__dict__ | {"cached": True}

    prompt = f"""
    You are a Spanish tutor. Create a concise lesson for level {body.level}. Topic: {body.module_title}.

    ⚙️ **Return ONLY valid JSON** with the following exact keys:
    "grammar": "<short paragraph in english explaining the grammar topic> and the rules for it.",
    "words": [               # 8-12 giriş
        {{"es": "<spanish>", "en": "<english>"}}
    ],
    "sentences": [ "<10 sentences…>" ],
    "dialogue": [            # at least 10 lines, 2 speakers
        {{"speaker": "Persona 1", "text": "<line>"}},
        {{"speaker": "Persona 2", "text": "<line>"}}
    ]

    NO code fences, NO extra keys.
    """
    resp = openai.ChatCompletion.create(
        model="gpt-4o-mini",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=650,
        response_format={"type": "json_object"}   # 🔑 JSON-mode
    )
    data = resp.choices[0].message.content       # zaten geçerli JSON
    lesson = json.loads(data)

    row = LessonContent(
        user_id       = body.user_id,
        curriculum_id = body.curriculum_id,
        grammar       = lesson["grammar"],
        words         = json.dumps(lesson["words"], ensure_ascii=False),
        sentences     = json.dumps(lesson["sentences"], ensure_ascii=False),
        dialogue      = json.dumps(lesson["dialogue"], ensure_ascii=False)
    )

    db.add(row); db.commit(); db.refresh(row)
    return row.__dict__ | {"cached": False}
