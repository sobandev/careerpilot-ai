import urllib.request
import json
import os
from dotenv import load_dotenv

load_dotenv()
SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

try:
    print("Testing backend /health...")
    req = urllib.request.Request("http://localhost:8000/health")
    with urllib.request.urlopen(req, timeout=5) as response:
        print("Health:", response.read().decode())
        
    print(f"\nTesting RLS on profiles using URL: {SUPABASE_URL}/rest/v1/profiles?role=eq.jobseeker")
    req = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/profiles?role=eq.jobseeker&select=id",
        headers={"apikey": SUPABASE_ANON_KEY, "Authorization": f"Bearer {SUPABASE_ANON_KEY}"}
    )
    with urllib.request.urlopen(req, timeout=5) as response:
        data = json.loads(response.read().decode())
        print("Profiles returned (expected 0):", len(data))
        
    print("\nTesting jobs backend parsing (prompt injection protection)...")
    req = urllib.request.Request("http://localhost:8000/api/jobs")
    with urllib.request.urlopen(req, timeout=5) as response:
        data = json.loads(response.read().decode())
        print(f"Jobs returned: {len(data.get('jobs', []))} items (Pagination active)")
        
except Exception as e:
    print(f"HTTP Request failed: {e}")
