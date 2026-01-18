"""
Security Router
Analyzes prompts for security risks
"""
from fastapi import APIRouter, HTTPException
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm_logic import AgnoSecurityAnalyzer
from models import SecurityAnalysisRequest, SecurityAnalysisResponse, SecurityFlag

router = APIRouter()

# Initialize security analyzer
sec_analyzer = AgnoSecurityAnalyzer()


@router.post("/analyze", response_model=SecurityAnalysisResponse)
async def analyze_security(request: SecurityAnalysisRequest):
    """Analyze prompt for security risks"""
    try:
        # Analyze risk
        result = sec_analyzer.analyze_risk(request.prompt)
        
        # Convert flags to SecurityFlag objects
        flags = [
            SecurityFlag(
                type=flag.split(":")[0] if ":" in flag else "general",
                description=flag
            )
            for flag in result.get('flags', [])
        ]
        
        # Add recommendations as additional flags if present
        if 'recommendations' in result:
            for rec in result['recommendations']:
                flags.append(SecurityFlag(
                    type="recommendation",
                    description=rec
                ))
        
        return SecurityAnalysisResponse(
            risk_score=result['score'],
            flags=flags,
            is_safe=result['status'] in ['SAFE', 'WARNING']
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Security analysis failed: {str(e)}")

