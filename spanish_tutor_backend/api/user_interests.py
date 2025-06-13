from fastapi import APIRouter, Query, HTTPException
from sqlalchemy.orm import Session
from db import SessionLocal
from models import UserInterest

router = APIRouter()

@router.get("/user_interests")
def get_user_interests(user_id: int = Query(...)):
    db: Session = SessionLocal()
    try:
        rows = (
            db.query(UserInterest)
              .filter(UserInterest.user_id == user_id)
              .order_by(UserInterest.created_at.asc())
              .all()
        )
        # Eğer hiç satır yoksa boş liste dön
        return [
            {
                "id": r.id,
                "user_id": r.user_id,
                "user_name": r.user_name,
                "interests": r.interests,
                "created_at": r.created_at.isoformat(),
            }
            for r in rows
        ]
    finally:
        db.close()
