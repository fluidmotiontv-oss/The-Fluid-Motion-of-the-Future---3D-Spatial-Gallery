import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { ebookConfig } from '../config/ebookConfig';
import { RoomId, Language } from '../types';
import { createBookCoverTexture, createExhibitCanvasTexture } from './canvasTextures';
import { spatialAudio } from '../audio/spatialAudio';

export interface GalleryCallbacks {
  onSelectRoom: (roomId: RoomId) => void;
  onSelectExhibit: (exhibitId: string) => void;
  onOpenReadingLounge: () => void;
  onOpenVaultCheckout: () => void;
  onSelectGuardian: () => void;
  onOpenPipeline: () => void;
}

interface FluidWaveMesh {
  mesh: THREE.Mesh;
  geometry: THREE.PlaneGeometry;
  basePositions: Float32Array;
  speed: number;
  freqX: number;
  freqY: number;
  amplitude: number;
}

export class GalleryScene {
  private container: HTMLElement;
  private callbacks: GalleryCallbacks;
  public currentLanguage: Language = 'en';
  
  // Three.js Core
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private animFrameId: number | null = null;
  private clock: THREE.Clock;

  // Camera Lerp State
  private targetCamPos: THREE.Vector3;
  private currentCamPos: THREE.Vector3;
  private targetLookAt: THREE.Vector3;
  private currentLookAt: THREE.Vector3;
  private mouseOffset: { x: number; y: number };
  private targetMouseOffset: { x: number; y: number };
  public currentRoomId: RoomId = 'foyer';

  // Performance Mode Fallback State
  private isPerformanceMode: boolean = false;

  // Interactive Meshes for Raycasting
  private interactiveObjects: THREE.Object3D[] = [];
  private raycaster: THREE.Raycaster;
  private mouseVec: THREE.Vector2;
  private hoveredObject: THREE.Object3D | null = null;

  // Animated Scene Components
  private composer!: EffectComposer;
  private bloomPass!: UnrealBloomPass;
  private kineticSculpture: THREE.Group | null = null;
  private bookGroup: THREE.Group | null = null;
  private particlesMesh: THREE.Points | null = null;
  private portalMeshes: { mesh: THREE.Mesh; targetRoom: RoomId; light: THREE.PointLight }[] = [];
  private exhibitMeshes: { mesh: THREE.Mesh; id: string; basePos: THREE.Vector3 }[] = [];
  private loungeTabletMesh: THREE.Mesh | null = null;
  private fluidWaveMeshes: FluidWaveMesh[] = [];
  private plasmaSystem: THREE.Points | null = null;

  // Zone Interactive State
  private skateBikeGroup: THREE.Group | null = null;
  private isBikeLaunching: boolean = false;
  private bikeLaunchTime: number = 0;
  private lotusPetals: THREE.Mesh[] = [];

  // Super Puff Guardian Companion
  private guardianGroup: THREE.Group | null = null;
  private guardianTargetPos: THREE.Vector3 = new THREE.Vector3(2.2, 2.3, 8.8);
  private guardianCurrentPos: THREE.Vector3 = new THREE.Vector3(2.2, 2.3, 8.8);
  private guardianWings: THREE.Mesh[] = [];
  private guardianTailNodes: THREE.Mesh[] = [];
  private guardianCoreLight: THREE.PointLight | null = null;
  private guardianRoomPositions: Record<RoomId, [number, number, number]> = {
    foyer: [2.2, 2.3, 8.8],
    hall1: [3.0, 2.5, -20.0],
    hall2: [24.5, 2.5, -20.0],
    lotus: [-25.0, 2.5, -20.0],
    lounge: [24.0, 2.3, 5.0],
    games: [-25.0, 2.3, 5.0],
    theater: [-25.0, 2.5, 33.0],
    skatepark: [3.0, 2.5, 33.0],
    waterworld: [24.5, 2.5, 33.0],
    vault: [12.0, 2.5, 22.0],
  };

  constructor(container: HTMLElement, callbacks: GalleryCallbacks) {
    this.container = container;
    this.callbacks = callbacks;
    this.clock = new THREE.Clock();

    // Scene & Renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060810);
    this.scene.fog = new THREE.FogExp2(0x060810, 0.018);

    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 150);
    
    // Initial camera position (Foyer)
    const foyer = ebookConfig.rooms[0];
    this.targetCamPos = new THREE.Vector3(...foyer.cameraPosition);
    this.currentCamPos = this.targetCamPos.clone();
    this.targetLookAt = new THREE.Vector3(...foyer.cameraLookAt);
    this.currentLookAt = this.targetLookAt.clone();
    this.camera.position.copy(this.currentCamPos);
    this.camera.lookAt(this.currentLookAt);

    this.mouseOffset = { x: 0, y: 0 };
    this.targetMouseOffset = { x: 0, y: 0 };
    this.raycaster = new THREE.Raycaster();
    this.mouseVec = new THREE.Vector2(-999, -999);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.container.appendChild(this.renderer.domElement);

