import io
import re
from typing import Optional

try:
    import fitz  # PyMuPDF
    HAS_FITZ = True
except ImportError:
    HAS_FITZ = False

try:
    from docx import Document
    HAS_DOCX = True
except ImportError:
    HAS_DOCX = False


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract text from PDF bytes using PyMuPDF."""
    if not HAS_FITZ:
        return ""
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        return text.strip()
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract text from DOCX bytes."""
    if not HAS_DOCX:
        return ""
    try:
        doc = Document(io.BytesIO(file_bytes))
        text = "\n".join([para.text for para in doc.paragraphs])
        return text.strip()
    except Exception as e:
        print(f"DOCX extraction error: {e}")
        return ""


def parse_resume(file_bytes: bytes, content_type: str) -> str:
    """Parse resume bytes based on content type."""
    if "pdf" in content_type.lower():
        return extract_text_from_pdf(file_bytes)
    elif "docx" in content_type.lower() or "word" in content_type.lower():
        return extract_text_from_docx(file_bytes)
    elif "plain" in content_type.lower():
        return file_bytes.decode("utf-8", errors="ignore")
    else:
        # Try PDF first, then DOCX
        text = extract_text_from_pdf(file_bytes)
        if not text:
            text = extract_text_from_docx(file_bytes)
        return text


def estimate_experience_years(text: str) -> float:
    """Estimate years of experience from resume text."""
    patterns = [
        r'(\d+)\+?\s*years?\s*(?:of\s*)?experience',
        r'experience\s*(?:of\s*)?(\d+)\+?\s*years?',
        r'(\d+)\+?\s*yr[s]?\s*(?:of\s*)?(?:experience|exp)',
    ]
    for pattern in patterns:
        matches = re.findall(pattern, text.lower())
        if matches:
            return float(max(int(m) for m in matches))

    # Count year ranges like 2020 - 2023
    year_pattern = r'(20\d{2})\s*[-–]\s*(20\d{2}|present|current)'
    matches = re.findall(year_pattern, text.lower())
    if matches:
        total = 0
        for start, end in matches:
            start_yr = int(start)
            end_yr = 2026 if end in ['present', 'current'] else int(end)
            total += max(0, end_yr - start_yr)
        return float(min(total, 30))

    return 0.0


def detect_education_level(text: str) -> str:
    """Detect highest education level from resume text."""
    text_lower = text.lower()
    if any(w in text_lower for w in ['ph.d', 'phd', 'doctorate', 'doctor of philosophy']):
        return "phd"
    if any(w in text_lower for w in ['master', 'm.s.', 'mba', 'm.b.a', 'm.sc', 'msc', 'ms ']):
        return "masters"
    if any(w in text_lower for w in ['bachelor', 'b.s.', 'b.a.', 'b.sc', 'bsc', 'b.e.', 'b.tech', 'btech', 'undergraduate']):
        return "bachelors"
    if any(w in text_lower for w in ['associate', 'diploma', 'a.s.', 'a.a.']):
        return "associate"
    return "other"


def detect_industry(text: str) -> str:
    """Detect primary industry from resume text."""
    text_lower = text.lower()
    industries = {
        "technology": ['software', 'developer', 'engineer', 'programming', 'coding', 'tech', 'it ', 'data science', 'machine learning', 'ai ', 'artificial intelligence', 'cloud', 'devops', 'frontend', 'backend', 'fullstack'],
        "finance": ['finance', 'banking', 'investment', 'accounting', 'financial', 'cfa', 'cpa', 'audit', 'tax'],
        "healthcare": ['healthcare', 'medical', 'hospital', 'clinical', 'pharmacy', 'nurse', 'doctor', 'physician'],
        "marketing": ['marketing', 'seo', 'content', 'brand', 'digital marketing', 'social media', 'advertising'],
        "education": ['teaching', 'teacher', 'professor', 'lecturer', 'education', 'university', 'school', 'tutor'],
        "design": ['design', 'ui/ux', 'ux', 'graphic', 'creative', 'figma', 'adobe', 'illustrator'],
        "sales": ['sales', 'business development', 'account manager', 'crm', 'revenue'],
    }
    scores = {}
    for industry, keywords in industries.items():
        scores[industry] = sum(1 for kw in keywords if kw in text_lower)
    return max(scores, key=scores.get) if scores else "other"


def detect_seniority(text: str, experience_years: float) -> str:
    """Detect seniority level."""
    text_lower = text.lower()
    if any(w in text_lower for w in ['cto', 'ceo', 'coo', 'chief', 'vp ', 'vice president', 'director']):
        return "executive"
    if any(w in text_lower for w in ['senior', 'lead', 'principal', 'staff', 'architect']) or experience_years >= 5:
        return "senior"
    if any(w in text_lower for w in ['mid', 'intermediate']) or 2 <= experience_years < 5:
        return "mid"
    if experience_years < 2:
        return "junior"
    return "mid"
