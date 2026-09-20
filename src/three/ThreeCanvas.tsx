import React, { useEffect, useRef } from 'react';
import { GalleryScene } from './GalleryScene';
import { RoomId } from '../types';

interface ThreeCanvasProps {
  currentRoomId: RoomId;
  isPerformanceMode?: boolean;
  onSelectRoom: (roomId: RoomId) => void;
  onSelectExhibit: (exhibitId: string) => void;
  onOpenReadingLounge: () => void;
  onOpenVaultCheckout: () => void;
  onSelectGuardian: () => void;
  onOpenPipeline: () => void;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  currentRoomId,
  isPerformanceMode = false,
  onSelectRoom,
  onSelectExhibit,
  onOpenReadingLounge,
  onOpenVaultCheckout,
  onSelectGuardian,
  onOpenPipeline,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<GalleryScene | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new GalleryScene(containerRef.current, {
      onSelectRoom,
      onSelectExhibit,
      onOpenReadingLounge,
      onOpenVaultCheckout,
      onSelectGuardian,
      onOpenPipeline,
    });

    scene.setPerformanceMode(isPerformanceMode);
    sceneRef.current = scene;

    return () => {
      scene.destroy();
      sceneRef.current = null;
    };
  }, [onSelectRoom, onSelectExhibit, onOpenReadingLounge, onOpenVaultCheckout, onSelectGuardian, onOpenPipeline]);

  // Synchronize room changes from UI to Three.js camera controller
  useEffect(() => {
    if (sceneRef.current && sceneRef.current.currentRoomId !== currentRoomId) {
      sceneRef.current.navigateToRoom(currentRoomId);
    }
  }, [currentRoomId]);

  // Synchronize Performance Mode changes
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.setPerformanceMode(isPerformanceMode);
    }
  }, [isPerformanceMode]);

  return (
    <div
      id="webgl-canvas-container"
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-neutral-950 touch-none"
    />
  );
};
