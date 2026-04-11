from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 1. Import BOTH routers and give them unique aliases (names)
from app.api.endpoints import router as api_router
from app.api.seed import router as seed_router
from app.api.ocr import router as ocr_router 

app = FastAPI(title="OmniSearch Enterprise API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Include BOTH routers separately
app.include_router(api_router, prefix="/api/v1", tags=["Search"])
app.include_router(seed_router, prefix="/api/v1", tags=["Admin"])
app.include_router(ocr_router, prefix="/api/v1", tags=["OCR"])
@app.get("/")
async def root():
    return {"status": "Online"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)