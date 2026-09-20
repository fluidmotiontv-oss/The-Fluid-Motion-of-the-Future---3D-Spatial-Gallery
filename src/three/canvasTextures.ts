import * as THREE from 'three';

/**
 * Utility to generate high-resolution procedural textures for 3D gallery exhibits and the 3D book cover.
 * Guarantees zero external 404 image errors and crisp rendering.
 */

export function createBookCoverTexture(title: string, subtitle: string, author: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1448;
  const ctx = canvas.getContext('2d')!;

  // Background deep gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1024, 1448);
  bgGrad.addColorStop(0, '#0a0d1a');
  bgGrad.addColorStop(0.5, '#05070e');
  bgGrad.addColorStop(1, '#020307');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1448);

  // Subtle fluid wave vectors
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.15)';
  ctx.lineWidth = 3;
  for (let i = 0; i < 8; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 400 + i * 80);
    ctx.bezierCurveTo(300, 300 + i * 90, 700, 600 + i * 70, 1024, 500 + i * 80);
    ctx.stroke();
  }

  // Gold foil border geometric frame
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;
  ctx.strokeRect(60, 60, 904, 1328);
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
  ctx.lineWidth = 2;
  ctx.strokeRect(76, 76, 872, 1296);

  // Decorative corner accents
  const corners = [
    [60, 60],
    [964, 60],
    [60, 1388],
    [964, 1388],
  ];
  corners.forEach(([x, y]) => {
    ctx.fillStyle = '#e5c058';
    ctx.fillRect(x - 8, y - 8, 16, 16);
  });

  // Top Category Badge
  ctx.fillStyle = '#00f0ff';
  ctx.font = '600 24px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '6px';
  ctx.fillText('TEMPORAL MECHANICS & MEDIA', 512, 220);

  // Central Holographic Sphere Ring
  ctx.save();
  ctx.beginPath();
  ctx.arc(512, 540, 180, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Inner 54-minute tick ring
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.8)';
  ctx.lineWidth = 3;
  for (let a = 0; a < 54; a++) {
    const angle = (a / 54) * Math.PI * 2 - Math.PI / 2;
    const r1 = 150;
    const r2 = a % 6 === 0 ? 175 : 160;
    ctx.beginPath();
    ctx.moveTo(512 + Math.cos(angle) * r1, 540 + Math.sin(angle) * r1);
    ctx.lineTo(512 + Math.cos(angle) * r2, 540 + Math.sin(angle) * r2);
    ctx.stroke();
  }

  // Center Glyph
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 72px "Cinzel", serif';
  ctx.fillText('54', 512, 565);
  ctx.restore();

  // Main Title
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 68px "Cinzel", serif';
  ctx.textAlign = 'center';
  ctx.fillText('THE FLUID MOTION', 512, 840);
  ctx.fillText('OF THE FUTURE', 512, 920);

  // Subtitle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.font = '400 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Redefining Temporal Mechanics, Media Architectures', 512, 990);
  ctx.fillText('& Kinetic Consciousness', 512, 1030);

  // Divider Line
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(360, 1110);
  ctx.lineTo(664, 1110);
  ctx.stroke();

  // Author
  ctx.fillStyle = '#e5c058';
  ctx.font = '700 32px "Space Mono", monospace';
  ctx.letterSpacing = '4px';
  ctx.fillText(author.toUpperCase(), 512, 1200);

  // Edition Tag
  ctx.fillStyle = 'rgba(0, 240, 255, 0.8)';
  ctx.font = '500 22px "Space Mono", monospace';
  ctx.fillText('ORIGINAL MASTER EDITION • 2026', 512, 1280);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}

