from fastapi import APIRouter, Depends
from app.core.config import get_settings, Settings
from app.core.security import get_rbac_filter
from app.services import pinecone_svc
from pydantic import BaseModel

class SearchRequest(BaseModel):
    query: str
    role: str

router = APIRouter()

@router.post("/search")
async def search(req: SearchRequest, settings: Settings = Depends(get_settings)):
    # 1. Get the RBAC Filter logic from security.py
    rbac_filter = get_rbac_filter(req.role)
    
    # 2. Use settings for API keys instead of os.environ
    api_key = settings.PINECONE_API_KEY
    
    # 3. Perform the filtered search
    results = await pinecone_svc.search(
        query=req.query, 
        rbac_filter=rbac_filter,
        api_key=api_key
    )
    
    return results