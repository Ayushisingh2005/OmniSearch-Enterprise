"use client";
import { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Database, 
  LayoutGrid, 
  Upload, 
  Loader2, 
  FileText, 
  X, 
  Sparkles 
} from 'lucide-react';

interface SidebarProps {
  role: string;
  setRole: (role: string) => void;
}

export default function Sidebar({ role, setRole }: SidebarProps) {
  const [mounted, setMounted] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<string | null>(null); // State for real-time output
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  // Only allow files smaller than 1MB to avoid '413 Payload Too Large' errors
  if (file.size > 1024 * 1024) {
    alert("Image is too large. Please use a smaller screenshot.");
    return;
  }

  setIsScanning(true);
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: reader.result }),
      });
      
      const data = await response.json();
      setOcrResult(data.text); // This updates the blue box
    } catch (err) {
      setOcrResult("Could not reach Python backend.");
    } finally {
      setIsScanning(false);
    }
  };
};

  return (
    <aside 
      className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col h-full gap-8 transition-opacity duration-300"
      style={{ opacity: mounted ? 1 : 0 }}
    >
      {/* 1. Header Section */}
      <div>
        <h1 className="text-2xl font-black text-blue-600 flex items-center gap-2">
          <Database size={28} strokeWidth={3} /> OMNI<span className="text-slate-800">SEARCH</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-1">Enterprise Intelligence</p>
      </div>

      <nav className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        {/* 2. RBAC Section */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2">
            <Shield size={14} /> Security Layer (RBAC)
          </label>
          <select 
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
          >
            <option value="Junior Developer">Junior Developer</option>
            <option value="Senior Architect">Senior Architect</option>
            <option value="HR Manager">HR Manager</option>
            <option value="System Admin">System Admin</option>
          </select>
        </div>

        {/* 3. Connectors Section */}
        <div>
          <label className="text-[11px] font-bold text-slate-400 uppercase mb-3 block flex items-center gap-2">
            <LayoutGrid size={14} /> Active Connectors
          </label>
          <div className="space-y-3">
            {['Slack Threads', 'Jira Cloud', 'GitHub Enterprise', 'Confluence'].map((source) => (
              <div key={source} className="flex items-center justify-between text-xs font-medium text-slate-600 bg-slate-50 p-2 rounded-md border border-transparent hover:border-slate-200 transition-all">
                <span>{source}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. REAL-TIME OCR OUTPUT PANEL (Feature 3 Result) */}
        {ocrResult && (
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 relative animate-in fade-in slide-in-from-bottom-2">
            <button 
              onClick={() => setOcrResult(null)}
              className="absolute top-2 right-2 text-blue-400 hover:text-blue-600"
            >
              <X size={14} />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-blue-600" />
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">AI Vision Insight</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed max-h-40 overflow-y-auto italic">
              "{ocrResult}"
            </p>
          </div>
        )}
      </nav>

      {/* 5. OCR Trigger Section */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          accept="image/*" 
          className="hidden" 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isScanning}
          className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50 transition-all text-sm font-bold shadow-sm disabled:bg-slate-50 disabled:cursor-not-allowed"
        >
          {isScanning ? (
            <Loader2 size={18} className="animate-spin text-blue-500" />
          ) : (
            <Upload size={18} />
          )}
          {isScanning ? "AI is Analyzing..." : "OCR Image Scan"}
        </button>
      </div>
    </aside>
  );
} 