export function createExhibitCanvasTexture(
  type: string,
  title: string,
  category: string,
  gradient: [string, string]
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 768;
  const ctx = canvas.getContext('2d')!;

  // Background
  const bg = ctx.createLinearGradient(0, 0, 1024, 768);
  bg.addColorStop(0, '#0c1021');
  bg.addColorStop(1, '#05070d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, 1024, 768);

  // Ambient glow circle
  const radialGlow = ctx.createRadialGradient(512, 420, 20, 512, 420, 380);
  radialGlow.addColorStop(0, gradient[0] + '44');
  radialGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = radialGlow;
  ctx.fillRect(0, 0, 1024, 768);

  // Frame border
  ctx.strokeStyle = gradient[0];
  ctx.lineWidth = 4;
  ctx.strokeRect(30, 30, 964, 708);

  // Header Bar
  ctx.fillStyle = gradient[0] + '22';
  ctx.fillRect(30, 30, 964, 80);

  ctx.fillStyle = gradient[0];
  ctx.font = '700 22px "Space Mono", monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`EXHIBIT // ${category.toUpperCase()}`, 60, 80);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 42px "Syne", sans-serif';
  ctx.fillText(title, 60, 170);

  // Center Graphic Rendering based on exhibit type
  if (type === 'clock54') {
    // 54-minute clock visual
    ctx.save();
    ctx.translate(512, 440);
    ctx.strokeStyle = '#ffffff22';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, 180, 0, Math.PI * 2);
    ctx.stroke();

    // 54 tick marks
    for (let i = 0; i < 54; i++) {
      const rad = (i / 54) * Math.PI * 2 - Math.PI / 2;
      const isMajor = i % 6 === 0;
      const rInner = isMajor ? 140 : 160;
      const rOuter = 180;
      ctx.strokeStyle = isMajor ? gradient[0] : '#ffffff66';
      ctx.lineWidth = isMajor ? 5 : 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(rad) * rInner, Math.sin(rad) * rInner);
      ctx.lineTo(Math.cos(rad) * rOuter, Math.sin(rad) * rOuter);
      ctx.stroke();
    }

    // Glowing 54 hand
    ctx.strokeStyle = gradient[1];
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const handAngle = (42 / 54) * Math.PI * 2 - Math.PI / 2;
    ctx.lineTo(Math.cos(handAngle) * 130, Math.sin(handAngle) * 130);
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = '700 36px "Space Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('54m CYCLE', 0, 10);
    ctx.restore();
  } else if (type === 'temporalWave' || type === 'resonance') {
    // Waveform graphic
    ctx.save();
    ctx.translate(100, 440);
    ctx.lineWidth = 5;
    for (let w = 0; w < 4; w++) {
      ctx.strokeStyle = w % 2 === 0 ? gradient[0] : gradient[1];
      ctx.beginPath();
      for (let x = 0; x <= 824; x += 10) {
        const y = Math.sin((x + w * 90) * 0.02) * (70 - w * 12) + Math.cos(x * 0.008) * 30;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  } else if (type === 'timingTimeline') {
    // Stand-up localization timeline
    ctx.save();
    ctx.translate(80, 430);
    ctx.strokeStyle = '#ffffff44';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(864, 0);
    ctx.stroke();

    const beats = [
      { label: 'SETUP', pos: 80, tag: '0.0s' },
      { label: 'TENSION', pos: 320, tag: '[pause: 0.5s]' },
      { label: 'DELIVERY', pos: 580, tag: 'CADENCE' },
      { label: 'PUNCHLINE', pos: 800, tag: 'LAST WORD' },
    ];
    beats.forEach(b => {
      ctx.fillStyle = gradient[0];
      ctx.beginPath();
      ctx.arc(b.pos, 0, 12, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 20px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(b.label, b.pos, -30);

      ctx.fillStyle = gradient[1];
      ctx.font = '500 16px "Space Mono", monospace';
      ctx.fillText(b.tag, b.pos, 45);
    });
    ctx.restore();
  } else {
    // Default Media Grid diagram
    ctx.save();
    ctx.translate(262, 280);
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        ctx.fillStyle = ((r + c) % 2 === 0 ? gradient[0] : gradient[1]) + '33';
        ctx.strokeStyle = (r + c) % 2 === 0 ? gradient[0] : gradient[1];
        ctx.lineWidth = 3;
        ctx.fillRect(c * 170, r * 100, 150, 80);
        ctx.strokeRect(c * 170, r * 100, 150, 80);
      }
    }
    ctx.restore();
  }

  // Footer prompt
  ctx.fillStyle = '#ffffffaa';
  ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('✦ Click to Inspect & Read Deep-Dive Analysis ✦', 512, 690);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  return texture;
}
