"""
Trains the email phishing classifier using TF-IDF + Logistic Regression.

Data source: a labeled Safe Email / Phishing Email corpus
(Phishing_validation_emails.csv, Zenodo record 13474746 - see
data/README_DATA.md). NOTE: this seed dataset is intentionally small
and template-heavy, which is fine to get a working pipeline end-to-end,
but you should swap in a larger, more diverse corpus (e.g. the Nazario
phishing corpus + a legitimate corpus like Enron) before relying on this
for anything beyond a demo/portfolio project. The training script doesn't
change either way - just point DATA_PATH at a bigger CSV with the same
two columns.

Run:
    python ml_training/train_email_model.py
Produces:
    app/ml/email_model.joblib
"""
import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "Phishing_validation_emails.csv")
MODEL_OUT = os.path.join(os.path.dirname(__file__), "..", "app", "ml", "email_model.joblib")


def main():
    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=["Email Text", "Email Type"])
    df["label"] = (df["Email Type"].str.strip() == "Phishing Email").astype(int)
    print(f"  {len(df)} rows | label distribution:\n{df['label'].value_counts()}")

    X = df["Email Text"]
    y = df["label"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    pipeline = Pipeline([
        ("tfidf", TfidfVectorizer(
            lowercase=True,
            stop_words="english",
            ngram_range=(1, 2),
            max_features=5000,
            min_df=1,
        )),
        ("clf", LogisticRegression(max_iter=1000, class_weight="balanced")),
    ])

    print("Training TF-IDF + Logistic Regression pipeline...")
    pipeline.fit(X_train, y_train)

    print("\nEvaluation on held-out test set:")
    y_pred = pipeline.predict(X_test)
    print(classification_report(y_test, y_pred, target_names=["safe", "phishing"]))

    os.makedirs(os.path.dirname(MODEL_OUT), exist_ok=True)
    joblib.dump(pipeline, MODEL_OUT)
    print(f"\nSaved model to {MODEL_OUT}")


if __name__ == "__main__":
    main()
