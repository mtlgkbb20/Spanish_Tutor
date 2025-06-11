from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session as ORMSession
from datetime import datetime
from ..db import SessionLocal
from ..models import Session as SessionTbl, User
from sqlalchemy import func

router = APIRouter()
def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

class SessionEnd(BaseModel):
    session_id: int | None = None
    user_id: int | None = None

@router.post("/session/end")
def end_session(body: SessionEnd, db: ORMSession = Depends(get_db)):
    if body.session_id:
        sess = db.query(SessionTbl).filter(SessionTbl.id==body.session_id).first()
    else:
        sess = db.query(SessionTbl).filter(
            SessionTbl.user_id==body.user_id,
            SessionTbl.logout_at==None
        ).order_by(SessionTbl.login_at.desc()).first()
    if not sess:
        raise HTTPException(404,"Active session not found")
    sess.logout_at = datetime.utcnow()
    db.commit()
    return {"success": True, "logout_at": sess.logout_at}

@router.get("/session/stats")
def session_stats(user_id: int, db: ORMSession = Depends(get_db)):
    sessions = db.query(SessionTbl).filter(SessionTbl.user_id==user_id).all()
    if not sessions:
        return {"login_count":0, "total_hours":0, "current_level":"A1"}
    login_count   = len(sessions)
    total_seconds = sum(
        ((s.logout_at or datetime.utcnow()) - s.login_at).total_seconds()
        for s in sessions
    )
    total_hours = round(total_seconds/3600, 2)
    user = db.query(User).filter(User.id==user_id).first()
    return {
        "login_count": login_count,
        "total_hours": total_hours,
        "current_level": user.current_level if user else "A1"
    }
