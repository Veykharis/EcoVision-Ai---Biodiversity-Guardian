import { Sighting, CitizenReport, RegionalHealthScore } from '../src/types.js';

export const INITIAL_REGIONS: RegionalHealthScore[] = [
  {
    regionName: 'Telangana & Hyderabad Forest Reserve',
    lat: 17.3850,
    lng: 78.4867,
    healthIndex: 68,
    speciesRichness: 142,
    endangeredCount: 12,
    invasiveCount: 28,
    habitatThreatLevel: 'High',
    recentTrend: 'declining',
    keyRiskFactors: [
      'Rapid urban sprawl into Kawal & Amrabad corridor',
      'High density of Lantana camara displacing native flora',
      'Illegal encroachment around lake catchments'
    ]
  },
  {
    regionName: 'Western Ghats Biodiversity Hotspot',
    lat: 11.4102,
    lng: 76.6950,
    healthIndex: 82,
    speciesRichness: 480,
    endangeredCount: 45,
    invasiveCount: 19,
    habitatThreatLevel: 'Moderate',
    recentTrend: 'stable',
    keyRiskFactors: [
      'Tea & coffee plantation fragmentation',
      'Tourism pressure in Nilgiri biosphere',
      'Seasonal forest fires'
    ]
  },
  {
    regionName: 'Yellowstone Ecosystem Preserve',
    lat: 44.4280,
    lng: -110.5885,
    healthIndex: 89,
    speciesRichness: 310,
    endangeredCount: 6,
    invasiveCount: 14,
    habitatThreatLevel: 'Low',
    recentTrend: 'improving',
    keyRiskFactors: [
      'Climate warming impacting high-altitude pine',
      'Cheatgrass spread in sagebrush steppe'
    ]
  },
  {
    regionName: 'Amazon Rainforest Basin - Sector Delta',
    lat: -3.4653,
    lng: -62.2159,
    healthIndex: 61,
    speciesRichness: 1250,
    endangeredCount: 88,
    invasiveCount: 35,
    habitatThreatLevel: 'Severe',
    recentTrend: 'declining',
    keyRiskFactors: [
      'Active illegal logging & cattle ranching',
      'River pollution from artisanal mining',
      'Severe drought cycles'
    ]
  }
];

export const INITIAL_KNOWLEDGE_BASE = [
  {
    title: 'IUCN Red List Guidelines for Panthera tigris (Bengal Tiger)',
    source: 'IUCN Red List Assessment 2024',
    snippet: 'Panthera tigris is listed as Endangered (EN). Habitat fragmentation and prey depletion are primary drivers. Dispersal corridors between tiger reserves in central and southern India are critical to maintaining genetic flow.',
    relevanceScore: 0.96
  },
  {
    title: 'Impact Assessment of Lantana Camara in Tropical Deciduous Forests',
    source: 'Journal of Ecology & Conservation India 2025',
    snippet: 'Lantana camara forms dense impenetrable thickets, suppressing native sapling regeneration and reducing forage for wild herbivores like Chital and Sambar. Fire frequency increases significantly in heavily infested forest patches.',
    relevanceScore: 0.92
  },
  {
    title: 'Parthenium Hysterophorus Spread in Semi-Arid Ecosystems',
    source: 'Invasive Species Bulletin 2024',
    snippet: 'Parthenium causes severe allergic dermatitis in wildlife and humans. It suppresses native grass species through allelopathic chemicals released into the topsoil.',
    relevanceScore: 0.88
  },
  {
    title: 'Conservation Status of Ardeotis nigriceps (Great Indian Bustard)',
    source: 'Wildlife Institute of India Special Report',
    snippet: 'Critically Endangered (CR) with fewer than 150 individuals remaining in the wild. High-voltage power transmission lines and feral dog predation on ground nests represent 80% of mortality.',
    relevanceScore: 0.98
  },
  {
    title: 'Water Hyacinth (Eichhornia crassipes) Eutrophication Dynamics',
    source: 'Global Freshwater Research',
    snippet: 'Blocks sunlight penetration in wetlands and urban lakes, resulting in hypoxic dead zones that trigger mass fish die-offs and eradicate native aquatic flora.',
    relevanceScore: 0.85
  }
];

