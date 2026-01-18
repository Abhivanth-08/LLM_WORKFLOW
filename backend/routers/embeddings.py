"""
Embeddings Router
Generates embeddings and 3D visualizations
"""
from fastapi import APIRouter, HTTPException
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm_logic import EmbeddingLab
from models import EmbeddingRequest, EmbeddingResponse, EmbeddingPoint

router = APIRouter()

# Initialize embedding lab
embedding_lab = EmbeddingLab()


@router.post("/generate", response_model=EmbeddingResponse)
async def generate_embeddings(request: EmbeddingRequest):
    """Generate embeddings and return 3D projection"""
    try:
        # Use the same method as Streamlit for consistency
        # This includes reference vocabulary for stable PCA projection
        points_data = embedding_lab.get_projection_2d(request.texts)
        
        # Convert to response format
        points = [
            EmbeddingPoint(
                text=point["text"],
                x=point["x"],
                y=point["y"],
                z=point["z"],
                cluster=point["cluster"]
            )
            for point in points_data
        ]
        
        return EmbeddingResponse(points=points)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Embedding generation failed: {str(e)}")
