from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os 
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db import SessionLocal
from models import Progress
from datetime import datetime

router = APIRouter()
def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

class ProgressUpdate(BaseModel):
    user_id: int
    curriculum_id: str
    status: str           # complete / review / incomplete

@router.post("/progress/update")
def update_progress(body: ProgressUpdate, db: Session = Depends(get_db)):
    row = db.query(Progress).filter(
        Progress.user_id == body.user_id,
        Progress.curriculum_id == body.curriculum_id
    ).first()
    if not row:
        row = Progress(user_id=body.user_id, curriculum_id=body.curriculum_id)
        db.add(row)
    row.status = body.status
    row.completed_at = datetime.utcnow() if body.status == "complete" else None
    db.commit()
    return {"success": True}

@router.get("/progress/list")
def list_progress(user_id: int, db: Session = Depends(get_db)):
    rows = db.query(Progress).filter(Progress.user_id == user_id).all()
    return {"progress": [
        {"curriculum_id": r.curriculum_id, "status": r.status}
        for r in rows
    ]}
