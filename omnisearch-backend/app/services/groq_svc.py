import os
from groq import Groq
import json
from app.core.config import get_settings

settings = get_settings()

async def expand_query(query: str):
    client = Groq(api_key=settings.GROQ_API_KEY)
    
    # The prompt MUST contain the word 'json'
    prompt = f"""
   
    You are an IT helper. Take the user query and give 3 synonyms. Keep it simple.
    
    User Query: "{query}"
    
    Output the results strictly in JSON format with the key 'variations'.
    Example: {{"variations": ["var1", "var2", "var3"]}}
    """
    
    try:
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                # Added a system message for better enterprise-grade logic
                {"role": "system", "content": "You output only valid json."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"} # This requires 'json' in the prompt
        )
        
        data = json.loads(completion.choices[0].message.content)
        variations = [str(v) for v in data.get("variations", [query])]
        return variations
        
    except Exception as e:
        print(f"Groq logic failed: {e}")
        return [query] # Fallback to original query so search doesn't crash
    
    #  You are an IT search optimization engine. 
    # Convert the user query into 3 technical variations.