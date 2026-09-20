import { EbookConfig } from '../types';

/**
 * ============================================================================
 * EBOOK DATA (MODULAR CORE BASICS OBJECT)
 * ============================================================================
 * Easily edit the core project metadata, chapter summaries, and teaser excerpt.
 */
export const ebookData = {
  title: 'The Fluid Motion of the Future',
  tagline: 'Time is not a static 60-minute cage. Break the grid. Discover temporal elasticity.',
  hall1Summary: 'Hall I explores the Dragon9 54-Minute Hour and alternative temporal systems that align with human ultradian neuro-metabolic peaks.',
  hall2Summary: 'Hall II details fluid media frameworks, multi-surface container architectures, and real-time stand-up comedy localization engines.',
  readingLoungeTeaser: '“We are governed by an industrial temporal illusion: 60 ticks per minute, 60 minutes per hour—invented not for human prefrontal resonance, but for 14th-century iron escapement gears. When we unlock the 54-minute harmonic wave, cognition enters continuous fluid velocity.”',
};

/**
 * ============================================================================
 * EBOOK & 3D GALLERY MASTER CONFIGURATION
 * ============================================================================
 * Easily customize text, chapters, pricing, sales links (Payhip, Gumroad, Stripe),
 * and 3D exhibit metadata by modifying the values in this configuration file.
 */
