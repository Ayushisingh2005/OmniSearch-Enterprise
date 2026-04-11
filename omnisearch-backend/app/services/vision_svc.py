import os
import google.generativeai as genai
import base64
from app.core.config import get_settings

settings = get_settings()

async def analyze_image(base64_image: str):
    # 1. Configure the API
    genai.configure(api_key=settings.GEMINI_API_KEY)
    
    # 2. AUTO-DISCOVERY: Find a model that works for your account
    available_models = []
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                available_models.append(m.name)
        
        print(f"DEBUG: Found these models on your account: {available_models}")
        
        # Priority list: we want Flash 1.5, then Pro 1.5, then Pro 1.0
        selected_model = None
        for target in ['models/gemini-1.5-flash', 'models/gemini-1.5-pro', 'models/gemini-pro-vision']:
            if target in available_models:
                selected_model = target
                break
        
        # Fallback to the first available model if targets aren't found
        if not selected_model and available_models:
            selected_model = available_models[0]
            
        if not selected_model:
            return "Vision Error: No compatible Gemini models found on this API key."

        print(f"DEBUG: Selected working model: {selected_model}")
        model = genai.GenerativeModel(selected_model)

        # 3. Process the image
        if "," in base64_image:
            base64_data = base64_image.split(",")[1]
        else:
            base64_data = base64_image
        image_bytes = base64.b64decode(base64_data)

        response = model.generate_content([
            "Extract all technical text and describe this diagram for an IT index.",
            {"mime_type": "image/jpeg", "data": image_bytes}
        ])
        
        return response.text

    except Exception as e:
        print(f"CRITICAL ERROR: {str(e)}")
        return f"Vision Service Failed. Error: {str(e)}"