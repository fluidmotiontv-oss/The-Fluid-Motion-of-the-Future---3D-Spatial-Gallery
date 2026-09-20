import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  BookOpen,
  Clock,
  Layers,
  Sparkles,
  Music,
  Gamepad2,
  Tv,
  Zap,
  Waves,
} from 'lucide-react';
import { ebookConfig } from '../config/ebookConfig';
import { RoomId } from '../types';

interface RoomControlsProps {
  currentRoomId: RoomId;
  onSelectRoom: (roomId: RoomId) => void;
  onOpenVault: () => void;
}

export const RoomControls: React.FC<RoomControlsProps> = ({
  currentRoomId,
  onSelectRoom,
  onOpenVault,
}) => {
  const roomOrder: RoomId[] = [
    'foyer',
    'hall1',
    'hall2',
    'lotus',
    'lounge',
    'games',
    'theater',
    'skatepark',
    'waterworld',
    'vault',
  ];
  const currentIndex = roomOrder.indexOf(currentRoomId);

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + roomOrder.length) % roomOrder.length;
    onSelectRoom(roomOrder[prevIndex]);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % roomOrder.length;
    onSelectRoom(roomOrder[nextIndex]);
  };

  const getIcon = (id: RoomId) => {
    switch (id) {
      case 'foyer':
        return <Sparkles className="w-3.5 h-3.5" />;
      case 'hall1':
        return <Clock className="w-3.5 h-3.5" />;
      case 'hall2':
        return <Layers className="w-3.5 h-3.5" />;
      case 'lotus':
        return <Music className="w-3.5 h-3.5 text-pink-400" />;
      case 'lounge':
        return <BookOpen className="w-3.5 h-3.5" />;
      case 'games':
        return <Gamepad2 className="w-3.5 h-3.5 text-purple-400" />;
      case 'theater':
        return <Tv className="w-3.5 h-3.5 text-red-400" />;
      case 'skatepark':
        return <Zap className="w-3.5 h-3.5 text-orange-400" />;
      case 'waterworld':
        return <Waves className="w-3.5 h-3.5 text-sky-400" />;
      case 'vault':
        return <ShieldCheck className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 pointer-events-auto max-w-[95vw]">
      {/* Interactive Helper Banner */}
      <div className="hidden sm:flex items-center gap-2 px-3.5 py-1 rounded-full bg-neutral-950/80 border border-neutral-800/80 text-[11px] font-mono text-neutral-400 backdrop-blur-md">
        <span className="text-cyan-400">✦ Click</span> 3D exhibits, doorway portals, or the central hardcover tome to interact
      </div>

      {/* Main Navigation Bar */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-2xl bg-neutral-950/85 backdrop-blur-xl border border-neutral-800 shadow-2xl">
        {/* Previous Button */}
        <button
          id="btn-nav-prev-room"
          onClick={handlePrev}
          title="Previous Chamber"
          className="flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-300 hover:text-white transition-all active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Room Quick Selection Chips */}
        <div className="flex items-center gap-1 overflow-x-auto max-w-[60vw] sm:max-w-none scrollbar-none px-1">
          {ebookConfig.rooms.map((room, idx) => {
            const isActive = currentRoomId === room.id;
            const isVault = room.id === 'vault';

            return (
              <button
                key={room.id}
                id={`btn-nav-chip-${room.id}`}
                onClick={() => onSelectRoom(room.id)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-mono transition-all whitespace-nowrap ${
                  isActive
                    ? isVault
                      ? 'bg-amber-500 text-neutral-950 font-bold shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                      : 'bg-neutral-100 text-neutral-950 font-bold shadow-[0_0_12px_rgba(255,255,255,0.3)]'
                    : isVault
                    ? 'bg-amber-950/40 text-amber-300 border border-amber-500/40 hover:bg-amber-900/60'
                    : 'bg-neutral-900/70 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/80'
                }`}
              >
                {getIcon(room.id)}
                <span className="hidden md:inline font-sans">{room.name}</span>
                <span className="md:hidden font-mono">0{idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          id="btn-nav-next-room"
          onClick={handleNext}
          title="Next Chamber"
          className="flex items-center justify-center w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-300 hover:text-white transition-all active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
