import { ExternalLink, Hash, Clock, ShieldCheck } from 'lucide-react';

interface ResultProps {
  title: string;
  content: string;
  source: string;
  score: string;
  access: string;
  url?: string; 
}

export default function ResultCard({ title, content, source, score, access, url }: ResultProps) {
  // If no URL is provided, we use a search query fallback so it's always clickable
  const finalUrl = url || `https://www.google.com/search?q=${encodeURIComponent(title)}`;

  return (
    <div className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Hash className="text-blue-500" size={18} />
          {/* 1. TITLE LINK */}
          <a 
            href={finalUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-lg font-bold text-slate-800 hover:text-blue-600 transition-colors cursor-pointer decoration-blue-200 hover:underline underline-offset-4"
          >
            {title}
          </a>
        </div>
        <span className="bg-green-50 text-green-700 text-[10px] font-black px-2 py-1 rounded-full uppercase">
          {score} Match
        </span>
      </div>
      
      <p className="text-slate-600 text-sm leading-relaxed mb-5">{content}</p>

      <div className="flex items-center gap-4 pt-4 border-t border-slate-50">
        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase">
          <Clock size={12} /> {source}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-blue-400 uppercase">
          <ShieldCheck size={12} /> {access}
        </div>
        
        {/* 2. ICON REDIRECT BUTTON (Corrected) */}
        <a 
          href={finalUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="ml-auto p-2 bg-slate-50 rounded-full text-slate-300 hover:text-blue-500 hover:bg-blue-100 transition-all flex items-center justify-center"
          title="Open Source Document"
        >
          <ExternalLink size={18} />
        </a>
      </div>
    </div>
  );
}