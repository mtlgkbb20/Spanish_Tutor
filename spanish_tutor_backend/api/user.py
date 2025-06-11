from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
from ..db import SessionLocal
from ..models import User, Session as SessionTbl

router = APIRouter()

def get_db():
    db = SessionLocal()
    try: yield db
    finally: db.close()

class UserCreate(BaseModel):
    name: str

@router.post("/auth")
def auth_user(payload: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.name == payload.name).first()
    new_flag = False
    if not db_user:
        db_user = User(name=payload.name)
        db.add(db_user); db.commit(); db.refresh(db_user)
        new_flag = True

    new_session = SessionTbl(
        user_id = db_user.id,
        level   = db_user.current_level,
        interest= None
    )
    db.add(new_session); db.commit(); db.refresh(new_session)

    return {
        "id"         : db_user.id,
        "name"       : db_user.name,
        "session_id" : new_session.id,
        "new"        : new_flag
    }
