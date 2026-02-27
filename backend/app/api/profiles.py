from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from app.core.supabase import get_supabase

router = APIRouter()

class UpdateProfileRequest(BaseModel):
    full_name: str | None = None
    avatar_url: str | None = None
    phone: str | None = None
    location: str | None = None

@router.put("/me")
async def update_my_profile(req: UpdateProfileRequest, authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")
    token = authorization.split(" ")[1]
    sb = get_supabase(token)
    
    try:
        user_resp = sb.auth.get_user(token)
        user_id = user_resp.user.id
        
        update_data = {}
        if req.full_name is not None:
            update_data["full_name"] = req.full_name
        if req.avatar_url is not None:
            update_data["avatar_url"] = req.avatar_url
        if req.phone is not None:
            update_data["phone"] = req.phone
        if req.location is not None:
            update_data["location"] = req.location
            
        if not update_data:
             return {"message": "Nothing to update"}
             
        # Update Profiles DB
        res = sb.table("profiles").update(update_data).eq("id", user_id).execute()
        return {"message": "Profile updated", "data": res.data[0] if res.data else None}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{user_id}")
async def get_public_profile(user_id: str):
    """
    Fetch a user's Career Passport (Public Profile).
    Requires the database to have public SELECT enabled for profiles, resumes, and resume_analysis,
    or the backend needs a service role key. Since we are using the anon key, RLS must be open for SELECT on these.
    """
    sb = get_supabase()
    
    try:
        # Fetch base profile
        profile = sb.table("profiles").select("id, full_name, avatar_url, role").eq("id", user_id).execute()
        if not profile.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        user_profile = profile.data[0]
        
        # Fetch resume data (skills, experience, education, etc) safely
        resume = sb.table("resumes").select("file_url, skills, experience_years, education_level, industry, seniority").eq("user_id", user_id).execute()
        
        # Fetch AI analysis data safely
        analysis = sb.table("resume_analysis").select("overall_score, strengths, missing_skills, ai_summary").eq("user_id", user_id).execute()
        
        return {
            "profile": user_profile,
            "resume": resume.data[0] if resume.data else None,
            "analysis": analysis.data[0] if analysis.data else None
        }
    except Exception as e:
        # Raise generic 404 if anything fails (e.g. RLS blocks it)
        raise HTTPException(status_code=404, detail="Profile could not be retrieved")
