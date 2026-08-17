from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.sql import func
from app.database import Base


class ScanRecord(Base):
    __tablename__ = "scan_records"

    id = Column(Integer, primary_key=True, index=True)
    scan_type = Column(String(10), index=True)  # "url" or "email"
    input_preview = Column(Text)  # the URL, or a truncated preview of email text
    is_phishing = Column(Integer)  # 0 or 1
    confidence = Column(Float)  # probability of the phishing class, 0-1
    created_at = Column(DateTime(timezone=True), server_default=func.now())
