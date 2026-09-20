import React from 'react';
import { Sparkles, ArrowRight, BookOpen, ShieldCheck, X } from 'lucide-react';
import { ebookConfig } from '../config/ebookConfig';
import { translations } from '../config/i18n';
import { RoomId, Language } from '../types';

interface FoyerWelcomeProps {
  isVisible: boolean;
  currentLanguage: Language;
  onClose: () => void;
  onStartTour: () => void;
  onNavigateRoom: (roomId: RoomId) => void;
  onOpenVault: () => void;
}

export const FoyerWelcome: React.FC<FoyerWelcomeProps> = ({
  isVisible,
  currentLanguage,
  onClose,
  onStartTour,
  onNavigateRoom,
  onOpenVault,
}) => {
  if (!isVisible) return null;

  const t = translations[currentLanguage];

  return (
    <div className="fixed top-20 left-4 sm:left-8 z-30 max-w-sm sm:max-w-md pointer-events-auto animate-fade-in">
      <div className="relative p-6 rounded-2xl bg-neutral-950/85 backdrop-blur-xl border border-cyan-500/40 shadow-[0_0_40px_rgba(6,182,212,0.2)] space-y-4">
        {/* Dismiss Button */}
        <button
          id="btn-dismiss-foyer-welcome"
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Badge & Title */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              {t.foyer.badge}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight leading-tight">
            {t.appTitle}
          </h2>
          <p className="text-xs text-neutral-300 mt-1.5 font-sans leading-relaxed">
            {t.guardianDialogues.foyer.lore.split('.')[0]}. {t.guardianDialogues.foyer.lore.split('.')[1]}.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-neutral-400 bg-neutral-900/60 p-3 rounded-xl border border-neutral-800/80">
          {t.foyer.highlights.map((h, i) => (
            <div key={i}>{h}</div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          {/* Begin Tour */}
          <button
            id="btn-start-interactive-tour"
            onClick={() => {
              onStartTour();
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold font-sans text-xs tracking-wide transition-all shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:scale-[1.02]"
          >
            <span>Begin Guided Spatial Tour</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {/* Direct Vault */}
            <button
              id="btn-foyer-jump-vault"
              onClick={() => {
                onOpenVault();
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 text-[11px] font-mono border border-amber-500/40 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>The Vault (NEC)</span>
            </button>

            {/* Reading Lounge */}
            <button
              id="btn-foyer-jump-lounge"
              onClick={() => {
                onNavigateRoom('lounge');
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 text-[11px] font-mono border border-emerald-500/40 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reading Lounge</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
