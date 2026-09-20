import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Play,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Volume2,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Compass,
  Lightbulb,
  Layers,
} from 'lucide-react';
import { ebookConfig } from '../config/ebookConfig';
import { translations } from '../config/i18n';
import { RoomId, Language } from '../types';
import { spatialAudio } from '../audio/spatialAudio';

interface DragonGuardianDialogueProps {
  currentRoomId: RoomId;
  currentLanguage: Language;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onNavigateRoom: (roomId: RoomId) => void;
  onOpenExhibits: () => void;
  onOpenLounge: () => void;
  onOpenVault: () => void;
  isAutoTour: boolean;
  onToggleAutoTour: () => void;
}

export const DragonGuardianDialogue: React.FC<DragonGuardianDialogueProps> = ({
  currentRoomId,
  currentLanguage,
  isOpen,
  onClose,
  onOpen,
  onNavigateRoom,
  onOpenExhibits,
  onOpenLounge,
  onOpenVault,
  isAutoTour,
  onToggleAutoTour,
}) => {
  const [activeTab, setActiveTab] = useState<'lore' | 'insights'>('lore');
  const [isSpeakingVoice, setIsSpeakingVoice] = useState<boolean>(false);

  const t = translations[currentLanguage];
  const dialogue = t.guardianDialogues[currentRoomId] || t.guardianDialogues.foyer;
  const roomText = t.rooms[currentRoomId] || t.rooms.foyer;

  // Play a soft guardian chime when room changes and guardian speaks
  useEffect(() => {
    if (isOpen) {
      spatialAudio.playInteractSound('portal');
    }
  }, [currentRoomId, isOpen]);

  // Voice synthesis sound simulation + Web Speech API
  const handlePlayVoice = () => {
    setIsSpeakingVoice(true);
    spatialAudio.playInteractSound('click');

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(dialogue.lore);
      utterance.lang = currentLanguage === 'ja' ? 'ja-JP' : 'en-US';
      utterance.rate = currentLanguage === 'ja' ? 1.0 : 1.0;
      utterance.pitch = 0.8; // Deeper, more authoritative bodyguard voice
      utterance.onend = () => setIsSpeakingVoice(false);
      utterance.onerror = () => setIsSpeakingVoice(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeakingVoice(false), 3000);
    }
  };

  // Minimized Floating Pill when closed
  if (!isOpen) {
    return (
      <div className="fixed bottom-24 left-4 sm:left-8 z-30 pointer-events-auto animate-fade-in">
        <button
          id="btn-summon-guardian"
          onClick={() => {
            spatialAudio.playInteractSound('click');
            onOpen();
          }}
          className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-neutral-950/90 hover:bg-neutral-900 border border-cyan-500/50 hover:border-cyan-400 text-neutral-100 shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all hover:scale-105 group"
        >
          {/* Super Puff Avatar Orb */}
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-500 p-0.5 shadow-inner">
            <span className="absolute inset-0 rounded-full animate-ping bg-cyan-400 opacity-30" />
            <ShieldCheck className="w-4 h-4 text-white relative z-10" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                {currentLanguage === 'ja' ? 'Super Puff (ボディガード)' : 'Super Puff (Bodyguard)'}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <span className="text-xs font-sans text-neutral-300 block font-medium group-hover:text-white">
              {currentLanguage === 'ja' ? `${roomText.name}の安全を確認` : `Scan ${roomText.name} safety`}
            </span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div
      id="guardian-dialogue-card"
      className="fixed bottom-24 left-4 sm:left-8 z-30 max-w-sm sm:max-w-md w-[calc(100vw-2rem)] sm:w-full pointer-events-auto animate-fade-in"
    >
      <div className="relative rounded-2xl bg-neutral-950/90 backdrop-blur-xl border border-cyan-500/40 shadow-[0_0_35px_rgba(6,182,212,0.25)] p-5 space-y-4 overflow-hidden">
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-purple-600 p-0.5 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
              <span className="absolute inset-0 rounded-xl animate-pulse bg-cyan-400 opacity-20" />
              <ShieldCheck className="w-5 h-5 text-white relative z-10" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                  {currentLanguage === 'ja' ? 'Super Puff' : 'Super Puff'}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                  Bodyguard
                </span>
              </div>
              <h4 className="text-xs font-bold font-sans text-white">
                {currentLanguage === 'ja' ? '空間防衛 & ガイド' : 'Spatial Defense & Guide'} • {roomText.name}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Audio Voiceover / TTS */}
            <button
              id="btn-guardian-voice"
              onClick={handlePlayVoice}
              title={currentLanguage === 'ja' ? 'ガーディアンの音声を聴く' : 'Listen to Guardian Voice'}
              className={`p-1.5 rounded-lg border transition-colors ${
                isSpeakingVoice
                  ? 'bg-cyan-500 text-neutral-950 border-cyan-400 animate-pulse'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-cyan-400 hover:border-cyan-500/50'
              }`}
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {/* Minimize */}
            <button
              id="btn-minimize-guardian"
              onClick={() => {
                spatialAudio.playInteractSound('click');
                onClose();
              }}
              title="Minimize Companion"
              className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Switcher: Lore vs Key Insights */}
        <div className="flex items-center gap-2 p-1 rounded-xl bg-neutral-900/80 border border-neutral-800/80">
          <button
            onClick={() => setActiveTab('lore')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'lore'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{currentLanguage === 'ja' ? '世界観 & 解説' : 'Lore & Vision'}</span>
          </button>

          <button
            onClick={() => setActiveTab('insights')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
              activeTab === 'insights'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{currentLanguage === 'ja' ? '3つの要点' : '3 Key Proofs'}</span>
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'lore' ? (
          <div className="space-y-2 text-xs font-sans leading-relaxed text-neutral-200">
            <p className="font-semibold text-cyan-300 italic text-[11px] font-mono">
              "{dialogue.intro}"
            </p>
            <p className="text-neutral-300 text-xs leading-relaxed bg-neutral-900/40 p-3 rounded-xl border border-neutral-800/60">
              {dialogue.lore}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {dialogue.insights.map((insight, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2.5 rounded-xl bg-neutral-900/60 border border-neutral-800 text-xs font-sans text-neutral-300"
              >
                <span className="w-4 h-4 shrink-0 rounded-full bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-[10px] font-mono text-cyan-300 mt-0.5">
                  {idx + 1}
                </span>
                <span>{insight}</span>
              </div>
            ))}
          </div>
        )}

        {/* Suggested Action Bar */}
        <div className="pt-1 space-y-2 border-t border-neutral-800/80">
          {currentRoomId === 'foyer' && (
            <button
              id="btn-guardian-action-tour"
              onClick={() => {
                onToggleAutoTour();
                if (!isAutoTour) {
                  onNavigateRoom('hall1');
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-neutral-950 font-bold font-sans text-xs tracking-wide shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all hover:scale-[1.01]"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>
                {isAutoTour
                  ? (currentLanguage === 'ja' ? 'ガイドツアーを一時停止' : 'Pause Guided Auto-Tour')
                  : (currentLanguage === 'ja' ? '5室のガイドツアーを開始' : 'Start 5-Chamber Guided Tour')}
              </span>
            </button>
          )}

          {(currentRoomId === 'hall1' || currentRoomId === 'hall2') && (
            <div className="flex items-center gap-2">
              <button
                id="btn-guardian-action-exhibits"
                onClick={onOpenExhibits}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-bold font-sans text-xs tracking-wide transition-all shadow-sm"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{currentLanguage === 'ja' ? '展示詳細' : 'Open Exhibits'}</span>
              </button>

              <button
                id="btn-guardian-action-next-room"
                onClick={() => onNavigateRoom(currentRoomId === 'hall1' ? 'hall2' : 'lounge')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-mono text-xs transition-colors"
              >
                <span>{currentLanguage === 'ja' ? '次の展示室' : 'Next Chamber'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          )}

          {currentRoomId === 'lounge' && (
            <div className="flex items-center gap-2">
              <button
                id="btn-guardian-action-lounge"
                onClick={onOpenLounge}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold font-sans text-xs tracking-wide transition-all shadow-sm"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>{currentLanguage === 'ja' ? 'リーダーを開く' : 'Open E-Reader'}</span>
              </button>

              <button
                id="btn-guardian-action-to-vault"
                onClick={() => onNavigateRoom('vault')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-mono text-xs transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>{currentLanguage === 'ja' ? 'ザ・ヴォールトへ' : 'Go to The Vault'}</span>
              </button>
            </div>
          )}

          {currentRoomId === 'vault' && (
            <button
              id="btn-guardian-action-vault"
              onClick={onOpenVault}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-bold font-sans text-xs tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.35)] transition-all hover:scale-[1.01]"
            >
              <ShieldCheck className="w-4 h-4 text-neutral-950" />
              <span>{currentLanguage === 'ja' ? '電子書籍版を入手 ($29)' : 'Claim Ebook Edition ($29)'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
