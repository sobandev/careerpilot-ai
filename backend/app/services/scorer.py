from typing import List, Dict, Tuple
from app.services.embedder import compute_cosine_similarity


def _clamp(value: float, min_val: float = 0.0, max_val: float = 100.0) -> int:
    return int(max(min_val, min(max_val, value)))


def compute_skill_match(user_skills: List[str], job_skills: List[str]) -> int:
    """Calculate skill match percentage."""
    if not job_skills:
        return 50
    if not user_skills:
        return 0
    user_set = {s.lower().strip() for s in user_skills}
    job_set = {s.lower().strip() for s in job_skills}
    matched = len(user_set & job_set)
    return _clamp((matched / len(job_set)) * 100)


def compute_experience_match(user_years: float, job_min: float, job_max: float) -> int:
    """Calculate experience match percentage."""
    if user_years >= job_min and user_years <= job_max:
        return 100
    elif user_years < job_min:
        diff = job_min - user_years
        penalty = min(diff * 15, 80)
        return _clamp(100 - penalty)
    else:
        # Overqualified - slight penalty
        diff = user_years - job_max
        penalty = min(diff * 5, 20)
        return _clamp(100 - penalty)


def compute_keyword_similarity(resume_text: str, job_description: str,
                                resume_emb: List[float], job_emb: List[float]) -> int:
    """Calculate keyword similarity using embeddings."""
    if resume_emb and job_emb and any(v != 0 for v in resume_emb):
        sim = compute_cosine_similarity(resume_emb, job_emb)
        return _clamp(sim * 100)
    # Fallback: word overlap
    resume_words = set(resume_text.lower().split())
    job_words = set(job_description.lower().split())
    if not job_words:
        return 0
    overlap = len(resume_words & job_words) / len(job_words)
    return _clamp(overlap * 130)  # Scale up slightly


def compute_education_match(user_edu: str, job_edu: str) -> int:
    """Calculate education match score."""
    edu_levels = {"other": 0, "associate": 1, "bachelors": 2, "masters": 3, "phd": 4}
    user_level = edu_levels.get(user_edu, 0)
    job_level = edu_levels.get(job_edu, 0)
    if user_level >= job_level:
        return 100
    diff = job_level - user_level
    return _clamp(100 - diff * 25)


def compute_industry_alignment(user_industry: str, job_industry: str) -> int:
    """Calculate industry alignment score."""
    if user_industry == job_industry:
        return 100
    adjacent = {
        ("technology", "design"): 60,
        ("technology", "marketing"): 50,
        ("finance", "technology"): 55,
        ("marketing", "sales"): 75,
        ("sales", "marketing"): 75,
    }
    pair = (user_industry, job_industry)
    reverse_pair = (job_industry, user_industry)
    return adjacent.get(pair, adjacent.get(reverse_pair, 30))


def compute_compatibility_score(
    user_skills: List[str],
    user_experience_years: float,
    user_education: str,
    user_industry: str,
    resume_embedding: List[float],
    job_skills: List[str],
    job_experience_min: float,
    job_experience_max: float,
    job_education: str,
    job_industry: str,
    job_description: str,
    resume_text: str,
    job_embedding: List[float] = None,
) -> Dict[str, int]:
    """
    Compute weighted compatibility score.
    Weights: Skill 40%, Experience 25%, Keywords 20%, Education 10%, Industry 5%
    """
    skill = compute_skill_match(user_skills, job_skills)
    experience = compute_experience_match(user_experience_years, job_experience_min, job_experience_max)
    keyword = compute_keyword_similarity(resume_text, job_description, resume_embedding, job_embedding or [])
    education = compute_education_match(user_education, job_education)
    industry = compute_industry_alignment(user_industry, job_industry)

    total = (
        skill * 0.40 +
        experience * 0.25 +
        keyword * 0.20 +
        education * 0.10 +
        industry * 0.05
    )

    return {
        "total_score": _clamp(total),
        "skill_match": skill,
        "experience_match": experience,
        "keyword_similarity": keyword,
        "education_match": education,
        "industry_alignment": industry,
    }
