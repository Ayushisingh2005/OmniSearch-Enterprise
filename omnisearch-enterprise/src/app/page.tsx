"use client";
import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ResultCard from '../components/ResultCard';
import MetricsBar from '../components/MetricsBar';
import SearchBar from '../components/SearchBar'; // Added missing import

export default function Home() {
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("Junior Developer");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]); // State to store real search results

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    
    try {
      const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
     const response = await fetch('http://localhost:8000/api/v1/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, role }),
});
      const data = await response.json();
      
      if (data.results) {
        setResults(data.results); // Save real results to state
      }
    } catch (err) {
      console.error("Search Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar role={role} setRole={setRole} />

      <main className="flex-1 overflow-y-auto p-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold mb-4">
              <Sparkles size={14} /> Feature 4: AI Query Expansion Active
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">How can I help you today?</h2>
          </div>

          {/* Search Box Component */}
          <SearchBar 
            query={query} 
            setQuery={setQuery} 
            onSearch={handleSearch} 
            loading={loading} 
          />

          {/* Results Grid */}
          <div className="mt-16 space-y-6">
            <div className="flex justify-between items-end">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Knowledge Retrieval</h4>
              <span className="text-xs text-slate-400">
                Found {results.length || 2} matching resources for 
                <span className="text-blue-500 font-bold underline ml-1">"{query || "..."}"</span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {/* If we have real results, show them. Otherwise, show the default mock data */}
              {results.length > 0 ? (
                results.map((res, index) => (
                  <ResultCard 
                    key={index}
                    title={res.metadata?.title || "Result Found"}
                    content={res.metadata?.text || "No content summary available."}
                    source={res.metadata?.source || "Internal Database"}
                    score={`${Math.round(res.relevance_score * 100)}%`}
                    access={res.metadata?.permitted_roles?.[0] || "Public"}
                  />
                ))
              ) : (
                <>
                  {/* Default Mock Data (visible on first load) */}
                  <ResultCard 
                    title="SSO Configuration Guide - v2.4"
                    content="Ensure that the Redirect URI in the Okta Dashboard matches the one in your .env.local file. Most 'Invalid Client' errors are caused by a mismatch here."
                    source="Confluence"
                    score="99%"
                    access="Internal-Dev"
                  />
                  <ResultCard 
                    title="Slack Thread: Deployment Failure"
                    content="The CI pipeline is currently failing because the Docker image size exceeded the 2GB limit. We need to optimize the multi-stage build."
                    source="Slack #ops-alerts"
                    score="84%"
                    access="Public"
                  />
                </>
              )}
            </div>
          </div>

          <MetricsBar />
        </div>
      </main>
    </div>
  );
}
