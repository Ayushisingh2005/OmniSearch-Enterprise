"use client";
import { useState, useEffect } from 'react';
import { Sparkles, SearchX, Info, ShieldCheck } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ResultCard from '../components/ResultCard';
import MetricsBar from '../components/MetricsBar';
import SearchBar from '../components/SearchBar';

export default function Home() {
  // --- 1. CORE STATE ---
  const [query, setQuery] = useState("");
  const [role, setRole] = useState("Junior Developer");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  // --- 2. METRICS STATE (with safe defaults) ---
  const [metrics, setMetrics] = useState({
    latency: "0ms",
    faithfulness: "0.00",
    cache: "Idle",
    rerank: "Waiting"
  });

  // --- 3. HYDRATION FIX (Stops infinite reloading/flickering) ---
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // --- 4. SEARCH LOGIC ---
  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setHasSearched(true); 
    setResults([]); 

    try {
      const response = await fetch('http://localhost:8000/api/v1/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, role }),
      });

      const data = await response.json();

      if (data.results) {
        setResults(data.results);
        
        // Only update metrics if the backend actually sent them
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      }
    } catch (err) {
      console.error("Connection to AI Backend failed:", err);
      alert("Error: Backend is offline. Run 'python main.py' in the backend folder.");
    } finally {
      setLoading(false);
    }
  };

  // Prevent rendering until the client is ready
  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      <Sidebar role={role} setRole={setRole} />

      <main className="flex-1 overflow-y-auto p-12">
        <div className="max-w-5xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black mb-4 shadow-sm border border-blue-100 uppercase tracking-widest">
              <Sparkles size={12} /> Enterprise Intelligence Active
            </div>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight text-center">
                OmniSearch <span className="text-blue-600">Enterprise</span>
            </h2>
            <p className="text-slate-400 text-sm mt-2 font-medium">Secure semantic retrieval for modern IT organizations</p>
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
            <div className="flex justify-between items-end border-b border-slate-200 pb-4">
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Retrieval Pipeline</h4>
                <p className="text-[10px] text-blue-500 font-bold uppercase mt-1 flex items-center gap-1">
                   <ShieldCheck size={12} /> Security Context: {role}
                </p>
              </div>
              {hasSearched && !loading && (
                <span className="text-[11px] text-slate-400 font-bold bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm uppercase tracking-tighter">
                  {results.length} relevant matches identified
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 pb-10">
              
              {loading ? (
                /* LOADING STATE */
                <div className="p-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm animate-pulse">
                  <div className="w-12 h-12 bg-blue-50 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Sparkles className="text-blue-400 animate-spin" />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">AI Expansion & Retrieval in progress...</p>
                </div>

              ) : results.length > 0 ? (
                /* SUCCESS STATE: SHOW REAL RESULTS */
                results.map((res, index) => (
                  <ResultCard 
                    key={index}
                    title={res.title || "Technical Insight"}
                    content={res.text}
                    source={res.source}
                    score={`${res.score}%`}
                    access={res.access || role}
                    url={res.url} 
                  />
                ))

              ) : hasSearched ? (
                /* EMPTY STATE: NO RESULTS FOUND ABOVE THRESHOLD */
                <div className="p-16 text-center bg-amber-50/30 rounded-3xl border-2 border-dashed border-amber-200">
                  <SearchX size={48} className="mx-auto text-amber-400 mb-4" />
                  <h3 className="text-lg font-bold text-amber-900 tracking-tight">Zero Confidence Matches</h3>
                  <p className="text-amber-700/70 text-sm max-w-md mx-auto mt-2 font-medium">
                    The Semantic Engine filtered these results because they were below the relevance threshold. 
                    Try using more specific technical terms.
                  </p>
                </div>

              ) : (
                /* INITIAL STATE: WELCOME MESSAGE */
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:border-blue-200 transition-all">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Info size={24}/></div>
                    <h3 className="font-bold text-slate-800 mb-2">Semantic Intent</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Type technical questions like "How do I setup Okta?" to search across Silos.
                    </p>
                  </div>
                  <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm group hover:border-green-200 transition-all">
                    <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><ShieldCheck size={24}/></div>
                    <h3 className="font-bold text-slate-800 mb-2">Security Context</h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                       Enforcing RBAC filters for <span className="text-blue-600 font-bold">"{role}"</span> permissions.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic Metrics Boxes */}
          <MetricsBar 
            latency={metrics.latency} 
            faithfulness={metrics.faithfulness} 
            cache={metrics.cache} 
            rerank={metrics.rerank} 
          />
        </div>
      </main>
    </div>
  );
}
