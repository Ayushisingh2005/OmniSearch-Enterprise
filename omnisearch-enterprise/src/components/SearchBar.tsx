import { Search, Sparkles, Loader2 } from 'lucide-react';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  loading: boolean;
}

export default function SearchBar({ query, setQuery, onSearch, loading }: SearchBarProps) {
  
  // Trigger search when user presses "Enter"
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loading) {
      onSearch();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* FEATURE 4 INDICATOR: Shows the user that AI is expanding their query */}
      <div className="flex items-center justify-center gap-2 mb-6">
        <div className="px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-full flex items-center gap-2 shadow-sm">
          <Sparkles size={14} className="text-blue-500 animate-pulse" />
          <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">
            AI Semantic Expansion Active
          </span>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          {loading ? (
            <Loader2 size={24} className="animate-spin text-blue-500" />
          ) : (
            <Search size={24} strokeWidth={2.5} />
          )}
        </div>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe a technical issue or search documentation..."
          className="w-full p-6 pl-16 pr-32 text-lg bg-white border border-slate-200 rounded-[2rem] shadow-2xl shadow-blue-900/5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-400 transition-all placeholder:text-slate-800"
        />

        <button
          onClick={onSearch}
          disabled={loading || !query}
          className="absolute right-3 top-3 bottom-3 px-6 bg-blue-600 text-black rounded-[1.5rem] font-bold text-sm hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          {loading ? 'Analyzing...' : 'Search'}
        </button>
      </div>

      <div className="mt-4 flex justify-center gap-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span> Multi-modal enabled
        </p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span> Hybrid Retrieval
        </p>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
          <span className="w-1 h-1 bg-slate-300 rounded-full"></span> RBAC Filtered
        </p>
      </div>
    </div>
  );
}