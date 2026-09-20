import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Twitter,
  Linkedin,
  MessageCircle,
  Send,
  Sparkles,
  ExternalLink,
  Globe,
  Radio,
} from 'lucide-react';
import { ebookConfig } from '../config/ebookConfig';
import { RoomId } from '../types';
import { spatialAudio } from '../audio/spatialAudio';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRoomId: RoomId;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  currentRoomId,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [copiedSnippet, setCopiedSnippet] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentRoom = ebookConfig.rooms.find(r => r.id === currentRoomId) || ebookConfig.rooms[0];

  // Base URL with hash anchor for deep linking into specific room
  const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://fluidmotion.future';
  const shareableUrl = `${baseUrl}#room=${currentRoomId}`;

  // Room-specific post texts
  const roomShareTexts: Record<RoomId, string> = {
    foyer: `Step into the Sovereign Horizon Engine Core (3D Spatial Interface). Experience the Grand Atrium mesh node and discover the Dragon9 54-minute hour: ${shareableUrl} #SovereignMesh #Dragon9 #HorizonEngine`,
    hall1: `Exploring the Dragon9 54-Minute Hour and alternative temporal wave mechanics in Hall I of the Sovereign Horizon Engine: ${shareableUrl} #Productivity #TemporalMechanics #FluidTime`,
    hall2: `Immersed in Hall II (Sovereign Media Frameworks & Timing Physics) inside the Horizon Engine Core: ${shareableUrl} #MediaArchitecture #KineticDesign #SovereignMedia`,
    lotus: `Harmonizing 432Hz spatial synth scales at the Lotus Nexus in the Sovereign Horizon Engine: ${shareableUrl} #LotusNexus #432Hz #AcousticHarmonics #3DWeb`,
    lounge: `Reading sample chapters inside the Sovereign Reading Sanctuary for "The Fluid Motion of the Future": ${shareableUrl} #Ebook #FutureOfReading #SovereignSanctuary`,
    games: `Playing retro 54m chrono games & neon pool at the Games Room in the Sovereign Horizon Engine: ${shareableUrl} #Arcade #FluidGaming #WebGL`,
    theater: `Watching high-density logic visualizations at the Ruthless Logic Arena in the Sovereign Horizon Engine: ${shareableUrl} #LogicArena #HorizonEngine #SovereignProofs`,
    skatepark: `Launching stunt bike jumps into the soft foam pit at the Indoor Skate Park in the Sovereign Horizon Engine: ${shareableUrl} #SkatePark3D #InteractivePhysics`,
    waterworld: `Riding body-waves on the FlowRider at Water World in the Sovereign Horizon Engine: ${shareableUrl} #WaterWorld #FluidWaveMesh`,
    vault: `Inspecting the 3D Master Tome in The Vault. Get "The Fluid Motion of the Future" 284-page master package via the Sovereign Register: ${shareableUrl} #EbookLaunch #NEC #SovereignLedger`,
  };

  const currentPostText = roomShareTexts[currentRoomId] || roomShareTexts.foyer;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl);
      setCopied(true);
      spatialAudio.playInteractSound('click');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleCopySnippet = async () => {
    try {
      await navigator.clipboard.writeText(currentPostText);
      setCopiedSnippet(true);
      spatialAudio.playInteractSound('click');
      setTimeout(() => setCopiedSnippet(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${ebookConfig.title} — ${currentRoom.name}`,
          text: currentPostText,
          url: shareableUrl,
        });
        spatialAudio.playInteractSound('click');
      } catch {
        // Ignored if cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  // Social Share Intent URLs
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(currentPostText)}`;
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableUrl)}`;
  const redditUrl = `https://reddit.com/submit?url=${encodeURIComponent(shareableUrl)}&title=${encodeURIComponent(`${ebookConfig.title} — ${currentRoom.name}`)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(currentPostText)}`;
  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareableUrl)}&text=${encodeURIComponent(currentPostText)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/80 backdrop-blur-xl animate-fade-in pointer-events-auto">
      <div
        id="social-share-modal-card"
        className="relative w-full max-w-lg rounded-2xl bg-neutral-900 border border-neutral-700/80 shadow-2xl p-6 sm:p-7 space-y-6 overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl border"
              style={{
                backgroundColor: currentRoom.themeColor + '20',
                borderColor: currentRoom.themeColor + '60',
                color: currentRoom.themeColor,
              }}
            >
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block font-bold">
                Social Broadcasting
              </span>
              <h3 className="text-base sm:text-lg font-bold font-sans text-white">
                Share This 3D Chamber
              </h3>
            </div>
          </div>

          <button
            id="btn-close-share-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Chamber Visual Card */}
        <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full animate-ping"
                style={{ backgroundColor: currentRoom.themeColor }}
              />
              <span className="text-xs font-mono font-bold text-neutral-200">
                {currentRoom.name}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                Deep-Link Active
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-sans line-clamp-1">
              {currentRoom.tagline}
            </p>
          </div>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              id="btn-native-share"
              onClick={handleNativeShare}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-mono font-bold transition-all"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Broadcast</span>
            </button>
          )}
        </div>

        {/* Direct Link Copy Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono text-neutral-400 flex items-center justify-between">
            <span>Direct Chamber URL:</span>
            <span className="text-[10px] text-cyan-400 font-mono">Teleports visitor directly here</span>
          </label>
          <div className="flex items-center gap-2 p-1.5 rounded-xl bg-neutral-950 border border-neutral-800">
            <Globe className="w-4 h-4 text-neutral-500 ml-2 shrink-0" />
            <input
              type="text"
              readOnly
              value={shareableUrl}
              className="flex-1 bg-transparent text-xs font-mono text-neutral-200 focus:outline-none truncate"
            />
            <button
              id="btn-copy-chamber-link"
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                copied
                  ? 'bg-emerald-500 text-neutral-950 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Social Platforms Quick Share */}
        <div className="space-y-2">
          <span className="text-xs font-mono text-neutral-400 block">
            Broadcast to Social Channels:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* X / Twitter */}
            <a
              id="link-share-twitter"
              href={twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 text-neutral-200 text-xs font-mono transition-all group"
            >
              <Twitter className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>X / Twitter</span>
            </a>

            {/* LinkedIn */}
            <a
              id="link-share-linkedin"
              href={linkedInUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 text-neutral-200 text-xs font-mono transition-all group"
            >
              <Linkedin className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <span>LinkedIn</span>
            </a>

            {/* WhatsApp */}
            <a
              id="link-share-whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 text-neutral-200 text-xs font-mono transition-all group"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>WhatsApp</span>
            </a>

            {/* Telegram */}
            <a
              id="link-share-telegram"
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-600 text-neutral-200 text-xs font-mono transition-all group"
            >
              <Send className="w-4 h-4 text-sky-400 group-hover:scale-110 transition-transform" />
              <span>Telegram</span>
            </a>
          </div>
        </div>

        {/* Pre-formatted Post Copy Snippet */}
        <div className="p-3 rounded-xl bg-neutral-950/60 border border-neutral-800/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-neutral-400">
              Pre-filled Post Copy:
            </span>
            <button
              id="btn-copy-post-snippet"
              onClick={handleCopySnippet}
              className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {copiedSnippet ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSnippet ? 'Copied snippet!' : 'Copy snippet'}</span>
            </button>
          </div>
          <p className="text-xs text-neutral-300 font-sans italic line-clamp-3 bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
            "{currentPostText}"
          </p>
        </div>
      </div>
    </div>
  );
};
