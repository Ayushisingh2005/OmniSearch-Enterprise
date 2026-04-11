from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    # App Settings
    APP_NAME: str = "OmniSearch Enterprise API"
    DEBUG_MODE: bool = False
    
    # FEATURE 4: Groq API
    GROQ_API_KEY: str
    
    # FEATURE 3: Gemini API
    GEMINI_API_KEY: str
    
    # FEATURE 1: Pinecone Settings
    PINECONE_API_KEY: str
    PINECONE_INDEX_NAME: str
    
    # FEATURE 2: Cohere Settings
    COHERE_API_KEY: str
    
    # FEATURE 6: Redis Cache (Optional)
    REDIS_URL: str = "redis://localhost:6379"

    # Load from .env file
    model_config = SettingsConfigDict(env_file=".env")

@lru_cache()
def get_settings():
    """Returns a cached instance of settings (Standard FastAPI pattern)"""
    return Settings()