    // Post-processing Bloom Pipeline
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      0.85, // Bloom Strength - vibrant emissive neon glow
      0.45, // Bloom Radius
      0.22  // Bloom Threshold - highlights glowing book, lotus, and neon portals
    );
    this.composer.addPass(this.bloomPass);

    const outputPass = new OutputPass();
    this.composer.addPass(outputPass);

    this.setupLighting();
    this.buildWorld();
    this.setupEventListeners();
    this.startLoop();
  }

  private setupLighting() {
    // Ambient soft fill
    const ambientLight = new THREE.AmbientLight(0x223355, 1.2);
    this.scene.add(ambientLight);

    // Directional moonbeam
    const dirLight = new THREE.DirectionalLight(0xaaccff, 1.0);
    dirLight.position.set(20, 40, 20);
    this.scene.add(dirLight);

    // Room specific point lights
    ebookConfig.rooms.forEach(room => {
      const pLight = new THREE.PointLight(new THREE.Color(room.accentGlow), 2.5, 32);
      pLight.position.set(room.roomPosition[0], 4.5, room.roomPosition[2]);
      this.scene.add(pLight);
    });
  }

  private buildWorld() {
    this.buildCorridorsAndFloors();
    this.buildFoyer();
    this.buildHall(1);
    this.buildHall(2);
    this.buildLotusNexus();
    this.buildReadingLounge();
    this.buildGamesRoom();
    this.buildTheater();
    this.buildSkatePark();
    this.buildWaterWorld();
    this.buildVault();
    this.buildParticleField();
    this.buildFluidWaveMeshes();
    this.buildHorizonPlasmaEngine();
    this.buildSuperPuff();
  }

  private buildCorridorsAndFloors() {
    // Large Dark Reflective Ground Grid
    const floorGeo = new THREE.PlaneGeometry(120, 120, 60, 60);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x070a14,
      roughness: 0.25,
      metalness: 0.8,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(14, 0, -5);
    this.scene.add(floor);

    // Floor Grid Wireframe Overlay
    const gridHelper = new THREE.GridHelper(120, 60, 0x00f0ff, 0x152238);
    gridHelper.position.set(14, 0.02, -5);
    this.scene.add(gridHelper);

    // Connecting Pathway Runner
    const pathwayGeo = new THREE.PlaneGeometry(6, 110);
    const pathwayMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.08,
    });
    const path1 = new THREE.Mesh(pathwayGeo, pathwayMat);
    path1.rotation.x = -Math.PI / 2;
    path1.position.set(0, 0.03, -14);
    this.scene.add(path1);

    const path2 = new THREE.Mesh(pathwayGeo, pathwayMat);
    path2.rotation.x = -Math.PI / 2;
    path2.rotation.z = Math.PI / 2;
    path2.position.set(14, 0.03, -28);
    this.scene.add(path2);

    const path3 = new THREE.Mesh(pathwayGeo, pathwayMat);
    path3.rotation.x = -Math.PI / 2;
    path3.position.set(28, 0.03, -14);
    this.scene.add(path3);
  }

  private buildFoyer() {
    const foyerGroup = new THREE.Group();
    foyerGroup.position.set(0, 0, 0);

    // Architectural Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.5, 0.6, 8, 8);
    const pillarMat = new THREE.MeshStandardMaterial({
      color: 0x101524,
      metalness: 0.9,
      roughness: 0.3,
    });
    const pillarPositions = [
      [-6, 4, -6],
      [6, 4, -6],
      [-6, 4, 6],
      [6, 4, 6],
    ];
    pillarPositions.forEach(([x, y, z]) => {
      const p = new THREE.Mesh(pillarGeo, pillarMat);
      p.position.set(x, y, z);
      foyerGroup.add(p);

      // Neon Rings on Pillars
      const ringGeo = new THREE.TorusGeometry(0.65, 0.04, 8, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(x, y + 1.5, z);
      foyerGroup.add(ring);
    });

    // Central Kinetic Chronometer Sculpture
    this.kineticSculpture = new THREE.Group();
    this.kineticSculpture.position.set(0, 2.2, 0);

    // Glowing core sphere
    const coreGeo = new THREE.SphereGeometry(0.7, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.8,
      roughness: 0.1,
      metalness: 0.9,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    this.kineticSculpture.add(core);

    // Outer Gyro Rings
    const gyroColors = [0x00f0ff, 0x8b5cf6, 0xd4af37];
    gyroColors.forEach((color, idx) => {
      const gyroGeo = new THREE.TorusGeometry(1.4 + idx * 0.45, 0.05, 12, 48);
      const gyroMat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.4,
        metalness: 0.95,
        roughness: 0.1,
      });
      const ring = new THREE.Mesh(gyroGeo, gyroMat);
      ring.name = `gyro_${idx}`;
      this.kineticSculpture!.add(ring);
    });

    foyerGroup.add(this.kineticSculpture);

    // Holographic Floor Circle
    const circleGeo = new THREE.RingGeometry(1.8, 3.2, 32);
    const circleMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.35,
    });
    const floorCircle = new THREE.Mesh(circleGeo, circleMat);
    floorCircle.rotation.x = -Math.PI / 2;
    floorCircle.position.y = 0.05;
    foyerGroup.add(floorCircle);

    // 3D Creator Pipeline Station Terminal Pedestal
    const terminalPedGeo = new THREE.BoxGeometry(1.4, 1.2, 0.8);
    const terminalPedMat = new THREE.MeshStandardMaterial({
      color: 0x1f190e,
      metalness: 0.9,
      roughness: 0.2,
    });
    const terminalPed = new THREE.Mesh(terminalPedGeo, terminalPedMat);
    terminalPed.position.set(-4.5, 0.6, 2.0);
    foyerGroup.add(terminalPed);

    const terminalScreenGeo = new THREE.PlaneGeometry(1.2, 0.8);
    const terminalScreenMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.9,
    });
    const terminalScreen = new THREE.Mesh(terminalScreenGeo, terminalScreenMat);
    terminalScreen.position.set(-4.5, 1.3, 2.41);
    terminalScreen.rotation.x = -Math.PI / 8;
    terminalScreen.userData = { type: 'pipelineTerminal' };
    this.interactiveObjects.push(terminalScreen);
    foyerGroup.add(terminalScreen);

    // Portal Archway to Hall I
    this.createPortalArchway(foyerGroup, [0, 0, -10], 'hall1', 'Enter Hall I: Chrono-Mechanics', 0x8b5cf6);

    this.scene.add(foyerGroup);
  }

  private buildHall(hallNum: 1 | 2) {
    const isHall1 = hallNum === 1;
    const roomX = isHall1 ? 0 : 28;
    const roomZ = -28;
    const hallGroup = new THREE.Group();
    hallGroup.position.set(roomX, 0, roomZ);

    // Hall Exhibits from config
    const hallExhibits = ebookConfig.exhibits.filter(e => e.roomId === (isHall1 ? 'hall1' : 'hall2'));

    hallExhibits.forEach(exhibit => {
      const exhibitGroup = new THREE.Group();
      // Relative offset from hall center
      const relX = exhibit.position[0] - roomX;
      const relY = exhibit.position[1];
      const relZ = exhibit.position[2] - roomZ;
      exhibitGroup.position.set(relX, relY, relZ);
      exhibitGroup.rotation.set(...exhibit.rotation);

      // Holographic Glass Display Pane
      const paneGeo = new THREE.BoxGeometry(4.2, 3.0, 0.15);
      const texture = createExhibitCanvasTexture(
        exhibit.visualGraphicType,
        exhibit.title,
        exhibit.category,
        exhibit.gradient
      );

      const paneMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.2,
        metalness: 0.7,
        emissive: new THREE.Color(exhibit.gradient[0]),
        emissiveIntensity: 0.18,
      });
      const paneMesh = new THREE.Mesh(paneGeo, paneMat);
      paneMesh.userData = { type: 'exhibit', id: exhibit.id };
      this.interactiveObjects.push(paneMesh);
      this.exhibitMeshes.push({
        mesh: paneMesh,
        id: exhibit.id,
        basePos: exhibitGroup.position.clone(),
      });
      exhibitGroup.add(paneMesh);

      // Glowing Neon Frame Border
      const frameGeo = new THREE.BoxGeometry(4.35, 3.15, 0.08);
      const frameMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(exhibit.gradient[0]),
        wireframe: true,
      });
      const frameMesh = new THREE.Mesh(frameGeo, frameMat);
      exhibitGroup.add(frameMesh);

      // Pedestal Base
      const pedGeo = new THREE.CylinderGeometry(1.2, 1.4, 0.8, 16);
      const pedMat = new THREE.MeshStandardMaterial({
        color: 0x0c111e,
        metalness: 0.8,
        roughness: 0.3,
      });
      const ped = new THREE.Mesh(pedGeo, pedMat);
      ped.position.set(0, -relY + 0.4, 0);
      exhibitGroup.add(ped);

      // Pedestal Glowing Ring
      const pedRingGeo = new THREE.TorusGeometry(1.3, 0.04, 8, 24);
      const pedRingMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(exhibit.gradient[0]) });
      const pedRing = new THREE.Mesh(pedRingGeo, pedRingMat);
      pedRing.rotation.x = Math.PI / 2;
      pedRing.position.set(0, -relY + 0.8, 0);
      exhibitGroup.add(pedRing);

      hallGroup.add(exhibitGroup);
    });

    // Wall Panels & Columns
    const backWallGeo = new THREE.BoxGeometry(22, 6, 0.5);
    const backWallMat = new THREE.MeshStandardMaterial({
      color: 0x080b15,
      roughness: 0.4,
      metalness: 0.6,
    });
    const backWall = new THREE.Mesh(backWallGeo, backWallMat);
    backWall.position.set(0, 3, -8);
    hallGroup.add(backWall);

    // Portals
    if (isHall1) {
      this.createPortalArchway(hallGroup, [-10, 0, 0], 'lotus', 'Enter Lotus Nexus', 0xec4899);
      this.createPortalArchway(hallGroup, [10, 0, 0], 'hall2', 'Hall II: Fluid Media', 0x3b82f6);
      this.createPortalArchway(hallGroup, [0, 0, 10], 'foyer', 'Return to Foyer', 0x00f0ff);
    } else {
      this.createPortalArchway(hallGroup, [0, 0, 10], 'lounge', 'Enter Reading Lounge', 0x10b981);
      this.createPortalArchway(hallGroup, [-10, 0, 0], 'hall1', 'Return to Hall I', 0x8b5cf6);
    }

    this.scene.add(hallGroup);
  }

  private buildLotusNexus() {
    const lotusGroup = new THREE.Group();
    lotusGroup.position.set(-28, 0, -28);

    // Reflecting Pool Platform
    const poolGeo = new THREE.CylinderGeometry(7.5, 8.0, 0.4, 32);
    const poolMat = new THREE.MeshStandardMaterial({
      color: 0x11081a,
      roughness: 0.1,
      metalness: 0.9,
    });
    const pool = new THREE.Mesh(poolGeo, poolMat);
    pool.position.set(0, 0.2, 0);
    lotusGroup.add(pool);

    // Neon Pool Edge
    const edgeRingGeo = new THREE.TorusGeometry(7.6, 0.06, 8, 48);
    const edgeRingMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
    const edgeRing = new THREE.Mesh(edgeRingGeo, edgeRingMat);
    edgeRing.rotation.x = Math.PI / 2;
    edgeRing.position.set(0, 0.4, 0);
    lotusGroup.add(edgeRing);

    // Water Mirror Plane
    const waterGeo = new THREE.CircleGeometry(7.2, 32);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x2e1065,
      roughness: 0.05,
      metalness: 0.95,
      emissive: 0x7e22ce,
      emissiveIntensity: 0.2,
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = 0.41;
    lotusGroup.add(water);

    // Central Floating 3D Lotus Flower
    const lotusCoreGeo = new THREE.SphereGeometry(0.7, 24, 24);
    const lotusCoreMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xdb2777,
      emissiveIntensity: 0.9,
      roughness: 0.2,
    });
    const lotusCore = new THREE.Mesh(lotusCoreGeo, lotusCoreMat);
    lotusCore.position.set(0, 1.4, 0);
    lotusCore.userData = { type: 'lotusPetal', noteIndex: 0 };
    this.interactiveObjects.push(lotusCore);
    lotusGroup.add(lotusCore);

    // 8 Surrounding Glowing Petals
    const petalGeo = new THREE.ConeGeometry(0.5, 1.8, 4);
    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xf472b6,
      emissive: 0xe11d48,
      emissiveIntensity: 0.6,
      metalness: 0.3,
      roughness: 0.2,
    });

    this.lotusPetals = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const petal = new THREE.Mesh(petalGeo, petalMat);
      petal.position.set(Math.cos(angle) * 1.6, 1.2, Math.sin(angle) * 1.6);
      petal.rotation.z = Math.PI / 3;
      petal.rotation.y = -angle;
      petal.userData = { type: 'lotusPetal', noteIndex: i };
      this.interactiveObjects.push(petal);
      this.lotusPetals.push(petal);
      lotusGroup.add(petal);

      // Surrounding Piano Key Pedestals
      const keyGeo = new THREE.BoxGeometry(0.6, 0.8, 1.4);
      const keyMat = new THREE.MeshStandardMaterial({
        color: 0x1e1b4b,
        emissive: 0x4338ca,
        emissiveIntensity: 0.4,
        metalness: 0.8,
      });
      const keyMesh = new THREE.Mesh(keyGeo, keyMat);
      keyMesh.position.set(Math.cos(angle) * 4.8, 0.8, Math.sin(angle) * 4.8);
      keyMesh.rotation.y = -angle + Math.PI / 2;
      keyMesh.userData = { type: 'pianoKey', noteIndex: i };
      this.interactiveObjects.push(keyMesh);
      lotusGroup.add(keyMesh);
    }

    // Portals
    this.createPortalArchway(lotusGroup, [10, 0, 0], 'hall1', 'Return to Hall I', 0x8b5cf6);
    this.createPortalArchway(lotusGroup, [0, 0, 10], 'games', 'Enter Games & Pool Lounge', 0xa855f7);

    this.scene.add(lotusGroup);
  }

  private buildGamesRoom() {
    const gamesGroup = new THREE.Group();
    gamesGroup.position.set(-28, 0, 0);

    // Floor Platform
    const platGeo = new THREE.BoxGeometry(16, 0.4, 16);
    const platMat = new THREE.MeshStandardMaterial({
      color: 0x130e26,
      roughness: 0.3,
      metalness: 0.7,
    });
    const plat = new THREE.Mesh(platGeo, platMat);
    plat.position.set(0, 0.2, 0);
    gamesGroup.add(plat);

    // -------------------------------------------------------------
    // 3D NEON BILLIARD POOL TABLE
    // -------------------------------------------------------------
    const poolGroup = new THREE.Group();
    poolGroup.position.set(-3.2, 0.4, 0);

    // Felt Surface
    const feltGeo = new THREE.BoxGeometry(4.8, 0.6, 2.6);
    const feltMat = new THREE.MeshStandardMaterial({
      color: 0x064e3b,
      roughness: 0.5,
      metalness: 0.1,
    });
    const felt = new THREE.Mesh(feltGeo, feltMat);
    felt.position.y = 0.9;
    poolGroup.add(felt);

    // Mahogany Outer Rails
    const railGeo = new THREE.BoxGeometry(5.2, 0.7, 3.0);
    const railMat = new THREE.MeshStandardMaterial({
      color: 0x451a03,
      roughness: 0.3,
      metalness: 0.8,
    });
    const rail = new THREE.Mesh(railGeo, railMat);
    rail.position.y = 0.85;
    poolGroup.add(rail);

    // 4 Legs
    const legGeo = new THREE.CylinderGeometry(0.2, 0.2, 1.2, 12);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1c1917, metalness: 0.9 });
    const legPositions = [
      [-2.3, 0.6, -1.2],
      [2.3, 0.6, -1.2],
      [-2.3, 0.6, 1.2],
      [2.3, 0.6, 1.2],
    ];
    legPositions.forEach(([x, y, z]) => {
      const leg = new THREE.Mesh(legGeo, legMat);
      leg.position.set(x, y, z);
      poolGroup.add(leg);
    });

    // Glowing Pool Balls
    const ballGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const ballColors = [0xffffff, 0xf59e0b, 0xef4444, 0x3b82f6, 0x8b5cf6, 0x10b981];
    ballColors.forEach((col, idx) => {
      const ballMat = new THREE.MeshStandardMaterial({
        color: col,
        emissive: col,
        emissiveIntensity: 0.3,
        roughness: 0.1,
      });
      const ball = new THREE.Mesh(ballGeo, ballMat);
      ball.position.set(-1.0 + (idx % 3) * 0.35, 1.3, -0.4 + Math.floor(idx / 3) * 0.4);
      poolGroup.add(ball);
    });

    gamesGroup.add(poolGroup);

    // -------------------------------------------------------------
    // 3D RETRO ARCADE MACHINE
    // -------------------------------------------------------------
    const arcadeGroup = new THREE.Group();
    arcadeGroup.position.set(3.5, 0.4, -2.5);

    // Cabinet
    const cabGeo = new THREE.BoxGeometry(1.8, 3.8, 1.6);
    const cabMat = new THREE.MeshStandardMaterial({
      color: 0x1e1035,
      metalness: 0.8,
      roughness: 0.2,
    });
    const cab = new THREE.Mesh(cabGeo, cabMat);
    cab.position.y = 1.9;
    arcadeGroup.add(cab);

    // CRT Screen
    const screenGeo = new THREE.PlaneGeometry(1.4, 1.1);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
    });
    const screen = new THREE.Mesh(screenGeo, screenMat);
    screen.position.set(0, 2.3, 0.81);
    screen.userData = { type: 'arcadeGame' };
    this.interactiveObjects.push(screen);
    arcadeGroup.add(screen);

    // Glowing Marquee Header
    const marqueeGeo = new THREE.BoxGeometry(1.7, 0.5, 0.2);
    const marqueeMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      emissive: 0xe11d48,
      emissiveIntensity: 0.8,
    });
    const marquee = new THREE.Mesh(marqueeGeo, marqueeMat);
    marquee.position.set(0, 3.6, 0.8);
    arcadeGroup.add(marquee);

    gamesGroup.add(arcadeGroup);

    // Portals
    this.createPortalArchway(gamesGroup, [0, 0, -10], 'lotus', 'Return to Lotus Nexus', 0xec4899);
    this.createPortalArchway(gamesGroup, [0, 0, 10], 'theater', 'Enter Cinema Theater', 0xef4444);

    this.scene.add(gamesGroup);
  }

  private buildTheater() {
    const theaterGroup = new THREE.Group();
    theaterGroup.position.set(-28, 0, 28);

    // Floor Platform
    const platGeo = new THREE.CylinderGeometry(8.5, 9.0, 0.4, 32);
    const platMat = new THREE.MeshStandardMaterial({
      color: 0x0f101d,
      roughness: 0.4,
      metalness: 0.6,
    });
    const plat = new THREE.Mesh(platGeo, platMat);
    plat.position.set(0, 0.2, 0);
    theaterGroup.add(plat);

    // -------------------------------------------------------------
    // CURVED 3D PROJECTION SCREEN
    // -------------------------------------------------------------
    const screenGeo = new THREE.CylinderGeometry(8, 8, 4.5, 32, 1, true, -Math.PI / 3, (Math.PI * 2) / 3);
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0369a1,
      emissiveIntensity: 0.6,
      side: THREE.DoubleSide,
      roughness: 0.2,
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 2.8, -4.5);
    screenMesh.rotation.y = Math.PI;
    screenMesh.userData = { type: 'theaterScreen' };
    this.interactiveObjects.push(screenMesh);
    theaterGroup.add(screenMesh);

    // Screen Neon Border Frame
    const frameGeo = new THREE.TorusGeometry(4.8, 0.08, 8, 32);
    const frameMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.set(0, 2.8, -4.2);
    frame.scale.set(1.6, 0.5, 1);
    theaterGroup.add(frame);

    // Theater Lounge Seats
    const seatGeo = new THREE.BoxGeometry(1.2, 0.8, 0.9);
    const seatMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.6 });
    for (let row = 0; row < 2; row++) {
      for (let col = -2; col <= 2; col++) {
        const seat = new THREE.Mesh(seatGeo, seatMat);
        seat.position.set(col * 1.5, 0.8 + row * 0.3, 1.0 + row * 1.8);
        theaterGroup.add(seat);
      }
    }

    // Overhead Light Beam Cone
    const coneGeo = new THREE.ConeGeometry(2.8, 7.0, 16, 1, true);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
    });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.set(0, 3.8, 0);
    cone.rotation.x = -Math.PI / 4;
    theaterGroup.add(cone);

    // Portals
    this.createPortalArchway(theaterGroup, [0, 0, -10], 'games', 'Return to Games Room', 0xa855f7);
    this.createPortalArchway(theaterGroup, [10, 0, 0], 'skatepark', 'Enter Indoor Skate Park', 0xf97316);

    this.scene.add(theaterGroup);
  }

  private buildSkatePark() {
    const skateGroup = new THREE.Group();
    skateGroup.position.set(0, 0, 28);

    // Floor
    const floorGeo = new THREE.BoxGeometry(18, 0.4, 18);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1c1917,
      roughness: 0.4,
      metalness: 0.6,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.set(0, 0.2, 0);
    skateGroup.add(floor);

    // -------------------------------------------------------------
    // RAMP & QUARTER-PIPE
    // -------------------------------------------------------------
    const rampGeo = new THREE.BoxGeometry(5.0, 2.5, 4.0);
    const rampMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.8,
      roughness: 0.3,
    });
    const ramp = new THREE.Mesh(rampGeo, rampMat);
    ramp.position.set(-4.5, 1.2, -3.0);
    ramp.rotation.z = -Math.PI / 8;
    skateGroup.add(ramp);

    // -------------------------------------------------------------
    // INTERACTIVE RED LAUNCH BUTTON
    // -------------------------------------------------------------
    const btnPedGeo = new THREE.CylinderGeometry(0.8, 1.0, 1.0, 16);
    const btnPedMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.9 });
    const btnPed = new THREE.Mesh(btnPedGeo, btnPedMat);
    btnPed.position.set(-4.5, 0.8, 2.5);
    skateGroup.add(btnPed);

    const redBtnGeo = new THREE.CylinderGeometry(0.6, 0.6, 0.3, 24);
    const redBtnMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xd97706,
      emissiveIntensity: 0.8,
      metalness: 0.2,
    });
    const redBtn = new THREE.Mesh(redBtnGeo, redBtnMat);
    redBtn.position.set(-4.5, 1.4, 2.5);
    redBtn.userData = { type: 'skateLaunchBtn' };
    this.interactiveObjects.push(redBtn);
    skateGroup.add(redBtn);

    // -------------------------------------------------------------
    // FOAM CUSHION PIT (60 Soft Physics Cubes)
    // -------------------------------------------------------------
    const pitGeo = new THREE.BoxGeometry(6.5, 0.8, 6.5);
    const pitMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.8 });
    const pitBase = new THREE.Mesh(pitGeo, pitMat);
    pitBase.position.set(3.5, 0.6, 0);
    skateGroup.add(pitBase);

    const blockGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const blockColors = [0xf43f5e, 0x38bdf8, 0xa855f7, 0xfacc15, 0x34d399];

    for (let i = 0; i < 45; i++) {
      const col = blockColors[i % blockColors.length];
      const mat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.7 });
      const block = new THREE.Mesh(blockGeo, mat);
      block.position.set(
        1.5 + (Math.random() - 0.5) * 5.0,
        0.9 + Math.random() * 0.8,
        (Math.random() - 0.5) * 5.0
      );
      block.rotation.set(Math.random(), Math.random(), Math.random());
      skateGroup.add(block);
    }

    // -------------------------------------------------------------
    // 3D STUNT BIKE GROUP
    // -------------------------------------------------------------
    this.skateBikeGroup = new THREE.Group();
    this.skateBikeGroup.position.set(-6.0, 2.2, -3.0);

    // Bike Frame
    const frameGeo = new THREE.TorusGeometry(0.4, 0.08, 8, 16);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xf97316, metalness: 0.9, roughness: 0.2 });
    const bikeFrame = new THREE.Mesh(frameGeo, frameMat);
    this.skateBikeGroup.add(bikeFrame);

    // Bike Wheels
    const wheelGeo = new THREE.TorusGeometry(0.35, 0.06, 8, 24);
    const wheelMat = new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.5 });
    const w1 = new THREE.Mesh(wheelGeo, wheelMat);
    w1.position.set(-0.6, -0.3, 0);
    this.skateBikeGroup.add(w1);

    const w2 = new THREE.Mesh(wheelGeo, wheelMat);
    w2.position.set(0.6, -0.3, 0);
    this.skateBikeGroup.add(w2);

    skateGroup.add(this.skateBikeGroup);

    // Portals
    this.createPortalArchway(skateGroup, [-10, 0, 0], 'theater', 'Return to Theater', 0xef4444);
    this.createPortalArchway(skateGroup, [10, 0, 0], 'waterworld', 'Enter Water World', 0x38bdf8);

    this.scene.add(skateGroup);
  }

  private buildWaterWorld() {
    const waterGroup = new THREE.Group();
    waterGroup.position.set(28, 0, 28);

    // Pool Base Deck
    const deckGeo = new THREE.CylinderGeometry(8.5, 9.0, 0.4, 32);
    const deckMat = new THREE.MeshStandardMaterial({
      color: 0x0c1e2e,
      roughness: 0.3,
      metalness: 0.7,
    });
    const deck = new THREE.Mesh(deckGeo, deckMat);
    deck.position.set(0, 0.2, 0);
    waterGroup.add(deck);

    // -------------------------------------------------------------
    // FLOWRIDER SURF MACHINE
    // -------------------------------------------------------------
    const surfRampGeo = new THREE.BoxGeometry(4.2, 1.2, 6.0);
    const surfRampMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.5,
      roughness: 0.1,
    });
    const surfRamp = new THREE.Mesh(surfRampGeo, surfRampMat);
    surfRamp.position.set(-3.5, 0.8, -1.0);
    surfRamp.rotation.x = Math.PI / 12;
    waterGroup.add(surfRamp);

    // Surfboard
    const boardGeo = new THREE.BoxGeometry(0.6, 0.08, 1.8);
    const boardMat = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xeab308,
      emissiveIntensity: 0.6,
    });
    const board = new THREE.Mesh(boardGeo, boardMat);
    board.position.set(-3.5, 1.3, -1.0);
    board.rotation.x = Math.PI / 12;
    board.userData = { type: 'flowriderSurf' };
    this.interactiveObjects.push(board);
    waterGroup.add(board);

    // -------------------------------------------------------------
    // 3D JET BOAT
    // -------------------------------------------------------------
    const boatGroup = new THREE.Group();
    boatGroup.position.set(3.5, 0.6, 1.5);

    // Hull
    const hullGeo = new THREE.ConeGeometry(1.2, 3.8, 4);
    const hullMat = new THREE.MeshStandardMaterial({
      color: 0xf87171,
      metalness: 0.9,
      roughness: 0.1,
    });
    const hull = new THREE.Mesh(hullGeo, hullMat);
    hull.rotation.x = Math.PI / 2;
    boatGroup.add(hull);

    // Windshield
    const glassGeo = new THREE.BoxGeometry(0.9, 0.4, 0.6);
    const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(0, 0.4, 0);
    boatGroup.add(glass);

    boatGroup.userData = { type: 'jetBoat' };
    this.interactiveObjects.push(boatGroup);
    waterGroup.add(boatGroup);

    // Portals
    this.createPortalArchway(waterGroup, [-10, 0, 0], 'skatepark', 'Return to Skate Park', 0xf97316);
    this.createPortalArchway(waterGroup, [0, 0, -10], 'lounge', 'Return to Lounge', 0x10b981);

    this.scene.add(waterGroup);
  }

  private buildReadingLounge() {
    const loungeGroup = new THREE.Group();
    loungeGroup.position.set(28, 0, 0);

    // Circular Lounge Platform
    const platformGeo = new THREE.CylinderGeometry(7, 7.5, 0.4, 32);
    const platformMat = new THREE.MeshStandardMaterial({
      color: 0x0a1418,
      roughness: 0.3,
      metalness: 0.7,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.position.set(0, 0.2, 0);
    loungeGroup.add(platform);

    // Glowing Neon Edge Ring
    const edgeRingGeo = new THREE.TorusGeometry(7.1, 0.05, 8, 48);
    const edgeRingMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const edgeRing = new THREE.Mesh(edgeRingGeo, edgeRingMat);
    edgeRing.rotation.x = Math.PI / 2;
    edgeRing.position.set(0, 0.4, 0);
    loungeGroup.add(edgeRing);

    // Central Reading Console Pedestal
    const consoleGeo = new THREE.CylinderGeometry(0.8, 1.1, 1.4, 16);
    const consoleMat = new THREE.MeshStandardMaterial({
      color: 0x122420,
      metalness: 0.8,
      roughness: 0.2,
    });
    const consoleMesh = new THREE.Mesh(consoleGeo, consoleMat);
    consoleMesh.position.set(0, 0.9, 0);
    loungeGroup.add(consoleMesh);

    // Floating Cyber Tablet / E-Reader Mockup Mesh
    const tabletGeo = new THREE.BoxGeometry(2.4, 0.08, 1.8);
    const tabletMat = new THREE.MeshStandardMaterial({
      color: 0x052e26,
      emissive: 0x10b981,
      emissiveIntensity: 0.3,
      roughness: 0.1,
      metalness: 0.9,
    });
    this.loungeTabletMesh = new THREE.Mesh(tabletGeo, tabletMat);
    this.loungeTabletMesh.position.set(0, 1.7, 0);
    this.loungeTabletMesh.rotation.x = Math.PI / 8;
    this.loungeTabletMesh.userData = { type: 'loungeTablet' };
    this.interactiveObjects.push(this.loungeTabletMesh);
    loungeGroup.add(this.loungeTabletMesh);

    // Floating Hologram Text Beacon over Tablet
    const holoRingGeo = new THREE.TorusGeometry(1.5, 0.03, 8, 32);
    const holoRingMat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const holoRing = new THREE.Mesh(holoRingGeo, holoRingMat);
    holoRing.rotation.x = Math.PI / 2;
    holoRing.position.set(0, 2.2, 0);
    loungeGroup.add(holoRing);

    // Portal to The Vault & Hall II
    this.createPortalArchway(loungeGroup, [-7, 0, 9], 'vault', 'Enter The Vault: Ebook Showcase', 0xf59e0b);
    this.createPortalArchway(loungeGroup, [0, 0, -10], 'hall2', 'Return to Hall II', 0x3b82f6);

    this.scene.add(loungeGroup);
  }

  private buildVault() {
    const vaultGroup = new THREE.Group();
    vaultGroup.position.set(14, 0, 18);

    // Elevated Golden Platform
    const vaultPlatGeo = new THREE.CylinderGeometry(6.5, 7.0, 0.6, 32);
    const vaultPlatMat = new THREE.MeshStandardMaterial({
      color: 0x1c1508,
      metalness: 0.9,
      roughness: 0.2,
    });
    const vaultPlat = new THREE.Mesh(vaultPlatGeo, vaultPlatMat);
    vaultPlat.position.set(0, 0.3, 0);
    vaultGroup.add(vaultPlat);

    // Golden Halo Ring
    const goldRingGeo = new THREE.TorusGeometry(6.6, 0.06, 8, 48);
    const goldRingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.6,
      metalness: 0.9,
    });
    const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
    goldRing.rotation.x = Math.PI / 2;
    goldRing.position.set(0, 0.6, 0);
    vaultGroup.add(goldRing);

    // Vault Spotlights from Above
    const spotLight = new THREE.SpotLight(0xfff1cf, 4.0, 18, Math.PI / 5, 0.3, 1.2);
    spotLight.position.set(0, 7.5, 0);
    spotLight.target = vaultPlat;
    vaultGroup.add(spotLight);

    // Pedestal for the 3D Book
    const pedGeo = new THREE.CylinderGeometry(1.2, 1.4, 1.2, 24);
    const pedMat = new THREE.MeshStandardMaterial({
      color: 0x110e06,
      metalness: 0.95,
      roughness: 0.1,
    });
    const ped = new THREE.Mesh(pedGeo, pedMat);
    ped.position.set(0, 0.9, 0);
    vaultGroup.add(ped);

    // -------------------------------------------------------------
    // REALISTIC 3D HARDCOVER BOOK MODEL
    // -------------------------------------------------------------
    this.bookGroup = new THREE.Group();
    this.bookGroup.position.set(0, 2.1, 0);

    const bookWidth = 1.9;
    const bookHeight = 2.6;
    const bookDepth = 0.38;

    // Materials for the Book:
    // Front cover has high-res canvas texture
    const coverTexture = createBookCoverTexture(
      ebookConfig.title,
      ebookConfig.subtitle,
      ebookConfig.author
    );

    const frontCoverMat = new THREE.MeshStandardMaterial({
      map: coverTexture,
      roughness: 0.25,
      metalness: 0.4,
    });

    const spineAndBackMat = new THREE.MeshStandardMaterial({
      color: 0x0b0e1b,
      roughness: 0.35,
      metalness: 0.6,
    });

    // Gold gilded pages material
    const pagesMat = new THREE.MeshStandardMaterial({
      color: 0xe5c058,
      metalness: 0.85,
      roughness: 0.3,
    });

    // Materials array for BoxGeometry: [right, left, top, bottom, front, back]
    const bookMaterials = [
      pagesMat,        // Right (Gilded Page edges)
      spineAndBackMat, // Left (Spine)
      pagesMat,        // Top (Gilded Page edges)
      pagesMat,        // Bottom (Gilded Page edges)
      frontCoverMat,   // Front (Master Cover Artwork)
      spineAndBackMat, // Back Cover
    ];

    const bookGeo = new THREE.BoxGeometry(bookWidth, bookHeight, bookDepth);
    const bookMesh = new THREE.Mesh(bookGeo, bookMaterials);
    bookMesh.userData = { type: 'book' };
    this.interactiveObjects.push(bookMesh);
    this.bookGroup.add(bookMesh);

    // Gold Ribbon Bookmark Hanging Down
    const ribbonGeo = new THREE.BoxGeometry(0.08, 0.9, 0.02);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      metalness: 0.9,
      roughness: 0.2,
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.set(0.3, -bookHeight / 2 - 0.3, 0);
    this.bookGroup.add(ribbon);

    // Floating Gold Sparkle Ring Around Book
    const auraGeo = new THREE.TorusGeometry(1.8, 0.025, 8, 36);
    const auraMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24, transparent: true, opacity: 0.7 });
    const aura = new THREE.Mesh(auraGeo, auraMat);
    aura.rotation.x = Math.PI / 2.3;
    this.bookGroup.add(aura);

    vaultGroup.add(this.bookGroup);

    // Return Portals
    this.createPortalArchway(vaultGroup, [-8, 0, -8], 'foyer', 'Return to Foyer', 0x00f0ff);
    this.createPortalArchway(vaultGroup, [8, 0, -8], 'lounge', 'Back to Reading Lounge', 0x10b981);

    this.scene.add(vaultGroup);
  }

  private createPortalArchway(
    parentGroup: THREE.Group,
    pos: [number, number, number],
    targetRoom: RoomId,
    label: string,
    colorHex: number
  ) {
    const portalGroup = new THREE.Group();
    portalGroup.position.set(...pos);

    // Arch Frame
    const archGeo = new THREE.BoxGeometry(3.2, 4.4, 0.25);
    const archMat = new THREE.MeshStandardMaterial({
      color: 0x0c111e,
      metalness: 0.8,
      roughness: 0.3,
    });
    const arch = new THREE.Mesh(archGeo, archMat);
    arch.position.y = 2.2;
    portalGroup.add(arch);

    // Glowing Inner Portal Quad
    const innerGeo = new THREE.PlaneGeometry(2.5, 3.8);
    const innerMat = new THREE.MeshBasicMaterial({
      color: colorHex,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMesh.position.y = 2.2;
    innerMesh.userData = { type: 'portal', targetRoom, label };
    this.interactiveObjects.push(innerMesh);
    portalGroup.add(innerMesh);

    // Portal Light
    const pLight = new THREE.PointLight(colorHex, 1.8, 8);
    pLight.position.set(0, 2.2, 0.5);
    portalGroup.add(pLight);

    this.portalMeshes.push({ mesh: innerMesh, targetRoom, light: pLight });
    parentGroup.add(portalGroup);
  }

  private buildParticleField() {
    const particleCount = 1200;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const c1 = new THREE.Color(0x00f0ff);
    const c2 = new THREE.Color(0x8b5cf6);
    const c3 = new THREE.Color(0xf59e0b);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.3) * 90;
      positions[i * 3 + 1] = Math.random() * 12 + 0.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 90;

      const pick = Math.random();
      const col = pick < 0.4 ? c1 : pick < 0.75 ? c2 : c3;
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });

    this.particlesMesh = new THREE.Points(geo, mat);
    this.scene.add(this.particlesMesh);
  }

  // -------------------------------------------------------------
  // HORIZON PLASMA ENGINE (FRAGMENT SHADER PARTICLE EMITTER)
  // -------------------------------------------------------------
  private buildHorizonPlasmaEngine() {
    const plasmaGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8.0;
      positions[i + 1] = (Math.random() - 0.5) * 8.0;
      positions[i + 2] = (Math.random() - 0.5) * 8.0;
    }

    plasmaGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const plasmaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uColorA: { value: new THREE.Color(0x00f0ff) },
        uColorB: { value: new THREE.Color(0xff00aa) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = 4.0 * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying vec2 vUv;

        // Procedural noise function for plasma turbulence
        float noise(vec2 p) {
          return sin(p.x * 10.0 + uTime) * cos(p.y * 10.0 - uTime) * 0.5 + 0.5;
        }

        void main() {
          vec2 uv = gl_PointCoord;
          float dist = distance(uv, vec2(0.5));
          if (dist > 0.5) discard;
          
          float n = noise(uv * 3.0 + vec2(uTime * 0.2, -uTime * 0.3));
          n += noise(uv * 6.0 - vec2(uTime * 0.5));
          
          vec3 finalColor = mix(uColorA, uColorB, n);
          float alpha = smoothstep(0.5, 0.1, dist) * smoothstep(0.1, 0.9, n);
          
          gl_FragColor = vec4(finalColor, alpha * 0.85);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    this.plasmaSystem = new THREE.Points(plasmaGeometry, plasmaMaterial);
    // Position it in the Theater room or Foyer? 
    // Let's put it high up in the Foyer as a "Cosmic Horizon"
    this.plasmaSystem.position.set(0, 12, -15);
    this.scene.add(this.plasmaSystem);
  }

  // -------------------------------------------------------------
  // ANIMATED FLUID MESHES (VERTEX DISPLACEMENT SHADERS / GEOMETRY)
  // -------------------------------------------------------------
  private buildFluidWaveMeshes() {
    this.fluidWaveMeshes = [];

    // Helper to register a responsive undulating fluid mesh
    const createFluidMesh = (
      pos: [number, number, number],
      rot: [number, number, number],
      size: [number, number, number, number],
      colorHex: number,
      opacity: number,
      speed: number,
      freqX: number,
      freqY: number,
      amplitude: number,
      wireframe: boolean = false
    ) => {
      const geo = new THREE.PlaneGeometry(size[0], size[1], size[2], size[3]);
      const basePositions = new Float32Array(geo.attributes.position.array);

      const mat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.35,
        wireframe,
        transparent: true,
        opacity,
        side: THREE.DoubleSide,
        roughness: 0.2,
        metalness: 0.8,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(...pos);
      mesh.rotation.set(...rot);
      this.scene.add(mesh);

      this.fluidWaveMeshes.push({
        mesh,
        geometry: geo,
        basePositions,
        speed,
        freqX,
        freqY,
        amplitude,
      });
    };

    // 1. Foyer Grand Ripple Canopy (Overhead Atrium)
    createFluidMesh(
      [0, 8.2, 0],
      [Math.PI / 2, 0, 0],
      [36, 36, 40, 40],
      0x00f0ff,
      0.18,
      0.85,
      0.35,
      0.35,
      0.65,
      true
    );

    // 2. Hall I Chrono-Fluid Ribbon Backdrop
    createFluidMesh(
      [0, 4.2, -18.2],
      [0, 0, 0],
      [24, 8, 36, 18],
      0x8b5cf6,
      0.22,
      1.1,
      0.45,
      0.3,
      0.55,
      false
    );

    // 3. Hall II Kinetic Fluid Wave Wall
    createFluidMesh(
      [28, 4.2, -18.2],
      [0, 0, 0],
      [24, 8, 36, 18],
      0x38bdf8,
      0.22,
      1.2,
      0.5,
      0.35,
      0.6,
      false
    );

    // 4. Reading Lounge Ambient Bio-Wave Bed
    createFluidMesh(
      [28, 0.45, 0],
      [-Math.PI / 2, 0, 0],
      [18, 18, 28, 28],
      0x10b981,
      0.2,
      0.7,
      0.3,
      0.3,
      0.4,
      true
    );

    // 5. The Vault Shimmering Golden Aurora Curtain
    createFluidMesh(
      [14, 5.0, 24.5],
      [0, 0, 0],
      [20, 10, 32, 20],
      0xf59e0b,
      0.28,
      0.9,
      0.4,
      0.35,
      0.75,
      false
    );
  }

  // -------------------------------------------------------------
  // SUPER PUFF BODYGUARD (AI SPATIAL COMPANION)
  // -------------------------------------------------------------
  private buildSuperPuff() {
    this.guardianGroup = new THREE.Group();
    const initialPos = this.guardianRoomPositions.foyer;
    this.guardianTargetPos = new THREE.Vector3(...initialPos);
    this.guardianCurrentPos = this.guardianTargetPos.clone();
    this.guardianGroup.position.copy(this.guardianCurrentPos);

    // 1. Central Luminous Dragon Core (Crystal Sphere)
    const coreGeo = new THREE.SphereGeometry(0.38, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00d4ff,
      emissiveIntensity: 0.9,
      metalness: 0.3,
      roughness: 0.1,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.name = 'guardianCore';
    this.guardianGroup.add(coreMesh);

    // Inner glowing crystal
    const innerGeo = new THREE.OctahedronGeometry(0.24, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    this.guardianGroup.add(innerMesh);

    // 2. Dragon Horn Crest (Cyber Horns)
    const hornGeo = new THREE.ConeGeometry(0.06, 0.45, 6);
    const hornMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x6d28d9,
      emissiveIntensity: 0.7,
      metalness: 0.8,
      roughness: 0.2,
    });

    const leftHorn = new THREE.Mesh(hornGeo, hornMat);
    leftHorn.position.set(-0.2, 0.32, -0.08);
    leftHorn.rotation.set(-0.4, 0, -0.4);
    this.guardianGroup.add(leftHorn);

    const rightHorn = new THREE.Mesh(hornGeo, hornMat);
    rightHorn.position.set(0.2, 0.32, -0.08);
    rightHorn.rotation.set(-0.4, 0, 0.4);
    this.guardianGroup.add(rightHorn);

    // 3. The 9 Orbital Chrono-Wings (Dragon9 Shards)
    this.guardianWings = [];
    const shardGeo = new THREE.OctahedronGeometry(0.09, 0);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1,
    });

    for (let i = 0; i < 9; i++) {
      const shard = new THREE.Mesh(shardGeo, shardMat);
      shard.userData = {
        orbitIndex: i,
        speed: 1.2 + (i % 3) * 0.4,
        radius: 0.7 + (i % 3) * 0.22,
        inclination: ((i * 40) * Math.PI) / 180,
      };
      this.guardianGroup.add(shard);
      this.guardianWings.push(shard);
    }

    // 4. Serpentine Floater Tail (4 luminous spinal nodes)
    this.guardianTailNodes = [];
    for (let i = 0; i < 4; i++) {
      const radius = 0.14 * Math.pow(0.82, i);
      const tailGeo = new THREE.SphereGeometry(radius, 16, 16);
      const tailMat = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        emissive: 0x7c3aed,
        emissiveIntensity: 0.6,
        roughness: 0.3,
      });
      const tailNode = new THREE.Mesh(tailGeo, tailMat);
      tailNode.position.set(0, -0.32 - i * 0.25, -0.12 - i * 0.18);
      this.guardianGroup.add(tailNode);
      this.guardianTailNodes.push(tailNode);
    }

    // 5. Guardian Light
    this.guardianCoreLight = new THREE.PointLight(0x00f0ff, 2.2, 8);
    this.guardianCoreLight.position.set(0, 0, 0);
    this.guardianGroup.add(this.guardianCoreLight);

    // 6. Interactive Raycast Hitbox
    const hitGeo = new THREE.SphereGeometry(0.9, 12, 12);
    const hitMat = new THREE.MeshBasicMaterial({
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const hitMesh = new THREE.Mesh(hitGeo, hitMat);
    hitMesh.userData = { type: 'guardian' };
    this.guardianGroup.add(hitMesh);
    this.interactiveObjects.push(hitMesh);

    this.scene.add(this.guardianGroup);
  }

  // -------------------------------------------------------------
  // NAVIGATION & CAMERA CONTROL
  // -------------------------------------------------------------
  public navigateToRoom(roomId: RoomId) {
    const room = ebookConfig.rooms.find(r => r.id === roomId);
    if (!room) return;

    this.currentRoomId = roomId;
    this.targetCamPos.set(...room.cameraPosition);
    this.targetLookAt.set(...room.cameraLookAt);

    // Update Guardian Target Position
    const gPos = this.guardianRoomPositions[roomId];
    if (gPos) {
      this.guardianTargetPos.set(...gPos);
    }

    this.callbacks.onSelectRoom(roomId);
  }

  public setMouseParallax(clientX: number, clientY: number) {
    const normX = (clientX / window.innerWidth) * 2 - 1;
    const normY = -(clientY / window.innerHeight) * 2 + 1;

    this.mouseVec.set(normX, normY);
    this.targetMouseOffset.x = normX * 0.8;
    this.targetMouseOffset.y = normY * 0.4;
  }

  private setupEventListeners() {
    const onPointerMove = (e: MouseEvent) => {
      this.setMouseParallax(e.clientX, e.clientY);
      this.checkRaycastHover();
    };

    const onPointerDown = (e: MouseEvent) => {
      // Trigger Raycast Click
      this.setMouseParallax(e.clientX, e.clientY);
      this.handleRaycastClick();
    };

    let touchStartPos = { x: 0, y: 0, time: 0 };
    let initialPinchDist = 0;
    let initialFov = 50;

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartPos = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now(),
        };
        this.setMouseParallax(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        initialPinchDist = Math.hypot(dx, dy);
        initialFov = this.camera.fov;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        this.setMouseParallax(e.touches[0].clientX, e.touches[0].clientY);
      } else if (e.touches.length === 2 && initialPinchDist > 0) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if (dist > 0) {
          const factor = initialPinchDist / dist;
          const newFov = Math.max(30, Math.min(75, initialFov * factor));
          this.camera.fov = newFov;
          this.camera.updateProjectionMatrix();
        }
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.changedTouches.length === 1) {
        const touch = e.changedTouches[0];
        const dx = touch.clientX - touchStartPos.x;
        const dy = touch.clientY - touchStartPos.y;
        const dist = Math.hypot(dx, dy);
        const duration = Date.now() - touchStartPos.time;

        if (dist < 12 && duration < 350) {
          this.setMouseParallax(touch.clientX, touch.clientY);
          this.handleRaycastClick();
        }
      }
      initialPinchDist = 0;
    };

    const onResize = () => {
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.composer.setSize(width, height);
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('click', onPointerDown);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('resize', onResize);
  }

  private checkRaycastHover() {
    this.raycaster.setFromCamera(this.mouseVec, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      let targetObj: THREE.Object3D | null = intersects[0].object;
      while (targetObj && !targetObj.userData?.type && targetObj.parent) {
        targetObj = targetObj.parent;
      }

      if (targetObj && targetObj.userData?.type) {
        this.container.style.cursor = 'pointer';
        this.hoveredObject = targetObj;
        return;
      }
    }

    this.container.style.cursor = 'default';
    this.hoveredObject = null;
  }

  private handleRaycastClick() {
    this.raycaster.setFromCamera(this.mouseVec, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      let targetObj: THREE.Object3D | null = intersects[0].object;
      while (targetObj && !targetObj.userData?.type && targetObj.parent) {
        targetObj = targetObj.parent;
      }

      if (targetObj && targetObj.userData) {
        const type = targetObj.userData.type;
        if (type === 'portal') {
          const targetRoom = targetObj.userData.targetRoom as RoomId;
          this.navigateToRoom(targetRoom);
        } else if (type === 'exhibit') {
          const id = targetObj.userData.id as string;
          this.callbacks.onSelectExhibit(id);
        } else if (type === 'loungeTablet') {
          this.callbacks.onOpenReadingLounge();
        } else if (type === 'book') {
          this.callbacks.onOpenVaultCheckout();
        } else if (type === 'guardian') {
          this.callbacks.onSelectGuardian();
        } else if (type === 'lotusPetal' || type === 'pianoKey') {
          const index = (targetObj.userData.noteIndex as number) || 0;
          // 432Hz Harmonic Series for the Sovereign Lotus Nexus
          const freqs = [432, 486, 540, 576, 648, 720, 810, 864];
          const freq = freqs[index % freqs.length];
          spatialAudio.playHealerTone(freq, 'sine', 0.15);
        } else if (type === 'skateLaunchBtn') {
          this.triggerSkateBikeLaunch();
        } else if (type === 'arcadeGame') {
          spatialAudio.playSynthNote(880);
        } else if (type === 'theaterScreen') {
          spatialAudio.playSynthNote(520);
        } else if (type === 'flowriderSurf' || type === 'jetBoat') {
          spatialAudio.playSynthNote(320);
        } else if (type === 'pipelineTerminal') {
          this.callbacks.onOpenPipeline();
        }
      }
    }
  }

  public triggerSkateBikeLaunch() {
    if (this.isBikeLaunching) return;
    this.isBikeLaunching = true;
    this.bikeLaunchTime = this.clock.getElapsedTime();
    spatialAudio.playSynthNote(600);
  }

  public setPerformanceMode(isPerformance: boolean) {
    this.isPerformanceMode = isPerformance;
    if (this.renderer) {
      if (isPerformance) {
        this.renderer.setPixelRatio(1.0);
        if (this.bloomPass) {
          this.bloomPass.enabled = false;
        }
        if (this.particlesMesh) {
          this.particlesMesh.visible = false;
        }
      } else {
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        if (this.bloomPass) {
          this.bloomPass.enabled = true;
        }
        if (this.particlesMesh) {
          this.particlesMesh.visible = true;
        }
      }
    }
  }

  // -------------------------------------------------------------
  // ANIMATION LOOP
  // -------------------------------------------------------------
  private startLoop() {
    const loop = () => {
      this.animFrameId = requestAnimationFrame(loop);
      const delta = this.clock.getDelta();
      const elapsed = this.clock.getElapsedTime();

      // Smooth Camera Lerp
      const lerpSpeed = 0.055;
      this.currentCamPos.lerp(this.targetCamPos, lerpSpeed);
      this.currentLookAt.lerp(this.targetLookAt, lerpSpeed);

      // Smooth Mouse Parallax
      this.mouseOffset.x += (this.targetMouseOffset.x - this.mouseOffset.x) * 0.05;
      this.mouseOffset.y += (this.targetMouseOffset.y - this.mouseOffset.y) * 0.05;

      this.camera.position.set(
        this.currentCamPos.x + this.mouseOffset.x,
        this.currentCamPos.y + this.mouseOffset.y,
        this.currentCamPos.z
      );
      this.camera.lookAt(
        this.currentLookAt.x + this.mouseOffset.x * 0.5,
        this.currentLookAt.y + this.mouseOffset.y * 0.5,
        this.currentLookAt.z
      );

      // Super Puff Animation & Hovering Physics
      if (this.guardianGroup) {
        // Smooth position glide to room location
        this.guardianCurrentPos.lerp(this.guardianTargetPos, 0.045);
        const hoverY = Math.sin(elapsed * 2.2) * 0.12;
        this.guardianGroup.position.set(
          this.guardianCurrentPos.x,
          this.guardianCurrentPos.y + hoverY,
          this.guardianCurrentPos.z
        );

        // Gently face towards the camera
        this.guardianGroup.lookAt(this.camera.position);

        // Animate 9 Orbital Chrono-Shards
        this.guardianWings.forEach((shard, idx) => {
          const orbitAngle = elapsed * shard.userData.speed + (idx * Math.PI * 2) / 9;
          const r = shard.userData.radius;
          shard.position.set(
            Math.cos(orbitAngle) * r,
            Math.sin(orbitAngle * 1.5) * 0.35,
            Math.sin(orbitAngle) * r
          );
          shard.rotation.x += delta * 1.8;
          shard.rotation.y += delta * 2.2;
        });

        // Animate Serpentine Tail Nodes
        this.guardianTailNodes.forEach((node, i) => {
          const wave = Math.sin(elapsed * 3.5 - i * 0.8) * 0.08;
          node.position.x = wave;
          node.position.y = -0.32 - i * 0.25 + Math.cos(elapsed * 2.5 - i * 0.6) * 0.05;
        });

        // Pulsing Light
        if (this.guardianCoreLight) {
          this.guardianCoreLight.intensity = 2.0 + Math.sin(elapsed * 3.0) * 0.8;
        }
      }

      // Animate Skate Bike Launch Parabola
      if (this.isBikeLaunching && this.skateBikeGroup) {
        const t = (elapsed - this.bikeLaunchTime) * 1.8;
        if (t <= 2.2) {
          const startX = -6.0;
          const targetX = 3.5;
          const curX = startX + (targetX - startX) * (t / 2.2);
          const curY = 2.2 + Math.sin((t / 2.2) * Math.PI) * 3.5 - (t / 2.2) * 1.2;
          this.skateBikeGroup.position.set(curX, Math.max(1.0, curY), -3.0 + (t / 2.2) * 3.0);
          this.skateBikeGroup.rotation.z = Math.sin(t * 3) * 0.8;
        } else {
          this.skateBikeGroup.position.set(-6.0, 2.2, -3.0);
          this.skateBikeGroup.rotation.set(0, 0, 0);
          this.isBikeLaunching = false;
        }
      }

      // Animate Lotus Petals Waving
      this.lotusPetals.forEach((petal, i) => {
        petal.position.y = 1.2 + Math.sin(elapsed * 2.0 + i) * 0.08;
      });

      // Kinetic Sculpture Animation in Foyer
      if (this.kineticSculpture) {
        this.kineticSculpture.children.forEach((child, i) => {
          if (child.name.startsWith('gyro_')) {
            const speed = (i + 1) * 0.4;
            child.rotation.x += delta * speed * 0.7;
            child.rotation.y += delta * speed;
          }
        });
      }

      // 3D Hardcover Book Animation in The Vault
      if (this.bookGroup) {
        // Slow majestic float & rotation
        this.bookGroup.rotation.y = Math.sin(elapsed * 0.45) * 0.55 + elapsed * 0.15;
        this.bookGroup.position.y = 2.1 + Math.sin(elapsed * 1.4) * 0.12;
      }

      // Floating Exhibit Frames subtle bob
      this.exhibitMeshes.forEach((item, idx) => {
        item.mesh.position.y = Math.sin(elapsed * 1.5 + idx * 1.2) * 0.08;
      });

      // Lounge Tablet pulse
      if (this.loungeTabletMesh) {
        this.loungeTabletMesh.position.y = 1.7 + Math.sin(elapsed * 1.6) * 0.06;
      }

      // Particle Field gentle drift
      if (this.particlesMesh) {
        this.particlesMesh.rotation.y = elapsed * 0.02;
      }

      // Horizon Plasma Engine Animation
      if (this.plasmaSystem) {
        (this.plasmaSystem.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed;
        this.plasmaSystem.rotation.y = elapsed * 0.1;
      }

      // Portal Quad Pulsing
      this.portalMeshes.forEach(({ mesh, light }, idx) => {
        const pulse = Math.sin(elapsed * 2.5 + idx) * 0.15 + 0.4;
        (mesh.material as THREE.MeshBasicMaterial).opacity = pulse;
        light.intensity = 1.5 + Math.sin(elapsed * 2.5 + idx) * 0.6;
      });

      // Real-Time Animated Fluid Mesh Vertex Displacement (Throttled in Performance Mode)
      const shouldUpdateFluidMesh = !this.isPerformanceMode || (Math.floor(elapsed * 30) % 2 === 0);
      if (shouldUpdateFluidMesh) {
        this.fluidWaveMeshes.forEach(fm => {
          const posAttr = fm.geometry.attributes.position;
          const arr = posAttr.array as Float32Array;
          const count = posAttr.count;
          for (let i = 0; i < count; i++) {
            const origZ = fm.basePositions[i * 3 + 2];
            const x = fm.basePositions[i * 3];
            const y = fm.basePositions[i * 3 + 1];
            const wave =
              Math.sin(x * fm.freqX + elapsed * fm.speed) *
                Math.cos(y * fm.freqY + elapsed * (fm.speed * 0.75)) *
                fm.amplitude +
              Math.sin((x + y) * 0.25 + elapsed * (fm.speed * 1.2)) *
                (fm.amplitude * 0.35);
            arr[i * 3 + 2] = origZ + wave;
          }
          posAttr.needsUpdate = true;
          if (!this.isPerformanceMode) {
            fm.geometry.computeVertexNormals();
          }
        });
      }

      if (this.isPerformanceMode) {
        this.renderer.render(this.scene, this.camera);
      } else {
        this.composer.render();
      }
    };

    loop();
  }

  public destroy() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.composer) {
      this.composer.dispose();
    }
    this.renderer.dispose();
    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
