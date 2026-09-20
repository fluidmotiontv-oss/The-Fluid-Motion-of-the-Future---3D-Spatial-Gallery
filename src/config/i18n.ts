import { Language, RoomId } from '../types';

export interface TranslationData {
  appTitle: string;
  appSubtitle: string;
  tagline: string;
  nav: {
    guidedTour: string;
    pauseTour: string;
    share: string;
    soundOn: string;
    soundOff: string;
    controls: string;
    vault: string;
    selectLanguage: string;
  };
  rooms: Record<RoomId, { name: string; subtitle: string; tagline: string; description: string }>;
  guardianDialogues: Record<RoomId, {
    intro: string;
    lore: string;
    insights: string[];
    actionLabel: string;
  }>;
  foyer: {
    badge: string;
    beginTour: string;
    jumpVault: string;
    readingLounge: string;
    highlights: string[];
  };
  exhibitUi: {
    category: string;
    deepDive: string;
    keyInsights: string;
    audioVoiceover: string;
    openLounge: string;
    acquireVault: string;
    close: string;
    next: string;
    prev: string;
  };
  loungeUi: {
    title: string;
    badge: string;
    tableOfContents: string;
    readTime: string;
    prevPage: string;
    nextPage: string;
    audioNarration: string;
    playingAudio: string;
    fontSize: string;
    theme: string;
    goToVault: string;
  };
  vaultUi: {
    badge: string;
    title: string;
    subtitle: string;
    specifications: string;
    selectEdition: string;
    acquireCta: string;
    instantDownload: string;
    guarantee: string;
    licenseKey: string;
    purchaseSuccess: string;
  };
  shareUi: {
    title: string;
    badge: string;
    deepLinkActive: string;
    broadcast: string;
    copyLink: string;
    copied: string;
    copySnippet: string;
    shareOn: string;
  };
}

