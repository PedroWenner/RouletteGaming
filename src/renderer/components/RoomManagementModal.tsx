import React, { useState } from 'react';
import { Room } from '../../shared/types/Room';
import Button from './Button';
import Modal from './Modal';

interface RoomManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  rooms: Room[];
  activeRoomId: string | null;
  onUpdateRooms: (rooms: Room[]) => void;
  onSelectRoom: (id: string | null) => void;
}

const RoomManagementModal: React.FC<RoomManagementModalProps> = ({
  isOpen,
  onClose,
  rooms,
  activeRoomId,
  onUpdateRooms,
  onSelectRoom,
}) => {
  const [newRoomName, setNewRoomName] = useState('');
  const [view, setView] = useState<'list' | 'ranking'>('list');

  const handleAddRoom = () => {
    if (!newRoomName.trim()) return;
    const newRoom: Room = {
      id: crypto.randomUUID(),
      name: newRoomName.trim(),
      attendance: 0,
      offering: 0,
      wins: 0,
    };
    onUpdateRooms([...rooms, newRoom]);
    setNewRoomName('');
  };

  const handleDeleteRoom = (id: string) => {
    onUpdateRooms(rooms.filter((r) => r.id !== id));
    if (activeRoomId === id) onSelectRoom(null);
  };

  const handleUpdateField = (id: string, field: keyof Room, value: string | number) => {
    const updated = rooms.map((r) => {
      if (r.id === id) {
        return { ...r, [field]: value };
      }
      return r;
    });
    onUpdateRooms(updated);
  };

  const sortedRooms = [...rooms].sort((a, b) => {
    // Default ranking by total (could be expanded)
    return b.wins - a.wins || b.attendance - a.attendance;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gestão de Salas e Ranking">
      <div className="flex flex-col gap-6 max-h-[70vh]">
        {/* Tabs */}
        <div className="flex p-1 bg-slate-950 rounded-xl">
          <button
            onClick={() => setView('list')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${view === 'list' ? 'bg-slate-800 text-cyan-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
          >
            Lista de Salas
          </button>
          <button
            onClick={() => setView('ranking')}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${view === 'ranking' ? 'bg-slate-800 text-cyan-400 shadow-lg' : 'text-slate-500 hover:text-slate-300'
              }`}
          >
            Ranking Geral
          </button>
        </div>

        {view === 'list' ? (
          <>
            {/* Add Room */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Nome da nova sala..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
              <Button onClick={handleAddRoom} variant="secondary" className="px-4 py-2 text-sm h-auto">
                Adicionar
              </Button>
            </div>

            {/* Room List Table */}
            <div className="overflow-y-auto pr-2 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                    <th className="py-3 px-2">Sala</th>
                    <th className="py-3 px-2 text-center">Pres.</th>
                    <th className="py-3 px-2 text-center">Oferta</th>
                    <th className="py-3 px-2 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {rooms.map((room) => (
                    <tr
                      key={room.id}
                      className={`group transition-colors ${activeRoomId === room.id ? 'bg-cyan-500/5' : 'hover:bg-white/5'}`}
                    >
                      <td className="py-3 px-2">
                        <div className="flex flex-col">
                          <span className={`font-bold text-sm ${activeRoomId === room.id ? 'text-cyan-400' : 'text-white'}`}>
                            {room.name}
                          </span>
                          {activeRoomId === room.id && (
                            <span className="text-[9px] font-black text-cyan-600 uppercase tracking-tighter">Ativa</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={room.attendance}
                          onChange={(e) => handleUpdateField(room.id, 'attendance', parseInt(e.target.value) || 0)}
                          className="w-12 bg-transparent text-center text-sm font-medium text-slate-300 focus:outline-none focus:text-white"
                        />
                      </td>
                      <td className="py-3 px-2">
                        <input
                          type="number"
                          value={room.offering}
                          onChange={(e) => handleUpdateField(room.id, 'offering', parseFloat(e.target.value) || 0)}
                          className="w-16 bg-transparent text-center text-sm font-medium text-slate-300 focus:outline-none focus:text-white"
                        />
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectRoom(room.id === activeRoomId ? null : room.id)}
                            className={`p-1.5 rounded-lg transition-all ${activeRoomId === room.id
                                ? 'bg-cyan-500 text-white shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                                : 'text-slate-500 hover:text-cyan-400'
                              }`}
                            title="Selecionar Sala"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="p-1.5 text-slate-600 hover:text-rose-500 transition-colors"
                            title="Excluir Sala"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {rooms.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-600 text-xs italic">
                        Nenhuma sala cadastrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* Ranking View */
          <div className="overflow-y-auto pr-2 custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-slate-800">
                  <th className="py-3 px-2">Pos.</th>
                  <th className="py-3 px-2">Sala</th>
                  <th className="py-3 px-2 text-center">Pres.</th>
                  <th className="py-3 px-2 text-center">Oferta</th>
                  <th className="py-3 px-2 text-center">Vitórias</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {sortedRooms.map((room, index) => (
                  <tr key={room.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2">
                      <span className={`text-xs font-black ${index === 0 ? 'text-amber-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-700' : 'text-slate-600'
                        }`}>
                        #{index + 1}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-bold text-sm text-white">{room.name}</span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-xs text-slate-400">{room.attendance}</td>
                    <td className="py-3 px-2 text-center font-mono text-xs text-slate-400">{room.offering}</td>
                    <td className="py-3 px-2 text-center">
                      <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded border border-cyan-500/20">
                        {room.wins}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default RoomManagementModal;
