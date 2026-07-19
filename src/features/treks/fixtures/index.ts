import { normalizeTrekCollection } from '../services/normalizers';

import type { TrekSummary } from '../types';

const demoTrekFixtures: TrekSummary[] = [
  {
    id: 'demo-kudremukh', name: 'Kudremukh Peak', slug: 'kudremukh-peak',
    shortDescription: 'Cloud forests, rolling grasslands, and a summit worth the early start.',
    fullDescription: 'A monsoon-favorite trail through dense shola forest and open ridgelines in the Western Ghats.',
    state: 'Karnataka', location: 'Chikkamagaluru', latitude: 13.1342, longitude: 75.2544,
    startDate: '2026-08-08T04:30:00.000Z', endDate: '2026-08-09T14:00:00.000Z',
    difficulty: 'MODERATE', costInr: 5499, maxParticipants: 18, currentParticipants: 11,
    avgRating: 4.8, ratingCount: 326, popularityScore: 97, source: 'demo',
    images: [{ url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85', isPrimary: true, altText: 'Misty mountain ridgeline' }],
    tags: [{ name: 'Monsoon' }, { name: 'Western Ghats' }], isPublished: true, status: 'PUBLISHED',
  },
  {
    id: 'demo-hampta-pass', name: 'Hampta Pass', slug: 'hampta-pass',
    shortDescription: 'Cross from the lush Kullu valley into the stark landscapes of Lahaul.',
    fullDescription: 'A high-altitude crossover trek with dramatic scenery changes, river crossings, and alpine camps.',
    state: 'Himachal Pradesh', location: 'Manali', latitude: 32.2627, longitude: 77.1887,
    startDate: '2026-09-12T03:30:00.000Z', endDate: '2026-09-16T12:00:00.000Z',
    difficulty: 'MODERATE', costInr: 11999, maxParticipants: 20, currentParticipants: 14,
    avgRating: 4.9, ratingCount: 512, popularityScore: 94, source: 'demo',
    images: [{ url: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85', isPrimary: true, altText: 'Mountain valley at sunrise' }],
    tags: [{ name: 'High altitude' }, { name: 'Camping' }], isPublished: true, status: 'PUBLISHED',
  },
  {
    id: 'demo-tadiandamol', name: 'Tadiandamol', slug: 'tadiandamol',
    shortDescription: 'A friendly weekend climb through coffee country and misty grasslands.',
    fullDescription: 'Coorg’s highest peak is an approachable day hike with wide views and a gentle trail profile.',
    state: 'Karnataka', location: 'Kodagu', latitude: 12.2164, longitude: 75.6152,
    startDate: '2026-08-22T05:00:00.000Z', endDate: '2026-08-23T11:30:00.000Z',
    difficulty: 'EASY', costInr: 3299, maxParticipants: 24, currentParticipants: 9,
    avgRating: 4.6, ratingCount: 184, popularityScore: 83, source: 'demo',
    images: [{ url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85', isPrimary: true, altText: 'Green trail through mountain grasslands' }],
    tags: [{ name: 'Beginner' }, { name: 'Weekend' }], isPublished: true, status: 'PUBLISHED',
  },
  {
    id: 'demo-sandakphu', name: 'Sandakphu Ridge', slug: 'sandakphu-ridge',
    shortDescription: 'Walk the Singalila ridge with four of the world’s tallest peaks on the horizon.',
    fullDescription: 'A classic Himalayan ridge trek through rhododendron forests and welcoming mountain hamlets.',
    state: 'West Bengal', location: 'Darjeeling', latitude: 27.1058, longitude: 88.0017,
    startDate: '2026-10-03T04:00:00.000Z', endDate: '2026-10-08T12:00:00.000Z',
    difficulty: 'DIFFICULT', costInr: 15499, maxParticipants: 16, currentParticipants: 7,
    avgRating: 4.9, ratingCount: 278, popularityScore: 90, source: 'demo',
    images: [{ url: 'https://images.unsplash.com/photo-1483347756197-71ef80e95f73?auto=format&fit=crop&w=1200&q=85', isPrimary: true, altText: 'Snowy Himalayan range' }],
    tags: [{ name: 'Himalaya' }, { name: 'Ridge walk' }], isPublished: true, status: 'PUBLISHED',
  },
  {
    id: 'demo-rajmachi', name: 'Rajmachi Fort', slug: 'rajmachi-fort',
    shortDescription: 'Waterfalls, forest paths, and two historic forts above the Sahyadris.',
    fullDescription: 'An easy overnight trail that comes alive in the rains and works well for first-time trekkers.',
    state: 'Maharashtra', location: 'Lonavala', latitude: 18.8264, longitude: 73.3944,
    startDate: '2026-08-15T06:00:00.000Z', endDate: '2026-08-16T10:30:00.000Z',
    difficulty: 'EASY', costInr: 2499, maxParticipants: 28, currentParticipants: 19,
    avgRating: 4.5, ratingCount: 401, popularityScore: 88, source: 'demo',
    images: [{ url: 'https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1200&q=85', isPrimary: true, altText: 'Trail overlooking a green valley' }],
    tags: [{ name: 'Fort' }, { name: 'Beginner' }], isPublished: true, status: 'PUBLISHED',
  },
  {
    id: 'demo-valley-flowers', name: 'Valley of Flowers', slug: 'valley-of-flowers',
    shortDescription: 'A protected Himalayan valley carpeted with seasonal alpine flowers.',
    fullDescription: 'A beautiful multi-day journey combining the flower valley with an optional Hemkund Sahib climb.',
    state: 'Uttarakhand', location: 'Chamoli', latitude: 30.728, longitude: 79.605,
    startDate: '2026-08-29T03:30:00.000Z', endDate: '2026-09-03T12:00:00.000Z',
    difficulty: 'MODERATE', costInr: 13999, maxParticipants: 18, currentParticipants: 12,
    avgRating: 4.8, ratingCount: 356, popularityScore: 92, source: 'demo',
    images: [{ url: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=85', isPrimary: true, altText: 'Wildflowers beneath mountains' }],
    tags: [{ name: 'Flowers' }, { name: 'National Park' }], isPublished: true, status: 'PUBLISHED',
  },
];

// Demo records cross the same runtime validation boundary as API records. This
// prevents a typed fixture from silently drifting away from the live contract.
export const demoTreks = normalizeTrekCollection(demoTrekFixtures, {
  limit: demoTrekFixtures.length,
  source: 'demo',
}).items;
