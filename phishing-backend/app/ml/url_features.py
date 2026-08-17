"""
Lexical / structural feature extraction for URLs.

Design choice: every feature is computed purely from the URL STRING itself
(no live network calls, no WHOIS, no DNS lookups). That makes this:
  - fast enough for a real-time API endpoint
  - reliable (no external dependency that can time out or get rate-limited)
  - deterministic (same URL -> same features, every time)

This exact module is imported by both the training script and the FastAPI
app, so the features used to train the model are guaranteed to match the
features used to score a URL at prediction time.
"""
import re
import math
from urllib.parse import urlparse
from collections import Counter

SUSPICIOUS_WORDS = [
    "login", "verify", "account", "update", "secure", "bank", "confirm",
    "signin", "sign-in", "password", "webscr", "billing", "ebayisapi",
    "suspend", "urgent", "alert", "unlock", "authenticate", "wallet",
    "recover", "reset", "invoice", "support",
]

SHORTENERS = {
    "bit.ly", "goo.gl", "tinyurl.com", "t.co", "ow.ly", "is.gd", "buff.ly",
    "adf.ly", "bit.do", "shorte.st", "tiny.cc", "cutt.ly", "rebrand.ly",
}

SUSPICIOUS_TLDS = {
    "zip", "review", "country", "kim", "cricket", "science", "work",
    "party", "gq", "link", "xyz", "top", "club", "loan", "men", "date",
    "icu", "tk", "ml", "ga", "cf",
}

FEATURE_NAMES = [
    "url_length", "domain_length", "path_length",
    "num_dots", "num_hyphens", "num_underscores", "num_slashes",
    "num_digits", "num_at", "num_question", "num_equal", "num_percent",
    "num_ampersand", "num_subdomains",
    "has_ip", "has_https", "has_port",
    "domain_hyphen_count", "digit_ratio_domain",
    "has_suspicious_word", "num_suspicious_words",
    "is_shortener", "has_suspicious_tld",
    "domain_entropy", "path_depth",
    "has_double_slash_in_path", "has_at_symbol",
    "tld_length", "starts_with_www",
]

IP_PATTERN = re.compile(
    r"^(?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}"
    r"(?:25[0-5]|2[0-4]\d|[01]?\d?\d)$"
)


def _shannon_entropy(s: str) -> float:
    if not s:
        return 0.0
    counts = Counter(s)
    length = len(s)
    return -sum((c / length) * math.log2(c / length) for c in counts.values())


def _safe_parse(url: str):
    url = url.strip()
    if not re.match(r"^[a-zA-Z][a-zA-Z0-9+.\-]*://", url):
        url = "http://" + url
    return urlparse(url)


def extract_features(url: str) -> dict:
    """Return an ordered dict of numeric features for a single URL string."""
    parsed = _safe_parse(url)
    domain = parsed.hostname or ""
    path = parsed.path or ""
    full = url

    domain_no_port = domain.split(":")[0] if domain else ""
    labels = [l for l in domain_no_port.split(".") if l]
    tld = labels[-1] if labels else ""

    features = {
        "url_length": len(full),
        "domain_length": len(domain_no_port),
        "path_length": len(path),
        "num_dots": full.count("."),
        "num_hyphens": full.count("-"),
        "num_underscores": full.count("_"),
        "num_slashes": full.count("/"),
        "num_digits": sum(c.isdigit() for c in full),
        "num_at": full.count("@"),
        "num_question": full.count("?"),
        "num_equal": full.count("="),
        "num_percent": full.count("%"),
        "num_ampersand": full.count("&"),
        "num_subdomains": max(len(labels) - 2, 0),
        "has_ip": 1 if IP_PATTERN.match(domain_no_port) else 0,
        "has_https": 1 if parsed.scheme == "https" else 0,
        "has_port": 1 if parsed.port else 0,
        "domain_hyphen_count": domain_no_port.count("-"),
        "digit_ratio_domain": (
            sum(c.isdigit() for c in domain_no_port) / len(domain_no_port)
            if domain_no_port else 0.0
        ),
        "has_suspicious_word": 1 if any(
            w in full.lower() for w in SUSPICIOUS_WORDS
        ) else 0,
        "num_suspicious_words": sum(
            1 for w in SUSPICIOUS_WORDS if w in full.lower()
        ),
        "is_shortener": 1 if domain_no_port.lower() in SHORTENERS else 0,
        "has_suspicious_tld": 1 if tld.lower() in SUSPICIOUS_TLDS else 0,
        "domain_entropy": round(_shannon_entropy(domain_no_port), 4),
        "path_depth": len([p for p in path.split("/") if p]),
        "has_double_slash_in_path": 1 if "//" in path else 0,
        "has_at_symbol": 1 if "@" in full else 0,
        "tld_length": len(tld),
        "starts_with_www": 1 if domain_no_port.lower().startswith("www.") else 0,
    }
    return features


def features_to_vector(features: dict) -> list:
    """Convert a features dict into an ordered list matching FEATURE_NAMES."""
    return [features[name] for name in FEATURE_NAMES]
