import React, { useState } from 'react';
import Button from './Button';

interface RangeSelectorProps {
  onInitialize: (min: number, max: number, uniqueMode: boolean) => void;
  disabled?: boolean;
}

const RangeSelector: React.FC<RangeSelectorProps> = ({ onInitialize, disabled }) => {
  const [min, setMin] = useState<string>('1');
  const [max, setMax] = useState<string>('60');
  const [uniqueMode, setUniqueMode] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleInit = () => {
    const minVal = parseInt(min);
    const maxVal = parseInt(max);

    if (isNaN(minVal) || isNaN(maxVal)) {
      setError('Please enter valid numbers');
      return;
    }

    if (minVal > maxVal) {
      setError('Min must be smaller than Max');
      return;
    }

    setError(null);
    onInitialize(minVal, maxVal, uniqueMode);
  };

  return (
    <div className="flex flex-col items-center gap-6 glass-panel p-8 rounded-[2rem] shadow-xl backdrop-blur-md transition-all duration-300">
      <div className="flex items-center gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-[var(--app-text-dim)] uppercase tracking-widest ml-1">Início</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            disabled={disabled}
            className="w-28 bg-[var(--app-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--app-text)] font-black focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 transition-all text-center text-lg"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-[10px] font-black text-[var(--app-text-dim)] uppercase tracking-widest ml-1">Fim</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            disabled={disabled}
            className="w-28 bg-[var(--app-bg)] border border-[var(--card-border)] rounded-xl px-4 py-3 text-[var(--app-text)] font-black focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50 transition-all text-center text-lg"
          />
        </div>
      </div>

      <div className="flex items-center justify-between w-full px-4 py-3 glass-panel rounded-2xl">
        <label className="text-xs font-black text-[var(--app-text)] uppercase tracking-widest cursor-pointer select-none" htmlFor="unique-mode">
          Não repetir números
        </label>
        <button
          id="unique-mode"
          onClick={() => setUniqueMode(!uniqueMode)}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] focus:ring-offset-2 focus:ring-offset-[var(--app-bg)] ${
            uniqueMode ? 'bg-[var(--accent-primary)]' : 'bg-[var(--app-text-dim)]/30'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-transform ${
              uniqueMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {error && (
        <div className="px-4 py-2 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          <p className="text-rose-500 text-[10px] font-black uppercase tracking-widest animate-pulse">{error}</p>
        </div>
      )}

      <Button
        onClick={handleInit}
        variant="primary"
        disabled={disabled}
        className="w-full py-4 uppercase tracking-[0.2em] text-xs font-black"
      >
        Iniciar Sorteio
      </Button>
    </div>
  );
};

export default RangeSelector;
