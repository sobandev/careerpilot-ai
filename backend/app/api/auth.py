from fastapi import APIRouter, HTTPException, Header, Response, Depends, Request
from pydantic import BaseModel
from app.core.supabase import get_supabase
from app.core.dependencies import get_current_user, get_token_from_request

router = APIRouter()


class RegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    role: str  # "jobseeker" or "employer"


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/register")
async def register(req: RegisterRequest):
    sb = get_supabase()
    try:
        result = sb.auth.sign_up({
            "email": req.email,
            "password": req.password,
            "options": {
                "data": {
                    "full_name": req.full_name,
                    "role": req.role
                }
            }
        })
        return {"message": "Registration successful", "user_id": result.user.id if result.user else None}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(req: LoginRequest, response: Response):
    sb = get_supabase()
    try:
        result = sb.auth.sign_in_with_password({
            "email": req.email,
            "password": req.password
        })
        
        token = result.session.access_token
        refresh_token = result.session.refresh_token
        auth_sb = get_supabase(token)
        
        # Ensure profile exists
        profile_check = auth_sb.table("profiles").select("id").eq("id", result.user.id).execute()
        if not profile_check.data:
            auth_sb.table("profiles").insert({
                "id": result.user.id,
                "email": result.user.email,
                "full_name": result.user.user_metadata.get("full_name", ""),
                "role": result.user.user_metadata.get("role", "jobseeker")
            }).execute()

        # Set HttpOnly cookies
        response.set_cookie(key="access_token", value=token, httponly=True, secure=True, samesite="none", max_age=3600)
        response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True, samesite="none", max_age=604800)

        return {
            "user": {
                "id": result.user.id,
                "email": result.user.email,
                "full_name": result.user.user_metadata.get("full_name", ""),
                "role": result.user.user_metadata.get("role", "jobseeker"),
            }
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")



@router.post("/logout")
async def logout(response: Response, token: str = Depends(get_token_from_request)):
    try:
        auth_sb = get_supabase(token)
        auth_sb.auth.sign_out()
    except Exception:
        pass
            
    # Always clear cookies to ensure client is logged out locally
    response.delete_cookie("access_token", httponly=True, secure=True, samesite="none")
    response.delete_cookie("refresh_token", httponly=True, secure=True, samesite="none")
    
    return {"message": "Logged out successfully"}


@router.get("/me")
async def get_me(user_data: tuple = Depends(get_current_user)):
    user, sb = user_data
    try:
        profile_q = sb.table("profiles").select("*").eq("id", user.id).execute()
        
        if not profile_q.data:
            sb.table("profiles").insert({
                "id": user.id,
                "email": user.email,
                "full_name": user.user_metadata.get("full_name", ""),
                "role": user.user_metadata.get("role", "jobseeker")
            }).execute()
            profile_q = sb.table("profiles").select("*").eq("id", user.id).execute()
            
        return profile_q.data[0] if profile_q.data else None
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid token")
