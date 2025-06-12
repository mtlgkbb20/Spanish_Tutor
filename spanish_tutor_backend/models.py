from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime
from datetime import datetime
import os 
import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from db import Base

class User(Base):
    __tablename__ = "users"
    id            = Column(Integer, primary_key=True, index=True)
    name          = Column(String, unique=True, index=True, nullable=False)
    current_level = Column(String(5), default="A1")

class Progress(Base):
    __tablename__ = "progress"
    id            = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey("users.id"))
    curriculum_id = Column(String, index=True)          # "A1-0"
    status        = Column(String(20), default="incomplete")
    completed_at  = Column(DateTime)

class Submission(Base):
    __tablename__ = "submissions"
    id            = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey("users.id"))
    curriculum_id = Column(String, index=True)
    answer        = Column(Text)
    score         = Column(Float)
    feedback      = Column(Text)
    submitted_at  = Column(DateTime, default=datetime.utcnow)

class Session(Base):
    __tablename__ = "sessions"
    id        = Column(Integer, primary_key=True, index=True)
    user_id   = Column(Integer, ForeignKey("users.id"))
    login_at  = Column(DateTime, default=datetime.utcnow)
    logout_at = Column(DateTime, nullable=True)
    level     = Column(String(5))
    interest  = Column(String, nullable=True)

class LessonContent(Base):
    __tablename__ = "lesson_contents"
    id            = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey("users.id"))
    curriculum_id = Column(String, index=True)
    grammar       = Column(Text)
    words         = Column(Text)      # virgül ayrılmış
    sentences     = Column(Text)
    dialogue      = Column(Text)
    created_at    = Column(DateTime, default=datetime.utcnow)
