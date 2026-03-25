import React from 'react';
import { Room } from '../../shared/types/Room';

interface PodiumRankingProps {
  rooms: Room[];
  category: 'attendance' | 'offering' | 'wins';
  title: string;
}

const PodiumRanking: React.FC<PodiumRankingProps> = ({ rooms, category, title }) => {
  const sorted = [...rooms].sort((a, b) => (b[category] as number) - (a[category] as number));
  const top3 = sorted.slice(0, 3);

  const getMedalColor = (index: number) => {
    if (index === 0) return 'from-amber-300 via-amber-500 to-amber-600 shadow-amber-500/50'; // Gold
    if (index === 1) return 'from-slate-300 via-slate-400 to-slate-500 shadow-slate-400/50'; // Silver
    return 'from-amber-700 via-amber-800 to-amber-900 shadow-amber-800/50'; // Bronze
  };

  const getPodiumHeight = (index: number) => {
    if (index === 0) return 'h-40';
    if (index === 1) return 'h-32';
    return 'h-24';
  };

  // Reorder for podium display: 2nd, 1st, 3rd
  const podiumOrder = [];
  if (top3[1]) podiumOrder.push({ ...top3[1], index: 1 });
  if (top3[0]) podiumOrder.push({ ...top3[0], index: 0 });
  if (top3[2]) podiumOrder.push({ ...top3[2], index: 2 });

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-lg mb-12">
      <h3 className="text-xl font-black italic tracking-widest text-cyan-400 uppercase">{title}</h3>

      {top3.length > 0 ? (
        <div className="flex items-end justify-center gap-4 w-full px-4">
          {podiumOrder.map((room) => (
            <div key={room.id} className="flex flex-col items-center flex-1 animate-in slide-in-from-bottom-8 duration-700">
              <div className="mb-4 flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getMedalColor(room.index)} flex items-center justify-center border-2 border-white/20 shadow-lg`}>
                  <span className="text-white font-black text-xl italic">{room.index + 1}º</span>
                </div>
                <span className="text-center font-bold text-sm tracking-tight line-clamp-2 max-w-[80px]">
                  {room.name}
                </span>
                <span className="text-[10px] font-black text-slate-500 uppercase">
                   {room[category]} {category === 'offering' ? 'Ofertas' : category === 'attendance' ? 'Presenças' : 'Vitórias'}
                </span>
              </div>
              
              <div className={`w-full ${getPodiumHeight(room.index)} rounded-t-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/40 border-x border-t border-slate-700/50 relative overflow-hidden group`}>
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-600 italic text-sm">Nenhum dado disponível ainda.</p>
      )}
    </div>
  );
};

export default PodiumRanking;
