from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..db import SessionLocal
from ..models import LessonContent
import openai, os, json
openai.api_key = os.getenv("OPENAI_API_KEY")

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
Provide a short JSON lesson for {body.level} on "{body.module_title}".
Keys: grammar, words (array), sentences (array of 3), dialogue.
"""
    resp = openai.ChatCompletion.create(
        model="gpt-4o",
        messages=[{"role":"user","content":prompt}],
        temperature=0.4, max_tokens=500
    )
    data = json.loads(resp["choices"][0]["message"]["content"])

    row = LessonContent(
        user_id=body.user_id, curriculum_id=body.curriculum_id,
        grammar=data["grammar"],
        words=",".join(data["words"]),
        sentences="\n".join(data["sentences"]),
        dialogue=data["dialogue"]
    )
    db.add(row); db.commit(); db.refresh(row)
    return row.__dict__ | {"cached": False}
