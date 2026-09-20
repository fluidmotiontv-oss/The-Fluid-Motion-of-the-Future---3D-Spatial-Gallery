import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Bookmark, Volume2, Sparkles, BookOpen, Sliders, Type } from 'lucide-react';
import { ebookConfig } from '../config/ebookConfig';
import { spatialAudio } from '../audio/spatialAudio';

interface ReadingLoungeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenVault: () => void;
}

export const ReadingLoungeModal: React.FC<ReadingLoungeModalProps> = ({
  isOpen,
  onClose,
  onOpenVault,
}) => {
  const [selectedChapterIdx, setSelectedChapterIdx] = useState<number>(0);
  const [pageIdx, setPageIdx] = useState<number>(0);
  const [readerTheme, setReaderTheme] = useState<'dark' | 'sepia' | 'cyan'>('dark');
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [isPlayingNarration, setIsPlayingNarration] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentChapter = ebookConfig.chapters[selectedChapterIdx] || ebookConfig.chapters[0];
  const totalPages = currentChapter.pageContent.length;

  const handleNextPage = () => {
    spatialAudio.playInteractSound('click');
    if (pageIdx < totalPages - 1) {
      setPageIdx(pageIdx + 1);
    } else if (selectedChapterIdx < ebookConfig.chapters.length - 1) {
      setSelectedChapterIdx(selectedChapterIdx + 1);
      setPageIdx(0);
    }
  };

  const handlePrevPage = () => {
    spatialAudio.playInteractSound('click');
    if (pageIdx > 0) {
      setPageIdx(pageIdx - 1);
    } else if (selectedChapterIdx > 0) {
      setSelectedChapterIdx(selectedChapterIdx - 1);
      setPageIdx(ebookConfig.chapters[selectedChapterIdx - 1].pageContent.length - 1);
    }
  };

  const toggleNarration = () => {
    spatialAudio.playInteractSound('click');
    setIsPlayingNarration(!isPlayingNarration);
    if (!isPlayingNarration) {
      spatialAudio.playInteractSound('shimmer');
    }
  };

  // Reader Themes styling
  const themeClasses = {
    dark: 'bg-neutral-950 text-neutral-200 border-neutral-800',
    sepia: 'bg-[#1a1714] text-[#d6c7b2] border-[#383129]',
    cyan: 'bg-[#06131c] text-[#a4e2f5] border-[#103a4f]',
  };

  const textSizes = {
    normal: 'text-base sm:text-lg leading-relaxed',
    large: 'text-lg sm:text-xl leading-relaxed',
    xlarge: 'text-xl sm:text-2xl leading-loose',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-2xl animate-fade-in pointer-events-auto">
      <div
        id="reading-lounge-container"
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-neutral-900 border border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.15)] overflow-hidden"
      >
        {/* Top Lounge Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold uppercase text-emerald-400">
                  Digital Reading Lounge
                </span>
                <span className="text-[10px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                  Interactive E-Reader Mockup
                </span>
              </div>
              <h2 className="text-sm font-semibold text-neutral-200 truncate max-w-[280px] sm:max-w-md">
                {ebookConfig.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmark */}
            <button
              id="btn-toggle-bookmark"
              onClick={() => setIsBookmarked(!isBookmarked)}
              title={isBookmarked ? 'Bookmarked' : 'Add Bookmark'}
              className={`p-2 rounded-lg transition-colors border ${
                isBookmarked
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
            </button>

            {/* Close */}
            <button
              id="btn-close-reading-lounge"
              onClick={onClose}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chapter Selection Tab Strip */}
        <div className="flex items-center gap-2 px-6 py-2.5 bg-neutral-950/40 border-b border-neutral-800/80 overflow-x-auto scrollbar-none">
          {ebookConfig.chapters.map((chap, idx) => (
            <button
              key={idx}
              id={`btn-chapter-tab-${idx}`}
              onClick={() => {
                setSelectedChapterIdx(idx);
                setPageIdx(0);
                spatialAudio.playInteractSound('click');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition-all ${
                selectedChapterIdx === idx
                  ? 'bg-emerald-500/20 border border-emerald-500/60 text-emerald-300 font-bold'
                  : 'bg-neutral-800/60 border border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <span className="opacity-70 mr-1.5">{chap.number}:</span>
              <span>{chap.title}</span>
            </button>
          ))}
        </div>

        {/* Reader Customization Settings Toolbar */}
        <div className="flex items-center justify-between px-6 py-2 bg-neutral-950/20 border-b border-neutral-800/60 text-xs font-mono text-neutral-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-neutral-500" />
              Theme:
            </span>
            <button
              id="btn-theme-dark"
              onClick={() => setReaderTheme('dark')}
              className={`px-2 py-0.5 rounded ${readerTheme === 'dark' ? 'bg-neutral-800 text-white font-bold' : 'hover:text-neutral-200'}`}
            >
              OLED Dark
            </button>
            <button
              id="btn-theme-sepia"
              onClick={() => setReaderTheme('sepia')}
              className={`px-2 py-0.5 rounded ${readerTheme === 'sepia' ? 'bg-amber-950 text-amber-300 font-bold' : 'hover:text-neutral-200'}`}
            >
              Warm Sepia
            </button>
            <button
              id="btn-theme-cyan"
              onClick={() => setReaderTheme('cyan')}
              className={`px-2 py-0.5 rounded ${readerTheme === 'cyan' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'hover:text-neutral-200'}`}
            >
              Cyber Cyan
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Type className="w-3.5 h-3.5 text-neutral-500" />
            <button
              id="btn-font-normal"
              onClick={() => setFontSize('normal')}
              className={`px-1.5 py-0.5 rounded ${fontSize === 'normal' ? 'bg-neutral-800 text-white' : ''}`}
            >
              A
            </button>
            <button
              id="btn-font-large"
              onClick={() => setFontSize('large')}
              className={`px-1.5 py-0.5 rounded text-sm ${fontSize === 'large' ? 'bg-neutral-800 text-white' : ''}`}
            >
              A+
            </button>
            <button
              id="btn-font-xlarge"
              onClick={() => setFontSize('xlarge')}
              className={`px-1.5 py-0.5 rounded text-base font-bold ${fontSize === 'xlarge' ? 'bg-neutral-800 text-white' : ''}`}
            >
              A++
            </button>
          </div>
        </div>

        {/* E-Reader Screen Area */}
        <div className={`flex-1 overflow-y-auto p-6 sm:p-10 transition-colors ${themeClasses[readerTheme]}`}>
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Chapter Header */}
            <div className="border-b border-current/20 pb-4">
              <span className="text-xs font-mono uppercase tracking-widest opacity-70 block mb-1">
                {currentChapter.number} • {currentChapter.readTime}
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight">
                {currentChapter.title}
              </h1>
              <p className="text-sm font-sans opacity-80 mt-1">
                {currentChapter.subtitle}
              </p>
            </div>

            {/* Audio Direction Bracket */}
            {currentChapter.audioDirection && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <Volume2 className="w-4 h-4 text-emerald-400" />
                  <span className="opacity-90">{currentChapter.audioDirection}</span>
                </div>
                <button
                  id="btn-toggle-chapter-narration"
                  onClick={toggleNarration}
                  className="px-2.5 py-1 rounded bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-[11px] font-mono font-bold transition-all"
                >
                  {isPlayingNarration ? 'Pause Audio' : 'Play Narration'}
                </button>
              </div>
            )}

            {/* Page Reading Text */}
            <div className={`font-serif whitespace-pre-line ${textSizes[fontSize]}`}>
              {currentChapter.pageContent[pageIdx]}
            </div>
          </div>
        </div>

        {/* E-Reader Page Turning Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-neutral-800 bg-neutral-950/80">
          {/* Pagination Controls */}
          <div className="flex items-center gap-3">
            <button
              id="btn-reader-prev-page"
              onClick={handlePrevPage}
              disabled={selectedChapterIdx === 0 && pageIdx === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none text-neutral-300 text-xs font-mono transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Page</span>
            </button>

            <span className="text-xs font-mono text-neutral-400">
              Page {pageIdx + 1} / {totalPages}
            </span>

            <button
              id="btn-reader-next-page"
              onClick={handleNextPage}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono transition-colors"
            >
              <span>Next Page</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Unlock Full Ebook CTA */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-neutral-400 hidden md:inline">
              Enjoying the preview?
            </span>
            <button
              id="btn-lounge-unlock-vault"
              onClick={() => {
                onClose();
                onOpenVault();
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 text-xs sm:text-sm font-sans font-bold shadow-lg transition-transform hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Full 284-Page Book ($29)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
