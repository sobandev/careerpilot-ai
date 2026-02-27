from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ResumeUploadResponse(BaseModel):
    id: str
    user_id: str
    file_url: str
    raw_text: str
    skills: List[str]
    experience_years: float
    education_level: str
    industry: str
    seniority: str
    created_at: datetime


class ResumeAnalysis(BaseModel):
    resume_id: str
    overall_score: int
    strengths: List[str]
    weaknesses: List[str]
    missing_skills: List[str]
    keyword_optimization: int
    profile_completeness: int
    ai_summary: str
    industry_alignment: str


class RoadmapItem(BaseModel):
    skill: str
    priority: int
    timeline: str
    resources: List[str]
    milestone: str


class RoadmapResponse(BaseModel):
    user_id: str
    target_role: str
    total_duration: str
    items: List[RoadmapItem]
    ai_narrative: str


class JobCreate(BaseModel):
    title: str
    company_id: str
    description: str
    requirements: str
    skills_required: List[str]
    experience_min: float
    experience_max: float
    education_level: str
    industry: str
    location: str
    job_type: str  # full-time, part-time, contract, remote
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None


class JobResponse(BaseModel):
    id: str
    title: str
    company_name: str
    company_logo: Optional[str]
    description: str
    requirements: str
    skills_required: List[str]
    experience_min: float
    experience_max: float
    education_level: str
    industry: str
    location: str
    job_type: str
    salary_min: Optional[int]
    salary_max: Optional[int]
    created_at: datetime
    match_score: Optional[int] = None


class CompatibilityScore(BaseModel):
    job_id: str
    user_id: str
    total_score: int
    skill_match: int
    experience_match: int
    keyword_similarity: int
    education_match: int
    industry_alignment: int
    missing_skills: List[str]
    improvement_tips: List[str]
    ai_explanation: str


class ApplicationCreate(BaseModel):
    job_id: str
    cover_letter: Optional[str] = None


class ApplicationResponse(BaseModel):
    id: str
    job_id: str
    job_title: str
    company_name: str
    status: str  # applied, viewed, shortlisted, rejected
    applied_at: datetime
    match_score: Optional[int] = None
