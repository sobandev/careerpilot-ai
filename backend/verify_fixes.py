import asyncio
import httpx
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

async def verify():
    print("Testing Backend Health...")
    async with httpx.AsyncClient() as client:
        resp = await client.get("http://localhost:8000/health")
        print("Health Status:", resp.status_code)
        
    print("\nTesting RLS (Anon querying Profiles)...")
    if SUPABASE_URL and SUPABASE_ANON_KEY:
        sb = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
        # Auth.uid() should be null, this should return empty string or throw error if RLS works
        res = sb.table("profiles").select("*").execute()
        print(f"RLS Prevented access? {len(res.data) == 0}")
    else:
        print("Missing Supabase credentials in env.")

if __name__ == "__main__":
    asyncio.run(verify())
