import React, { useState } from 'react';
import { X, Play, Pause, ChevronLeft, ChevronRight, BookOpen, Sparkles, Volume2, CheckCircle2 } from 'lucide-react';
import { ebookConfig } from '../config/ebookConfig';
import { spatialAudio } from '../audio/spatialAudio';

interface ExhibitModalProps {
  exhibitId: string | null;
  onClose: () => void;
  onSelectExhibit: (id: string) => void;
  onOpenReadingLounge: () => void;
  onOpenVault: () => void;
}

export const ExhibitModal: React.FC<ExhibitModalProps> = ({
  exhibitId,
  onClose,
  onSelectExhibit,
  onOpenReadingLounge,
  onOpenVault,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  if (!exhibitId) return null;

  const exhibitIndex = ebookConfig.exhibits.findIndex(e => e.id === exhibitId);
  const exhibit = ebookConfig.exhibits[exhibitIndex] || ebookConfig.exhibits[0];

  const handlePrev = () => {
    const prevIdx = (exhibitIndex - 1 + ebookConfig.exhibits.length) % ebookConfig.exhibits.length;
    onSelectExhibit(ebookConfig.exhibits[prevIdx].id);
    setIsPlayingAudio(false);
  };

  const handleNext = () => {
    const nextIdx = (exhibitIndex + 1) % ebookConfig.exhibits.length;
    onSelectExhibit(ebookConfig.exhibits[nextIdx].id);
    setIsPlayingAudio(false);
  };

  const toggleAudioSnippet = () => {
    spatialAudio.playInteractSound('click');
    setIsPlayingAudio(!isPlayingAudio);
    if (!isPlayingAudio) {
      spatialAudio.playInteractSound('shimmer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/80 backdrop-blur-xl animate-fade-in pointer-events-auto">
      <div
        id="exhibit-modal-card"
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-neutral-900 border border-neutral-700/80 shadow-2xl overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <span
              className="px-2.5 py-1 text-xs font-mono font-bold uppercase rounded-md tracking-wider border"
              style={{
                backgroundColor: exhibit.gradient[0] + '22',
                color: exhibit.gradient[0],
                borderColor: exhibit.gradient[0] + '66',
              }}
            >
              {exhibit.category}
            </span>
            <span className="text-xs font-mono text-neutral-400">
              Exhibit {exhibitIndex + 1} of {ebookConfig.exhibits.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-exhibit-prev"
              onClick={handlePrev}
              title="Previous Exhibit"
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="btn-exhibit-next"
              onClick={handleNext}
              title="Next Exhibit"
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              id="btn-close-exhibit-modal"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-neutral-200">
          {/* Title & Subtitle */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-sans tracking-tight text-white">
              {exhibit.title}
            </h2>
            <p className="text-base sm:text-lg font-medium text-neutral-400 mt-1 font-sans">
              {exhibit.subtitle}
            </p>
          </div>

          {/* Abstract Highlight Box */}
          <div className="p-4 sm:p-5 rounded-xl bg-neutral-950/60 border border-neutral-800 text-neutral-300 font-sans text-sm sm:text-base leading-relaxed">
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2 font-bold">
              ✦ Theoretical Abstract
            </span>
            {exhibit.abstract}
          </div>

          {/* Deep Dive Analysis Text */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              In-Depth Analytical Breakdown
            </h3>
            <div className="text-sm sm:text-base text-neutral-300 font-sans leading-relaxed whitespace-pre-line bg-neutral-950/30 p-5 rounded-xl border border-neutral-800/60">
              {exhibit.deepDive}
            </div>
          </div>

          {/* Key Insights Bullets */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              Core Principles & Empirical Insights
            </h3>
            <div className="grid gap-2">
              {exhibit.keyInsights.map((insight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-neutral-950/40 border border-neutral-800/80 text-xs sm:text-sm text-neutral-300"
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Audio Voiceover Snippet with Direction Cues */}
          {exhibit.audioVoiceoverSnippet && (
            <div className="p-4 sm:p-5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-mono font-bold uppercase text-cyan-300">
                    Audio Voiceover & Atmospheric Script Preview
                  </span>
                </div>
                <button
                  id="btn-play-voiceover-snippet"
                  onClick={toggleAudioSnippet}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-mono font-bold transition-all"
                >
                  {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  <span>{isPlayingAudio ? 'Stop Preview' : 'Listen Synthesized Track'}</span>
                </button>
              </div>

              <div className="p-3 rounded-lg bg-neutral-950/80 font-mono text-xs text-neutral-400 border border-neutral-800">
                <span className="text-amber-400 font-semibold block mb-1">
                  {exhibit.audioVoiceoverSnippet.cue}
                </span>
                <p className="text-neutral-200 italic">
                  "{exhibit.audioVoiceoverSnippet.script}"
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-neutral-800 bg-neutral-950/80">
          <button
            id="btn-jump-to-reading-lounge"
            onClick={() => {
              onClose();
              onOpenReadingLounge();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs sm:text-sm font-sans font-medium transition-colors"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Read Chapter Excerpt in Lounge</span>
          </button>

          <button
            id="btn-modal-buy-vault"
            onClick={() => {
              onClose();
              onOpenVault();
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 text-xs sm:text-sm font-sans font-bold shadow-lg transition-transform hover:scale-105"
          >
            <Sparkles className="w-4 h-4" />
            <span>Unlock Complete Ebook ($29)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