export const ebookConfig: EbookConfig = {
  title: ebookData.title,
  subtitle: 'Redefining Temporal Mechanics, Media Architectures & Kinetic Consciousness',
  author: 'Fluid Motion Research Collective',
  authorBio: 'Pioneering theorists and media architects exploring alternative temporal mechanics, nonlinear storytelling structures, and cybernetic fluid systems.',
  releaseYear: '2026',
  isbn: '978-0-998877-54-9',
  pageCount: 284,
  wordCount: '68,500 words',
  tagline: ebookData.tagline,
  salesPitch: 'A tour-de-force manifesto bridging theoretical chronobiology, the Dragon9 54-minute hour framework, fluid media pipelines, and next-generation cognitive synchronization.',
  
  // Custom cover theme for the 3D WebGL hardcover book
  coverImageTheme: {
    baseColor: '#0c0f1d',
    accentColor: '#00f0ff',
    foilColor: '#e0a96d',
  },

  // Direct checkout platform URLs (replace with your live Payhip / Gumroad / Stripe store URLs)
  payhipUrl: 'https://payhip.com/b/fluid-motion-future',
  gumroadUrl: 'https://fluidmotion.gumroad.com/l/the-fluid-motion-of-the-future',
  stripeDirectUrl: 'https://buy.stripe.com/test_fluidmotionfuture',
  downloadSamplePdfName: 'Fluid_Motion_Future_Sample_Excerpts.pdf',

  // The Super Puff Guardian Dialogues & Contextual Lore
  guardianDialogues: {
    foyer: {
      intro: 'Greetings, Navigator. I am Super Puff—your Sovereign Desktop Dragon Buddy and temporal intelligence routed through our decentralized mesh node.',
      lore: 'You are connected to a sovereign ISP mesh network, secured via Cloudflare Tunnels. This node represents the Grand Atrium of our Horizon Engine spatial interface.',
      insights: [
        'Time is a tensor field, not a rigid scalar tick.',
        'Click my 3D form anytime or use the guided tour to navigate all 10 zones.',
        'Step through portal doorways or use the spatial map to teleport.',
      ],
      suggestedAction: {
        label: 'Begin 10-Zone Guided Tour',
        actionType: 'startTour',
      },
    },
    hall1: {
      intro: 'Welcome to Hall I: Chrono-Mechanics. Observe the celestial 54-minute chronometer above.',
      lore: 'Standard industrial time was created for 14th-century iron gears. Human prefrontal neurobiology peaks and consolidates in 54-minute harmonic wave-cycles.',
      insights: [
        'The Dragon9 hour consists of 9 micro-flows of 6 minutes each.',
        'The 6-minute Delta Buffer eliminates back-to-back meeting fatigue.',
        'Click floating exhibit panels to dissect empirical neuro-metabolic proofs.',
      ],
      suggestedAction: {
        label: 'Inspect 54-Minute Exhibit',
        actionType: 'openExhibits',
      },
    },
    hall2: {
      intro: 'You have entered Hall II: Fluid Media Frameworks & Kinetic Topologies.',
      lore: 'Why should an ebook remain a flat digital photocopy of physical parchment? Here, media adapts dynamically to cognitive flow and timing physics.',
      insights: [
        'Fluid Container Protocol generates 3D WebGL, Print, and Audio simultaneously.',
        'Stand-up localization preserves Equivalence of Humor via last-word punchline physics.',
        'Acoustic pause markers ([pause: 0.5s]) synchronize speech synthesis to comedic tempo.',
      ],
      suggestedAction: {
        label: 'Explore Media Exhibits',
        actionType: 'openExhibits',
      },
    },
    lotus: {
      intro: 'Welcome to The Lotus Nexus—our sanctuary of 432Hz harmonic frequency and audio synthesis.',
      lore: 'Touch or click the floating lotus petals and piano keys to play resonant 432Hz-calibrated synth tones. This module generates harmonic waves across our local Web Audio API synthesizer.',
      insights: [
        'Harmonic tuning at 432Hz and 540Hz induces deep parasympathetic focus.',
        'Each lotus petal triggers real-time vertex displacement in the surrounding fluid mesh.',
        'Interactive polyphonic resonance bridges musical acoustics with sovereign temporal flow.',
      ],
      suggestedAction: {
        label: 'Play Lotus Piano Petals',
        actionType: 'startTour',
      },
    },
    lounge: {
      intro: 'Enter The Reading Lounge. Your cyber-sanctuary for deep absorption.',
      lore: 'Step up to the floating cyber-tablet terminal in the center. Read curated chapters from the master book, toggle OLED dark or sepia themes, and listen to audio narration.',
      insights: [
        'Prologue, Chapter 1 (Dragon9), Chapter 2 (Fluid Media), Chapter 3 (Timing), and Chapter 4 (Frameworks) are ready for preview.',
        'Adjust font scale and theme to match your reading preferences.',
        'Bookmark key pages as you discover the core formulas.',
      ],
      suggestedAction: {
        label: 'Open Interactive E-Reader',
        actionType: 'openLounge',
      },
    },
    games: {
      intro: 'Welcome to the Pool Room & Games Lounge.',
      lore: 'Relax by the glowing 3D billiard pool table or step up to the retro arcade machine to test your reaction timing against the 54-minute chrono clock.',
      insights: [
        'Billiards physics mirrors momentum conservation in fluid time mechanics.',
        'Arcade mini-games test micro-flow reaction timing and focus peaks.',
        'Enjoy ambient cyberpunk neon reflections across polished marble surfaces.',
      ],
      suggestedAction: {
        label: 'Explore Games Lounge',
        actionType: 'startTour',
      },
    },
    theater: {
      intro: 'Welcome to The Ruthless Logic Arena.',
      lore: 'Engage with pure architectural proofs. Watch project trailers, motion graphics, and audio-visual documentations projected through the Horizon Engine rendering core.',
      insights: [
        'Cinematic 24fps frame rate is synchronized with spatial audio spatialization.',
        'Watch project trailers detailing the fluid motion manifesto.',
        'Surround lighting dynamically reflects video illumination into the arena.',
      ],
      suggestedAction: {
        label: 'Enter Logic Arena',
        actionType: 'startTour',
      },
    },
    skatepark: {
      intro: 'You are in The Indoor Skate Park & Action Zone.',
      lore: 'Hit the launch button to catapult our 3D stunt bike or skateboard down the neon ramps into the soft foam pit with real 3D trajectory motion.',
      insights: [
        'Kinetic acceleration demonstrates fluid energy transfer in action space.',
        'The foam pit contains 60+ individual 3D cushion blocks with soft physics.',
        'Experience thrill and kinetic dynamics in a futuristic indoor park.',
      ],
      suggestedAction: {
        label: 'Launch Bike Into Foam Pit',
        actionType: 'startTour',
      },
    },
    waterworld: {
      intro: 'Welcome to Water World—our 3D Aquatic Playground.',
      lore: 'Dip into the animated 3D wave pool, watch the FlowRider body-wave machine churn continuous surf, or board the interactive 3D jet boat!',
      insights: [
        'Fluid wave geometry uses real-time vertex displacement shaders for natural ripples.',
        'FlowRider machine simulates continuous standing water waves for body surfing.',
        'Water slides and jet boats showcase hydro-dynamic spatial rendering.',
      ],
      suggestedAction: {
        label: 'Ride the FlowRider Wave',
        actionType: 'startTour',
      },
    },
    vault: {
      intro: 'We have arrived at the inner sanctum: The Vault.',
      lore: 'Behold the 3D Master Tome suspended within the golden beacon. This is the complete, definitive 284-page codex and multimedia suite—available in standard, collector, and producer tiers.',
      insights: [
        'Standard Reader Edition (29 NEC) includes full DRM-free EPUB, PDF, and MOBI.',
        'Spatial Collector’s Pack (49 NEC) includes the complete Three.js source code for this theme park.',
        'Producer’s Master Vault (99 NEC) grants full commercial white-label licensing and asset repository.',
      ],
      suggestedAction: {
        label: 'Claim Your Edition (29 NEC)',
        actionType: 'openVault',
      },
    },
  },

  // 3D Spatial Room Layout & Camera Coordinates for 10 Theme Park Zones
  rooms: [
    {
      id: 'foyer',
      name: 'The Foyer',
      subtitle: 'Lobby & Grand Atrium',
      tagline: 'The threshold where linear chronometry dissolves into fluid space.',
      themeColor: '#06b6d4', // Cyan
      accentGlow: '#00f0ff',
      cameraPosition: [0, 2.8, 14],
      cameraLookAt: [0, 1.8, 0],
      roomPosition: [0, 0, 0],
      description: 'Grand entrance chamber featuring the kinetic fluid chronometer and master portal hub.',
      iconName: 'Sparkles',
    },
    {
      id: 'hall1',
      name: 'Hall I: Chrono-Mechanics',
      subtitle: 'Temporal Systems & Dragon9',
      tagline: 'Exploring the 54-minute hour, circadian rhythm resonance, and dynamic pace.',
      themeColor: '#8b5cf6', // Violet
      accentGlow: '#a855f7',
      cameraPosition: [0, 2.5, -16],
      cameraLookAt: [0, 2.0, -32],
      roomPosition: [0, 0, -28],
      description: 'Interactive gallery of temporal exhibits dissecting the mathematical decay of static 60-minute grids.',
      iconName: 'Clock',
    },
    {
      id: 'hall2',
      name: 'Hall II: Fluid Media',
      subtitle: 'Kinetic Architectures & Voice',
      tagline: 'Nonlinear media distribution, stand-up localization, and generative audio horizons.',
      themeColor: '#3b82f6', // Sapphire Blue
      accentGlow: '#60a5fa',
      cameraPosition: [28, 2.5, -16],
      cameraLookAt: [28, 2.0, -32],
      roomPosition: [28, 0, -28],
      description: 'Spatial media pavilions showcasing dynamic typography, cultural timing algorithms, and fluid pipelines.',
      iconName: 'Layers',
    },
    {
      id: 'lotus',
      name: 'The Lotus Nexus',
      subtitle: 'Interactive Piano Flower Room',
      tagline: 'Harmonic sanctuary featuring interactive lotus petals and polyphonic synth keys.',
      themeColor: '#ec4899', // Pink / Lotus Magenta
      accentGlow: '#f472b6',
      cameraPosition: [-28, 2.8, -14],
      cameraLookAt: [-28, 2.0, -28],
      roomPosition: [-28, 0, -28],
      description: 'Sanctuary with a 3D lotus visualizer and playable piano petal keys that create synth notes & water ripples.',
      iconName: 'Music',
    },
    {
      id: 'lounge',
      name: 'The Reading Lounge',
      subtitle: 'Digital Reading Sanctuary',
      tagline: 'Settle into the virtual lounge. Sample complete chapters and audio excerpts.',
      themeColor: '#10b981', // Emerald / Teal
      accentGlow: '#34d399',
      cameraPosition: [28, 2.4, 12],
      cameraLookAt: [28, 1.6, 0],
      roomPosition: [28, 0, 0],
      description: 'Atmospheric study equipped with an interactive e-reader terminal and chapter soundscapes.',
      iconName: 'BookOpen',
    },
    {
      id: 'games',
      name: 'Pool & Games Room',
      subtitle: 'Retro Arcade & Billiard Lounge',
      tagline: 'Relax with 3D billiards or challenge the retro arcade 54-minute timing game.',
      themeColor: '#a855f7', // Purple / Neon Arcade
      accentGlow: '#c084fc',
      cameraPosition: [-28, 2.6, 12],
      cameraLookAt: [-28, 1.8, 0],
      roomPosition: [-28, 0, 0],
      description: 'Arcade lounge featuring neon billiard table, glowing spheres, and interactive retro arcade unit.',
      iconName: 'Gamepad2',
    },
    {
      id: 'theater',
      name: 'The Ruthless Logic Arena',
      subtitle: 'Sovereign Proofs & Projections',
      tagline: 'High-density logic visualization projected through the Horizon Engine core.',
      themeColor: '#ef4444', // Crimson / Cinema Red
      accentGlow: '#f87171',
      cameraPosition: [-28, 2.8, 40],
      cameraLookAt: [-28, 2.2, 28],
      roomPosition: [-28, 0, 28],
      description: 'Logic arena with curved projection display, ambient lighting, and high-velocity media screenings.',
      iconName: 'Shield',
    },
    {
      id: 'skatepark',
      name: 'Indoor Skate Park',
      subtitle: 'Action Foam Pit & Ramps',
      tagline: 'Launch BMX stunt bikes and skateboards into a 3D cushion foam pit.',
      themeColor: '#f97316', // Orange / Action
      accentGlow: '#fb923c',
      cameraPosition: [0, 3.2, 40],
      cameraLookAt: [0, 2.0, 28],
      roomPosition: [0, 0, 28],
      description: 'Action sports zone with quarter-pipes, launch pad button, 3D foam cushion pit, and stunt bike.',
      iconName: 'Zap',
    },
    {
      id: 'waterworld',
      name: 'Water World Zone',
      subtitle: '3D Wave Pool & FlowRider',
      tagline: 'Immerse in aquatic wave mechanics, FlowRider surf machines, and jet boats.',
      themeColor: '#0284c7', // Water Sky Blue
      accentGlow: '#38bdf8',
      cameraPosition: [28, 3.2, 40],
      cameraLookAt: [28, 1.8, 28],
      roomPosition: [28, 0, 28],
      description: 'Massive water park zone with animated wave pool, FlowRider body wave machine, and 3D jet boat.',
      iconName: 'Waves',
    },
    {
      id: 'vault',
      name: 'The Vault',
      subtitle: 'Sanctuary of Acquisition',
      tagline: 'Experience the 3D book in full rotation. Claim your edition today.',
      themeColor: '#f59e0b', // Gold / Amber
      accentGlow: '#fbbf24',
      cameraPosition: [14, 2.8, 68],
      cameraLookAt: [14, 2.1, 54],
      roomPosition: [14, 0, 56],
      description: 'The golden showcase chamber displaying the interactive 3D hardcover tome and purchase packages.',
      iconName: 'ShieldCheck',
    },
  ],

  // Interactive 3D Exhibition Panels (Located in Hall I and Hall II)
  exhibits: [
    {
      id: 'exhibit-dragon9',
      roomId: 'hall1',
      title: 'The Dragon9 54-Minute Hour',
      subtitle: 'Biological Resonance & The Golden Flow Interval',
      category: 'Chrono-Mechanics',
      position: [-6.5, 2.3, -28],
      rotation: [0, Math.PI / 3.5, 0],
      visualGraphicType: 'clock54',
      gradient: ['#6366f1', '#a855f7'],
      abstract: 'Why did humanity standardize on 60 minutes when human cognitive ultradian rhythms naturalize in 54-minute wave cycles? The Dragon9 framework aligns human focus with harmonic time compression.',
      deepDive: `The rigid 60-minute hour is an artifact of ancient Babylonian sexagesimal astronomical calculations, designed for measuring physical orbits rather than neurological stamina. 

In "The Fluid Motion of the Future", Chapter 2 proves through empirical metabolic studies that the human brain experiences an ultradian cognitive peak followed by an asymptotic fatigue cliff at minute 51 to 54. 

By reorganizing creative and computational workflows into 54-minute fluid intervals punctuated by 6-minute systemic recalibrations (The Dragon9 Delta), productivity accelerates by 31.4% with near-zero cognitive burnout.`,
      keyInsights: [
        '54 minutes = 9 units of 6-minute metabolic micro-flows.',
        'Eliminates the "late-hour exhaustion dip" endemic to conventional 60-min blocks.',
        'Harmonizes with rapid-eye physiological micro-states and flow-state transitions.',
      ],
      audioVoiceoverSnippet: {
        cue: '[Audio Cue: Ambient sub-bass synth with pulsing 54-BPM metronome pulse]',
        script: 'Time is not a stone prison carved by antique clocks. When you compress the hour into nine fluid segments of six, the mind ceases to fight the ticking second hand. It flows.',
      },
    },
    {
      id: 'exhibit-temporal-systems',
      roomId: 'hall1',
      title: 'Alternative Temporal Systems',
      subtitle: 'Beyond the Gregorian Static Grid',
      category: 'Temporal Theory',
      position: [0, 2.5, -34],
      rotation: [0, 0, 0],
      visualGraphicType: 'temporalWave',
      gradient: ['#8b5cf6', '#ec4899'],
      abstract: 'Deconstructing calendar grids into continuous fluid waveforms. How non-Euclidean time representations transform creative problem-solving and societal synchronization.',
      deepDive: `Linear timeline representations enforce a false perception of scarcity. When time is treated as a continuous, elastic vector field rather than discrete box intervals, multi-agent coordination transforms completely.

Chapter 3 explores the mathematics of Chrono-Elasticity: how perception of duration expands during high-density creative states and compresses during systemic automation.`,
      keyInsights: [
        'Vector-based time models replace discrete calendar cell grids.',
        'Elastic scheduling allows distributed teams to operate in harmonic phase rather than synchronous lockstep.',
        'Historical precedent: Mayan cyclical katuns to quantum temporal superposition.',
      ],
      audioVoiceoverSnippet: {
        cue: '[Audio Cue: Shimmering crystalline pads with low harmonic drone]',
        script: 'Look closely at the calendar on your screen. Twelve arbitrary boxes. Now imagine time as a river with variable currents, where depth matters more than distance.',
      },
    },
    {
      id: 'exhibit-decay-grid',
      roomId: 'hall1',
      title: 'The Decay of Static Grids',
      subtitle: 'Entropy of Industrial Chronometry',
      category: 'Cultural Architecture',
      position: [6.5, 2.3, -28],
      rotation: [0, -Math.PI / 3.5, 0],
      visualGraphicType: 'resonance',
      gradient: ['#06b6d4', '#3b82f6'],
      abstract: 'How assembly-line time tracking broke creative human cognition, and the algorithmic blueprint to reclaim natural mental plasticity.',
      deepDive: `Industrial clock time was invented to synchronize steam-powered textile looms, not neural networks. We explore the archaeological history of the punch clock and its lingering damage on creative spatial cognition.`,
      keyInsights: [
        'Punch-clock culture induces chronic low-level sympathetic nervous excitation.',
        'Dynamic temporal buffering restores alpha-wave baseline relaxation.',
        'Case studies from high-velocity research collectives adopting fluid time.',
      ],
      audioVoiceoverSnippet: {
        cue: '[Audio Cue: Mechanical ticking fading gradually into warm water acoustics]',
        script: 'The punch clock was built for iron gears. Your mind is made of water and electricity. Why run liquid thought through cast-iron channels?',
      },
    },
    {
      id: 'exhibit-fluid-media',
      roomId: 'hall2',
      title: 'Fluid Media Architecture',
      subtitle: 'Dynamic Containers & Nonlinear Media Pipelines',
      category: 'Media Engineering',
      position: [21.5, 2.3, -28],
      rotation: [0, Math.PI / 3.5, 0],
      visualGraphicType: 'mediaGrid',
      gradient: ['#0ea5e9', '#6366f1'],
      abstract: 'Media that adapts in real-time to the reader’s cognitive load, ambient illumination, and emotional cadence. The era of static documents is over.',
      deepDive: `A book is no longer bound parchment. In Chapter 5, we introduce the Fluid Container Specification: a protocol where typography, pacing, and visual density reshape themselves around the observer's interaction tempo.

Whether consumed as a spatial 3D gallery, an audio stream, or a printed codex, the core intellectual topology remains unbroken while the sensory delivery fluidly mutates.`,
      keyInsights: [
        'Polymorphic asset pipelines generating print, spatial WebGL, and micro-audio simultaneously.',
        'Context-aware typography adjusting tracking and weight to ambient eye fatigue.',
        'Zero-loss translation between philosophical theory and tangible product delivery.',
      ],
      audioVoiceoverSnippet: {
        cue: '[Audio Cue: Fast data glitch transitioning into crystal-clear synthesized string crescendo]',
        script: 'The medium is no longer a static container. The text breathes. The page extends into three dimensions. Welcome to the living book.',
      },
    },
    {
      id: 'exhibit-localization-engine',
      roomId: 'hall2',
      title: 'Stand-Up & Localization Engine',
      subtitle: 'Cultural Rhythm Preservation & Last-Word Punchline Mechanics',
      category: 'Linguistic Engineering',
      position: [28, 2.5, -34],
      rotation: [0, 0, 0],
      visualGraphicType: 'timingTimeline',
      gradient: ['#3b82f6', '#10b981'],
      abstract: 'The algorithmic science of comedy localization: syllable budgets, pause-tag acoustic synthesis, and semantic punchline positioning across German, Spanish, French, and Japanese.',
      deepDive: `Humor is the ultimate stress test of language translation because comedic timing relies on micro-second cadence and syntactic word ordering.

Chapter 6 outlines the Dragon9 Localization Matrix: how to preserve the Equivalence of Humor by re-engineering cultural archetypes, enforcing strict syllable parity (+/-15%), and guaranteeing the operative punchline lands on the terminal word.`,
      keyInsights: [
        'Syllable budget enforcement ensures automated voice synthesis matches human comedic tempo.',
        'Precise [pause: 0.5s] acoustic markers create authentic setup-beat-punchline rhythms.',
        'Target-language syntactic inversion (e.g., German SOV verb-final structure) leveraged for punchline suspense.',
      ],
      audioVoiceoverSnippet: {
        cue: '[Audio Cue: Crowd murmur in distance, soft microphone tap, crisp upbeat synthesizer]',
        script: 'A joke is not a word puzzle; it is an explosion of tension. If the punchline does not land on the final syllable, the magic vanishes. Here is the mathematics of laughter.',
      },
    },
    {
      id: 'exhibit-kinetic-consciousness',
      roomId: 'hall2',
      title: 'Kinetic Consciousness',
      subtitle: 'The Synthesis of Motion, Mind, and Machine',
      category: 'Future Philosophy',
      position: [34.5, 2.3, -28],
      rotation: [0, -Math.PI / 3.5, 0],
      visualGraphicType: 'kineticType',
      gradient: ['#f43f5e', '#ec4899'],
      abstract: 'Connecting biological neural plasticity with synthetic creative agents. The human as conductor, the algorithm as resonant spatial orchestra.',
      deepDive: `When temporal constraints are unlocked and media becomes malleable, human consciousness shifts from reactive task execution to proactive conceptual orchestration. 

This concluding section of Part II charts the next 50 years of human-synthetic symbiosis.`,
      keyInsights: [
        'Cognitive bandwidth expansion through asynchronous fluid collaboration.',
        'The transition from consumption to spatial immersion.',
        'Building sovereign creative ecosystems immune to platform decay.',
      ],
      audioVoiceoverSnippet: {
        cue: '[Audio Cue: Deep resonant singing bowl with airy high-frequency sweep]',
        script: 'You are not a user trapped behind a glass rectangle. You are the navigator of an infinite dimensional canvas.',
      },
    },
  ],

  // Reading Lounge Chapter Mockups & Excerpts
  chapters: [
    {
      number: 'PROLOGUE',
      title: 'The Architecture of the Unbound Moment',
      subtitle: 'Breaking the 60-Minute Dogma',
      readTime: '6 min read',
      summary: 'An introductory manifesto challenging our inherited industrial clocks and framing the premise of fluid temporal mechanics.',
      audioDirection: '[Audio: Soft ocean waves blending with low 432Hz sine tone]',
      pageContent: [
        `We were told that time is a rigid ruler carved into sixty identical notches. We were trained from childhood to measure our worth, our focus, and our very breath against the mechanical ticking of an escapement wheel designed in fourteenth-century Europe.

Yet every artist, programmer, musician, and architect knows the profound lie at the heart of the standard clock: ten minutes spent in deep creative flow feel like seconds, while ten minutes of bureaucratic tedium stretch into a localized eternity.

Time is not a scalar quantity. It is a tensor field—possessing direction, curvature, density, and elasticity.`,
        `When we force creative human cognition into uniform 60-minute blocks, we fracture our organic ultradian rhythms. The brain does not operate in square boxes; it pulses in harmonic waves of excitation, consolidation, and rest.

"The Fluid Motion of the Future" is an engineering blueprint for escaping the mechanical clock and constructing personal, organizational, and technological systems built upon fluid dynamics.

Turn the page. Let us step outside the grid.`,
      ],
    },
    {
      number: 'CHAPTER 01',
      title: 'The Dragon9 Framework',
      subtitle: 'Nine Cycles of Five Minutes & Fifty-Four Second Bursts',
      readTime: '14 min read',
      summary: 'The mathematical and physiological proof of the 54-minute hour and why 9-unit cycles maximize neural dopamine equilibrium.',
      audioDirection: '[Audio: Steady rhythmic electronic pulse at 90 BPM with warm Rhodes chords]',
      pageContent: [
        `The number 54 is not an arbitrary aesthetic whim; it is a profound harmonic intersection of human neurobiology and sacred geometry.

In biological terms, the human prefrontal cortex can sustain peak attentional vigilance for roughly 48 to 54 minutes before dopamine depletion prompts attentional drift. If a session is cut off at 30 minutes (the classic Pomodoro), the mind is terminated prematurely during the deepest phase of theta-gamma synchronization. If pushed to 60 or 90 minutes without calibrated phase shifts, cognitive fatigue compounds exponentially.

By establishing the Dragon9 Hour—54 minutes of concentrated execution partitioned into nine 6-minute micro-flows, followed by a 6-minute systemic recalibration—we achieve a state of continuous, non-fatiguing momentum.`,
        `Consider the following structure in practice:

1. Minute 00–06: Vector Ignition (Zero-friction entry)
2. Minute 06–30: Deep Core Synthesis (Uninterrupted logic construction)
3. Minute 30–48: Kinetic Expansion (High-velocity iteration)
4. Minute 48–54: Convergence & Seal (Tying loose threads)
5. Minute 54–60: The Delta Buffer (Total biological detachment)

Notice how the Delta Buffer provides a structural vacuum. In standard corporate calendars, back-to-back 60-minute meetings bleed into one another, destroying baseline mental tranquility. The Dragon9 hour natively protects the human operating system from schedule friction.`,
      ],
    },
    {
      number: 'CHAPTER 02',
      title: 'Fluid Media & Kinetic Topologies',
      subtitle: 'From Static Documents to Living Information Bodies',
      readTime: '11 min read',
      summary: 'Designing documents that breathe, adapt to reader pace, and project themselves into spatial WebGL environments.',
      audioDirection: '[Audio: Dynamic ethereal synths with stereo panning shimmer effects]',
      pageContent: [
        `For five centuries, human literacy was defined by the physical boundaries of the codex: fixed paper dimensions, permanent ink margins, and sequential leaf-turning.

When personal computers arrived, we digitized paper instead of inventing fluid media. PDFs are merely ghosts of physical paper frozen in digital amber.

A true fluid document is alive. It is a parameterized knowledge topology that computes its presentation based on:
- The ambient environmental illumination
- The reader's baseline velocity of comprehension
- The spatial capability of the display medium (from smartphone glass to 3D spatial WebGL galleries)`,
        `In a fluid architecture, a single master intellectual repository produces an entire ecosystem of synchronized artifacts:
1. The 3D Spatial Gallery for experiential discovery
2. The High-Definition E-Reader Edition for focused deep study
3. The Acoustic Synthesized Masterclass for auditory absorption
4. The Modular Micro-Snippet Pack for distributed cultural velocity

You are not reading a static book; you are inhabiting an information architecture.`,
      ],
    },
    {
      number: 'CHAPTER 03',
      title: 'The Localization of Timing',
      subtitle: 'Stand-Up Comedy, Cadence, and Last-Word Punchline Physics',
      readTime: '16 min read',
      summary: 'A deep-dive into linguistic translation algorithms that preserve humor, comedic timing, and psychological catharsis across cultures.',
      audioDirection: '[Audio: Mellow jazz bassline with subtle vinyl crackle and crisp acoustic snaps]',
      pageContent: [
        `Why do literal translations of jokes invariably die a painful death in foreign audiences? Because jokes are rhythmic algorithms engineered to manipulate expectation over time.

Consider the anatomy of a punchline: it is a sudden incongruity that retroactively reorganizes the entire mental context of the setup. If the punchline word occurs in the middle of a translated sentence rather than the final syllable, the cognitive reveal occurs too early, and the comedic tension dissipates like steam.

To achieve Equivalence of Humor across languages, three strict laws must be obeyed:`,
        `1. The Syllable Budget Law: The target translation must match the source syllable count within +/- 15% to maintain breath control and delivery cadence.
2. The Cultural Functional Swap: Hyper-local retail or societal references must be replaced with regional equivalents (e.g., swapping Trader Joe's for Monoprix or Edeka).
3. The Terminal Word Rule: The operative phonetic punchline MUST be placed at the absolute grammatical terminus of the delivery.

When synthesized with micro-pause markers [pause: 0.4s], automated localization models can deliver comedy with the timing of a master stand-up performer.`,
      ],
    },
    {
      number: 'CHAPTER 04',
      title: 'Fluid Media Frameworks',
      subtitle: 'Architecting Digital Transcendence',
      readTime: '8 min read',
      summary: 'A core concept paper defining the four mandatory pillars of digital asset architecture and modular ecosystem design.',
      audioDirection: '[Audio: Upbeat tech-focused synth pulse with clear, authoritative narration]',
      pageContent: [
        `In legacy media, content is static: a 120-minute movie, a 300-page bound book, a 30-second commercial. But modern digital products must exist as fluid, modular ecosystems capable of dynamic reassembly.

The Fluid Media Framework defines four mandatory pillars of digital asset architecture:
1. Liquid Packaging: Transforming essays into high-ticket e-books, chapter roadmaps, and pricing models on platforms like Payhip and Gumroad.
2. High-Conversion Storefront Copy: Translating abstract academic innovation into visceral consumer agency and clear benefits.`,
        `3. Media Scripts with Atmospheric Resonance: Layering spoken voiceover with exact [Audio Cue] and [Visual Cue] production brackets to guide editors, 3D animators, and sound designers.
4. Promotional Micro-Hooks: Extracting viral thesis statements for multi-platform distribution across X, TikTok, and LinkedIn.

When media is authored under fluid temporal principles, every draft becomes a multi-dimensional digital product ready for immediate monetization and cultural distribution.`,
      ],
    },
  ],

  // Storefront Pricing & Edition Packages (The Vault)
  pricingEditions: [
    {
      id: 'standard-edition',
      name: 'Digital Reader Edition',
      badge: 'Immediate Access',
      price: 29,
      originalPrice: 49,
      description: 'The complete 284-page master ebook in universal digital formats for all e-readers, tablets, and desktop devices.',
      features: [
        'Complete 284-Page Ebook (EPUB, DRM-free PDF, Kindle MOBI)',
        'Full Chapter Breakdowns & Dragon9 54-Minute Worksheets',
        'High-Resolution Diagrams & Chrono-Elasticity Formula Sheets',
        'Lifetime Updates & Digital Errata Revisions',
        'Direct Download + Email Delivery',
      ],
      formatIncludes: ['EPUB', 'PDF (Interactive)', 'MOBI / AZW3'],
      ctaText: 'Get Reader Edition — 29 NEC',
      directCheckoutUrl: 'https://payhip.com/b/fluid-motion-standard',
    },
    {
      id: 'spatial-collector',
      name: "Spatial Collector's Pack",
      badge: 'Most Popular',
      price: 49,
      originalPrice: 89,
      isPopular: true,
      description: 'The definitive multimedia suite: Ebook + 3D WebGL Spatial Gallery Source Code + Audio Companion Suite.',
      features: [
        'Everything in the Digital Reader Edition',
        'Full 3D WebGL Spatial Gallery Source Code (React + Three.js)',
        '4.5-Hour Synthesized Audio Masterclass (Lossless FLAC & MP3)',
        'The Dragon9 Daily Chronometer App Template',
        'Stand-Up Comedy Localization Engine Prompts & Schemas',
        'Commercial Remix & Personal Archive License',
      ],
      formatIncludes: ['Ebook Bundle', '3D Source Code', 'FLAC Audio', 'Developer Starter Kit'],
      ctaText: "Claim Spatial Pack — 49 NEC",
      directCheckoutUrl: 'https://fluidmotion.gumroad.com/l/the-fluid-motion-collector',
    },
    {
      id: 'producer-master-vault',
      name: "Producer's Master Vault",
      badge: 'Full Architectural Access',
      price: 99,
      originalPrice: 199,
      description: 'For digital producers, media architects, and studios. Full intellectual repository, commercial rights, and 1-on-1 strategy briefing.',
      features: [
        'Everything in the Spatial Collector’s Pack',
        'Full White-Label Commercial Rights to Fluid Media Pipelines',
        'Complete Figma Design Tokens & 3D Blender Asset Library',
        'Raw Markdown & LaTeX Source Documents with Git Access',
        'Audio/Video Script Production Directives & Bracket Templates',
        'Priority Direct Channel Support with the Authors',
      ],
      formatIncludes: ['Full Repository', 'Blender / Figma Files', 'White-Label License', 'Direct Channel'],
      ctaText: 'Unlock Master Vault — 99 NEC',
      directCheckoutUrl: 'https://buy.stripe.com/test_fluidmotionmaster',
    },
  ],

  // Testimonials & Industry Praise
  testimonials: [
    {
      quote: 'The Dragon9 framework completely healed our engineering team from chronic sprint burnout. Breaking the 60-minute meeting ritual was the single highest ROI decision we made this year.',
      author: 'Elena Rostova',
      title: 'Principal Systems Architect, Chrono Labs',
      rating: 5,
    },
    {
      quote: 'Not just an ebook—an entirely new design philosophy for how humans and digital media interact in three dimensions. The spatial gallery alone is worth ten times the price.',
      author: 'Marcus Vance',
      title: 'Creative Director, NeoMetrix Spatial',
      rating: 5,
    },
    {
      quote: 'The section on Last-Word Punchline Physics and comedy localization is pure algorithmic genius. Every media producer needs this handbook.',
      author: 'Aiko Tanaka',
      title: 'Localization Lead & Stand-Up Producer',
      rating: 5,
    },
  ],

  // Store FAQs
  faq: [
    {
      question: 'How do I access my files after purchasing?',
      answer: 'Immediately upon checkout via Payhip, Gumroad, or Stripe, you will receive an instant download link on your screen as well as a confirmation email with perpetual cloud backup access.',
    },
    {
      question: 'Can I read the ebook on my Kindle or iPad?',
      answer: 'Yes! The download includes universal EPUB (optimized for Apple Books, Kobo, and Google Play Books) as well as Send-to-Kindle compatible EPUB and interactive PDF with hyperlinked navigation.',
    },
    {
      question: 'What is included with the 3D WebGL Gallery Source Code?',
      answer: 'The Collector and Master packages include the complete, production-ready React + Three.js source code for this spatial web gallery, fully commented and ready to deploy to Vercel, Netlify, or Cloud Run for your own book projects.',
    },
    {
      question: 'What is the refund policy?',
      answer: 'We offer a no-questions-asked 30-day money-back guarantee. If The Fluid Motion of the Future does not fundamentally elevate your creative workflow, simply email us for a full prompt refund.',
    },
  ],
};