export const INITIAL_SIGHTINGS: Sighting[] = [
  {
    id: 'sighting-101',
    timestamp: '2026-07-20T14:32:00Z',
    locationName: 'Amrabad Tiger Reserve, Telangana',
    region: 'Telangana & Hyderabad Forest Reserve',
    lat: 16.3800,
    lng: 78.8200,
    imageUrl: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?auto=format&fit=crop&w=800&q=80',
    speciesName: 'Bengal Tiger',
    scientificName: 'Panthera tigris tigris',
    confidenceScore: 0.96,
    iucnStatus: 'EN',
    isInvasive: false,
    invasiveSeverity: 'None',
    observerRole: 'camera_trap',
    verifiedStatus: 'verified_expert',
    perceptionResult: {
      speciesName: 'Bengal Tiger',
      scientificName: 'Panthera tigris tigris',
      confidenceScore: 0.96,
      taxonomy: {
        kingdom: 'Animalia',
        phylum: 'Chordata',
        class: 'Mammalia',
        order: 'Carnivora',
        family: 'Felidae',
        genus: 'Panthera',
        species: 'Panthera tigris',
        commonName: 'Bengal Tiger'
      },
      iucnStatus: 'EN',
      iucnStatusLabel: 'Endangered',
      isInvasive: false,
      invasiveSeverity: 'None',
      description: 'Apex feline predator characterized by distinct reddish-orange coat with black vertical stripes. High conservation priority in Southern Indian tiger corridors.',
      habitatType: 'Tropical Dry Deciduous & Scrub Forest',
      nativeRegion: 'Indian Subcontinent',
      keyFeatures: ['Black vertical stripes', 'White facial markings', 'Large muscular frame (>180kg)', 'Distinct stripe pattern signature'],
      imageQualityScore: 92,
      imageQualityNotes: 'Sharp night vision IR frame from automated motion-triggered camera trap.'
    },
    reasoningInsight: {
      sightingId: 'sighting-101',
      generatedAt: '2026-07-20T14:35:12Z',
      context: {
        nearbySightingsCount: 4,
        radiusKm: 5,
        timeWindowDays: 30,
        historicalMatchesCount: 8,
        ragKnowledgeDocs: [
          {
            title: 'IUCN Red List Guidelines for Panthera tigris',
            source: 'IUCN Assessment 2024',
            snippet: 'Dispersal corridors between tiger reserves in central and southern India are critical to maintaining genetic flow.',
            relevanceScore: 0.96
          }
        ],
        regionalEcoSummary: 'Amrabad reserve shows active tiger movement. Sighting confirms presence of a young male tiger moving westward toward northern dispersal corridor.'
      },
      pattern: {
        populationTrend: 'Increasing',
        ecosystemPressureScore: 6.4,
        invasiveNativeInteraction: 'Lantana encroachment along tiger trails is constricting prey mobility, forcing apex predators closer to fringe village borders.',
        correlationFactors: [
          'Prey density increase (Chital herds)',
          'Agricultural border encroachment',
          'Lantana thicket corridor bottlenecking'
        ],
        habitatFragmentationRisk: 'Moderate'
      },
      insight: {
        title: 'Apex Predator Dispersal & Corridor Constraint Alert',
        summary: 'This Bengal Tiger sighting, combined with 3 previous camera trap logs this month, confirms a young male establishing territory along the Western Amrabad boundary. The corridor is constricted by heavy Lantana camara growth.',
        urgencyRating: 'Watch',
        ecologicalImpact: 'High ecological importance. Proves successful breeding in core zone, but highlights vulnerability of peripheral dispersal pathways.',
        keyTakeaways: [
          'Male tiger T-402 actively patrolling 18 km² territory',
          'Heavy invasive Lantana thickets compressing natural prey travel lanes',
          'Zero human-wildlife conflict incidents logged so far, but border proximity is high'
        ],
        recommendedActions: [
          'Deploy targeted invasive Lantana clearing along 3km boundary strip',
          'Enhance anti-poaching foot patrols around northern stream crossing',
          'Issue community alert to adjacent fringe livestock grazers'
        ],
        ecologicalRiskScore: 42
      },
      telemetry: [
        {
          agentName: 'Context',
          executionTimeMs: 140,
          inputTokensEstimated: 310,
          outputTokensEstimated: 180,
          costUsdEstimated: 0.00008,
          status: 'success',
          timestamp: '2026-07-20T14:35:10Z'
        },
        {
          agentName: 'Pattern',
          executionTimeMs: 185,
          inputTokensEstimated: 420,
          outputTokensEstimated: 210,
          costUsdEstimated: 0.00010,
          status: 'success',
          timestamp: '2026-07-20T14:35:11Z'
        },
        {
          agentName: 'Insight',
          executionTimeMs: 230,
          inputTokensEstimated: 580,
          outputTokensEstimated: 320,
          costUsdEstimated: 0.00014,
          status: 'success',
          timestamp: '2026-07-20T14:35:12Z'
        }
      ],
      totalPipelineTimeMs: 555,
      totalCostUsd: 0.00032
    },
    notes: 'Camera Trap 14B near Peddacheruvu stream.'
  },
  {
    id: 'sighting-102',
    timestamp: '2026-07-21T08:15:00Z',
    locationName: 'KBR National Park, Hyderabad',
    region: 'Telangana & Hyderabad Forest Reserve',
    lat: 17.4200,
    lng: 78.4350,
    imageUrl: 'https://images.unsplash.com/photo-1589656966895-2f33e7653819?auto=format&fit=crop&w=800&q=80',
    speciesName: 'Lantana Bush / Common Lantana',
    scientificName: 'Lantana camara',
    confidenceScore: 0.98,
    iucnStatus: 'LC',
    isInvasive: true,
    invasiveSeverity: 'Severe',
    observerRole: 'field_agent',
    verifiedStatus: 'verified_expert',
    perceptionResult: {
      speciesName: 'Common Lantana',
      scientificName: 'Lantana camara',
      confidenceScore: 0.98,
      taxonomy: {
        kingdom: 'Plantae',
        class: 'Magnoliopsida',
        order: 'Lamiales',
        family: 'Verbenaceae',
        genus: 'Lantana',
        species: 'Lantana camara',
        commonName: 'Wild Sage / Lantana'
      },
      iucnStatus: 'LC',
      iucnStatusLabel: 'Least Concern (Aggressive Alien Invasive)',
      isInvasive: true,
      invasiveSeverity: 'Severe',
      description: 'Highly aggressive noxious weed native to Tropical America. Outcompetes native understory vegetation, releases toxic allelopathic chemicals, and creates impenetrable brush.',
      habitatType: 'Disturbed Urban Forest & Woodland Margins',
      nativeRegion: 'Central & South America',
      keyFeatures: ['Small multi-colored flower clusters (yellow, orange, pink)', 'Quadrangular square stems with small prickles', 'Pungent aromatic leaves'],
      imageQualityScore: 95,
      imageQualityNotes: 'High clarity macro shot capturing flowers and serrated leaf margins.'
    },
    reasoningInsight: {
      sightingId: 'sighting-102',
      generatedAt: '2026-07-21T08:16:00Z',
      context: {
        nearbySightingsCount: 12,
        radiusKm: 3,
        timeWindowDays: 30,
        historicalMatchesCount: 34,
        ragKnowledgeDocs: [
          {
            title: 'Impact Assessment of Lantana Camara in Tropical Deciduous Forests',
            source: 'Journal of Ecology & Conservation 2025',
            snippet: 'Forms dense impenetrable thickets, suppressing native sapling regeneration and reducing forage for herbivores.',
            relevanceScore: 0.92
          }
        ],
        regionalEcoSummary: 'Heavy infestation across urban forest patches in Jubilee Hills / KBR area, choking native Neem and Acacia sapling emergence.'
      },
      pattern: {
        populationTrend: 'Anomalous Spurt',
        ecosystemPressureScore: 8.9,
        invasiveNativeInteraction: 'Lantana density has crossed 40% understory cover in this zone, displacing native peacock and small mammal foraging ground.',
        correlationFactors: [
          'Disturbed soil from trail maintenance',
          'Bird-mediated seed dispersal',
          'Lack of natural herbivorous suppression'
        ],
        habitatFragmentationRisk: 'High'
      },
      insight: {
        title: 'Severe Invasive Outbreak Risk in KBR Urban Buffer',
        summary: 'Lantana camara is expanding rapidly in KBR park sector 3. Without root-grubbing intervention, understory species diversity will drop by an estimated 60% over 2 seasons.',
        urgencyRating: 'Urgent',
        ecologicalImpact: 'High risk to urban biodiversity island. Causes localized extinction of native herbs and alters soil chemistry.',
        keyTakeaways: [
          'Understory canopy coverage reached critical threshold (42%)',
          'Suppression of native Neem and Tamarind wild regeneration',
          'Elevated fire risk during dry summer spell'
        ],
        recommendedActions: [
          'Organize mechanical root-cut weed suppression drive',
          'Replant native grasses (Cynodon, Cenchrus) immediately after removal',
          'Establish monitoring transects every 100m'
        ],
        ecologicalRiskScore: 84
      },
      telemetry: [
        {
          agentName: 'Context',
          executionTimeMs: 120,
          inputTokensEstimated: 290,
          outputTokensEstimated: 160,
          costUsdEstimated: 0.00007,
          status: 'success',
          timestamp: '2026-07-21T08:15:58Z'
        },
        {
          agentName: 'Pattern',
          executionTimeMs: 160,
          inputTokensEstimated: 400,
          outputTokensEstimated: 190,
          costUsdEstimated: 0.00009,
          status: 'success',
          timestamp: '2026-07-21T08:15:59Z'
        },
        {
          agentName: 'Insight',
          executionTimeMs: 210,
          inputTokensEstimated: 520,
          outputTokensEstimated: 300,
          costUsdEstimated: 0.00013,
          status: 'success',
          timestamp: '2026-07-21T08:16:00Z'
        }
      ],
      totalPipelineTimeMs: 490,
      totalCostUsd: 0.00029
    },
    notes: 'Logged during routine biodiversity transect by Forest Field Officer.'
  },
  {
    id: 'sighting-103',
    timestamp: '2026-07-19T11:20:00Z',
    locationName: 'Silent Valley National Park',
    region: 'Western Ghats Biodiversity Hotspot',
    lat: 11.0800,
    lng: 76.4500,
    imageUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?auto=format&fit=crop&w=800&q=80',
    speciesName: 'Lion-tailed Macaque',
    scientificName: 'Macaca silenus',
    confidenceScore: 0.94,
    iucnStatus: 'EN',
    isInvasive: false,
    invasiveSeverity: 'None',
    observerRole: 'researcher',
    verifiedStatus: 'verified_expert',
    perceptionResult: {
      speciesName: 'Lion-tailed Macaque',
      scientificName: 'Macaca silenus',
      confidenceScore: 0.94,
      taxonomy: {
        kingdom: 'Animalia',
        phylum: 'Chordata',
        class: 'Mammalia',
        order: 'Primates',
        family: 'Cercopithecidae',
        genus: 'Macaca',
        species: 'Macaca silenus',
        commonName: 'Wanderoo / Lion-tailed Macaque'
      },
      iucnStatus: 'EN',
      iucnStatusLabel: 'Endangered',
      isInvasive: false,
      invasiveSeverity: 'None',
      description: 'Endemic rainforest primate of the Western Ghats. Characterized by striking silver-white mane surrounding the head and a tufted tail tip resembling a lion.',
      habitatType: 'Tropical Evergreen Rainforest Canopy',
      nativeRegion: 'Western Ghats of India',
      keyFeatures: ['Silver-grey head mane', 'Black glossy coat', 'Tufted tail', 'Arboreal canopy habit'],
      imageQualityScore: 89,
      imageQualityNotes: 'Clear telephoto capture through upper rainforest canopy.'
    },
    notes: 'Troop of 14 individuals feeding on Ficus fruits in core forest area.'
  },
  {
    id: 'sighting-104',
    timestamp: '2026-07-18T16:45:00Z',
    locationName: 'Yellowstone Lamar Valley',
    region: 'Yellowstone Ecosystem Preserve',
    lat: 44.8700,
    lng: -110.2300,
    imageUrl: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?auto=format&fit=crop&w=800&q=80',
    speciesName: 'Gray Wolf',
    scientificName: 'Canis lupus',
    confidenceScore: 0.97,
    iucnStatus: 'LC',
    isInvasive: false,
    invasiveSeverity: 'None',
    observerRole: 'researcher',
    verifiedStatus: 'verified_expert',
    perceptionResult: {
      speciesName: 'Gray Wolf',
      scientificName: 'Canis lupus',
      confidenceScore: 0.97,
      taxonomy: {
        kingdom: 'Animalia',
        phylum: 'Chordata',
        class: 'Mammalia',
        order: 'Carnivora',
        family: 'Canidae',
        genus: 'Canis',
        species: 'Canis lupus',
        commonName: 'Timber Wolf / Gray Wolf'
      },
      iucnStatus: 'LC',
      iucnStatusLabel: 'Least Concern (Protected Ecosystem Keystone)',
      isInvasive: false,
      invasiveSeverity: 'None',
      description: 'Keystone predator instrumental in trophic cascade restoration in Yellowstone National Park.',
      habitatType: 'Alpine Meadow & Coniferous Montane Forest',
      nativeRegion: 'North America & Eurasia',
      keyFeatures: ['Grizzled grey-brown fur', 'Bushy black-tipped tail', 'Long legs and broad paws'],
      imageQualityScore: 94,
      imageQualityNotes: 'Sharp open meadow observation.'
    },
    notes: 'Junction Butte pack moving across river gravel bar.'
  },
  {
    id: 'sighting-105',
    timestamp: '2026-07-17T09:10:00Z',
    locationName: 'Hussain Sagar Lake Wetland, Hyderabad',
    region: 'Telangana & Hyderabad Forest Reserve',
    lat: 17.4230,
    lng: 78.4730,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    speciesName: 'Water Hyacinth',
    scientificName: 'Eichhornia crassipes',
    confidenceScore: 0.99,
    iucnStatus: 'LC',
    isInvasive: true,
    invasiveSeverity: 'Severe',
    observerRole: 'citizen',
    verifiedStatus: 'unverified',
    perceptionResult: {
      speciesName: 'Water Hyacinth',
      scientificName: 'Eichhornia crassipes',
      confidenceScore: 0.99,
      taxonomy: {
        kingdom: 'Plantae',
        class: 'Liliopsida',
        order: 'Commelinales',
        family: 'Pontederiaceae',
        genus: 'Eichhornia',
        species: 'Eichhornia crassipes',
        commonName: 'Water Hyacinth / Terror of Bengal'
      },
      iucnStatus: 'LC',
      iucnStatusLabel: 'Least Concern (Aggressive Aquatic Weed)',
      isInvasive: true,
      invasiveSeverity: 'Severe',
      description: 'Free-floating perennial aquatic plant with bulbous leaf petioles and purple flowers. Rapidly mats over water bodies causing severe hypoxia.',
      habitatType: 'Freshwater Lakes & Urban Reservoirs',
      nativeRegion: 'Amazon Basin',
      keyFeatures: ['Spongy inflated leaf stalks', 'Feathery dark fibrous roots', 'Pale violet flowers with yellow central spot'],
      imageQualityScore: 90,
      imageQualityNotes: 'Wide shot showing massive green mat covering lake surface.'
    },
    notes: 'Lake surface over 35% covered near Sanjeevaiah Park inlet.'
  }
];

