from typing import List, Set
import re

# Comprehensive skill keyword database
SKILLS_DB = {
    # Programming Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "ruby", "php",
    "swift", "kotlin", "scala", "r", "matlab", "perl", "bash", "shell scripting",
    # Frontend
    "react", "next.js", "vue", "angular", "svelte", "html", "css", "tailwind", "sass",
    "redux", "zustand", "graphql", "webpack", "vite", "jquery", "bootstrap",
    # Backend
    "node.js", "express", "fastapi", "django", "flask", "spring boot", "laravel",
    "rails", "asp.net", "nestjs", "hapi",
    # Databases
    "postgresql", "mysql", "mongodb", "redis", "sqlite", "elasticsearch", "cassandra",
    "dynamodb", "firestore", "supabase", "oracle", "sql server",
    # Cloud & DevOps
    "aws", "azure", "gcp", "google cloud", "docker", "kubernetes", "terraform", "ansible",
    "jenkins", "github actions", "ci/cd", "linux", "nginx", "apache",
    # AI / ML
    "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn",
    "hugging face", "langchain", "openai", "nlp", "computer vision", "llm",
    "data science", "pandas", "numpy", "matplotlib", "seaborn",
    # Mobile
    "react native", "flutter", "android", "ios", "swift", "xcode",
    # Tools & Practices
    "git", "github", "jira", "agile", "scrum", "rest api", "microservices",
    "unit testing", "tdd", "figma", "photoshop", "illustrator",
    # Soft Skills
    "leadership", "communication", "teamwork", "problem solving", "project management",
    "critical thinking", "time management",
    # Business
    "excel", "power bi", "tableau", "sql", "salesforce", "hubspot", "seo", "google analytics",
}

# Map to canonical names
SKILL_ALIASES = {
    "react.js": "react",
    "reactjs": "react",
    "nodejs": "node.js",
    "nextjs": "next.js",
    "vuejs": "vue",
    "angular.js": "angular",
    "postgres": "postgresql",
    "mongo": "mongodb",
    "k8s": "kubernetes",
    "tf": "tensorflow",
    "sklearn": "scikit-learn",
    "ml": "machine learning",
    "dl": "deep learning",
    "ai": "artificial intelligence",
}


def _normalize(skill: str) -> str:
    return SKILL_ALIASES.get(skill.lower().strip(), skill.lower().strip())


def extract_skills(text: str) -> List[str]:
    """Extract skills from resume text using keyword matching."""
    text_lower = text.lower()
    found: Set[str] = set()

    for skill in SKILLS_DB:
        # Use word boundary matching for short skills to avoid false positives
        pattern = r'\b' + re.escape(skill) + r'\b'
        if re.search(pattern, text_lower):
            found.add(skill)

    # Check aliases
    for alias, canonical in SKILL_ALIASES.items():
        pattern = r'\b' + re.escape(alias) + r'\b'
        if re.search(pattern, text_lower):
            found.add(canonical)

    return sorted(list(found))


def get_missing_skills(user_skills: List[str], job_skills: List[str]) -> List[str]:
    """Return skills in job that are missing from user profile."""
    user_set = {_normalize(s) for s in user_skills}
    return [s for s in job_skills if _normalize(s) not in user_set]


def get_in_demand_skills(industry: str) -> List[str]:
    """Return in-demand skills for a given industry."""
    demand_map = {
        "technology": ["docker", "kubernetes", "aws", "react", "python", "typescript", "graphql",
                       "machine learning", "ci/cd", "microservices"],
        "finance": ["excel", "python", "sql", "tableau", "power bi", "bloomberg", "financial modeling"],
        "marketing": ["seo", "google analytics", "hubspot", "content marketing", "social media", "figma"],
        "healthcare": ["ehr", "medical coding", "clinical research", "hipaa", "python", "data analysis"],
        "design": ["figma", "adobe xd", "photoshop", "illustrator", "ux research", "prototyping"],
        "education": ["curriculum development", "lms", "e-learning", "communication", "python"],
        "sales": ["salesforce", "crm", "hubspot", "negotiation", "communication", "excel"],
    }
    return demand_map.get(industry, ["python", "sql", "excel", "communication", "git"])
