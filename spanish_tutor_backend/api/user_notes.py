# api/user_notes.py

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db import SessionLocal
from models import UserNote

router = APIRouter()

class NoteIn(BaseModel):
    user_id: int
    content: str

@router.post("/user_notes", response_model=NoteIn)
def add_note(note: NoteIn):
    db: Session = SessionLocal()
    try:
        new = UserNote(user_id=note.user_id, content=note.content)
        db.add(new)
        db.commit()
        db.refresh(new)
        return {"user_id": new.user_id, "content": new.content}
    finally:
        db.close()

@router.get("/user_notes")
def get_notes(user_id: int = Query(...)):
    db: Session = SessionLocal()
    try:
        rows = (
            db.query(UserNote)
              .filter(UserNote.user_id == user_id)
              .order_by(UserNote.created_at.desc())
              .all()
        )
        return [
            {"id": r.id, "user_id": r.user_id, "content": r.content, "created_at": r.created_at.isoformat()}
            for r in rows
        ]
    finally:
        db.close()
