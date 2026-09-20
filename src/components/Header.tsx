import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Sparkles, ShoppingBag, HelpCircle, Compass, Share2, Globe, Terminal, Gauge, Zap, Coins } from 'lucide-react';
import { ebookConfig } from '../config/ebookConfig';
import { translations } from '../config/i18n';
import { RoomId, Language } from '../types';
import { Dragon9ClockComponent } from './Dragon9ClockComponent';
import { economicLedger } from '../utils/economicLedger';

interface HeaderProps {
  currentRoomId: RoomId;
  currentLanguage: Language;
  onToggleLanguage: (lang: Language) => void;
  isAudioMuted: boolean;
  onToggleAudio: () => void;
  onOpenVault: () => void;
  onOpenHelp: () => void;
  onOpenShare: () => void;
  onOpenPipeline: () => void;
  isAutoTour: boolean;
  onToggleAutoTour: () => void;
  isPerformanceMode: boolean;
  onTogglePerformanceMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoomId,
  currentLanguage,
  onToggleLanguage,
  isAudioMuted,
  onToggleAudio,
  onOpenVault,
  onOpenHelp,
  onOpenShare,
  onOpenPipeline,
  isAutoTour,
  onToggleAutoTour,
  isPerformanceMode,
  onTogglePerformanceMode,
}) => {
  const t = translations[currentLanguage];
  const roomText = t.rooms[currentRoomId] || t.rooms.foyer;
  const currentRoom = ebookConfig.rooms.find(r => r.id === currentRoomId) || ebookConfig.rooms[0];

  const [necBalance, setNecBalance] = useState<number>(() => economicLedger.getBalance());

  useEffect(() => {
    const interval = setInterval(() => {
      setNecBalance(economicLedger.getBalance());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between px-3 sm:px-8 py-3 bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800/60 pointer-events-auto">
      {/* Brand & Subtitle */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
          <span className="font-serif font-bold text-base sm:text-lg text-cyan-400">D9</span>
          <div className="absolute -inset-0.5 rounded-xl border border-cyan-400/20 animate-pulse pointer-events-none" />
        </div>
        <div className="hidden md:block">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold tracking-wider text-neutral-100 uppercase font-sans">
              Sovereign Horizon Interface
            </h1>
            <span className="px-1.5 py-0.5 text-[10px] font-mono font-semibold uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded">
              Dragon Buddy Active
            </span>
          </div>
          <p className="text-xs text-neutral-400 tracking-wide font-sans">
            Sovereign Mesh Node: New Zealand (Port Waikato) • Secured Cloudflare Tunnel
          </p>
        </div>
      </div>

      {/* Dragon 9 Temporal Standard & Economic Ledger */}
      <div className="hidden lg:flex items-center gap-4">
        <Dragon9ClockComponent />
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/5 border border-amber-500/20 text-[10px] font-mono text-amber-400">
          <Coins className="w-3 h-3 text-amber-500" />
          <span>{necBalance.toLocaleString()} NEC</span>
        </div>
      </div>

      {/* Current Room Indicator Badge */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700/60 shadow-inner">
        <div
          className="w-2.5 h-2.5 rounded-full animate-ping"
          style={{ backgroundColor: currentRoom.themeColor }}
        />
        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
          <span className="text-[10px] uppercase font-mono text-neutral-400 tracking-wider">
            Chamber:
          </span>
          <span className="text-xs font-semibold text-neutral-100 font-sans tracking-wide">
            {roomText.name}
          </span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Language Switcher Toggle */}
        <button
          id="btn-language-toggle"
          onClick={() => onToggleLanguage(currentLanguage === 'en' ? 'ja' : 'en')}
          title="Switch Language / 言語切替 (EN / 日本語)"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900/90 border border-neutral-700 hover:border-cyan-400 text-xs font-mono text-neutral-200 hover:text-cyan-300 transition-colors shadow-sm"
        >
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-bold">{currentLanguage === 'en' ? 'EN' : '日本語'}</span>
        </button>

        {/* Low-Spec & Performance Fallback Toggle */}
        <button
          id="btn-toggle-performance"
          onClick={onTogglePerformanceMode}
          title={isPerformanceMode ? "Performance Mode Active (Fast FPS, Low FX)" : "High Quality FX Active (Bloom, Shader Waves)"}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 border ${
            isPerformanceMode
              ? 'bg-emerald-950/60 border-emerald-400 text-emerald-300 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
              : 'bg-neutral-900/90 border-neutral-700 text-neutral-300 hover:border-purple-400 hover:text-purple-300'
          }`}
        >
          {isPerformanceMode ? (
            <>
              <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="font-semibold">{currentLanguage === 'ja' ? '軽量' : 'Perf'}</span>
            </>
          ) : (
            <>
              <Gauge className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline font-semibold">{currentLanguage === 'ja' ? '高画質' : 'HQ'}</span>
            </>
          )}
        </button>

        {/* Pipeline Terminal Button */}
        <button
          id="btn-header-pipeline"
          onClick={onOpenPipeline}
          title="Pipeline Export Terminal (Creator Station)"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-amber-500/40 text-xs font-mono text-amber-300 hover:bg-amber-950/40 hover:border-amber-400 hover:text-white transition-all shadow-[0_0_10px_rgba(245,158,11,0.15)]"
        >
          <Terminal className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="hidden lg:inline">Pipeline Terminal</span>
        </button>

        {/* Social Share Chamber Button */}
        <button
          id="btn-header-share"
          onClick={onOpenShare}
          title="Share This 3D Chamber"
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-400 hover:text-white transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)]"
        >
          <Share2 className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">{t.nav.share}</span>
        </button>

        {/* Guided Auto-Tour Toggle */}
        <button
          id="btn-toggle-auto-tour"
          onClick={onToggleAutoTour}
          title={isAutoTour ? t.nav.pauseTour : t.nav.guidedTour}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 border ${
            isAutoTour
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
              : 'bg-neutral-900/80 border-neutral-700 text-neutral-300 hover:border-neutral-500 hover:text-white'
          }`}
        >
          <Compass className={`w-3.5 h-3.5 ${isAutoTour ? 'animate-spin' : ''}`} />
          <span className="hidden lg:inline">{isAutoTour ? t.nav.pauseTour : t.nav.guidedTour}</span>
        </button>

        {/* Spatial Audio Synthesizer Toggle */}
        <button
          id="btn-toggle-audio"
          onClick={onToggleAudio}
          title={isAudioMuted ? 'Unmute Spatial Audio' : 'Mute Spatial Audio'}
          className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-700 text-xs font-mono text-neutral-300 hover:border-neutral-500 hover:text-white transition-colors"
        >
          {isAudioMuted ? (
            <VolumeX className="w-4 h-4 text-neutral-500" />
          ) : (
            <Volume2 className="w-4 h-4 text-cyan-400 animate-pulse" />
          )}
          <span className="hidden xl:inline">{isAudioMuted ? t.nav.soundOff : t.nav.soundOn}</span>
        </button>

        {/* Keyboard / Controls Help */}
        <button
          id="btn-open-help"
          onClick={onOpenHelp}
          title="Controls & Shortcuts"
          className="p-1.5 sm:p-2 rounded-lg bg-neutral-900/80 border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Buy Now / Store CTA */}
        <button
          id="btn-header-buy-now"
          onClick={onOpenVault}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs sm:text-sm tracking-wide shadow-[0_0_15px_rgba(245,158,11,0.35)] transition-all hover:scale-[1.03] active:scale-[0.98]"
        >
          <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="font-sans font-semibold whitespace-nowrap">{t.nav.vault}</span>
        </button>
      </div>
    </header>
  );
};

