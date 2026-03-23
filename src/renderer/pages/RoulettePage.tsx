import React, { useEffect } from 'react';
import { useRoulette } from '../hooks/useRoulette';
import RangeSelector from '../components/RangeSelector';
import RouletteWheel from '../components/RouletteWheel';
import Button from '../components/Button';
import HistoryPanel from '../components/HistoryPanel';
import jackpotSound from '../assets/sounds/jackpot.mp3';
import alcatechLogo from '../assets/alcatech_logo.png';

const RoulettePage: React.FC = () => {
  const {
    engine,
    initEngine,
    spin,
    reset,
    history,
    lastResult,
    isSpinning,
    remainingCount
  } = useRoulette();

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && engine && !isSpinning) {
        spin();
      }
      if (e.key === 'Escape') {
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine, isSpinning, spin, reset]);

  useEffect(() => {
    if (!isSpinning && lastResult !== null) {
      const audio = new Audio(jackpotSound);
      audio.play().catch(err => console.error("Error playing sound:", err));
    }
  }, [isSpinning, lastResult]);

  return (
    <div className="flex flex-col items-center justify-between min-h-screen py-12 px-6 bg-[#0f172a] text-white">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-5xl font-black mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
          ROLETA DA IEAD BELVEDERE
        </h1>
        <p className="text-slate-400 font-medium"></p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-12 w-full max-w-2xl">

        {!engine ? (
          <div className="animate-in fade-in zoom-in duration-700">
            <RangeSelector onInitialize={(min, max, uniqueMode) => initEngine({ min, max, uniqueMode })} />
            <p className="mt-6 text-slate-500 text-center text-sm">
              Defina um range para iniciar sua sessão
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-12 w-full animate-in fade-in slide-in-from-top-4 duration-500">

            {/* Range Info */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-4 bg-slate-800/30 px-6 py-2 rounded-full border border-slate-700/50">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Range Ativo</span>
                <span className="text-cyan-400 font-black">{engine.getConfig().min} — {engine.getConfig().max}</span>
                <button
                  onClick={() => initEngine(engine.getConfig())}
                  className="ml-2 text-slate-500 hover:text-white transition-colors"
                  title="Resetar Sessão"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>

              {engine.getConfig().uniqueMode && (
                <div className="flex gap-2">
                  <div className="text-[10px] font-bold text-cyan-500/80 uppercase tracking-[0.2em] bg-cyan-500/10 px-3 py-1 rounded-md border border-cyan-500/20">
                    Modo: Sem repetição
                  </div>
                  <div className="text-[10px] font-bold text-amber-500/80 uppercase tracking-[0.2em] bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20">
                    Restantes: {remainingCount}
                  </div>
                </div>
              )}
            </div>

            <RouletteWheel isSpinning={isSpinning} result={lastResult} config={engine.getConfig()} />

            <div className="flex flex-col items-center gap-4">
              <Button
                onClick={spin}
                disabled={isSpinning}
                glow
                className="w-48 py-4 text-xl"
              >
                {isSpinning ? 'GIRANDO...' : 'GIRAR'}
              </Button>
              <p className="text-slate-600 text-xs uppercase tracking-[0.2em] font-bold">Pressione <span className="text-slate-400">ENTER</span> para girar</p>
            </div>

            {lastResult !== null && !isSpinning && (
              <div className="flex flex-col items-center animate-in zoom-in-75 duration-300">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mb-2">Vencedor</span>
                <div className="text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.8)] decoration-cyan-500 decoration-8">
                  {lastResult}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer / History */}
      <footer className="w-full max-w-md mt-12">
        <HistoryPanel history={history} />
      </footer>

      {/* Branding */}
      <div className="mt-16 mb-8 flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity duration-500 group cursor-default">
        <span className="text-[10px] font-bold tracking-[0.4em] text-slate-500 uppercase">Desenvolvido por</span>
        <div className="flex items-center gap-3 bg-slate-900/50 backdrop-blur-md px-5 py-2.5 rounded-2xl border border-slate-700/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative flex items-center gap-3">
            <img
              src={alcatechLogo}
              alt="Alcatech"
              className="w-7 h-7 rounded-lg shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all duration-500"
            />
            <span className="text-xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
              ALCATECH
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoulettePage;
