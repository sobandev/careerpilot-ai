
import os
import sys
from dotenv import load_dotenv
load_dotenv()

# Add current directory to path so we can import app modules
sys.path.append(os.getcwd())

from app.core.supabase import get_supabase

def debug_relationships():
    sb = get_supabase()
    
    # IDs from user report
    job_id = "ef217635-d810-4076-b22a-72aae8b6c69b"
    app_id = "1fa51434-33f6-43ed-991e-f45645c643a8"
    
    print(f"--- Debugging Job: {job_id} ---")
    job = sb.table("jobs").select("*").eq("id", job_id).execute()
    if not job.data:
        print("❌ Job NOT FOUND")
        return
    
    job_data = job.data[0]
    company_id = job_data.get("company_id")
    print(f"✅ Job Found. Linked to Company ID: {company_id}")
    
    print(f"--- Debugging Company: {company_id} ---")
    company = sb.table("companies").select("*").eq("id", company_id).execute()
    if not company.data:
        print("❌ Company NOT FOUND")
    else:
        company_data = company.data[0]
        owner_id = company_data.get("owner_id")
        print(f"✅ Company Found. Owned by User ID: {owner_id}")
        
    print(f"--- Debugging Application: {app_id} ---")
    app = sb.table("applications").select("*").eq("id", app_id).execute()
    if not app.data:
        print("❌ Application NOT FOUND")
    else:
        app_data = app.data[0]
        linked_job_id = app_data.get("job_id")
        match_score = app_data.get("match_score")
        print(f"✅ Application Found.")
        print(f"   Linked Job ID: {linked_job_id}")
        print(f"   Match Score: {match_score}")
        
        if linked_job_id != job_id:
            print(f"❌ MISMATCH: Application links to Job {linked_job_id}, expected {job_id}")
        else:
            print("✅ linkage correct.")

if __name__ == "__main__":
    debug_relationships()
