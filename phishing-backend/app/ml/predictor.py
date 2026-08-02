"""
Loads both trained models once at import time and exposes simple
predict functions used by the API routes. Keeping model-loading here
(rather than in the route handlers) means the models are read from disk
exactly once per server process, not once per request.
"""
import os
import joblib
import pandas as pd

from app.ml.url_features import extract_features, FEATURE_NAMES

_HERE = os.path.dirname(__file__)
URL_MODEL_PATH = os.path.join(_HERE, "url_model.joblib")
EMAIL_MODEL_PATH = os.path.join(_HERE, "email_model.joblib")

_url_bundle = None
_email_pipeline = None


def _load_models():
    global _url_bundle, _email_pipeline
    if _url_bundle is None:
        if not os.path.exists(URL_MODEL_PATH):
            raise RuntimeError(
                f"URL model not found at {URL_MODEL_PATH}. "
                "Run `python ml_training/train_url_model.py` first."
            )
        _url_bundle = joblib.load(URL_MODEL_PATH)

    if _email_pipeline is None:
        if not os.path.exists(EMAIL_MODEL_PATH):
            raise RuntimeError(
                f"Email model not found at {EMAIL_MODEL_PATH}. "
                "Run `python ml_training/train_email_model.py` first."
            )
        _email_pipeline = joblib.load(EMAIL_MODEL_PATH)


def _risk_level(confidence: float) -> str:
    if confidence >= 0.75:
        return "high"
    if confidence >= 0.4:
        return "medium"
    return "low"


def predict_url(url: str) -> dict:
    _load_models()
    model = _url_bundle["model"]
    feats = extract_features(url)
    X = pd.DataFrame([feats])[FEATURE_NAMES]

    proba = model.predict_proba(X)[0]
    # class 1 = phishing
    phishing_idx = list(model.classes_).index(1)
    confidence = float(proba[phishing_idx])
    is_phishing = confidence >= 0.5

    return {
        "is_phishing": is_phishing,
        "confidence": round(confidence, 4),
        "risk_level": _risk_level(confidence),
        "details": {
            "extracted_features": feats,
        },
    }


def predict_email(email_text: str) -> dict:
    _load_models()
    proba = _email_pipeline.predict_proba([email_text])[0]
    classes = list(_email_pipeline.classes_)
    phishing_idx = classes.index(1)
    confidence = float(proba[phishing_idx])
    is_phishing = confidence >= 0.5

    return {
        "is_phishing": is_phishing,
        "confidence": round(confidence, 4),
        "risk_level": _risk_level(confidence),
        "details": None,
    }
