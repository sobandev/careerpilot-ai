from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    GROQ_API_KEY: str
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    FRONTEND_URL: str = "http://localhost:3000"
    GROQ_MODEL: str = "llama-3.1-8b-instant"

    class Config:
        env_file = ".env"


settings = Settings()
