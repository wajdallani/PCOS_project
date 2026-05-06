import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # Groq Configuration
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY")
    
    # LangSmith Configuration
    LANGCHAIN_TRACING_V2: str = os.getenv("LANGCHAIN_TRACING_V2", "false")
    LANGCHAIN_API_KEY: str = os.getenv("LANGCHAIN_API_KEY")
    LANGCHAIN_PROJECT: str = os.getenv("LANGCHAIN_PROJECT", "OvaCare-PCOS")
    
    # LLM Configuration
    LLM_MODEL: str = "llama-3.3-70b-versatile"  # Fast & powerful on Groq
    TEMPERATURE: float = 0.0  # Zero for consistent medical responses
    
    # App Info
    PROJECT_NAME: str = "ovacare-pcos-test"
    VERSION: str = "0.1.0"

settings = Settings()

# Verify setup
print("âœ… LangSmith Tracing:", settings.LANGCHAIN_TRACING_V2)
print("âœ… Groq Model:", settings.LLM_MODEL)
