from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
from ..db import SessionLocal
from ..models import Submission, Progress

router = APIRouter()
def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

class SubmissionCreate(BaseModel):
    user_id: int
    curriculum_id: str
    answer: str
    score: float | None = None
    feedback: str | None = None

@router.post("/quiz/submit")
def submit_quiz(body: SubmissionCreate, db: Session = Depends(get_db)):
    sub = Submission(
        user_id=body.user_id, curriculum_id=body.curriculum_id,
        answer=body.answer, score=body.score, feedback=body.feedback,
        submitted_at=datetime.utcnow()
    )
    db.add(sub); db.commit(); db.refresh(sub)

    prog = db.query(Progress).filter(
        Progress.user_id==body.user_id,
        Progress.curriculum_id==body.curriculum_id
    ).first()
    if not prog:
        prog = Progress(user_id=body.user_id, curriculum_id=body.curriculum_id)
        db.add(prog)
    if body.score and body.score >= 70:
        prog.status="complete"; prog.completed_at=datetime.utcnow()
    else:
        prog.status="review"
    db.commit()
    return {"success": True, "progress": prog.status, "submission_id": sub.id}
