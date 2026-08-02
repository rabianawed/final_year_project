"""
Trains the URL phishing classifier.

Data sources (see data/README_DATA.md for full attribution):
  - Phishing URLs: JPCERT/CC public phishing URL dataset (real, confirmed
    phishing sites, Jan-Jun 2022), https://github.com/JPCERTCC/phishurl-list
  - Legitimate URLs: a mix of benign/brand URLs and the top 10,000 most
    visited domains on the web.

Run:
    python ml_training/train_url_model.py
Produces:
    app/ml/url_model.joblib
"""
import sys
import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
import joblib

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from app.ml.url_features import extract_features, FEATURE_NAMES

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "url_dataset_combined.csv")
MODEL_OUT = os.path.join(os.path.dirname(__file__), "..", "app", "ml", "url_model.joblib")


def main():
    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=["url"]).drop_duplicates(subset=["url"])
    print(f"  {len(df)} rows | label distribution:\n{df['label'].value_counts()}")

    print("Extracting features (pure lexical, no network calls)...")
    feats = df["url"].apply(extract_features)
    X = pd.DataFrame(list(feats))[FEATURE_NAMES]
    y = df["label"].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print("Training RandomForestClassifier...")
    clf = RandomForestClassifier(
        n_estimators=300,
        max_depth=20,
        min_samples_leaf=2,
        class_weight="balanced",
        n_jobs=-1,
        random_state=42,
    )
    clf.fit(X_train, y_train)

    print("\nEvaluation on held-out test set:")
    y_pred = clf.predict(X_test)
    print(classification_report(y_test, y_pred, target_names=["legitimate", "phishing"]))
    print("Confusion matrix:\n", confusion_matrix(y_test, y_pred))

    importances = sorted(
        zip(FEATURE_NAMES, clf.feature_importances_), key=lambda x: -x[1]
    )
    print("\nTop 10 most important features:")
    for name, imp in importances[:10]:
        print(f"  {name:28s} {imp:.4f}")

    os.makedirs(os.path.dirname(MODEL_OUT), exist_ok=True)
    joblib.dump({"model": clf, "feature_names": FEATURE_NAMES}, MODEL_OUT)
    print(f"\nSaved model to {MODEL_OUT}")


if __name__ == "__main__":
    main()