export const translations: Record<Language, TranslationData> = {
  en: {
    appTitle: 'The Fluid Motion of the Future',
    appSubtitle: 'Sovereign Horizon Engine Core | 432Hz Harmonic Synthesis',
    tagline: 'Sovereign ISP mesh interface for the Dragon9 54-minute hour and fluid media physics.',
    nav: {
      guidedTour: 'Guided Tour',
      pauseTour: 'Pause Tour',
      share: 'Share Chamber',
      soundOn: 'Audio On',
      soundOff: 'Muted',
      controls: 'Controls',
      vault: 'The Vault (NEC)',
      selectLanguage: 'Language',
    },
    rooms: {
      foyer: {
        name: 'The Foyer',
        subtitle: 'Sovereign Mesh Node & Kinetic Chronometer',
        tagline: 'Portal to the decentralized temporal network.',
        description: 'Sovereign entry node with fluid kinetic sculpture and central spatial portal hub.',
      },
      hall1: {
        name: 'Hall I: Chrono-Mechanics',
        subtitle: 'The Dragon9 54-Minute Hour',
        tagline: 'Deconstructing the 60-minute industrial construct into biological wave cycles.',
        description: 'Exhibition of alternative temporal systems, ultra-radian rhythms, and grid decay.',
      },
      hall2: {
        name: 'Hall II: Fluid Media',
        subtitle: 'Sovereign Media Frameworks & Timing Physics',
        tagline: 'Content topologies, stand-up comedy localization engines, and kinetic typography.',
        description: 'Exhibition of responsive multi-surface containers and temporal voice synthesis.',
      },
      lotus: {
        name: 'The Lotus Nexus',
        subtitle: '432Hz Harmonic Sanctuary',
        tagline: 'Harmonic sanctuary featuring interactive lotus petals and polyphonic synth keys.',
        description: 'Sovereign frequency generator with playable piano keys triggering 432Hz harmonic notes.',
      },
      lounge: {
        name: 'The Reading Lounge',
        subtitle: 'Sovereign Reading Sanctuary',
        tagline: 'Immersive reading environment for sample chapters and audio commentaries.',
        description: 'High-focus ambient lounge featuring customizable typography, OLED themes, and audio previews.',
      },
      games: {
        name: 'Pool & Games Room',
        subtitle: 'Retro Arcade & Billiard Lounge',
        tagline: 'Relax with 3D billiards or challenge the retro arcade 54-minute timing game.',
        description: 'Neon billiard pool lounge and 3D arcade machine with micro-flow reaction timing games.',
      },
      theater: {
        name: 'The Ruthless Logic Arena',
        subtitle: 'Sovereign Proofs & Projections',
        tagline: 'High-density logic visualization projected through the Horizon Engine core.',
        description: 'Logic arena with curved projection display, ambient lighting, and high-velocity media screenings.',
      },
      skatepark: {
        name: 'Indoor Skate Park',
        subtitle: 'Action Foam Pit & Ramps',
        tagline: 'Launch BMX stunt bikes and skateboards into a 3D cushion foam pit.',
        description: 'Action sports zone with quarter-pipes, launch pad button, 3D foam cushion pit, and stunt bike.',
      },
      waterworld: {
        name: 'Water World Zone',
        subtitle: '3D Wave Pool & FlowRider',
        tagline: 'Immerse in aquatic wave mechanics, FlowRider surf machines, and jet boats.',
        description: 'Massive water park zone with animated wave pool, FlowRider body wave machine, and 3D jet boat.',
      },
      vault: {
        name: 'The Vault',
        subtitle: '3D Hardcover Tome & Acquisition Portal',
        tagline: 'The definitive 284-page master package with source code and producer licensing.',
        description: 'Sanctuary housing the 3D Master Codex with direct digital purchase gateways.',
      },
    },
    guardianDialogues: {
      foyer: {
        intro: 'Greetings, Navigator. I am Super Puff—your Sovereign Desktop Dragon Buddy and temporal intelligence routed through our decentralized mesh node.',
        lore: 'You are connected to a sovereign ISP mesh network, secured via Cloudflare Tunnels. This node represents the Grand Atrium of our Horizon Engine spatial interface. All operations are synchronized to New Zealand (Port Waikato).',
        insights: [
          'Time is a tensor field, synchronized via the sovereign live repository.',
          'Your electronic currency balance (NEC) is managed via the native register.',
          'I am here to ensure your safety and provide seamless voice coaching across all chambers.',
        ],
        actionLabel: 'Begin 10-Zone Guided Tour',
      },
      hall1: {
        intro: 'Welcome to Hall I: Chrono-Mechanics. Observe the celestial 54-minute chronometer above.',
        lore: 'Standard industrial time was created for 14th-century iron gears. Human prefrontal neurobiology peaks and consolidates in 54-minute harmonic wave-cycles.',
        insights: [
          'The Dragon9 hour consists of 9 micro-flows of 6 minutes each.',
          'The 6-minute Delta Buffer eliminates back-to-back meeting fatigue.',
          'Click floating exhibit panels to dissect empirical neuro-metabolic proofs.',
        ],
        actionLabel: 'Inspect 54-Minute Exhibit',
      },
      hall2: {
        intro: 'You have entered Hall II: Fluid Media Frameworks & Kinetic Topologies.',
        lore: 'Why should an ebook remain a flat digital photocopy of physical parchment? Here, media adapts dynamically to cognitive flow and timing physics.',
        insights: [
          'Fluid Container Protocol generates 3D WebGL, Print, and Audio simultaneously.',
          'Stand-up localization preserves Equivalence of Humor via last-word punchline physics.',
          'Acoustic pause markers ([pause: 0.5s]) synchronize speech synthesis to comedic tempo.',
        ],
        actionLabel: 'Explore Media Exhibits',
      },
      lotus: {
        intro: 'Welcome to The Lotus Nexus—our sanctuary of 432Hz harmonic frequency and audio synthesis.',
        lore: 'Touch or click the floating lotus petals and piano keys to play resonant 432Hz-calibrated synth tones. This module generates harmonic waves across our local Web Audio API synthesizer.',
        insights: [
          'Harmonic tuning at 432Hz and 540Hz induces deep parasympathetic focus.',
          'Each lotus petal triggers real-time vertex displacement in the surrounding fluid mesh.',
          'Interactive polyphonic resonance bridges musical acoustics with sovereign temporal flow.',
        ],
        actionLabel: 'Play Lotus Piano Petals',
      },
      lounge: {
        intro: 'Enter The Reading Lounge. Your sovereign cyber-sanctuary for deep absorption.',
        lore: 'Step up to the floating cyber-tablet terminal in the center. Read curated chapters from the master book, toggle OLED dark or sepia themes, and listen to audio narration.',
        insights: [
          'Prologue, Chapter 1 (Dragon9), Chapter 2 (Fluid Media), Chapter 3 (Timing), and Chapter 4 (Frameworks) are ready for preview.',
          'Adjust font scale and theme to match your reading preferences.',
          'Bookmark key pages as you discover the core formulas.',
        ],
        actionLabel: 'Open Interactive E-Reader',
      },
      games: {
        intro: 'Welcome to the Pool Room & Games Lounge.',
        lore: 'Relax by the glowing 3D billiard pool table or step up to the retro arcade machine to test your reaction timing against the 54-minute chrono clock.',
        insights: [
          'Billiards physics mirrors momentum conservation in fluid time mechanics.',
          'Arcade mini-games test micro-flow reaction timing and focus peaks.',
          'Enjoy ambient cyberpunk neon reflections across polished marble surfaces.',
        ],
        actionLabel: 'Explore Games Lounge',
      },
      theater: {
        intro: 'Welcome to The Ruthless Logic Arena.',
        lore: 'Engage with pure architectural proofs. Watch project trailers, motion graphics, and audio-visual documentations projected through the Horizon Engine rendering core.',
        insights: [
          'Cinematic 24fps frame rate is synchronized with spatial audio spatialization.',
          'Watch project trailers detailing the fluid motion manifesto.',
          'Surround lighting dynamically reflects video illumination into the arena.',
        ],
        actionLabel: 'Enter Logic Arena',
      },
      skatepark: {
        intro: 'You are in The Indoor Skate Park & Action Zone.',
        lore: 'Hit the launch button to catapult our 3D stunt bike or skateboard down the neon ramps into the soft foam pit with real 3D trajectory motion.',
        insights: [
          'Kinetic acceleration demonstrates fluid energy transfer in action space.',
          'The foam pit contains 60+ individual 3D cushion blocks with soft physics.',
          'Experience thrill and kinetic dynamics in a futuristic indoor park.',
        ],
        actionLabel: 'Launch Bike Into Foam Pit',
      },
      waterworld: {
        intro: 'Welcome to Water World—our 3D Aquatic Playground.',
        lore: 'Dip into the animated 3D wave pool, watch the FlowRider body-wave machine churn continuous surf, or board the interactive 3D jet boat!',
        insights: [
          'Fluid wave geometry uses real-time vertex displacement shaders for natural ripples.',
          'FlowRider machine simulates continuous standing water waves for body surfing.',
          'Water slides and jet boats showcase hydro-dynamic spatial rendering.',
        ],
        actionLabel: 'Ride the FlowRider Wave',
      },
      vault: {
        intro: 'We have arrived at the inner sanctum: The Vault.',
        lore: 'Behold the 3D Master Tome suspended within the golden beacon. This is the complete, definitive 284-page codex and multimedia suite—available in standard, collector, and producer tiers.',
        insights: [
          'Standard Reader Edition ($29) includes full DRM-free EPUB, PDF, and MOBI.',
          'Spatial Collector’s Pack ($49) includes the complete Three.js source code for this theme park.',
          'Producer’s Master Vault ($99) grants full commercial white-label licensing and asset repository.',
        ],
        actionLabel: 'Claim Your Edition ($29)',
      },
    },
    foyer: {
      badge: 'Sovereign Horizon Interface',
      beginTour: 'Begin Guided Spatial Tour',
      jumpVault: 'The Vault ($29)',
      readingLounge: 'Reading Lounge',
      highlights: [
        '✦ Horizon Engine Core',
        '✦ 432Hz Lotus Nexus',
        '✦ Logic Arena Proofs',
        '✦ Sovereign NECR Ledger',
      ],
    },
    exhibitUi: {
      category: 'Exhibition Exhibit',
      deepDive: 'Analytical Deep Dive',
      keyInsights: 'Empirical Core Principles',
      audioVoiceover: 'Acoustic Voiceover Script & Audio Direction',
      openLounge: 'Read in Lounge',
      acquireVault: 'Get Book ($29)',
      close: 'Return to Chamber',
      next: 'Next Exhibit',
      prev: 'Previous Exhibit',
    },
    loungeUi: {
      title: 'The Reading Lounge',
      badge: 'Digital Reader Simulator',
      tableOfContents: 'Table of Contents',
      readTime: 'Read Time',
      prevPage: 'Previous Page',
      nextPage: 'Next Page',
      audioNarration: 'Listen to Voiceover',
      playingAudio: 'Playing Narration...',
      fontSize: 'Font Scale',
      theme: 'Theme',
      goToVault: 'Acquire Full Master Tome ($29)',
    },
    vaultUi: {
      badge: 'Exclusive Digital Storefront',
      title: 'The Vault',
      subtitle: 'Secure your permanent copy of "The Fluid Motion of the Future". Instant global delivery with DRM-free downloads.',
      specifications: 'Specifications & Artifacts',
      selectEdition: 'Select Your Edition',
      acquireCta: 'Acquire Access Now',
      instantDownload: 'Instant Digital Delivery',
      guarantee: '100% 30-Day Happiness Guarantee',
      licenseKey: 'Generated License Key',
      purchaseSuccess: 'Access Granted! Your download bundle is ready.',
    },
    shareUi: {
      title: 'Share This 3D Chamber',
      badge: 'Social Broadcasting',
      deepLinkActive: 'Deep-Link Active',
      broadcast: 'Broadcast',
      copyLink: 'Copy Link',
      copied: 'Copied!',
      copySnippet: 'Copy Snippet',
      shareOn: 'Broadcast to Social Channels:',
    },
  },
    ja: {
    appTitle: '流動する未来の時間力学',
    appSubtitle: 'Sovereign Horizon Engine Core | 432Hz和音合成',
    tagline: 'Sovereign ISP メッシュインターフェース | Dragon9「54分時間体系」と流動性メディア物理。',
    nav: {
      guidedTour: 'ガイドツアー',
      pauseTour: '一時停止',
      share: 'この部屋を共有',
      soundOn: '音響ON',
      soundOff: 'ミュート',
      controls: '操作方法',
      vault: '保管庫 (NEC)',
      selectLanguage: '言語切替',
    },
    rooms: {
      foyer: {
        name: 'ロビー・アトリウム',
        subtitle: 'Sovereign メッシュノード＆キネティック・クロノメーター',
        tagline: '分散型時間ネットワークへのポータル',
        description: '流動的なキネティック彫刻と中央ポータルを備えたメインロビー。',
      },
      hall1: {
        name: '第1展示室：時間力学',
        subtitle: 'Dragon9「54分時間体系」',
        tagline: '硬直した60分工業時間を、人間の神経生物学的波形サイクルへ解体。',
        description: '代替時間システム、超概日リズム、グリッド崩壊に関する展示。',
      },
      hall2: {
        name: '第2展示室：流動性メディア',
        subtitle: 'Sovereign メディアフレームワーク＆力学',
        tagline: '可変コンテナトポロジー、お笑い間合い翻訳エンジン、運動型タイポグラフィ。',
        description: 'マルチサーフェス対応コンテナと音声合成間合いタグの実証展示。',
      },
      lotus: {
        name: 'ロータス・ネクサス (Lotus Nexus)',
        subtitle: '432Hz和音サンクチュアリ',
        tagline: '432Hz/540Hz共鳴が自律神経の深い集中を誘導する聖域。',
        description: '432Hz和音を奏でるピアノ花弁を備えたSovereign周波数ジェネレーター。',
      },
      lounge: {
        name: 'リーディング・ラウンジ',
        subtitle: 'Sovereign 読書サンクチュアリ',
        tagline: '主要章の試し読みと音声解説を没入体験できる読書サンクチュアリ。',
        description: 'OLEDダーク・セピア切替、文字サイズ変更、音声ナレーション付きラウンジ。',
      },
      games: {
        name: 'ゲーム＆ビリヤードルーム',
        subtitle: 'ネオンビリヤード＆レトロアーケード',
        tagline: 'ネオン光る3Dビリヤードや54分時間反応アーケードゲームでリラックス。',
        description: 'ビリヤード台とミクロフロー反応速度を試す3Dアーケード筐体を配置。',
      },
      theater: {
        name: 'Ruthless Logic Arena',
        subtitle: 'Sovereign 証明＆プロジェクション',
        tagline: 'Horizon Engine コアを介して投影される高密度ロジックの可視化。',
        description: '高解像度曲面スクリーン、立体音響、プロモーション映写室。',
      },
      skatepark: {
        name: 'インドア・スケートパーク',
        subtitle: 'アクション・クッションフォームピット',
        tagline: '3D BMXバイクやスケートボードをクッションピットへダイナミックダイブ！',
        description: 'クォーターパイプ、発射ボタン、60個の3Dクッションピットを備えたアクションゾーン。',
      },
      waterworld: {
        name: 'ウォーター・ワールド (Water World)',
        subtitle: '3D波のプール＆FlowRiderサーフマシン',
        tagline: '波立つ3Dプール、FlowRiderボディボードマシン、ジェットボートを体験。',
        description: 'リアルタイム頂点シェーダーの波、サーフィンマシン、3Dジェットボート空間。',
      },
      vault: {
        name: 'マスター保管庫 (The Vault)',
        subtitle: '3D装丁マスター原典＆即時購入ポータル',
        tagline: '全284ページの決定版電子書籍、ソースコード、商用ライセンス付き。',
        description: '黄金の光柱に浮かぶ3Dハードカバー原典とデジタル決済ゲートウェイ。',
      },
    },
    guardianDialogues: {
      foyer: {
        intro: 'ようこそ、旅人よ。私は Super Puff——あなたの Sovereign Desktop Dragon Buddy であり、分散型メッシュノードを介して通信する時間知性です。',
        lore: 'あなたは今、Sovereign ISP メッシュネットワークに接続されています。Cloudflare Tunnel を介して安全に保たれたこのノードは、Horizon Engine の空間インターフェースです。',
        insights: [
          '時間は Sovereign ライブリポジトリを介して同期されるテンソル場である。',
          'あなたの電子通貨残高は、ネイティブ・レジスターによって安全に記録されます。',
          '私は常にあなたの安全を守り、シームレスな音声ガイダンスを提供します。',
        ],
        actionLabel: '10ゾーンのガイドツアーを開始',
      },
      hall1: {
        intro: '第1展示室「時間力学」へようこそ。頭上に輝く54分クロノメーターをご覧ください。',
        lore: '現代の60分制度は14世紀の機械時計のために作られました。しかし人間の前頭葉の集中波形は54分周期で共鳴します。周囲の3つの展示パネルをぜひ検証してください。',
        insights: [
          'Dragon9の1時間は、6分間のマイクロフロー9回で構成されます。',
          '6分間のデルタバッファが会議疲れと認知摩擦を完全に解消します。',
          '展示パネルをクリックして神経代謝の実証データをご覧ください。',
        ],
        actionLabel: '54分時間の展示を詳しく見る',
      },
      hall2: {
        intro: '第2展示室「流動性メディア」へようこそ。',
        lore: '電子書籍が紙のフラットなPDFコピーに留まる必要はありません。ここでは読者の認知や環境光に合わせて3D空間・音声・文字が流動変化します。お笑いの「間（ま）」を多言語翻訳する物理エンジンも展示しています。',
        insights: [
          '流動性コンテナが3D WebGL、書籍、音声を同時生成。',
          'スタンドアップコメディ翻訳：文末オチの法則で笑いの等価性を保証。',
          '音声合成タグ [pause: 0.5s] により的に確なツッコミの間合いを再現。',
        ],
        actionLabel: 'メディア展示を探索する',
      },
      lotus: {
        intro: '432Hz和音と周波数の聖域「ロータス・ネクサス」へようこそ。',
        lore: '中央の池に浮かぶ3D蓮の花びらやピアノキーをクリックしてください。432Hzに調整されたシンセ音色とともに、水面に光の波紋が広がります。',
        insights: [
          '432Hz/540Hzのソルフェジオ共鳴が自律神経の深い集中を誘導。',
          '花びらをクリックするとリアルタイム頂点シェーダーが波紋を計算。',
          '音響物理学と流動時間が Sovereign に融合するインタラクティブ空間。',
        ],
        actionLabel: '蓮華ピアノを演奏する',
      },
      lounge: {
        intro: 'リーディング・ラウンジへどうぞ。Sovereign な没入のための読書端末です。',
        lore: '中央に浮かぶサイバータブレットで、本書のプロローグや主要3章を試し読みできます。OLEDダークモードやセピア調の切替、音声ナレーションもお試しいただけます。',
        insights: [
          'プロローグ、第1章（Dragon9）、第2章（流動性）、第3章（間合い）、第4章（フレームワーク）を収録。',
          '文字サイズや背景色をお好みに合わせて調整可能。',
          '重要な数式や原則をブックマークしてじっくり閲覧できます。',
        ],
        actionLabel: '電子書籍リーダーを開く',
      },
      games: {
        intro: 'ゲーム＆ビリヤードルームへようこそ！',
        lore: '光る3Dビリヤード台で球の動力を眺めるか、レトロアーケード筐体で54分時間のミクロフロー反応速度ゲームに挑戦しましょう。',
        insights: [
          'ビリヤードの物理運動は流動時間内の運動量保存法則を体現。',
          'アーケードミニゲームであなたの没入反応速度をテスト。',
          'サイバーパンクなネオンの光が空間を彩ります。',
        ],
        actionLabel: 'ゲームルームを探索',
      },
      theater: {
        intro: 'Welcome to The Ruthless Logic Arena.',
        lore: 'Horizon Engine コアを介して投影される純粋な建築的証明を体験してください。映像トレーラーや解説アニメーションをお楽しみいただけます。',
        insights: [
          '24fps映画フレームレートと立体空間音響が完全同期。',
          '流動的時間の理念を描いたプロモーション映像を上映中。',
          '間接照明が映像の明るさに反応して変化します。',
        ],
        actionLabel: 'Logic Arena に入る',
      },
      skatepark: {
        intro: 'アクションゾーン「インドア・スケートパーク」です！',
        lore: '発射ボタンを押して、3D BMXバイクやスケートボードをランプからジャンプさせ、60個の柔らかい3Dクッションピットに飛び込ませましょう！',
        insights: [
          '運動加速度と放物線軌道が流動エネルギーの移動を表現。',
          'フォームピットにはリアルな弾力を持つ3Dブロックを充填。',
          '近未来のインドアパークでダイナミックなアクションを体験。',
        ],
        actionLabel: 'バイクをフォームピットへジャンプ！',
      },
      waterworld: {
        intro: '3D水上テーマパーク「ウォーター・ワールド」へようこそ！',
        lore: '波立つ3Dプールで泳ぐか、FlowRiderマシンで波乗り体感、あるいは3Dジェットボートに乗り込んでみましょう！',
        insights: [
          '頂点ディスプレイスメント・シェーダーによるリアルな水面波形。',
          'FlowRiderマシンが連続的なボディボード用定常波を生成。',
          '流体透過グラデーションと水しぶき粒子が臨場感を演出。',
        ],
        actionLabel: 'FlowRiderで波乗りを体験',
      },
      vault: {
        intro: '最奥のサンクチュアリ「マスター保管庫」に到達しました。',
        lore: '黄金の光の中に浮かぶ3Dハードカバー原典をご覧ください。全284ページの決定版マスターコードと全アセットを含む完全版をお求めいただけます。',
        insights: [
          '標準読者版 ($29)：DRMフリーのEPUB・PDF・MOBI完全版。',
          'コレクター版 ($49)：このテーマパークのThree.js全ソースコード付き。',
          'プロデューサー版 ($99)：商用ホワイトラベル再販権・全メディア素材付き。',
        ],
        actionLabel: '今すぐ原典を入手する ($29)',
      },
    },
    foyer: {
      badge: 'Sovereign Horizon Interface',
      beginTour: '3D空間ガイドツアーを開始',
      jumpVault: '保管庫へ直行 ($29)',
      readingLounge: '試し読みラウンジ',
      highlights: [
        '✦ Horizon Engine Core',
        '✦ 432Hz Lotus Nexus',
        '✦ Logic Arena Proofs',
        '✦ Sovereign NECR Ledger',
      ],
    },
    exhibitUi: {
      category: '展示詳細',
      deepDive: '理論的ディープダイブ',
      keyInsights: '主要な実証原則',
      audioVoiceover: '音声ナレーション台本＆音響ディレクション',
      openLounge: 'ラウンジで試し読み',
      acquireVault: '書籍を入手 ($29)',
      close: '展示室へ戻る',
      next: '次の展示',
      prev: '前の展示',
    },
    loungeUi: {
      title: 'リーディング・ラウンジ',
      badge: 'デジタル読書端末シミュレーター',
      tableOfContents: '目次・収録章',
      readTime: '所要時間',
      prevPage: '前のページ',
      nextPage: '次のページ',
      audioNarration: '音声解説を聞く',
      playingAudio: 'ナレーション再生中...',
      fontSize: '文字サイズ',
      theme: '背景テーマ',
      goToVault: '全284ページ完全版を入手 ($29)',
    },
    vaultUi: {
      badge: '限定デジタルストアフロント',
      title: 'マスター保管庫 (The Vault)',
      subtitle: '『流動する未来の時間力学』を今すぐ手に入れましょう。DRMフリーで世界中どこでも即時ダウンロード可能です。',
      specifications: '仕様・同梱物',
      selectEdition: 'エディションを選択',
      acquireCta: '今すぐアクセス権を獲得',
      instantDownload: '即時デジタル納品',
      guarantee: '100% 30日間返金保証',
      licenseKey: '発行ライセンスキー',
      purchaseSuccess: '購入完了！ダウンロードの準備ができました。',
    },
    shareUi: {
      title: 'この3D展示室をシェア',
      badge: 'ソーシャル拡散',
      deepLinkActive: 'ディープリンク有効',
      broadcast: '拡散する',
      copyLink: 'URLをコピー',
      copied: 'コピー完了！',
      copySnippet: '紹介文をコピー',
      shareOn: 'SNSでシェアする：',
    },
  },
};
