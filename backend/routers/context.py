"""
Context Window Router
Provides recall curve data for context window analysis
"""
from fastapi import APIRouter, HTTPException, Query
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm_logic import ContextTester
from models import RecallCurveResponse, RecallDataPoint

router = APIRouter()

# Initialize context tester
context_tester = ContextTester()


@router.get("/recall-curve", response_model=RecallCurveResponse)
async def get_recall_curve(max_tokens: int = Query(16000, ge=1000, le=32000)):
    """Get recall curve data for context window visualization"""
    try:
        # Calculate recall curve
        data = context_tester.calculate_recall_curve(max_tokens)
        
        # Convert to RecallDataPoint objects
        data_points = [
            RecallDataPoint(
                tokens=row['tokens'],
                position=row['position'],
                depth_pct=row.get('depth_pct', 0),
                recall=row['recall']
            )
            for row in data
        ]
        
        return RecallCurveResponse(data=data_points)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recall curve generation failed: {str(e)}")
