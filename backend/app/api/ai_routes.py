from fastapi import APIRouter, Header, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from app.core.supabase import get_supabase
from app.core.groq_client import chat_completion
from app.core.dependencies import get_current_user
import json
import os
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from app.core.config import settings

router = APIRouter()


class RoadmapRequest(BaseModel):
    target_role: Optional[str] = None
    job_id: Optional[str] = None

class ResourceObject(BaseModel):
    title: str = Field(description="Title of the learning resource")
    type: Literal["video", "article", "course"] = Field(description="Format of the resource")
    cost: Literal["free", "paid"] = Field(description="Cost constraint")
    url: str = Field(description="A VALID, REAL URL to the exact resource or strictly a targeted Google/YouTube search query string if exact URL unknown.")

class RoadmapItem(BaseModel):
    skill: str = Field(description="The primary skill to learn")
    priority: int = Field(description="Ordering priority from 1 to N")
    timeline: str = Field(description="Estimated time, e.g. '1 week', '2 weeks'")
    resources: List[ResourceObject] = Field(description="List of highly specific resource recommendations")
    milestone: str = Field(description="A concrete project or task to prove mastery")

class RoadmapSchema(BaseModel):
    target_role: str = Field(description="The specific target job title")
    total_duration: str = Field(description="Expected total time, e.g. '3-6 months'")
    ai_narrative: str = Field(description="A 2-3 sentence encouraging overview of this strategy")
    items: List[RoadmapItem] = Field(description="The sequential list of milestones and skills to learn")


@router.post("/roadmap")
async def generate_roadmap(req: RoadmapRequest, user_data: tuple = Depends(get_current_user)):
    user, sb = user_data

    resume_result = sb.table("resumes").select("*").eq("user_id", user.id).execute()
    analysis_result = sb.table("resume_analysis").select("*").eq("user_id", user.id).execute()

    if not resume_result.data:
        raise HTTPException(status_code=404, detail="Please upload your resume first")

    resume = resume_result.data[0]
    analysis = analysis_result.data[0] if analysis_result.data else {}

    target_role = req.target_role or f"Senior {resume.get('industry', 'Tech')} Professional"

    job_context_text = ""
    if req.job_id:
        app_res = sb.table("applications").select("ai_feedback").eq("user_id", user.id).eq("job_id", req.job_id).execute()
        job_res = sb.table("jobs").select("title, requirements").eq("id", req.job_id).execute()
        
        if job_res.data:
            job = job_res.data[0]
            target_role = job.get("title", target_role)
            feedback = []
            if app_res.data and app_res.data[0].get("ai_feedback"):
                feedback = app_res.data[0]["ai_feedback"]
            
            job_context_text = f"\n\nCRUCIAL CONTEXT - SPECIFIC ROLE:\nThe candidate recently filed an application for the role of '{target_role}'.\n"
            if feedback:
                job_context_text += f"\nAn expert AI Hiring Coach reviewed their application for this specific role and gave the following critical feedback tips to improve:\n"
                for i, tip in enumerate(feedback):
                    job_context_text += f"{i+1}. {tip}\n"
                
            job_context_text += f"\nYour EXCLUSIVE mission is to build a roadmap that directly addresses these exact feedback points and prepares them for this specific role requirements: {job.get('requirements', '')}."

    system_prompt = """You are a world-class career coach and tech educator. Generate a detailed, actionable career roadmap for this professional.
IMPORTANT: Return strictly valid JSON conforming exactly to the requested schema. No markdown wrapping.
You MUST provide high-quality, real-world resources (e.g. popular Udemy courses, exact YouTube tutorials, AWS/Microsoft Learn official docs).
For URLs, construct highly targeted links if exact URLs cannot be verified. For video, use formatting like: https://www.youtube.com/results?search_query=Learn+React+Full+Course 
For paid courses, refer to Coursera or Udemy direct searches.

{format_instructions}
"""

    user_prompt = f"""Candidate Profile:
- Current Skills: {', '.join(resume.get('skills', [])[:15])}
- Experience: {resume.get('experience_years', 0)} years
- Education: {resume.get('education_level', 'bachelors')}
- Industry: {resume.get('industry', 'technology')}
- Seniority: {resume.get('seniority', 'junior')}
- Target Role: {target_role}
- Missing Skills Identified: {', '.join(analysis.get('missing_skills', [])[:8])}
- Current Weaknesses: {', '.join(analysis.get('weaknesses', [])[:3])}{job_context_text}

Generate a personalized 5-7 milestone roadmap to help this candidate reach the target role and overcome their weaknesses."""

    try:
        # Initialize LangChain setup
        llm = ChatGroq(api_key=settings.GROQ_API_KEY, model=settings.GROQ_MODEL, temperature=0.3)
        parser = PydanticOutputParser(pydantic_object=RoadmapSchema)
        
        prompt_template = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("user", user_prompt)
        ])
        
        chain = prompt_template | llm | parser
        
        parsed_roadmap = await chain.ainvoke({"format_instructions": parser.get_format_instructions()})
        roadmap_dict = parsed_roadmap.model_dump()
        
        roadmap_data = {
            "user_id": user.id,
            "target_role": roadmap_dict.get("target_role", target_role),
            "total_duration": roadmap_dict.get("total_duration", "3 months"),
            "ai_narrative": roadmap_dict.get("ai_narrative", ""),
            "items": roadmap_dict.get("items", []),
        }

        sb.table("roadmaps").insert(roadmap_data).execute()
        
        # We don't have usage stats directly from chain.ainvoke easily without callbacks, 
        # so we skip token tracking for LangChain calls or implement lightweight token counting later.

        return roadmap_dict
        
    except Exception as e:
        print(f"Error generating roadmap: {e}")
        # Fallback to empty state
        raise HTTPException(status_code=500, detail="Failed to synthesize roadmap dynamically.")



