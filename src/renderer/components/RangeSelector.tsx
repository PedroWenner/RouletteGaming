import React, { useState } from 'react';
import Button from './Button';

interface RangeSelectorProps {
  onInitialize: (min: number, max: number) => void;
  disabled?: boolean;
}

const RangeSelector: React.FC<RangeSelectorProps> = ({ onInitialize, disabled }) => {
  const [min, setMin] = useState<string>('1');
  const [max, setMax] = useState<string>('60');
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
    onInitialize(minVal, maxVal);
  };

  return (
    <div className="flex flex-col items-center gap-4 bg-slate-800/40 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
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
