from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import resume, jobs, applications, ai_routes, auth, profiles
from app.core.config import settings

app = FastAPI(
    title="CareerPilot AI API",
    description="AI-powered job portal backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(resume.router, prefix="/api/resume", tags=["Resume"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(ai_routes.router, prefix="/api/ai", tags=["AI"])
app.include_router(profiles.router, prefix="/api/profiles", tags=["Profiles"])


@app.get("/")
def root():
    return {"message": "CareerPilot AI API is running 🚀"}


@app.get("/health")
def health():
    return {"status": "ok"}
