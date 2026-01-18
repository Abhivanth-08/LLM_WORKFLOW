# FastAPI Backend - Quick Start

## Installation

```bash
cd api
pip install -r requirements.txt
```

## Running the Server

```bash
# From the api directory
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Documentation

Once running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Endpoints

### Dashboard
- `GET /api/dashboard/stats` - Current statistics
- `GET /api/dashboard/activity` - Recent activity
- `GET /api/dashboard/usage` - 7-day usage data

### Tokenizer
- `POST /api/tokenizer/tokenize` - Tokenize text

### Cost Analysis
- `POST /api/cost/analyze` - Analyze prompt and recommend model
- `GET /api/cost/models` - Get all available models

### Analytics
- `GET /api/analytics/monthly-report` - Generate monthly report
- `GET /api/analytics/cost-trend` - Cost trend data
- `GET /api/analytics/quality-trend` - Quality trend data
- `GET /api/analytics/bloat-trend` - Bloat trend data

### Security
- `POST /api/security/analyze` - Analyze security risks

### Embeddings
- `POST /api/embeddings/generate` - Generate embeddings

### Attention
- `POST /api/attention/analyze` - Get attention weights

### Context Window
- `GET /api/context/recall-curve` - Get recall curve data

## Testing

```bash
# Health check
curl http://localhost:8000/health

# Test tokenizer
curl -X POST http://localhost:8000/api/tokenizer/tokenize \
  -H "Content-Type: application/json" \
  -d '{"text": "Hello world"}'

# Test dashboard stats
curl http://localhost:8000/api/dashboard/stats
```

## Environment Variables

Edit `api/.env`:
```
DATABASE_PATH=../llm_workflow.db
CORS_ORIGINS=http://localhost:8080
API_PORT=8000
```
