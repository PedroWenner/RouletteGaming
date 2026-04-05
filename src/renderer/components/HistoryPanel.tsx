import React from 'react';

interface HistoryPanelProps {
  history: number[];
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history }) => {
  return (
    <div className="w-full max-w-md glass-panel rounded-2xl p-6">
      <h3 className="text-sm font-bold text-[var(--app-text-dim)] uppercase tracking-widest mb-4">Últimos Resultados</h3>
      <div className="flex flex-wrap gap-2">
        {history.length === 0 && (
          <p className="text-[var(--app-text-dim)] italic text-sm opacity-50">Nenhum resultado ainda...</p>
        )}
        {history.map((num, i) => (
          <div
            key={i}
            className={`
              w-10 h-10 flex items-center justify-center rounded-xl font-black text-sm
              ${i === 0
                ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] border border-[var(--accent-primary)]/50 shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                : 'bg-[var(--card-border)]/30 text-[var(--app-text-dim)] border border-[var(--card-border)]/50'}
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
