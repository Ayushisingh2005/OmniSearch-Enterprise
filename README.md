## 🔍 OmniSearch-Enterprise
* Secure Multi-Modal Semantic Intelligence Layer for IT Organizations
  
OmniSearch-Enterprise is a heavyweight retrieval engine that replaces traditional keyword search with high-dimensional vector similarity. It is designed to bridge data silos across Slack, Jira, and technical documentation while enforcing strict Role-Based Access Control (RBAC) and ensuring enterprise-grade precision via Cross-Encoder Re-ranking.

![alt text](https://img.shields.io/badge/Frontend-Next.js%2015-black) ![alt text](https://img.shields.io/badge/Backend-FastAPI%20(Python)-009688)
![alt text](https://img.shields.io/badge/VectorDB-Pinecone-blue) ![alt text](https://img.shields.io/badge/LLM-Groq%20(Llama%203.3)-orange)

* Live link=https://omnisearchenterprise.vercel.app

🚀 The 7 Heavyweight Features
1. Security Layer (RBAC Filtering)
Enforces data privacy at the database level. Every document is tagged with metadata, and the Pinecone Metadata Filter ensures that a "Junior Developer" can never retrieve sensitive "HR Manager" or "System Admin" documents, even if they are semantically relevant.
2. Precision Re-ranking (Two-Stage Retrieval)
Standard vector search can be "fuzzy." This system uses a two-stage pipeline:
Retrieval: Pinecone fetches top 15 candidates using Cosine Similarity.
Re-ranking: Cohere Rerank v3 (Cross-Encoder) re-scores them for 99% technical precision.
3. Multi-Modal Vision (OCR Image Scan)
Engineers can upload technical architecture diagrams or whiteboard photos. Integrated Google Gemini 1.5 Flash analyzes the image, extracts technical components, and makes them searchable.
4. Semantic Query Expansion
Uses Groq (Llama 3.3 70B) to rewrite simple user queries into 3 technical variations. It understands that "login issues" actually means "LDAP authentication failure" or "SSO timeout."
5. Performance Observability
A real-time metrics dashboard tracks Latency (ms), Faithfulness, and Search Confidence, providing transparency into AI reasoning and system speed.
6. Semantic Cache Logic
Optimized for cost and speed. The architecture is designed to store mathematically similar previous queries in Redis, reducing LLM costs and providing sub-10ms response times for recurring technical issues.
7. Unified Agentic Connectors
Unified ingestion logic that treats Slack threads, GitHub READMEs, Jira tickets, and Confluence pages as a single "Knowledge Source of Truth."
---
🛠️ Tech Stack
| Component	        |  Technology                                          |
| ----------------  | ---------------                                      |
| Frontend	        | Next.js 15 (App Router), TypeScript, Tailwind CSS v4 |
| Backend API       |	FastAPI (Python 3.11), Asynchronous Processing       |
| Intelligence      |	Groq (Llama 3.3 70B), Cohere (v3 Embeddings/Rerank)  |
| Vision            |	Google Gemini 1.5 Flash (Vision Transformer)         |
| Storage           |	Pinecone Serverless (Vector Database)                |
| Deployment        |	Vercel (Frontend), Render (Backend)                  |
---
```
📂 File Directory Structure
code
Text
omnisearch-enterprise/
│
├── omnisearch-frontend/        # Next.js 15 + TypeScript + Tailwind
│   ├── public/                 # Static assets (icons, logo)
│   ├── src/
│   │   ├── app/                # App Router
│   │   │   ├── layout.tsx      # Root layout & Hydration fix
│   │   │   └── page.tsx        # Main Search Dashboard (The Glue)
│   │   ├── components/         # Modular UI Components
│   │   │   ├── Sidebar.tsx     # RBAC Select & OCR Trigger
│   │   │   ├── SearchBar.tsx   # Query Input & Expansion UI
│   │   │   ├── ResultCard.tsx  # Dynamic Result & Redirect Link
│   │   │   └── MetricsBar.tsx  # Latency & Faithfulness boxes
│   │   └── lib/                # Frontend Utilities
│   │       └── utils.ts        # Tailwind merging logic
│   ├── .env.local              # Frontend specific keys (NEXT_PUBLIC_URL)
│   ├── next.config.mjs         # Production Build settings
│   ├── tailwind.config.ts      # UI styling configurations
│   └── package.json            # Node dependencies
│
├── omnisearch-backend/         # FastAPI (Python 3.11) AI Engine
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # Entry point & CORS configuration
│   │   ├── api/               # API Endpoints (The "Routes")
│   │   │   ├── endpoints.py    # /search logic
│   │   │   ├── ocr.py          # /ocr logic
│   │   │   └── seed.py         # /seed ingestion logic
│   │   ├── core/              # System-wide logic
│   │   │   ├── config.py       # Pydantic Settings & Key validation
│   │   │   └── security.py     # RBAC Role Hierarchy logic
│   │   ├── services/          # Third-party AI Wrappers
│   │   │   ├── pinecone_svc.py # Vector DB search & upsert
│   │   │   ├── groq_svc.py     # Llama 3.3 Query Expansion
│   │   │   ├── cohere_svc.py   # Embeddings & Rerank v3
│   │   │   └── vision_svc.py   # Gemini 1.5 Flash Vision
│   │   └── models/
│   │       └── schemas.py      # Pydantic Search/OCR data models
│   ├── .env                    # Secure Backend Keys (not for GitHub)
│   ├── requirements.txt        # Python library list
│   └── .gitignore              # Ensures .env stays private
│
└── README.md                   # Documentation for the Interviewer
```

* 📐 System Architecture
```
Mermaid
graph TD
    User[User Search] --> UI[Next.js Frontend]
    UI --> API[FastAPI Backend]
    API --> Groq[Query Expansion: Llama 3.3]
    Groq --> Embed[Embeddings: Cohere v3]
    Embed --> DB[(Pinecone Vector DB)]
    DB -- Metadata RBAC Filter --> API
    API --> Rerank[Re-ranker: Cohere v3]
    Rerank --> UI
```
🔧 Installation & Setup
1. Clone the Repository
```
git clone https://github.com/ayushisingh2005/omnisearch-enterprise.git
```
2. Backend Setup (Python)
```
cd omnisearch-backend
python -m venv venv
source venv/bin/activate  # venv\Scripts\activate on Windows
pip install -r requirements.txt
python main.py
```
3. Frontend Setup (Next.js)
```
cd omnisearch-enterprise
npm install
npm run dev
```
4. Environment Variables
*Create a .env in the backend and .env.local in the frontend containing:
```
PINECONE_API_KEY
COHERE_API_KEY
GROQ_API_KEY
GEMINI_API_KEY
```
🧪 Industrial Test Cases
* Security Check: Log in as "Junior Developer" and search for "Root Passwords". The system should return zero results (RBAC enforced).
* Vision Check: Upload a screenshot of a cloud architecture diagram. The AI Vision box should list all detected components.
* Robustness Check: Search for "Pepperoni Pizza". The system should return "Zero Confidence Matches" (Relevance Thresholding).

* This project is a demonstration of secure, scalable AI retrieval systems for modern IT industries.
