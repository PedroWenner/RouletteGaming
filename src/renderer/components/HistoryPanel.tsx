import React from 'react';

interface HistoryPanelProps {
  history: number[];
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history }) => {
  return (
    <div className="w-full max-w-md bg-slate-800/20 rounded-2xl p-6 border border-slate-700/30">
      <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Últimos Resultados</h3>
      <div className="flex flex-wrap gap-2">
        {history.length === 0 && (
          <p className="text-slate-600 italic text-sm">Nenhum resultado ainda...</p>
        )}
        {history.map((num, i) => (
          <div
            key={i}
            className={`
              w-10 h-10 flex items-center justify-center rounded-lg font-bold text-sm
              ${i === 0
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'}
              animate-in fade-in slide-in-from-bottom-2 duration-500
            `}
          >
            {num}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryPanel;
