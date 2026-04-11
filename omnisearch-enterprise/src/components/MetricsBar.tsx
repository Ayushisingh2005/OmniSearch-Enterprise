import { Activity, Zap, Layers, BarChart3 } from 'lucide-react';

interface MetricsProps {
  latency: string;
  faithfulness: string;
  cache: string;
  rerank: string;
}

export default function MetricsBar({ latency, faithfulness, cache, rerank }: MetricsProps) {
  const metrics = [
    { label: 'Faithfulness', value: faithfulness, icon: <BarChart3 className="text-green-500" size={18} />, color: 'bg-green-50' },
    { label: 'Avg Latency', value: latency, icon: <Activity className="text-purple-500" size={18} />, color: 'bg-purple-50' },
    { label: 'Semantic Cache', value: cache, icon: <Zap className="text-orange-500" size={18} />, color: 'bg-orange-50' },
    { label: 'Re-Ranker', value: rerank, icon: <Layers className="text-blue-500" size={18} />, color: 'bg-blue-50' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-200">
      {metrics.map((m) => (
        <div key={m.label} className={`p-4 rounded-xl border border-slate-100 shadow-sm ${m.color} bg-opacity-30`}>
          <div className="flex items-center gap-2 mb-1">
            {m.icon}
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</span>
          </div>
          <p className="text-xl font-bold text-slate-800 tracking-tight">{m.value}</p>
        </div>
      ))}
    </div>
  );
}