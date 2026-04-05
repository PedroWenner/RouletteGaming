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
    <div className="relative w-72 h-36 glass-panel rounded-3xl overflow-hidden shadow-2xl transition-all duration-500">
      {/* Center Indicator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-full bg-[var(--accent-primary)] z-10 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
      
      <div 
        ref={scrollRef}
        className={`flex items-center transition-transform duration-[3000ms] ease-in-out h-full
          ${isSpinning ? 'translate-x-[-80%]' : 'translate-x-0'}`}
        style={{ width: `${displayNumbers.length * 90}px` }}
      >
        {displayNumbers.map((num, i) => (
          <div 
            key={i} 
            className="w-[90px] h-full flex items-center justify-center text-5xl font-black text-[var(--app-text)] shrink-0 opacity-40 select-none"
          >
            {num}
          </div>
        ))}
      </div>

      {/* Decorative overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[var(--app-bg)] via-transparent to-[var(--app-bg)] opacity-80" />
    </div>
  );
};

export default RouletteWheel;
