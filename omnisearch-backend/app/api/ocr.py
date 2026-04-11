from fastapi import APIRouter, HTTPException
from app.models.schemas import OCRRequest
from app.services import vision_svc

router = APIRouter()

@router.post("/ocr")
async def perform_ocr(req: OCRRequest):
    """
    FEATURE 3: Multi-modal Vision Ingestion.
    Takes a Base64 image and uses Gemini 1.5 Flash to extract technical text.
    """
    try:
        # 1. Validate that the image string isn't empty
        if not req.image:
            raise HTTPException(status_code=400, detail="No image data provided")

        # 2. Call the Vision Service (Gemini API)
        # We use 'await' because this is an external API call
        extracted_text = await vision_svc.analyze_image(req.image)
        
        return {
            "status": "Success",
            "text": extracted_text
        }
        
    except Exception as e:
        print(f"OCR ROUTE ERROR: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Vision processing failed: {str(e)}")