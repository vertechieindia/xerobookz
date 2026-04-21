"""PostgreSQL connection and session management"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from contextlib import contextmanager
import os

POSTGRES_URI = os.getenv("POSTGRES_URI", "postgresql://user:password@localhost:5432/xerobookz")

engine = create_engine(POSTGRES_URI, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


@contextmanager
def get_db_session():
    """Get database session context manager (for use with 'with' statement)"""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_db_session_dependency():
    """FastAPI dependency that yields a DB session (use with Depends(get_db_session_dependency))"""
    session = SessionLocal()
    try:
        yield session
        session.commit()
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_engine():
    """Get SQLAlchemy engine"""
    return engine

