import React, { useEffect, useState } from 'react';
import { useRoulette } from '../hooks/useRoulette';
import { Room } from '../../shared/types/Room';
import RoomManagementModal from '../components/RoomManagementModal';
import PodiumRanking from '../components/PodiumRanking';
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

  const [view, setView] = useState<'home' | 'roulette' | 'ranking'>('home');
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Load rooms and theme on mount
  useEffect(() => {
    const savedRooms = localStorage.getItem('roleta_rooms');
    const savedActiveId = localStorage.getItem('roleta_active_room_id');
    const savedTheme = localStorage.getItem('roleta_theme') as 'light' | 'dark';
    
    if (savedRooms) {
      setRooms(JSON.parse(savedRooms));
    }
    if (savedActiveId) {
      setActiveRoomId(savedActiveId);
    }
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('roleta_theme', newTheme);
  };

  const handleUpdateRooms = (updatedRooms: Room[]) => {
    setRooms(updatedRooms);
    localStorage.setItem('roleta_rooms', JSON.stringify(updatedRooms));
  };

  const handleSelectRoom = (id: string | null) => {
    setActiveRoomId(id);
    if (id) {
      localStorage.setItem('roleta_active_room_id', id);
    } else {
      localStorage.removeItem('roleta_active_room_id');
    }
  };

  const activeRoom = rooms.find(r => r.id === activeRoomId);

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && engine && !isSpinning && view === 'roulette') {
        spin();
      }
      if (e.key === 'Escape' && view === 'roulette') {
        reset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine, isSpinning, spin, reset, view]);

  useEffect(() => {
    if (!isSpinning && lastResult !== null) {
      const audio = new Audio(jackpotSound);
      audio.play().catch(err => console.error("Error playing sound:", err));

      // Record win for active room
      if (activeRoomId) {
        setRooms(prev => {
          const updated = prev.map(r => r.id === activeRoomId ? { ...r, wins: r.wins + 1 } : r);
          localStorage.setItem('roleta_rooms', JSON.stringify(updated));
          return updated;
        });
      }
    }
  }, [isSpinning, lastResult, activeRoomId]);

  return (
    <div className={`flex flex-col items-center justify-between min-h-screen py-12 px-6 transition-colors duration-500 ${theme === 'light' ? 'theme-light bg-[var(--app-bg)]' : 'bg-[#0f172a]'} text-[var(--app-text)]`}>
      {/* Header */}
      <header className="relative w-full max-w-4xl flex flex-col items-center gap-2 mb-8">
        <div className="absolute top-0 right-0 flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-3 glass-panel hover:bg-[var(--accent-primary)]/10 rounded-xl text-[var(--app-text)] hover:text-[var(--accent-primary)] transition-all duration-300"
            title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4-9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707M16.95 17.657l.707.707M7.757 6.343l.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="p-3 glass-panel hover:bg-[var(--accent-primary)]/10 rounded-xl text-[var(--app-text)] hover:text-[var(--accent-primary)] transition-all duration-300"
            title="Configurar Sala"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>

        <h1 className="text-5xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600">
          IEAD BELVEDERE
        </h1>

        {activeRoom && view === 'roulette' && (
          <div className="flex items-center gap-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full animate-in fade-in slide-in-from-top-2 duration-500">
            <span className="text-[10px] font-black text-cyan-500/60 uppercase tracking-[0.2em]">Sala Diária</span>
            <span className="text-sm font-bold text-cyan-400 tracking-tight">{activeRoom.name}</span>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-6xl">

        {view === 'home' && (
          <div className="flex flex-col md:flex-row gap-8 w-full max-w-2xl animate-in fade-in zoom-in duration-500">
            <button
              onClick={() => setView('ranking')}
              className="flex-1 group relative p-8 glass-panel rounded-3xl hover:border-amber-500/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/20 flex items-center justify-center border border-amber-500/30 group-hover:scale-110 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-black mb-2 italic tracking-widest text-[var(--app-text)]">RANKING</h2>
                  <p className="text-[var(--app-text-dim)] text-sm font-medium uppercase tracking-[0.2em]">Ver Resultados</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setView('roulette')}
              className="flex-1 group relative p-8 glass-panel rounded-3xl hover:border-cyan-500/50 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-2xl bg-cyan-500/20 flex items-center justify-center border border-cyan-500/30 group-hover:rotate-45 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-black mb-2 italic tracking-widest text-[var(--app-text)]">ROLETA</h2>
                  <p className="text-[var(--app-text-dim)] text-sm font-medium uppercase tracking-[0.2em]">Sortear Agora</p>
                </div>
              </div>
            </button>
          </div>
        )}

        {view === 'ranking' && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500 px-4">
            <button
              onClick={() => setView('home')}
              className="self-start mb-8 flex items-center gap-2 text-[var(--app-text-dim)] hover:text-[var(--app-text)] transition-colors uppercase text-xs font-black tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar Menu
            </button>
            <div className="flex flex-col xl:flex-row items-start justify-center gap-12 w-full">
              <PodiumRanking rooms={rooms} category="offering" title="Top Ofertas" />
              <PodiumRanking rooms={rooms} category="attendance" title="Top Presença" />
            </div>
          </div>
        )}

        {view === 'roulette' && (
          <div className="w-full flex flex-col items-center">
            <button
              onClick={() => setView('home')}
              disabled={isSpinning}
              className="self-start mb-8 flex items-center gap-2 text-[var(--app-text-dim)] hover:text-[var(--app-text)] transition-colors uppercase text-xs font-black tracking-widest disabled:opacity-30"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar Menu
            </button>

            {!engine ? (
              <div className="animate-in fade-in zoom-in duration-700 w-full max-w-md mx-auto">
                <RangeSelector onInitialize={(min, max, uniqueMode) => initEngine({ min, max, uniqueMode })} />
                <p className="mt-6 text-[var(--app-text-dim)] text-center text-sm font-medium uppercase tracking-widest opacity-50">
                  Configuração Inicial Necessária
                </p>
              </div>
            ) : (
              <div className="flex flex-col lg:flex-row gap-12 w-full items-start justify-center animate-in fade-in slide-in-from-top-4 duration-500">
                {/* Left Side: The Machine */}
                <div className="flex-1 flex flex-col items-center gap-12">
                  {/* Range Info */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4 glass-panel px-6 py-2 rounded-full backdrop-blur-sm">
                      <span className="text-[10px] font-black text-[var(--app-text-dim)] uppercase tracking-widest">Range</span>
                      <span className="text-[var(--accent-primary)] font-black">{engine.getConfig().min} — {engine.getConfig().max}</span>
                      <button
                        onClick={() => initEngine(engine.getConfig())}
                        className="ml-2 text-[var(--app-text-dim)] hover:text-[var(--app-text)] transition-colors"
                        title="Reiniciar Sorteios"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    </div>

                    {engine.getConfig().uniqueMode && (
                      <div className="flex gap-2">
                        <div className="text-[10px] font-bold text-cyan-500/80 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-md border border-cyan-500/20">
                          Modo: Sem repetição
                        </div>
                        <div className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20">
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
                      className="w-64 py-6 text-3xl h-auto"
                    >
                      {isSpinning ? 'GIRANDO...' : 'GIRAR AGORA'}
                    </Button>
                    <p className="text-[var(--app-text-dim)] text-[10px] uppercase tracking-[0.3em] font-black opacity-60">Pressione <span className="font-black text-[var(--app-text)]">ENTER</span> para girar</p>
                  </div>
                </div>

                {/* Right Side: Results Aside */}
                <aside className="w-full lg:w-80 flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-700">
                  {/* Current Result Highlight */}
                  <div className={`flex flex-col items-center glass-panel p-8 rounded-[2rem] border-[var(--accent-primary)]/20 transition-all duration-500 ${lastResult !== null && !isSpinning ? 'scale-100 opacity-100' : 'scale-95 opacity-50'}`}>
                    <span className="text-[10px] font-black text-[var(--app-text-dim)] uppercase tracking-[0.4em] mb-4">Último Sorteado</span>
                    <div className="text-8xl font-black text-[var(--app-text)] drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]">
                      {lastResult !== null ? lastResult : '--'}
                    </div>
                  </div>

                  <HistoryPanel history={history} />
                </aside>
              </div>
            )}
          </div>
        )}
      </main>


      {/* Branding */}
      <div className="mt-16 mb-8 flex flex-col items-center gap-3 opacity-40 hover:opacity-100 transition-opacity duration-500 group cursor-default">
        <span className="text-[10px] font-bold tracking-[0.4em] text-[var(--app-text-dim)] uppercase">Desenvolvido por</span>
        <div className="flex items-center gap-3 glass-panel px-5 py-2.5 rounded-2xl relative overflow-hidden">
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

      {/* Room Management Modal */}
      <RoomManagementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        rooms={rooms}
        activeRoomId={activeRoomId}
        onUpdateRooms={handleUpdateRooms}
        onSelectRoom={handleSelectRoom}
      />
    </div>
  );
};

export default RoulettePage;
