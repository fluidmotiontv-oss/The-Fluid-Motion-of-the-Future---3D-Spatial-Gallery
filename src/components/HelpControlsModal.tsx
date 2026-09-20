import React, { useMemo } from 'react';
import { X, Navigation, MousePointer, Volume2, Sparkles, Keyboard, Cpu, Gauge, Zap } from 'lucide-react';
import { getHardwareDiagnostics } from '../utils/hardwareDetection';

interface HelpControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPerformanceMode?: boolean;
  onTogglePerformanceMode?: () => void;
}

export const HelpControlsModal: React.FC<HelpControlsModalProps> = ({
  isOpen,
  onClose,
  isPerformanceMode = false,
  onTogglePerformanceMode,
}) => {
  const diag = useMemo(() => getHardwareDiagnostics(), [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-700/80 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold font-sans text-white">
              Spatial Navigation & Controls
            </h3>
          </div>
          <button
            id="btn-close-help-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Shortcuts list */}
        <div className="space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <span className="text-neutral-300 font-sans">Mouse Drag / Touch Pan</span>
            <span className="px-2 py-1 rounded bg-neutral-800 text-cyan-300">Spatial Look</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <span className="text-neutral-300 font-sans">Pinch Gesture / Touch</span>
            <span className="px-2 py-1 rounded bg-neutral-800 text-purple-300">Pinch Zoom FOV</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <span className="text-neutral-300 font-sans">Left Click / Tap 3D Items</span>
            <span className="px-2 py-1 rounded bg-neutral-800 text-cyan-300">Interact / Portals</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <span className="text-neutral-300 font-sans">Keyboard Keys 1 - 5</span>
            <span className="px-2 py-1 rounded bg-neutral-800 text-amber-300">Jump Chambers</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <span className="text-neutral-300 font-sans">Key [G]</span>
            <span className="px-2 py-1 rounded bg-neutral-800 text-cyan-300">Toggle Guardian</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <span className="text-neutral-300 font-sans">Key [M]</span>
            <span className="px-2 py-1 rounded bg-neutral-800 text-neutral-300">Toggle Audio</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800">
            <span className="text-neutral-300 font-sans">Key [Space]</span>
            <span className="px-2 py-1 rounded bg-neutral-800 text-amber-400">3D Book Vault</span>
          </div>
        </div>

        {/* Hardware Capability & Performance Tier Diagnostics */}
        <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-200">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Hardware Tier & WebGL Capabilities</span>
            </div>
            {onTogglePerformanceMode && (
              <button
                id="btn-modal-toggle-perf"
                onClick={onTogglePerformanceMode}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                  isPerformanceMode
                    ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                    : 'bg-purple-950/80 border-purple-400 text-purple-300'
                }`}
              >
                {isPerformanceMode ? <Zap className="w-3 h-3 text-emerald-400" /> : <Gauge className="w-3 h-3 text-purple-400" />}
                {isPerformanceMode ? 'Perf Mode' : 'High Quality'}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400">
            <div className="bg-neutral-900/80 p-2 rounded border border-neutral-800/80">
              <div className="text-neutral-500 text-[10px]">CPU Cores / RAM</div>
              <div className="text-neutral-200 font-semibold">{diag.cores} Cores • {diag.memoryGB}</div>
            </div>
            <div className="bg-neutral-900/80 p-2 rounded border border-neutral-800/80">
              <div className="text-neutral-500 text-[10px]">Max Texture Size</div>
              <div className="text-neutral-200 font-semibold">{diag.maxTextureSize}px</div>
            </div>
            <div className="col-span-2 bg-neutral-900/80 p-2 rounded border border-neutral-800/80">
              <div className="text-neutral-500 text-[10px]">GPU Renderer</div>
              <div className="text-neutral-200 font-semibold truncate">{diag.gpuRenderer}</div>
            </div>
          </div>
        </div>

        <div className="pt-1 text-center">
          <button
            id="btn-dismiss-help-ok"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold font-sans text-xs tracking-wide transition-all shadow-md"
          >
            Got It • Return to Gallery
          </button>
        </div>
      </div>
    </div>
  );
};
