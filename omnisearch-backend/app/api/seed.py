from fastapi import APIRouter, HTTPException, Depends
from app.services import cohere_svc, pinecone_svc
from app.core.config import Settings, get_settings

router = APIRouter()

# --- REALISTIC ENTERPRISE DATA ---
# In a real company, this would come from a JSON file or a Database
INITIAL_KNOWLEDGE_BASE = [
    {
        "id": "doc_001",
        "title": "Standard SSO Configuration",
        "text": "To configure Okta SSO, navigate to the admin panel and paste the SAML 2.0 metadata URL.",
        "source": "Confluence",
        "role": "Junior Developer",
        "url": "https://help.okta.com/en-us/content/topics/apps/apps_app_integration_wizard_saml.htm"
    },
    {
        "id": "doc_002",
        "title": "Network Topology & Firewall Rules",
        "text": "The production cluster is behind a Palo Alto firewall. Inbound traffic is restricted to port 443.",
        "source": "Architecture-Docs",
        "role": "Senior Architect",
        "url": "https://www.paloaltonetworks.com/network-security/next-generation-firewall"
    },
    {
        "id": "doc_003",
        "title": "Q4 Performance Bonus Policy",
        "text": "Performance bonuses are calculated based on OKR completion. HR Managers must submit reviews by Dec 15th.",
        "source": "HR-Portal",
        "role": "HR Manager",
        "url": "https://www.workday.com/en-us/products/talent-management/performance-management.html"
    },
    {
        "id": "doc_004",
        "title": "Root Password Rotation Logic",
        "text": "Root passwords for the AWS Master Account are rotated every 30 days using AWS Secrets Manager.",
        "source": "Internal-Security",
        "role": "System Admin",
        "url": "https://aws.amazon.com/secrets-manager/"
    }
]


@router.get("/seed")
async def seed_database(settings: Settings = Depends(get_settings)):
    """
    FEATURE 7: Data Ingestion Pipeline.
    Converts raw text into vectors and pushes them to the Cloud.
    """
    try:
        processed_count = 0
        
        for item in INITIAL_KNOWLEDGE_BASE:
            # 1. Generate Vector (1024 dimensions via Cohere)
            vector = await cohere_svc.get_embeddings(item["text"])
            
            # 2. Prepare Metadata for RBAC (Feature 1)
            # Admin always gets access, plus the specific role assigned
            metadata = {
                "title": item["title"],
                "text": item["text"],
                "source": item["source"],
                "permitted_roles": [item["role"], "System Admin"],
                "url": item["url"]
            }
            
            # 3. Upsert to Pinecone
            await pinecone_svc.upsert_vector(
                id=item["id"],
                vector=vector,
                metadata=metadata
            )
            processed_count += 1
            
        return {
            "status": "Success",
            "message": f"Ingested {processed_count} enterprise documents into {settings.PINECONE_INDEX_NAME}",
            "rbac_layer": "Active"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Seeding failed: {str(e)}")