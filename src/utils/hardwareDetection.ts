/**
 * Hardware Performance Tier & WebGL Capability Detector
 * Auto-detects lower-end devices, mobile GPUs, low memory/cores, or software WebGL renderers
 * to automatically enable Performance Mode fallback.
 */

export function detectLowSpecHardware(): boolean {
  if (typeof window === 'undefined') return false;

  // Check saved user override preference in localStorage
  const savedPref = localStorage.getItem('fluid_motion_perf_mode');
  if (savedPref === 'performance') return true;
  if (savedPref === 'high') return false;

  // 1. Hardware Concurrency (CPU Cores)
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
    return true;
  }

  // 2. Device Memory (in GB, Chrome/Edge supported)
  const deviceMemory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  if (deviceMemory && deviceMemory <= 4) {
    return true;
  }

  // 3. Touch Screen & Screen Dimensions (Budget Mobile check)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile && window.innerWidth < 768) {
    // If pixel ratio is high on budget mobile, high bloom/effects can lag
    if (window.devicePixelRatio > 2.5) {
      return true;
    }
  }

  // 4. WebGL Renderer & Extension Detection
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return true; // No WebGL or broken WebGL -> fallback

    const webglGl = gl as WebGLRenderingContext;
    const debugInfo = webglGl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const rendererStr = webglGl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;
      if (rendererStr) {
        const lowerRenderer = rendererStr.toLowerCase();
        // Check software renderers or low-tier mobile GPUs
        if (
          lowerRenderer.includes('swiftshader') ||
          lowerRenderer.includes('llvmpipe') ||
          lowerRenderer.includes('mali-t') ||
          lowerRenderer.includes('mali-4') ||
          lowerRenderer.includes('adreno 30') ||
          lowerRenderer.includes('adreno 40') ||
          lowerRenderer.includes('intel hd graphics 3000') ||
          lowerRenderer.includes('intel hd graphics 4000')
        ) {
          return true;
        }
      }
    }

    // Check Max Texture Size limit
    const maxTexSize = webglGl.getParameter(webglGl.MAX_TEXTURE_SIZE);
    if (maxTexSize && maxTexSize <= 4096) {
      return true;
    }
  } catch {
    return true;
  }

  return false;
}

export function savePerformancePreference(isPerformance: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('fluid_motion_perf_mode', isPerformance ? 'performance' : 'high');
}

export interface HardwareDiagnostics {
  cores: number;
  memoryGB: string;
  gpuRenderer: string;
  maxTextureSize: number;
  pixelRatio: number;
  isLowSpecDetected: boolean;
}

export function getHardwareDiagnostics(): HardwareDiagnostics {
  if (typeof window === 'undefined') {
    return {
      cores: 4,
      memoryGB: '4 GB',
      gpuRenderer: 'Standard WebGL',
      maxTextureSize: 8192,
      pixelRatio: 1,
      isLowSpecDetected: false,
    };
  }

  const cores = navigator.hardwareConcurrency || 4;
  const memory = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  const memoryGB = memory ? `${memory} GB` : 'N/A';
  let gpuRenderer = 'Standard GPU';
  let maxTextureSize = 8192;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (gl) {
      const webglGl = gl as WebGLRenderingContext;
      const debugInfo = webglGl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpuRenderer = webglGl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string || 'Standard GPU';
      }
      maxTextureSize = webglGl.getParameter(webglGl.MAX_TEXTURE_SIZE) || 8192;
    }
  } catch {
    // fallback
  }

  return {
    cores,
    memoryGB,
    gpuRenderer,
    maxTextureSize,
    pixelRatio: window.devicePixelRatio || 1,
    isLowSpecDetected: detectLowSpecHardware(),
  };
}

