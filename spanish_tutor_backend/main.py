from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.user      import router as user_router
from api.progress  import router as progress_router
from api.quiz      import router as quiz_router
from api.chat      import router as chat_router
from api.session   import router as session_router
from api.lesson    import router as lesson_router
from db import init_db
import os
init_db()
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(user_router,     prefix="/api")
app.include_router(progress_router, prefix="/api")
app.include_router(quiz_router,     prefix="/api")
app.include_router(chat_router,     prefix="/api")
app.include_router(session_router,  prefix="/api")
app.include_router(lesson_router,   prefix="/api")
