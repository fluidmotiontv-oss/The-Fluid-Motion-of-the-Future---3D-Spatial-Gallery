export type RoomId =
  | 'foyer'
  | 'hall1'
  | 'hall2'
  | 'lotus'
  | 'lounge'
  | 'games'
  | 'theater'
  | 'skatepark'
  | 'waterworld'
  | 'vault';
export type Language = 'en' | 'ja';

export interface RoomConfig {
  id: RoomId;
  name: string;
  subtitle: string;
  tagline: string;
  themeColor: string; // hex or rgb
  accentGlow: string;
  cameraPosition: [number, number, number];
  cameraLookAt: [number, number, number];
  roomPosition: [number, number, number];
  description: string;
  iconName: string;
}

export interface ExhibitItem {
  id: string;
  roomId: 'hall1' | 'hall2';
  title: string;
  subtitle: string;
  category: string;
  position: [number, number, number];
  rotation: [number, number, number];
  abstract: string;
  deepDive: string;
  keyInsights: string[];
  audioVoiceoverSnippet?: {
    cue: string;
    script: string;
  };
  visualGraphicType: 'clock54' | 'temporalWave' | 'mediaGrid' | 'timingTimeline' | 'kineticType' | 'resonance';
  gradient: [string, string];
}

export interface BookChapter {
  number: string;
  title: string;
  subtitle: string;
  summary: string;
  readTime: string;
  pageContent: string[];
  audioDirection?: string;
}

export interface PricingEdition {
  id: string;
  name: string;
  badge?: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  ctaText: string;
  formatIncludes: string[];
  directCheckoutUrl?: string;
}

export interface GuardianDialogue {
  intro: string;
  lore: string;
  insights: string[];
  suggestedAction?: {
    label: string;
    actionType: 'startTour' | 'nextRoom' | 'openExhibits' | 'openLounge' | 'openVault';
  };
}

export interface EbookConfig {
  title: string;
  subtitle: string;
  author: string;
  authorBio: string;
  releaseYear: string;
  isbn: string;
  pageCount: number;
  wordCount: string;
  tagline: string;
  salesPitch: string;
  coverImageTheme: {
    baseColor: string;
    accentColor: string;
    foilColor: string;
  };
  payhipUrl: string;
  gumroadUrl: string;
  stripeDirectUrl: string;
  downloadSamplePdfName: string;
  guardianDialogues: Record<RoomId, GuardianDialogue>;
  rooms: RoomConfig[];
  exhibits: ExhibitItem[];
  chapters: BookChapter[];
  pricingEditions: PricingEdition[];
  testimonials: {
    quote: string;
    author: string;
    title: string;
    rating: number;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
}

