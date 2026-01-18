"""
Cost Analysis Router
Analyzes prompts and recommends optimal models
"""
from fastapi import APIRouter, HTTPException
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm_logic import SmartRouter
from models import (
    CostAnalysisRequest, CostAnalysisResponse, ModelInfo,
    Warning, BloatResult
)

router = APIRouter()

# Initialize components
smart_router = SmartRouter()


@router.post("/analyze", response_model=CostAnalysisResponse)
async def analyze_cost(request: CostAnalysisRequest):
    """Analyze prompt and recommend optimal model"""
    try:
        # Use SmartRouter to analyze
        analysis = smart_router.analyze_and_route(request.prompt)
        
        # Simple quality scoring based on prompt length and structure
        quality_score = 85  # Default
        warnings = []
        
        # Check for common issues
        if len(request.prompt) < 10:
            warnings.append(Warning(
                type="brevity",
                severity="medium",
                message="Prompt is very short",
                suggestion="Add more context for better results"
            ))
            quality_score -= 10
        
        if len(request.prompt) > 2000:
            warnings.append(Warning(
                type="verbosity",
                severity="low",
                message="Prompt is quite long",
                suggestion="Consider condensing to reduce costs"
            ))
        
        # Simple bloat detection
        words = request.prompt.lower().split()
        unique_words = set(words)
        repetition_score = (len(words) - len(unique_words)) / max(len(words), 1) * 100
        bloat_score = min(100, repetition_score * 2)
        
        bloat_recommendations = []
        if bloat_score > 30:
            bloat_recommendations.append("Reduce repetitive phrases")
        if bloat_score > 50:
            bloat_recommendations.append("Significant redundancy detected - rewrite for clarity")
        
        # Get recommended model info
        recommended_info = analysis['cost_analysis'][0]
        
        # Convert to ModelInfo
        recommended = ModelInfo(
            name=analysis['recommended_model'],
            cost=recommended_info['total_cost'],
            speed=recommended_info['latency'],
            quality=quality_score,
            description=f"{analysis['tier']} tier model"
        )
        
        # Convert all models
        all_models = [
            ModelInfo(
                name=m['model'],
                cost=m['total_cost'],
                speed=m['latency'],
                quality=85,  # Default quality
                description=f"${m['total_cost']:.6f} per request"
            )
            for m in analysis['cost_analysis']
        ]
        
        # Create bloat result
        bloat_analysis = BloatResult(
            bloat_score=int(bloat_score),
            repetition_score=int(repetition_score),
            recommendations=bloat_recommendations if bloat_recommendations else ["Prompt looks good"]
        )
        
        return CostAnalysisResponse(
            recommended=recommended,
            all_models=all_models,
            quality_warnings=warnings,
            bloat_analysis=bloat_analysis,
            cost_breakdown={
                "input_tokens": recommended_info['input_tokens'],
                "output_tokens": recommended_info['est_output_tokens'],
                "total_cost": recommended_info['total_cost']
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cost analysis failed: {str(e)}")


@router.get("/models")
async def get_models():
    """Get all available models with pricing"""
    try:
        from llm_logic import MODEL_CATALOG
        
        models = []
        for key, model in MODEL_CATALOG.items():
            models.append({
                "name": key,
                "full_name": model.name,
                "input_cost": model.input_cost_per_1k,
                "output_cost": model.output_cost_per_1k,
                "context_window": model.context_window,
                "speed_tier": model.speed_tier,
                "latency": model.latency
            })
        
        return {"models": models}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

