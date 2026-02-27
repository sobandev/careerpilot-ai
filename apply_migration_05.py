import os
import psycopg2
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), "backend", ".env"))
db_url = os.environ.get("DATABASE_URL")

sql = """
ALTER TABLE applications
ADD COLUMN IF NOT EXISTS contact_email TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT;
"""

print(f"Connecting to {db_url}...")
with psycopg2.connect(db_url) as conn:
    print("Executing SQL...")
    with conn.cursor() as cur:
        cur.execute(sql)
    conn.commit()

print("Migration successful.")
