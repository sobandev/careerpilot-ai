from fastapi import HTTPException, Header, Request, Depends
from app.core.supabase import get_supabase

# Read HttpOnly cookie primarily, fallback to Header for testing
async def get_token_from_request(request: Request, authorization: str = Header(None)) -> str:
    token = request.cookies.get("access_token")
    if not token and authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return token

async def get_current_user(token: str = Depends(get_token_from_request)):
    sb = get_supabase(token)
    try:
        user_resp = sb.auth.get_user(token)
        return user_resp.user, sb
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
