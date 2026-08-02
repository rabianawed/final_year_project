from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class URLScanRequest(BaseModel):
    url: str = Field(..., min_length=3, examples=["http://secure-paypal-login.example.com"])


class EmailScanRequest(BaseModel):
    email_text: str = Field(..., min_length=1, examples=["Your account has been suspended. Click here to verify."])


class ScanResponse(BaseModel):
    is_phishing: bool
    confidence: float  # 0-1, probability of the "phishing" class
    risk_level: str  # "low" | "medium" | "high"
    details: Optional[dict] = None


class ScanHistoryItem(BaseModel):
    id: int
    scan_type: str
    input_preview: str
    is_phishing: bool
    confidence: float
    created_at: datetime

    class Config:
        from_attributes = True


class ScanHistoryResponse(BaseModel):
    items: List[ScanHistoryItem]
    total: int
