from email.mime import base
import os
from regex import B
from sqlalchemy import create_engine, Column, Integer, String, DateTime,Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import date
from dotenv import load_dotenv

load_dotenv()

# Define the SQLite database connection
DATABASE_URL = os.getenv("DATABASE_URL")

# Create an engine
engine = create_engine(DATABASE_URL)
# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
# Create a base class for declarative models
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
Base = declarative_base()


class Pdfs(Base):
    
    __tablename__ = "pdfs"
    
    id = Column(Integer, primary_key=True)
    filename = Column(String)
    extracted_text = Column(Text)
    upload_date = Column(DateTime, default=date.today)

