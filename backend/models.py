"""
Pydantic Models for API Request/Response Validation
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime


# ============================================================
# TOKENIZER MODELS
# ============================================================

class TokenizeRequest(BaseModel):
    text: str = Field(..., description="Text to tokenize")


class Token(BaseModel):
    text: str
    id: int


class TokenizeResponse(BaseModel):
    tokens: List[Token]
    stats: Dict[str, Any] = Field(default_factory=dict)


# ============================================================
# COST ANALYSIS MODELS
# ============================================================

class CostAnalysisRequest(BaseModel):
    prompt: str
    system_prompt: Optional[str] = ""
    complexity: int = Field(2, ge=1, le=4)
    priority: str = Field("quality", pattern="^(quality|speed|cost)$")


class ModelInfo(BaseModel):
    name: str
    cost: float
    speed: float
    quality: int
    description: str


class Warning(BaseModel):
    type: str
    severity: str
    message: str
    suggestion: str


class BloatResult(BaseModel):
    bloat_score: float
    repetition_score: float
    recommendations: List[str]


class CostAnalysisResponse(BaseModel):
    recommended: ModelInfo
    all_models: List[ModelInfo]
    quality_warnings: List[Warning]
    bloat_analysis: BloatResult
    cost_breakdown: Dict[str, Any]


# ============================================================
# DASHBOARD MODELS
# ============================================================

class DashboardStats(BaseModel):
    total_tokens: int
    api_calls_today: int
    avg_response_time: float
    cost_this_month: float
    changes: Dict[str, float]


class Activity(BaseModel):
    action: str
    module: str
    timestamp: str


class DashboardActivityResponse(BaseModel):
    activities: List[Activity]


class UsageDataPoint(BaseModel):
    date: str
    tokens: int


class DashboardUsageResponse(BaseModel):
    usage_data: List[UsageDataPoint]


# ============================================================
# ANALYTICS MODELS
# ============================================================

class MonthlyReportRequest(BaseModel):
    year: int
    month: int = Field(..., ge=1, le=12)


class MonthlyReportResponse(BaseModel):
    executive_summary: Dict[str, Any]
    cost_analysis: Dict[str, Any]
    quality_metrics: Dict[str, Any]
    bloat_metrics: Dict[str, Any]
    recommendations: List[str]


class TrendDataPoint(BaseModel):
    date: str
    value: float


class TrendResponse(BaseModel):
    data: List[TrendDataPoint]


# ============================================================
# SECURITY MODELS
# ============================================================

class SecurityAnalysisRequest(BaseModel):
    prompt: str
    system_prompt: Optional[str] = ""


class SecurityFlag(BaseModel):
    type: str
    description: str


class SecurityAnalysisResponse(BaseModel):
    risk_score: int
    flags: List[SecurityFlag]
    is_safe: bool


# ============================================================
# EMBEDDINGS MODELS
# ============================================================

class EmbeddingRequest(BaseModel):
    texts: List[str]


class EmbeddingPoint(BaseModel):
    text: str
    x: float
    y: float
    z: float
    cluster: str


class EmbeddingResponse(BaseModel):
    points: List[EmbeddingPoint]


# ============================================================
# ATTENTION MODELS
# ============================================================

class AttentionRequest(BaseModel):
    text: str
    layer: int = 0
    head: int = 0


class AttentionResponse(BaseModel):
    tokens: List[str]
    attention_matrix: List[List[float]]
    layer: int
    head: int


# ============================================================
# CONTEXT WINDOW MODELS
# ============================================================

class RecallDataPoint(BaseModel):
    tokens: int
    position: str
    depth_pct: float
    recall: float


class RecallCurveResponse(BaseModel):
    data: List[RecallDataPoint]
