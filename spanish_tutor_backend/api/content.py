# api/content.py

from fastapi import APIRouter, HTTPException, Query, Depends
from sqlalchemy.orm import Session
from db import SessionLocal
import openai
from config import OPENAI_API_KEY

router = APIRouter()
openai.api_key = OPENAI_API_KEY

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/content")
def get_content(curriculum_id: str = Query(...), db: Session = Depends(get_db)):
    """
    Returns a structured summary of the module,
    based on the chat history stored for this curriculum_id.
    """
    # 1) Chat geçmişini al (örneğin LessonContent tablosundan veya ayrı ChatMessage tablosundan)
    #    Burada örnek olarak LessonContent içeriğini kullanıyoruz:
    from models import LessonContent

    row = (
        db.query(LessonContent)
          .filter(LessonContent.curriculum_id == curriculum_id)
          .order_by(LessonContent.created_at.desc())
          .first()
    )
    if not row:
        raise HTTPException(404, f"No lesson content found for {curriculum_id}")

    # 2) LLM prompt’u: bu row’dan gelen JSON benzeri veriyi zenginleştiriyoruz
    prompt = f"""
Using the following lesson data for module {curriculum_id}, produce a JSON object with:
- title (string)
- sections: an array of {{heading: string, body: string}}

Lesson data:
Grammar: {row.grammar}
Words: {row.words}
Sentences: {row.sentences}
Dialogue: {row.dialogue}
"""
    resp = openai.ChatCompletion.create(
        model="gpt-4.1-mini",
        messages=[{"role": "system", "content": "You are a helpful assistant that formats lessons."},
                  {"role": "user",   "content": prompt}],
        temperature=0.2,
        max_tokens=1500,
    )
    try:
        content = resp.choices[0].message.content
        # OpenAI’dan dönen content, JSON objesi olarak metin halinde
        import json
        parsed = json.loads(content)
    except Exception as e:
        raise HTTPException(500, f"Failed to parse content JSON: {e}")

    return parsed
