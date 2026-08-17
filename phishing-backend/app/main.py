from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import scan

# Create SQLite tables on startup if they don't exist yet
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Phishing Detection API",
    description=(
        "Real-time phishing detection for URLs and emails using ML/NLP. "
        "Analyzes lexical/structural URL features and email text content "
        "to classify threats and return a confidence score."
    ),
    version="1.0.0",
)

# --- CORS ---------------------------------------------------------------
# Update allow_origins with your actual frontend URL(s) before deploying.
# "*" is convenient for local development but should be tightened in prod.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "*",  # TODO: remove in production, replace with your real domain(s)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(scan.router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "service": "AI Phishing Detection API",
        "docs": "/docs",
    }


@app.get("/health")
def health():
    return {"status": "healthy"}
