# AI Phishing Detection - Backend

FastAPI backend for the AI-powered phishing detection system. Classifies
**URLs** and **email text** as phishing or legitimate using two ML models,
and stores every scan in a SQLite history log.

## Stack
- **FastAPI** - REST API
- **scikit-learn** - RandomForest (URLs) + TF-IDF/LogisticRegression (emails)
- **SQLite + SQLAlchemy** - scan history storage
- **Pydantic** - request/response validation

## Project structure
```
app/
  main.py              # FastAPI app, CORS, router registration
  database.py          # SQLite/SQLAlchemy setup
  models/scan.py        # ORM model for scan_records table
  schemas/scan.py        # Pydantic request/response models
  routers/scan.py        # /api/scan/url, /api/scan/email, /api/scan/history
  ml/
    url_features.py     # lexical URL feature extraction (shared by train + predict)
    predictor.py         # loads models, runs predictions
    url_model.joblib      # trained RandomForest (generated)
    email_model.joblib    # trained TF-IDF+LogReg pipeline (generated)
ml_training/
  train_url_model.py     # trains + saves url_model.joblib
  train_email_model.py    # trains + saves email_model.joblib
data/
  url_dataset_combined.csv          # ~46k real URLs (JPCERT/CC phishing + top domains)
  Phishing_validation_emails.csv    # labeled email text dataset
requirements.txt
```

## Setup

```bash
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Models are already trained and included (`app/ml/*.joblib`). To retrain
from scratch (e.g. after swapping in a bigger dataset):

```bash
python ml_training/train_url_model.py
python ml_training/train_email_model.py
```

## Run

```bash
uvicorn app.main:app --reload --port 8000
```

Interactive API docs: **http://localhost:8000/docs**

## Endpoints

| Method | Path | Body | Description |
|---|---|---|---|
| POST | `/api/scan/url` | `{"url": "..."}` | Classify a URL |
| POST | `/api/scan/email` | `{"email_text": "..."}` | Classify email content |
| GET | `/api/scan/history?limit=50&offset=0` | - | Recent scans |
| GET | `/health` | - | Health check |

**Response shape** (both scan endpoints):
```json
{
  "is_phishing": true,
  "confidence": 0.85,
  "risk_level": "high",
  "details": { "extracted_features": { ... } }
}
```
`risk_level` is derived from confidence: `low` (<0.4), `medium` (0.4-0.75), `high` (≥0.75).

## Connecting your React frontend

1. Set your frontend origin in `app/main.py` (`CORSMiddleware.allow_origins`) -
   currently it allows `localhost:3000`/`5173` and `*` for dev. **Remove `*`
   before deploying.**
2. Call it from React, e.g.:

```js
async function scanUrl(url) {
  const res = await fetch("http://localhost:8000/api/scan/url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return res.json(); // { is_phishing, confidence, risk_level, details }
}
```

## Data sources & honest limitations

- **URL model**: trained on ~32k real confirmed-phishing URLs from
  [JPCERT/CC's public dataset](https://github.com/JPCERTCC/phishurl-list)
  plus ~14k legitimate URLs (brand/benign sample + top 10,000 most-visited
  domains). Test-set accuracy ~96%. Features are purely lexical/structural
  (URL length, entropy, suspicious keywords, TLD, etc.) — **no live network
  calls**, so it's fast and works offline, but it can't catch phishing pages
  hosted on otherwise-reputable-looking domains without another signal
  (e.g. content analysis, blocklists, domain age via WHOIS).
- **Email model**: trained on a small (~200 row) labeled Safe/Phishing email
  dataset built from public templates. It works for the demo, but it's
  template-heavy and will overfit to phrasing rather than learning general
  phishing "tells." **Before using this for anything beyond a demo, swap in
  a larger, more diverse corpus** (e.g. the Nazario phishing corpus +
  Enron for legitimate mail) — the training script doesn't need to change,
  just point `DATA_PATH` in `ml_training/train_email_model.py` at a bigger
  CSV with the same two columns (`Email Text`, `Email Type`).

## Not included (by design, per our scope discussion)

- Blockchain / smart contract identity verification layer
- User authentication (add `fastapi-users` or similar if you need accounts)
- Live webpage content scanning (currently URL-lexical only)
- Deployment config (Docker/hosting) - ask if you want this added
