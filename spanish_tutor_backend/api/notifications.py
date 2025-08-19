from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from db import SessionLocal
from models import Notification

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/notifications")
def get_notifications(user_id: int = Query(...), db: Session = Depends(get_db)):
    """
    Kullanıcının tüm bildirimlerini, en yeniden eskiye doğru döner.
    """
    notes = (
        db.query(Notification)
          .filter(Notification.user_id == user_id)
          .order_by(Notification.created_at.desc())
          .all()
    )
    return [
        {
            "id": n.id,
            "message": n.message,
            "created_at": n.created_at.isoformat()
        }
        for n in notes
    ]
