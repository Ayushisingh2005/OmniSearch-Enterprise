from enum import Enum
from fastapi import HTTPException, status

class UserRole(str, Enum):
    JUNIOR = "Junior Developer"
    SENIOR = "Senior Architect"
    HR = "HR Manager"
    ADMIN = "System Admin"

# Define what each role is allowed to see (Metadata Filter Levels)
ROLE_PERMISSIONS = {
    UserRole.JUNIOR: ["Public", "Junior Developer"],
    UserRole.SENIOR: ["Public", "Junior Developer", "Senior Architect"],
    UserRole.HR: ["Public", "HR Manager"],
    UserRole.ADMIN: ["Public", "Junior Developer", "Senior Architect", "HR Manager", "System Admin"]
}

def get_rbac_filter(role: str):
    """
    FEATURE 1: Generates the Pinecone Metadata Filter based on user role.
    This ensures the database only returns what the user is allowed to see.
    """
    try:
        user_role = UserRole(role)
        allowed_levels = ROLE_PERMISSIONS.get(user_role, ["Public"])
        
        # This format is exactly what Pinecone's filter expects
        return {"permitted_roles": {"$in": allowed_levels}}
    
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid security role provided"
        )

def verify_access(requested_doc_role: str, user_role: str) -> bool:
    """Checks if a specific user can access a specific document"""
    allowed_levels = ROLE_PERMISSIONS.get(UserRole(user_role), ["Public"])
    return requested_doc_role in allowed_levels