export const INITIAL_CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: 'report-201',
    timestamp: '2026-07-21T07:10:00Z',
    title: 'Illegal Chemical Waste Dumping Near Pedda Cheruvu Wetland',
    category: 'illegal_dumping',
    description: 'Two unmarked tankers dumped viscous blue chemical effluent along the reserve forest boundary road.',
    locationName: 'Pedda Cheruvu Lake Catchment, Hyderabad outskirts',
    lat: 17.4650,
    lng: 78.5820,
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    status: 'pending',
    urgency: 'critical'
  },
  {
    id: 'report-202',
    timestamp: '2026-07-20T18:40:00Z',
    title: 'Wire Snare Poaching Trap Found along Amrabad Fringe Trail',
    category: 'poaching_hazard',
    description: 'Found a crude steel wire loop snare secured to a young teak tree near wildlife watering hole #3.',
    locationName: 'Amrabad Forest Range Sector 4',
    lat: 16.3920,
    lng: 78.8150,
    status: 'dispatched',
    urgency: 'high'
  },
  {
    id: 'report-203',
    timestamp: '2026-07-19T14:15:00Z',
    title: 'Parthenium Weed Massive Bloom Encroaching Agricultural Fields',
    category: 'invasive_outbreak',
    description: 'Over 2 acres of fallow land fully carpeted with flowering Parthenium hysterophorus. Local cattle suffering skin rash.',
    locationName: 'Maheshwaram Mandal, Ranga Reddy District',
    lat: 17.1320,
    lng: 78.4310,
    status: 'reviewed',
    urgency: 'medium'
  }
];
