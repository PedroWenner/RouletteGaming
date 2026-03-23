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
    <div className="flex flex-col items-center gap-6 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Min</label>
          <input
            type="number"
            value={min}
            onChange={(e) => setMin(e.target.value)}
            disabled={disabled}
            className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">Max</label>
          <input
            type="number"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            disabled={disabled}
            className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center justify-between w-full px-2">
        <label className="text-sm font-medium text-slate-300 cursor-pointer select-none" htmlFor="unique-mode">
          Não repetir números
        </label>
        <button
          id="unique-mode"
          onClick={() => setUniqueMode(!uniqueMode)}
          disabled={disabled}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${
            uniqueMode ? 'bg-cyan-600' : 'bg-slate-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              uniqueMode ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {error && <p className="text-rose-400 text-sm font-medium animate-pulse">{error}</p>}

      <Button
        onClick={handleInit}
        variant="secondary"
        disabled={disabled}
        className="w-full"
      >
        Definir Range
      </Button>
    </div>
  );
};

export default RangeSelector;
