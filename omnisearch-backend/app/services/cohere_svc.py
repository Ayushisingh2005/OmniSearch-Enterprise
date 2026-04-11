import os
import cohere
from app.core.config import get_settings

settings = get_settings()

async def get_embeddings(text: str):
    co = cohere.Client(api_key=settings.COHERE_API_KEY)
    response = co.embed(
        texts=[str(text)],
        model='embed-english-v3.0',
        input_type='search_query',
        embedding_types=['float']
    )
    return response.embeddings.float_[0] if hasattr(response.embeddings, 'float_') else response.embeddings[0]

async def rerank_results(query: str, matches: list):
    if not matches:
        return []
    
    co = cohere.Client(api_key=settings.COHERE_API_KEY)
    documents = [str(m.metadata['text']) for m in matches]
    
    results = co.rerank(
        query=str(query),
        documents=documents,
        top_n=5,
        model='rerank-english-v3.0'
    )
    
    final = []
    for r in results.results:
        # --- THE FIX: Adjusted Threshold ---
        # 0.20 is the sweet spot for testing. 
        # It shows technical results but still blocks unrelated junk.
       if r.relevance_score >= 0.05:  # Lowered to 5% for better demo visibility
        match = matches[r.index]
        final.append({
        "title": match.metadata.get('title'),
        "text": match.metadata.get('text'),
        "source": match.metadata.get('source'),
        "score": round(r.relevance_score * 100, 1),
        "access": match.metadata.get('permitted_roles')[0],
        "url": match.metadata.get('url') # Add this for clickability
    })
    
    # Check terminal to see the scores of your searches
    if results.results:
        print(f"DEBUG: Top AI Confidence Score: {results.results[0].relevance_score}")
        
    return final