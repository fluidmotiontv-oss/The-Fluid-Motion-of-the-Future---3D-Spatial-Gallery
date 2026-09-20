import React, { useState } from 'react';
import { MapPin, Navigation, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { ebookConfig } from '../config/ebookConfig';
import { RoomId } from '../types';

interface MinimapOverlayProps {
  currentRoomId: RoomId;
  onSelectRoom: (roomId: RoomId) => void;
}

export const MinimapOverlay: React.FC<MinimapOverlayProps> = ({
  currentRoomId,
  onSelectRoom,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // Room nodes positioned on the architectural theme-park floorplan grid (percentages)
  const nodeLayout: Record<RoomId, { x: number; y: number; label: string; number: string }> = {
    foyer: { x: 50, y: 50, label: 'Foyer', number: '01' },
    hall1: { x: 50, y: 26, label: 'Hall I', number: '02' },
    hall2: { x: 78, y: 26, label: 'Hall II', number: '03' },
    lotus: { x: 22, y: 26, label: 'Lotus Nexus', number: '04' },
    lounge: { x: 78, y: 50, label: 'Lounge', number: '05' },
    games: { x: 22, y: 50, label: 'Games/Pool', number: '06' },
    theater: { x: 22, y: 75, label: 'Theater', number: '07' },
    skatepark: { x: 50, y: 75, label: 'Skatepark', number: '08' },
    waterworld: { x: 78, y: 75, label: 'Water World', number: '09' },
    vault: { x: 50, y: 91, label: 'The Vault', number: '10' },
  };

  return (
    <div className="fixed bottom-20 right-4 sm:right-8 z-30 pointer-events-auto">
      <div className="flex flex-col items-end">
        {/* Toggle / Header Pill */}
        <button
          id="btn-toggle-minimap"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-3 py-1.5 mb-2 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-xs font-mono text-neutral-300 hover:text-white backdrop-blur-md shadow-lg transition-all"
        >
          <Navigation className="w-3.5 h-3.5 text-cyan-400" />
          <span>Spatial Floorplan</span>
          {isExpanded ? <Minimize2 className="w-3.5 h-3.5 ml-1" /> : <Maximize2 className="w-3.5 h-3.5 ml-1" />}
        </button>

        {/* Map Container */}
        <div
          className={`transition-all duration-300 ease-out origin-bottom-right rounded-2xl bg-neutral-950/90 backdrop-blur-xl border border-neutral-800 p-4 shadow-2xl overflow-hidden ${
            isExpanded
              ? 'w-72 sm:w-80 h-72 sm:h-80 opacity-100 scale-100'
              : 'w-48 sm:w-56 h-44 sm:h-48 opacity-95 scale-95'
          }`}
        >
          <div className="relative w-full h-full flex flex-col justify-between">
            {/* Map Top Bar */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Gallery Grid v2.6
              </span>
              <span className="text-[10px] font-mono text-neutral-500">Click to Teleport</span>
            </div>

            {/* Spatial Schematic Canvas */}
            <div className="relative flex-1 w-full my-1 rounded-lg bg-neutral-900/40 border border-neutral-800/60 overflow-hidden">
              {/* Floor grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px]" />

              {/* Connecting Hallway Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none stroke-neutral-700 stroke-2">
                {/* Central Foyer Cross */}
                <line x1="50%" y1="50%" x2="50%" y2="26%" strokeDasharray="3 3" />
                <line x1="50%" y1="50%" x2="78%" y2="50%" strokeDasharray="3 3" />
                <line x1="50%" y1="50%" x2="22%" y2="50%" strokeDasharray="3 3" />
                <line x1="50%" y1="50%" x2="50%" y2="75%" strokeDasharray="3 3" />
                {/* North Row */}
                <line x1="22%" y1="26%" x2="78%" y2="26%" strokeDasharray="3 3" />
                {/* East & West Columns */}
                <line x1="78%" y1="26%" x2="78%" y2="75%" strokeDasharray="3 3" />
                <line x1="22%" y1="26%" x2="22%" y2="75%" strokeDasharray="3 3" />
                {/* South Row & Vault */}
                <line x1="22%" y1="75%" x2="78%" y2="75%" strokeDasharray="3 3" />
                <line x1="50%" y1="75%" x2="50%" y2="91%" strokeDasharray="3 3" />
              </svg>

              {/* Room Nodes */}
              {(Object.keys(nodeLayout) as RoomId[]).map((roomId) => {
                const node = nodeLayout[roomId];
                const roomData = ebookConfig.rooms.find(r => r.id === roomId)!;
                const isActive = currentRoomId === roomId;

                return (
                  <button
                    key={roomId}
                    id={`btn-minimap-room-${roomId}`}
                    onClick={() => onSelectRoom(roomId)}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer p-1 focus:outline-none"
                  >
                    {/* Pulsing ring for active room */}
                    {isActive && (
                      <span
                        className="absolute inset-0 rounded-full animate-ping opacity-75"
                        style={{ backgroundColor: roomData.themeColor }}
                      />
                    )}

                    {/* Node Core */}
                    <div
                      className={`relative flex items-center justify-center rounded-full transition-all duration-200 ${
                        isActive
                          ? 'w-6 h-6 border-2 border-white shadow-[0_0_12px_rgba(255,255,255,0.8)] scale-110'
                          : 'w-4 h-4 border border-neutral-600 bg-neutral-900 group-hover:scale-125 group-hover:border-white'
                      }`}
                      style={{
                        backgroundColor: isActive ? roomData.themeColor : undefined,
                      }}
                    >
                      {roomId === 'vault' ? (
                        <Sparkles className="w-2.5 h-2.5 text-neutral-950" />
                      ) : (
                        <span className="text-[8px] font-mono font-bold text-neutral-950">
                          {isActive ? node.number : ''}
                        </span>
                      )}
                    </div>

                    {/* Floating Label */}
                    <span
                      className={`absolute left-1/2 -translate-x-1/2 -bottom-5 whitespace-nowrap text-[9px] font-mono px-1.5 py-0.5 rounded transition-colors ${
                        isActive
                          ? 'font-bold text-neutral-100 bg-neutral-900/90 border border-neutral-700'
                          : 'text-neutral-400 group-hover:text-neutral-200'
                      }`}
                    >
                      {node.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Minimap Status Footer */}
            <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-neutral-400 border-t border-neutral-800/80">
              <span className="truncate max-w-[150px]">
                {ebookConfig.rooms.find(r => r.id === currentRoomId)?.name}
              </span>
              <span className="text-cyan-400">FPS: 60 WebGL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
