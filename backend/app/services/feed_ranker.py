from typing import List, Dict, Any


def rank_jobs(jobs: List[Dict[str, Any]], user_resume: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Rank jobs for the personalized feed.
    Applies a boost based on skill overlap and industry match.
    Returns jobs sorted by relevance score descending.
    """
    user_skills = set(s.lower() for s in user_resume.get("skills", []))
    user_industry = user_resume.get("industry", "")

    ranked = []
    for job in jobs:
        job_skills = set(s.lower() for s in job.get("skills_required", []))
        job_industry = job.get("industry", "")

        # Skill overlap boost
        overlap = len(user_skills & job_skills)
        skill_boost = min(overlap * 10, 50)

        # Industry match boost
        industry_boost = 30 if user_industry == job_industry else 0

        # Match score from scoring engine (if available)
        match_score = job.get("match_score", 50)

        relevance = match_score * 0.6 + skill_boost * 0.25 + industry_boost * 0.15

        job["relevance_score"] = round(relevance, 2)
        ranked.append(job)

    ranked.sort(key=lambda x: x.get("relevance_score", 0), reverse=True)
    return ranked
