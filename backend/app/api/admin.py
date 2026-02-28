from fastapi import APIRouter, HTTPException, Depends, Header, Request
from app.core.supabase import get_supabase
from app.core.config import settings
from typing import Optional

router = APIRouter()

async def verify_admin_access(request: Request):
    """
    Validates if the requester is an Admin.
    Allows bypass if X-Admin-Key matches the server configuration.
    """
    # 1. Check Secret Key bypass
    x_admin_key = request.headers.get("x-admin-key")
    if x_admin_key and getattr(settings, "ADMIN_SECRET_KEY", None):
        if x_admin_key == settings.ADMIN_SECRET_KEY:
            return get_supabase() # Return raw client

    # 2. Check JWT Token Auth
    authorization = request.headers.get("authorization")
    token = request.cookies.get("access_token")
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]

    if not token:
        raise HTTPException(status_code=401, detail="Unauthorized")

    sb = get_supabase(token)
    try:
        user_resp = sb.auth.get_user(token)
        user = user_resp.user
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    # Check if the user's role is admin
    profile = sb.table("profiles").select("role").eq("id", user.id).execute()
    if not profile.data or profile.data[0].get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden. Admin access required.")
        
    return sb


@router.get("/stats")
async def get_admin_stats(sb = Depends(verify_admin_access)):
    """Fetch high-level platform metrics."""
    try:
        # We can use the counts from Supabase.
        # Since standard users might not have read access to everything, 
        # the Service Role Key would be ideal here if strict RLS blocks us, 
        # but for now we lean on the authenticated admin's Supabase client.
        
        users_resp = sb.table("profiles").select("id", count="exact").execute()
        jobs_resp = sb.table("jobs").select("id", count="exact").execute()
        apps_resp = sb.table("applications").select("id", count="exact").execute()
        
        return {
            "total_users": users_resp.count if hasattr(users_resp, 'count') else len(users_resp.data),
            "total_jobs": jobs_resp.count if hasattr(jobs_resp, 'count') else len(jobs_resp.data),
            "total_applications": apps_resp.count if hasattr(apps_resp, 'count') else len(apps_resp.data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/users")
async def list_users(sb = Depends(verify_admin_access)):
    """Fetch all registered users and their roles."""
    try:
        profiles = sb.table("profiles").select("*").order("created_at", desc=True).execute()
        return profiles.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
