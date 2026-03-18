import React, { useEffect, useState, useRef } from 'react';

interface RouletteWheelProps {
  isSpinning: boolean;
  result: number | null;
  config: { min: number; max: number } | null;
}

const RouletteWheel: React.FC<RouletteWheelProps> = ({ isSpinning, result, config }) => {
  const [displayNumbers, setDisplayNumbers] = useState<number[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (config) {
      // Create a large list of numbers for the scrolling effect
      const nums = [];
      const range = config.max - config.min + 1;
      for (let i = 0; i < 50; i++) {
        nums.push(Math.floor(Math.random() * range) + config.min);
      }
      setDisplayNumbers(nums);
    }
  }, [config]);

  // When result is available, ensure it's at the end of the list or somewhere visible
  useEffect(() => {
    if (result !== null && !isSpinning) {
      setDisplayNumbers(prev => {
        const next = [...prev];
        next[next.length - 3] = result; // Put it near the end
        return next;
      });
    }
  }, [result, isSpinning]);

  return (
    <div className="relative w-64 h-32 bg-slate-900 border-4 border-slate-700 rounded-2xl overflow-hidden shadow-[0_0_50px_-12px_rgba(34,211,238,0.3)]">
      {/* Center Indicator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-full bg-cyan-500 z-10 shadow-[0_0_10px_rgba(34,211,238,1)]" />
      
      <div 
        ref={scrollRef}
        className={`flex items-center transition-transform duration-[3000ms] ease-in-out h-full
          ${isSpinning ? 'translate-x-[-80%]' : 'translate-x-0'}`}
        style={{ width: `${displayNumbers.length * 80}px` }}
      >
        {displayNumbers.map((num, i) => (
          <div 
            key={i} 
            className="w-20 h-full flex items-center justify-center text-4xl font-black text-slate-100 shrink-0"
          >
            {num}
          </div>
        ))}
      </div>

      {/* Decorative overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-slate-900 via-transparent to-slate-900 opacity-60" />
    </div>
  );
};

export default RouletteWheel;
