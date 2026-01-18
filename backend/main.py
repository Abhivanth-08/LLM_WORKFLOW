"""
FastAPI Main Application
LLM Engineer Pro Backend
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import sys

# Add parent directory to path to import from main project
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

# Force reload attention_profiler module to pick up code changes
import importlib
try:
    import attention_profiler
    importlib.reload(attention_profiler)
    print("✓ Reloaded attention_profiler module")
except Exception as e:
    print(f"Note: Could not reload attention_profiler: {e}")


# Import routers
from routers import (
    tokenizer,
    cost,
    security,
    embeddings,
    attention,
    context
)

# Create FastAPI app
app = FastAPI(
    title="LLM Internals Explorer API",
    description="Backend for visualizing transformer internals with real models",
    version="2.0.0"
)

# Configure CORS
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:8080").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(tokenizer.router, prefix="/api/tokenizer", tags=["Tokenizer"])
app.include_router(cost.router, prefix="/api/cost", tags=["Cost Analysis"])
app.include_router(security.router, prefix="/api/security", tags=["Security"])
app.include_router(embeddings.router, prefix="/api/embeddings", tags=["Embeddings"])
app.include_router(attention.router, prefix="/api/attention", tags=["Attention"])
app.include_router(context.router, prefix="/api/context", tags=["Context Window"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "LLM Engineer Pro API",
        "version": "1.0.0",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "LLM Engineer Pro API"
    }


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
