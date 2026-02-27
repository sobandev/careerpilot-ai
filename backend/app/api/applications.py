from fastapi import APIRouter, Header, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from app.core.supabase import get_supabase
from app.services.scorer import compute_compatibility_score
from app.core.dependencies import get_current_user

router = APIRouter()


class ApplicationCreate(BaseModel):
    job_id: str
    cover_letter: Optional[str] = None
    contact_email: Optional[str] = None
    contact_phone: Optional[str] = None


@router.post("")
async def apply_to_job(req: ApplicationCreate, user_data: tuple = Depends(get_current_user)):
    user, sb = user_data

    # Check for duplicate application
    existing = sb.table("applications").select("id").eq("user_id", user.id).eq("job_id", req.job_id).execute()
    if existing.data:
        raise HTTPException(status_code=400, detail="You have already applied to this job")

    # Fetch Job Details
    job_res = sb.table("jobs").select("*").eq("id", req.job_id).execute()
    if not job_res.data:
        raise HTTPException(status_code=404, detail="Job not found")
    job = job_res.data[0]

    # Fetch User Resume
    resume_res = sb.table("resumes").select("*").eq("user_id", user.id).execute()
    match_score = 0
    
    if resume_res.data:
        resume = resume_res.data[0]
        try:
            scores = compute_compatibility_score(
                user_skills=resume.get("skills", []) or [],
                user_experience_years=resume.get("experience_years", 0) or 0,
                user_education=resume.get("education_level", "other") or "other",
                user_industry=resume.get("industry", "other") or "other",
                resume_embedding=resume.get("embedding", []) or [],
                
                job_skills=job.get("skills_required", []) or [],
                job_experience_min=job.get("experience_min", 0) or 0,
                job_experience_max=job.get("experience_max", 10) or 10,
                job_education=job.get("education_level", "bachelors") or "bachelors",
                job_industry=job.get("industry", "other") or "other",
                job_description=job.get("description", "") or "",
                resume_text=resume.get("raw_text", "") or "",
                job_embedding=[]  # Job embedding not yet implemented
            )
            match_score = scores["total_score"]
        except Exception as e:
            print(f"Scoring failed: {e}")
            match_score = 0

    result = sb.table("applications").insert({
        "user_id": user.id,
        "job_id": req.job_id,
        "cover_letter": req.cover_letter,
        "contact_email": req.contact_email,
        "contact_phone": req.contact_phone,
        "status": "applied",
        "match_score": match_score
    }).execute()

    return {"message": "Application submitted successfully", "id": result.data[0]["id"] if result.data else None}


@router.get("")
async def list_applications(user_data: tuple = Depends(get_current_user)):
    user, sb = user_data

    result = sb.table("applications").select(
        "*, jobs(title, industry, location, job_type, companies(name, logo_url))"
    ).eq("user_id", user.id).order("applied_at", desc=True).execute()

    return {"applications": result.data or []}


@router.get("/employer")
async def list_employer_applications(job_id: Optional[str] = None, user_data: tuple = Depends(get_current_user)):
    """Get applications for employer's jobs."""
    user, sb = user_data

    # Get employer's company
    company = sb.table("companies").select("id").eq("owner_id", user.id).execute()
    if not company.data:
        raise HTTPException(status_code=400, detail="Company not found")

    company_id = company.data[0]["id"]

    # Get all job IDs for this company
    jobs = sb.table("jobs").select("id").eq("company_id", company_id).execute()
    job_ids = [j["id"] for j in jobs.data]
    
    if not job_ids:
        return {
            "applications": [],
            "debug_info": {
                "message": "No jobs found for this company",
                "company_id": company_id,
                "user_id": user.id
            }
        }

    query = sb.table("applications").select(
        "id, status, applied_at, cover_letter, match_score, contact_email, contact_phone, jobs!inner(title, company_id), profiles(full_name, email, resumes(file_url, skills, experience_years, education_level), resume_analysis(overall_score, missing_skills, strengths))"
    ).in_("job_id", job_ids)

    if job_id:
        if job_id not in job_ids:
            return {"applications": []}
        query = query.eq("job_id", job_id)

    result = query.order("applied_at", desc=True).execute()
    return {
        "applications": result.data or [],
        "debug_info": {
            "user_id": user.id,
            "company_id": company_id,
            "job_ids_count": len(job_ids),
            "apps_found": len(result.data or []) if result.data else 0
        }
    }


@router.patch("/{application_id}/status")
async def update_application_status(
    application_id: str,
    status: str,
    user_data: tuple = Depends(get_current_user)
):
    user, sb = user_data

    valid_statuses = ["applied", "viewed", "shortlisted", "rejected", "hired"]
    if status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")

    result = sb.table("applications").update({"status": status}).eq("id", application_id).execute()
    return {"message": "Status updated", "status": status}
