import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Timer, RefreshCw, ZapOff } from 'lucide-react';
import { getDragon9Time, Dragon9Time } from '../utils/dragon9Time';
import { spatialAudio } from '../audio/spatialAudio';

export const IntermissionOverlay: React.FC = () => {
  const [d9Time, setD9Time] = useState<Dragon9Time>(() => getDragon9Time());
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextTime = getDragon9Time();
      setD9Time(nextTime);
      
      // Reset dismissal state when intermission ends
      if (!nextTime.isIntermission) {
        setIsDismissed(false);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Play sound when intermission starts
  useEffect(() => {
    if (d9Time.isIntermission && !isDismissed) {
      spatialAudio.playIntermissionAlert();
    }
  }, [d9Time.isIntermission, isDismissed]);

  if (!d9Time.isIntermission || isDismissed) return null;

  const isMidnight = d9Time.intermissionType === 'midnight';
  const title = isMidnight ? 'Midnight Recalibration' : 'Midday Spatial Stabilization';
  const subtext = isMidnight 
    ? 'The Dragon 9 nodes are resetting for the new temporal cycle.' 
    : 'Localized atmospheric pressure balancing is currently in progress.';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-neutral-950/40 backdrop-blur-3xl pointer-events-auto"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          className="relative max-w-lg w-full p-8 rounded-3xl bg-neutral-900/80 border border-amber-500/40 shadow-[0_0_80px_rgba(245,158,11,0.25)] text-center space-y-6 overflow-hidden"
        >
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-[80px] animate-pulse" />
          
          {/* Icon Header */}
          <div className="relative flex justify-center">
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-500">
              {isMidnight ? <ZapOff className="w-10 h-10 animate-pulse" /> : <RefreshCw className="w-10 h-10 animate-spin-slow" />}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-amber-400">
                Super Puff Security Notice
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white tracking-tight">
              {title}
            </h2>
            <p className="text-sm text-neutral-400 font-sans leading-relaxed px-4">
              {subtext}
            </p>
          </div>

          {/* Timer Display */}
          <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 inline-flex items-center gap-3">
            <Timer className="w-4 h-4 text-cyan-400" />
            <div className="text-left">
              <div className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">Remaining Duration</div>
              <div className="text-lg font-mono font-bold text-cyan-400 tracking-widest">
                {(() => {
                  const mm = Math.floor(d9Time.remainingSecondsIntermission / 60);
                  const ss = d9Time.remainingSecondsIntermission % 60;
                  return `${mm.toString().padStart(2, '0')}:${ss.toString().padStart(2, '0')}`;
                })()}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col gap-3">
            <div className="text-[10px] font-mono text-neutral-500 italic">
              Estimated Stabilization Complete at {isMidnight ? '00:00:00 D9' : '13:18:00 D9'}
            </div>
            
            <button
              onClick={() => {
                spatialAudio.playInteractSound('click');
                setIsDismissed(true);
              }}
              className="px-6 py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono border border-neutral-700 transition-all hover:text-white"
            >
              Override Protocol (Emergency Access)
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
