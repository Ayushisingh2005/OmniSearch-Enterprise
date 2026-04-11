import os
from pinecone import Pinecone
from app.core.config import get_settings

settings = get_settings()
pc = Pinecone(api_key=settings.PINECONE_API_KEY)
index = pc.Index(settings.PINECONE_INDEX_NAME)

async def vector_search(vector: list, role: str):
    """
    FEATURE 1: Secure Search with Role Hierarchy.
    """
    try:
        # Define what each role is ALLOWED to see
        # This is the "Heavy" Enterprise logic
        hierarchy = {
            "Junior Developer": ["Junior Developer", "Public"],
            "Senior Architect": ["Senior Architect", "Junior Developer", "Public"],
            "HR Manager": ["HR Manager", "Public"],
            "System Admin": ["System Admin", "Senior Architect", "HR Manager", "Junior Developer", "Public"]
        }
        
        # Get the list of allowed roles for the current user
        allowed_roles = hierarchy.get(role, ["Public"])

        print(f"DEBUG: Role '{role}' is searching with access to: {allowed_roles}")

        results = index.query(
            vector=vector,
            top_k=10,
            include_metadata=True,
            # FIXED: Now matches ANY role in the user's hierarchy
            filter={
                "permitted_roles": {"$in": allowed_roles}
            }
        )
        return results.matches
    except Exception as e:
        print(f"Pinecone Error: {e}")
        raise e

async def upsert_vector(id: str, vector: list, metadata: dict):
    try:
        # Standard upsert format
        index.upsert(vectors=[{"id": id, "values": vector, "metadata": metadata}])
        return True
    except Exception as e:
        print(f"Upsert Error: {e}")
        raise e