from pydantic import BaseModel
from typing import List, Optional

class SearchRequest(BaseModel):
    query: str
    role: str

class OCRRequest(BaseModel):
    image: str  # Base64 string