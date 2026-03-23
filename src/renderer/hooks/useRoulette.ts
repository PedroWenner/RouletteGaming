import { useState, useCallback, useMemo } from 'react';
import { RouletteEngine } from '@core/roulette/RouletteEngine';
import { RouletteConfig, RouletteResult } from '@shared/types/Roulette';

export const useRoulette = () => {
  const [engine, setEngine] = useState<RouletteEngine | null>(null);
  const [history, setHistory] = useState<RouletteResult[]>([]);
  const [lastResult, setLastResult] = useState<RouletteResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [remainingCount, setRemainingCount] = useState<number>(0);

  const initEngine = useCallback((config: RouletteConfig) => {
    const newEngine = new RouletteEngine(config);
    setEngine(newEngine);
    setHistory([]);
    setLastResult(null);
    setRemainingCount(newEngine.getRemainingCount());
  }, []);

  const spin = useCallback(async () => {
    if (!engine || isSpinning) return null;

    setIsSpinning(true);
    
    // Artificial delay to simulate spin animation (controlled by UI agent)
    return new Promise<RouletteResult>((resolve) => {
      setTimeout(() => {
        const result = engine.spin();
        setLastResult(result);
        setHistory(engine.getHistory().slice(-20).reverse());
        setRemainingCount(engine.getRemainingCount());
        setIsSpinning(false);
        resolve(result);
      }, 3000); // 3 seconds matching UX guidelines
    });
  }, [engine, isSpinning]);

  const reset = useCallback(() => {
    if (engine) {
      engine.reset();
      setHistory([]);
      setLastResult(null);
    }
  }, [engine]);

  return {
    engine,
    initEngine,
    spin,
    reset,
    history,
    lastResult,
    isSpinning,
    remainingCount
  };
};
