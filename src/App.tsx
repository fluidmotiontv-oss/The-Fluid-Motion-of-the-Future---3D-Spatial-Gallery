/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ThreeCanvas } from './three/ThreeCanvas';
import { Header } from './components/Header';
import { MinimapOverlay } from './components/MinimapOverlay';
import { RoomControls } from './components/RoomControls';
import { ExhibitModal } from './components/ExhibitModal';
import { ReadingLoungeModal } from './components/ReadingLoungeModal';
import { VaultCheckoutModal } from './components/VaultCheckoutModal';
import { FoyerWelcome } from './components/FoyerWelcome';
import { HelpControlsModal } from './components/HelpControlsModal';
import { SocialShareModal } from './components/SocialShareModal';
import { PipelineTerminalModal } from './components/PipelineTerminalModal';
import { DragonGuardianDialogue } from './components/DragonGuardianDialogue';
import { IntermissionOverlay } from './components/IntermissionOverlay';
import { spatialAudio } from './audio/spatialAudio';
import { RoomId, Language } from './types';
import { detectLowSpecHardware, savePerformancePreference } from './utils/hardwareDetection';
import { ebookConfig } from './config/ebookConfig';

const ALL_ROOM_IDS: RoomId[] = [
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

// Helper to extract room from URL hash or query params
function getInitialRoom(): RoomId {
  if (typeof window === 'undefined') return 'foyer';
  const hash = window.location.hash;
  const match = hash.match(/room=([a-zA-Z0-9]+)/);
  if (match && ALL_ROOM_IDS.includes(match[1] as RoomId)) {
    return match[1] as RoomId;
  }
  const params = new URLSearchParams(window.location.search);
  const roomParam = params.get('room');
  if (roomParam && ALL_ROOM_IDS.includes(roomParam as RoomId)) {
    return roomParam as RoomId;
  }
  return 'foyer';
}

export default function App() {
  const [currentRoomId, setCurrentRoomId] = useState<RoomId>(getInitialRoom);
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [activeExhibitId, setActiveExhibitId] = useState<string | null>(null);
  const [isReadingLoungeOpen, setIsReadingLoungeOpen] = useState<boolean>(false);
  const [isVaultCheckoutOpen, setIsVaultCheckoutOpen] = useState<boolean>(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isPipelineTerminalOpen, setIsPipelineTerminalOpen] = useState<boolean>(false);
  const [isGuardianOpen, setIsGuardianOpen] = useState<boolean>(true);
  const [isFoyerWelcomeVisible, setIsFoyerWelcomeVisible] = useState<boolean>(getInitialRoom() === 'foyer');
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isAutoTour, setIsAutoTour] = useState<boolean>(false);
  const [isPerformanceMode, setIsPerformanceMode] = useState<boolean>(() => detectLowSpecHardware());

  const handleTogglePerformanceMode = useCallback(() => {
    setIsPerformanceMode(prev => {
      const next = !prev;
      savePerformancePreference(next);
      return next;
    });
  }, []);

  // Navigate room handler with audio mood sync & URL hash updating
  const handleSelectRoom = useCallback((roomId: RoomId) => {
    setCurrentRoomId(roomId);
    spatialAudio.stopHealerTone();
    spatialAudio.setRoomMood(roomId);
    spatialAudio.playRoomTransition();
    if (roomId !== 'foyer') {
      setIsFoyerWelcomeVisible(false);
    }
    // Update browser URL hash cleanly without page reload for instant shareability
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#room=${roomId}`);
    }
  }, []);

  const handleToggleAudio = useCallback(() => {
    const muted = spatialAudio.toggleMute();
    setIsAudioMuted(muted);
  }, []);

  // Guided Auto-Tour Mode (Timer Loop through all 10 zones)
  useEffect(() => {
    if (!isAutoTour) return;

    const timer = setInterval(() => {
      setCurrentRoomId(prev => {
        const nextIdx = (ALL_ROOM_IDS.indexOf(prev) + 1) % ALL_ROOM_IDS.length;
        const nextRoom = ALL_ROOM_IDS[nextIdx];
        spatialAudio.setRoomMood(nextRoom);
        spatialAudio.playRoomTransition();
        if (typeof window !== 'undefined') {
          window.history.replaceState(null, '', `#room=${nextRoom}`);
        }
        return nextRoom;
      });
    }, 9000);

    return () => clearInterval(timer);
  }, [isAutoTour]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if inside input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === 'Escape') {
        setActiveExhibitId(null);
        setIsReadingLoungeOpen(false);
        setIsVaultCheckoutOpen(false);
        setIsHelpModalOpen(false);
        setIsShareModalOpen(false);
        setIsPipelineTerminalOpen(false);
        setIsFoyerWelcomeVisible(false);
      } else if (e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key, 10) - 1;
        if (ALL_ROOM_IDS[idx]) {
          handleSelectRoom(ALL_ROOM_IDS[idx]);
        }
      } else if (e.key === '0') {
        handleSelectRoom('vault');
      } else if (e.key.toLowerCase() === 'm') {
        handleToggleAudio();
      } else if (e.key.toLowerCase() === 'g') {
        setIsGuardianOpen(prev => !prev);
      } else if (e.code === 'Space' && !activeExhibitId && !isReadingLoungeOpen && !isShareModalOpen) {
        e.preventDefault();
        setIsVaultCheckoutOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectRoom, handleToggleAudio, activeExhibitId, isReadingLoungeOpen, isShareModalOpen]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-neutral-950 font-sans select-none">
      {/* 3D WebGL Spatial Gallery Canvas */}
      <ThreeCanvas
        currentRoomId={currentRoomId}
        isPerformanceMode={isPerformanceMode}
        onSelectRoom={handleSelectRoom}
        onSelectExhibit={(exhibitId) => {
          spatialAudio.playInteractSound('click');
          setActiveExhibitId(exhibitId);
        }}
        onOpenReadingLounge={() => {
          spatialAudio.playInteractSound('click');
          setIsReadingLoungeOpen(true);
        }}
        onOpenVaultCheckout={() => {
          spatialAudio.playInteractSound('click');
          setIsVaultCheckoutOpen(true);
        }}
        onSelectGuardian={() => {
          spatialAudio.playInteractSound('click');
          setIsGuardianOpen(true);
        }}
        onOpenPipeline={() => {
          spatialAudio.playInteractSound('click');
          setIsPipelineTerminalOpen(true);
        }}
      />

      {/* Top Navigation, Social Share & Audio Controls */}
      <Header
        currentRoomId={currentRoomId}
        currentLanguage={currentLanguage}
        onToggleLanguage={setCurrentLanguage}
        isAudioMuted={isAudioMuted}
        onToggleAudio={handleToggleAudio}
        onOpenVault={() => {
          handleSelectRoom('vault');
          setIsVaultCheckoutOpen(true);
        }}
        onOpenHelp={() => setIsHelpModalOpen(true)}
        onOpenShare={() => {
          spatialAudio.playInteractSound('click');
          setIsShareModalOpen(true);
        }}
        onOpenPipeline={() => {
          spatialAudio.playInteractSound('click');
          setIsPipelineTerminalOpen(true);
        }}
        isAutoTour={isAutoTour}
        onToggleAutoTour={() => setIsAutoTour(!isAutoTour)}
        isPerformanceMode={isPerformanceMode}
        onTogglePerformanceMode={handleTogglePerformanceMode}
      />

      {/* The Super Puff Companion & Contextual Communicator */}
      <DragonGuardianDialogue
        currentRoomId={currentRoomId}
        currentLanguage={currentLanguage}
        isOpen={isGuardianOpen}
        onClose={() => setIsGuardianOpen(false)}
        onOpen={() => setIsGuardianOpen(true)}
        onNavigateRoom={handleSelectRoom}
        onOpenExhibits={() => {
          const targetHall = currentRoomId === 'hall2' ? 'hall2' : 'hall1';
          const exhibit = ebookConfig.exhibits.find(e => e.roomId === targetHall);
          if (exhibit) {
            setActiveExhibitId(exhibit.id);
          }
        }}
        onOpenLounge={() => {
          handleSelectRoom('lounge');
          setIsReadingLoungeOpen(true);
        }}
        onOpenVault={() => {
          handleSelectRoom('vault');
          setIsVaultCheckoutOpen(true);
        }}
        isAutoTour={isAutoTour}
        onToggleAutoTour={() => setIsAutoTour(!isAutoTour)}
      />

      {/* Foyer Welcome Banner */}
      <FoyerWelcome
        isVisible={isFoyerWelcomeVisible && currentRoomId === 'foyer'}
        currentLanguage={currentLanguage}
        onClose={() => setIsFoyerWelcomeVisible(false)}
        onStartTour={() => handleSelectRoom('hall1')}
        onNavigateRoom={handleSelectRoom}
        onOpenVault={() => {
          handleSelectRoom('vault');
          setIsVaultCheckoutOpen(true);
        }}
      />

      {/* Architectural Spatial Minimap */}
      <MinimapOverlay
        currentRoomId={currentRoomId}
        onSelectRoom={handleSelectRoom}
      />

      {/* Bottom Room Navigation Dock */}
      <RoomControls
        currentRoomId={currentRoomId}
        onSelectRoom={handleSelectRoom}
        onOpenVault={() => {
          handleSelectRoom('vault');
          setIsVaultCheckoutOpen(true);
        }}
      />

      {/* Interactive 3D Exhibit Modal (Hall I & II) */}
      <ExhibitModal
        exhibitId={activeExhibitId}
        onClose={() => setActiveExhibitId(null)}
        onSelectExhibit={(id) => setActiveExhibitId(id)}
        onOpenReadingLounge={() => {
          handleSelectRoom('lounge');
          setIsReadingLoungeOpen(true);
        }}
        onOpenVault={() => {
          handleSelectRoom('vault');
          setIsVaultCheckoutOpen(true);
        }}
      />

      {/* Digital Reading Lounge E-Reader Simulator */}
      <ReadingLoungeModal
        isOpen={isReadingLoungeOpen}
        onClose={() => setIsReadingLoungeOpen(false)}
        onOpenVault={() => {
          handleSelectRoom('vault');
          setIsVaultCheckoutOpen(true);
        }}
      />

      {/* The Vault Storefront & 3D Hardcover Checkout Modal */}
      <VaultCheckoutModal
        isOpen={isVaultCheckoutOpen}
        onClose={() => setIsVaultCheckoutOpen(false)}
      />

      {/* Social Sharing Modal (Deep-Link to Chamber) */}
      <SocialShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        currentRoomId={currentRoomId}
      />

      {/* Keyboard Controls & Shortcuts Modal */}
      <HelpControlsModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        isPerformanceMode={isPerformanceMode}
        onTogglePerformanceMode={handleTogglePerformanceMode}
      />

      {/* The Pipeline Export Terminal (Creator Station Modal) */}
      <PipelineTerminalModal
        isOpen={isPipelineTerminalOpen}
        onClose={() => setIsPipelineTerminalOpen(false)}
        currentRoomId={currentRoomId}
        currentLanguage={currentLanguage}
        isAutoTour={isAutoTour}
      />
      <IntermissionOverlay />
    </main>
  );
}

