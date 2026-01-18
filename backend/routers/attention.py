"""
Attention Router
Analyzes attention patterns in transformers
"""
from fastapi import APIRouter, HTTPException
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm_logic import RealTransformerEngine
from models import AttentionRequest, AttentionResponse

router = APIRouter()

# Initialize transformer engine
transformer_engine = RealTransformerEngine()

# Initialize attention head profiler (lazy loading)
_profiler = None

def get_profiler():
    global _profiler
    if _profiler is None:
        try:
            from attention_profiler import AttentionHeadProfiler
            _profiler = AttentionHeadProfiler(transformer_engine)
        except Exception as e:
            print(f"Failed to initialize profiler: {e}")
    return _profiler


@router.post("/analyze", response_model=AttentionResponse)
async def analyze_attention(request: AttentionRequest):
    """Get attention weights for text"""
    try:
        # Get attention weights
        result = transformer_engine.get_attention_weights(request.text)
        
        # Extract specific layer and head
        attention_matrix = result['attention'][request.layer][request.head]
        
        # Convert to list of lists
        matrix_list = attention_matrix.tolist()
        
        return AttentionResponse(
            tokens=result['tokens'],
            attention_matrix=matrix_list,
            layer=request.layer,
            head=request.head
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Attention analysis failed: {str(e)}")


@router.get("/head-profiles")
async def get_head_profiles():
    """Get 3D visualization of attention head personalities"""
    try:
        profiler = get_profiler()
        if profiler is None:
            raise HTTPException(status_code=500, detail="Profiler not available")
        
        points = profiler.get_visualization_data()
        return {"points": points}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get head profiles: {str(e)}")


@router.get("/head-examples/{layer}/{head}")
async def get_head_examples(layer: int, head: int):
    """Get example sentences for a specific head"""
    try:
        profiler = get_profiler()
        if profiler is None:
            raise HTTPException(status_code=500, detail="Profiler not available")
        
        examples = profiler.get_head_examples(layer, head)
        return {"examples": examples}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get examples: {str(e)}")


@router.get("/cluster-info/{cluster_id}")
async def get_cluster_info(cluster_id: int):
    """Get information about a specific cluster"""
    try:
        profiler = get_profiler()
        if profiler is None:
            raise HTTPException(status_code=500, detail="Profiler not available")
        
        info = profiler.get_cluster_info(cluster_id)
        return info
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get cluster info: {str(e)}")


@router.get("/head-explanation/{layer}/{head}")
async def get_head_explanation(layer: int, head: int):
    """Get detailed explanation of why this head was classified into its cluster"""
    try:
        profiler = get_profiler()
        if profiler is None:
            raise HTTPException(status_code=500, detail="Profiler not available")
        
        explanation = profiler.get_head_explanation(layer, head)
        return explanation
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get explanation: {str(e)}")


@router.get("/layer-distribution")
async def get_layer_distribution():
    """Get distribution of cluster types across all 12 layers"""
    try:
        profiler = get_profiler()
        if profiler is None:
            raise HTTPException(status_code=500, detail="Profiler not available")
        
        distribution = profiler.get_layer_distribution()
        return {"distribution": distribution}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get distribution: {str(e)}")


@router.get("/metadata")
async def get_profiler_metadata():
    """Get profiler metadata including stability score and feature information"""
    try:
        profiler = get_profiler()
        if profiler is None:
            raise HTTPException(status_code=500, detail="Profiler not available")
        
        metadata = profiler.get_metadata()
        return metadata
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get metadata: {str(e)}")


