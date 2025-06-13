# api/tasks.py

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from db import SessionLocal
from models import Progress  # ilerlemeyi tutan modeliniz
from typing import Dict, Any

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/tasks")
def get_tasks(user_id: int = Query(...), curriculum_id: str = Query(...), db: Session = Depends(get_db)) -> Dict[str, Any]:
    """
    Returns two lists:
      - quizzes:   [{"index":0,"title":"Quiz 1",    "locked":True}, ...]
      - assignments:[{"index":0,"title":"HW 1","locked":True}, ...]
    Locked status is determined by Progress records.
    """
    # Örnek: Progress tablonuzda curriculum_id ve user_id eşleşen satır varsa modül tamamlanmış demektir.
    prog = db.query(Progress).filter_by(user_id=user_id, curriculum_id=curriculum_id, status="complete").first()
    module_unlocked = bool(prog)

    # Eğer modül tamamlandıysa dxd quizzes ve ödevler açık, değilse kilitli
    quizzes = []
    assignments = []
    for i in range(5):
        quizzes.append({
            "index": i+1,
            "title": f"Quiz {i+1}",
            "locked": not module_unlocked  # modül tamamlanana kadar kilitli
        })
        assignments.append({
            "index": i+1,
            "title": f"Assignment {i+1}",
            "locked": not module_unlocked
        })

    return {"quizzes": quizzes, "assignments": assignments}
