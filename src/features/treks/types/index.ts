export type TrekSource = 'api' | 'demo';

export type TrekValidationStatus = {
  compatibilityMode: boolean;
  source: TrekSource;
  state: 'validated';
};

export type TrekDifficulty = 'EASY' | 'MODERATE' | 'DIFFICULT' | 'EXTREME';
export type TrekSort = 'relevance' | 'newest' | 'popular' | 'distance';

export type TrekImage = {
  altText?: string | null;
  id?: string;
  isPrimary?: boolean;
  key?: string;
  url?: string | null;
};

export type TrekSummary = {
  avgRating: number;
  costInr: number;
  currentParticipants: number;
  difficulty: TrekDifficulty | null;
  endDate: string | null;
  fullDescription: string | null;
  id: string;
  images: TrekImage[];
  isPublished?: boolean;
  latitude: number | null;
  location: string | null;
  longitude: number | null;
  maxParticipants: number;
  name: string;
  popularityScore?: number;
  ratingCount: number;
  shortDescription: string | null;
  slug: string | null;
  source: TrekSource;
  startDate: string | null;
  state: string | null;
  status?: string;
  tags: { id?: string; name: string }[];
};

export type PaginationMeta = {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
};

export type PaginatedTreks = {
  items: TrekSummary[];
  meta: PaginationMeta;
  validation: TrekValidationStatus;
};

export type TrekFilters = {
  difficulty?: TrekDifficulty;
  latitude?: number;
  limit?: number;
  longitude?: number;
  maxCost?: number;
  minCost?: number;
  nearby?: boolean;
  page?: number;
  q?: string;
  radiusMeters?: number;
  sort?: TrekSort;
  state?: string;
};
