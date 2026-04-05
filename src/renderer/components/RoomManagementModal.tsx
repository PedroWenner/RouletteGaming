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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

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

  const handleStartEdit = (room: Room) => {
    setEditingId(room.id);
    setEditingName(room.name);
  };

  const handleSaveEdit = (id: string) => {
    if (!editingName.trim()) return;
    const updated = rooms.map(r => r.id === id ? { ...r, name: editingName.trim() } : r);
    onUpdateRooms(updated);
    setEditingId(null);
  };

  const sortedRooms = [...rooms].sort((a, b) => {
    // Default ranking by total (could be expanded)
    return b.wins - a.wins || b.attendance - a.attendance;
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gestão de Salas e Ranking">
      <div className="flex flex-col gap-6 max-h-[70vh]">
        {/* Tabs */}
        <div className="flex p-1 bg-[var(--app-bg)] border border-[var(--card-border)] rounded-xl">
          <button
            onClick={() => setView('list')}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${view === 'list' 
              ? 'bg-[var(--accent-primary)] text-white shadow-lg' 
              : 'text-[var(--app-text-dim)] hover:text-[var(--app-text)]'}`}
          >
            Lista de Salas
          </button>
          <button
            onClick={() => setView('ranking')}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${view === 'ranking' 
              ? 'bg-[var(--accent-primary)] text-white shadow-lg' 
              : 'text-[var(--app-text-dim)] hover:text-[var(--app-text)]'}`}
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
                className="flex-1 bg-[var(--app-bg)] border border-[var(--card-border)] rounded-xl px-4 py-2 text-sm text-[var(--app-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)]/50"
              />
              <Button onClick={handleAddRoom} variant="primary" className="px-4 py-2 text-sm h-auto font-black uppercase tracking-widest">
                Adicionar
              </Button>
            </div>

            {/* Room List Table */}
            <div className="overflow-y-auto pr-2 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] font-black text-[var(--app-text-dim)] uppercase tracking-widest border-b border-[var(--card-border)]">
                    <th className="py-3 px-2">Sala</th>
                    <th className="py-3 px-2 text-center">Pres.</th>
                    <th className="py-3 px-2 text-center">Oferta</th>
                    <th className="py-3 px-2 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--card-border)]/50">
                  {rooms.map((room) => (
                    <tr
                      key={room.id}
                      className={`group transition-colors ${activeRoomId === room.id ? 'bg-[var(--accent-primary)]/5' : 'hover:bg-[var(--app-text)]/5'}`}
                    >
                      <td className="py-3 px-2">
                        <div className="flex flex-col">
                          {editingId === room.id ? (
                            <input
                              type="text"
                              value={editingName}
                              onChange={(e) => setEditingName(e.target.value)}
                              className="bg-transparent border-b border-[var(--accent-primary)] focus:outline-none font-black text-sm text-[var(--app-text)] w-full"
                              autoFocus
                              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(room.id)}
                            />
                          ) : (
                            <span 
                              onClick={() => !editingId && onSelectRoom(room.id === activeRoomId ? null : room.id)}
                              className={`font-black text-sm cursor-pointer hover:underline decoration-[var(--accent-primary)] decoration-2 underline-offset-4 ${activeRoomId === room.id ? 'text-[var(--accent-primary)]' : 'text-[var(--app-text)]'}`}
                            >
                              {room.name}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          value={room.attendance}
                          onChange={(e) => handleUpdateField(room.id, 'attendance', parseInt(e.target.value) || 0)}
                          className="w-12 bg-transparent text-center text-sm font-black text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]/30 rounded"
                        />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <input
                          type="number"
                          value={room.offering}
                          onChange={(e) => handleUpdateField(room.id, 'offering', parseFloat(e.target.value) || 0)}
                          className="w-16 bg-transparent text-center text-sm font-black text-[var(--app-text)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-primary)]/30 rounded"
                        />
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {editingId === room.id ? (
                            <button
                              onClick={() => handleSaveEdit(room.id)}
                              className="p-1.5 bg-green-500 text-white rounded-lg shadow-lg"
                              title="Salvar"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStartEdit(room)}
                              className="p-1.5 text-[var(--app-text-dim)] hover:text-[var(--accent-primary)] transition-all"
                              title="Editar Nome"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteRoom(room.id)}
                            className="p-1.5 text-[var(--app-text-dim)] hover:text-rose-500 transition-colors"
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
                <tr className="text-[10px] font-black text-[var(--app-text-dim)] uppercase tracking-widest border-b border-[var(--card-border)]">
                  <th className="py-3 px-2">Pos.</th>
                  <th className="py-3 px-2">Sala</th>
                  <th className="py-3 px-2 text-center">Pres.</th>
                  <th className="py-3 px-2 text-center">Oferta</th>
                  <th className="py-3 px-2 text-center">Vitórias</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--card-border)]/50">
                {sortedRooms.map((room, index) => (
                  <tr key={room.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-2">
                       <span className={`text-xs font-black ${
                         index === 0 ? 'text-amber-400' : index === 1 ? 'text-[var(--app-text-dim)]' : index === 2 ? 'text-amber-700' : 'text-[var(--card-border)]'
                       }`}>
                         #{index + 1}
                       </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-black text-sm text-[var(--app-text)]">{room.name}</span>
                    </td>
                    <td className="py-3 px-2 text-center font-mono text-xs text-[var(--app-text-dim)]">{room.attendance}</td>
                    <td className="py-3 px-2 text-center font-mono text-xs text-[var(--app-text-dim)]">{room.offering}</td>
                    <td className="py-3 px-2 text-center">
                      <span className="bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] text-xs font-black px-2 py-0.5 rounded border border-[var(--accent-primary)]/20">
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
