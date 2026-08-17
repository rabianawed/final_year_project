from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc

from app.database import get_db
from app.models.scan import ScanRecord
from app.schemas.scan import (
    URLScanRequest,
    EmailScanRequest,
    ScanResponse,
    ScanHistoryResponse,
    ScanHistoryItem,
)
from app.ml.predictor import predict_url, predict_email

router = APIRouter(prefix="/api/scan", tags=["scan"])


def _save_record(db: Session, scan_type: str, preview: str, result: dict):
    record = ScanRecord(
        scan_type=scan_type,
        input_preview=preview[:500],
        is_phishing=int(result["is_phishing"]),
        confidence=result["confidence"],
    )
    db.add(record)
    db.commit()


@router.post("/url", response_model=ScanResponse)
def scan_url(payload: URLScanRequest, db: Session = Depends(get_db)):
    result = predict_url(payload.url)
    _save_record(db, "url", payload.url, result)
    return result


@router.post("/email", response_model=ScanResponse)
def scan_email(payload: EmailScanRequest, db: Session = Depends(get_db)):
    result = predict_email(payload.email_text)
    _save_record(db, "email", payload.email_text, result)
    return result


@router.get("/history", response_model=ScanHistoryResponse)
def get_history(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
):
    query = db.query(ScanRecord).order_by(desc(ScanRecord.created_at))
    total = query.count()
    records = query.offset(offset).limit(limit).all()
    items = [
        ScanHistoryItem(
            id=r.id,
            scan_type=r.scan_type,
            input_preview=r.input_preview,
            is_phishing=bool(r.is_phishing),
            confidence=r.confidence,
            created_at=r.created_at,
        )
        for r in records
    ]
    return ScanHistoryResponse(items=items, total=total)