@router.get("/roadmap")
async def get_roadmap(user_data: tuple = Depends(get_current_user)):
    user, sb = user_data

    result = sb.table("roadmaps").select("*").eq("user_id", user.id).order("created_at", desc=True).limit(1).execute()
    if not result.data:
        # Check if they have an old one
        old_result = sb.table("roadmaps").select("*").eq("user_id", user.id).execute()
        if not old_result.data:
            raise HTTPException(status_code=404, detail="No roadmap found.")
        return old_result.data[0]
        
    return result.data[0]

@router.get("/roadmaps/history")
async def get_roadmap_history(user_data: tuple = Depends(get_current_user)):
    user, sb = user_data
    result = sb.table("roadmaps").select("*").eq("user_id", user.id).order("created_at", desc=True).execute()
    return {"history": result.data or []}

@router.get("/roadmap/{roadmap_id}")
async def get_roadmap_by_id(roadmap_id: str, user_data: tuple = Depends(get_current_user)):
    user, sb = user_data
    result = sb.table("roadmaps").select("*").eq("id", roadmap_id).eq("user_id", user.id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Roadmap not found or access denied.")
        
    return result.data[0]


class CompanyCreate(BaseModel):
    name: str
    description: Optional[str] = None
    website: Optional[str] = None
    industry: Optional[str] = None
    size: Optional[str] = None
    location: Optional[str] = None


@router.post("/company")
async def create_company(req: CompanyCreate, user_data: tuple = Depends(get_current_user)):
    user, sb = user_data

    existing = sb.table("companies").select("id").eq("owner_id", user.id).execute()
    if existing.data:
        result = sb.table("companies").update({
            "name": req.name,
            "description": req.description,
            "website": req.website,
            "industry": req.industry,
            "size": req.size,
            "location": req.location,
        }).eq("owner_id", user.id).execute()
        return result.data[0] if result.data else {}

    result = sb.table("companies").insert({
        "owner_id": user.id,
        "name": req.name,
        "description": req.description,
        "website": req.website,
        "industry": req.industry,
        "size": req.size,
        "location": req.location,
    }).execute()
    return result.data[0] if result.data else {}


@router.get("/company/me")
async def get_my_company(user_data: tuple = Depends(get_current_user)):
    user, sb = user_data
    result = sb.table("companies").select("*").eq("owner_id", user.id).execute()
    if not result.data:
        return None
    return result.data[0]


@router.get("/employer/stats")
async def get_employer_stats(user_data: tuple = Depends(get_current_user)):
    user, sb = user_data

    company = sb.table("companies").select("id").eq("owner_id", user.id).execute()
    if not company.data:
        return {"total_jobs": 0, "total_applications": 0, "shortlisted": 0, "hired": 0}

    company_id = company.data[0]["id"]
    jobs = sb.table("jobs").select("id").eq("company_id", company_id).execute()
    job_ids = [j["id"] for j in (jobs.data or [])]

    if not job_ids:
        return {"total_jobs": 0, "total_applications": 0, "shortlisted": 0, "hired": 0}

    apps = sb.table("applications").select("status").in_("job_id", job_ids).execute()
    apps_data = apps.data or []

    return {
        "total_jobs": len(job_ids),
        "total_applications": len(apps_data),
        "shortlisted": sum(1 for a in apps_data if a["status"] == "shortlisted"),
        "hired": sum(1 for a in apps_data if a["status"] == "hired"),
    }
