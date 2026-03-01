import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "backend", ".env"))
db_url = os.environ.get("DATABASE_URL")

with open(os.path.join(os.path.dirname(__file__), "database", "06_add_application_ai_feedback.sql"), "r") as f:
    sql = f.read()

print(f"Connecting to {db_url}...")
with psycopg2.connect(db_url) as conn:
    print("Executing SQL: 06_add_application_ai_feedback.sql...")
    with conn.cursor() as cur:
        cur.execute(sql)
    conn.commit()

print("Migration successful.")
