"""
Tokenizer Router
Tokenizes text using the existing TokenCounter logic
"""
from fastapi import APIRouter, HTTPException
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from llm_logic import TokenCounter
from models import TokenizeRequest, TokenizeResponse, Token

router = APIRouter()

# Initialize token counter
token_counter = TokenCounter()


@router.post("/tokenize", response_model=TokenizeResponse)
async def tokenize_text(request: TokenizeRequest):
    """Tokenize input text and return tokens with IDs"""
    try:
        # Get token IDs
        token_ids = token_counter.get_token_ids(request.text)
        
        # Decode tokens
        decoded_tokens = token_counter.decode_tokens(token_ids)
        
        # Create token objects
        tokens = [
            Token(text=text, id=tid)
            for tid, text in zip(token_ids, decoded_tokens)
        ]
        
        # Calculate stats
        stats = {
            "characters": len(request.text),
            "tokens": len(tokens),
            "compressionRatio": round(len(request.text) / max(len(tokens), 1), 2)
        }
        
        return TokenizeResponse(tokens=tokens, stats=stats)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tokenization failed: {str(e)}")
