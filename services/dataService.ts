import { Governorate, CategoryType, Place } from "../types";

const STORAGE_KEY = 'asir_explorer_db_v3';

// Initial Seed Data
const SEED_DATA: Governorate[] = [
  {
    id: 'abha',
    name: 'Abha',
    arabicName: 'أبها',
    imageUrl: 'https://picsum.photos/800/600?random=1',
    description: 'The capital of Asir province, known for its mild climate and foggy mountains.',
    places: [
      {
        id: 'p1',
        name: 'High City (Al Madinah Al Aliya)',
        type: CategoryType.TOURIST_SITE,
        rating: 4.7,
        shortTitle: 'Scenic Viewpoint',
        description: 'A beautiful misty viewpoint overlooking the city.',
        imageUrl: 'https://picsum.photos/400/300?random=10',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=High+City+Abha+Saudi+Arabia',
        isManual: true
      },
      {
        id: 'p2',
        name: 'Blue Inn Hotel',
        type: CategoryType.HOTEL,
        rating: 4.5,
        shortTitle: '5-Star Hotel',
        imageUrl: 'https://picsum.photos/400/300?random=11',
        googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Blue+Inn+Hotel+Abha+Saudi+Arabia',
        isManual: true
      }
    ]
  },
  {
    id: 'khamis',
    name: 'Khamis Mushait',
    arabicName: 'خميس مشيط',
    imageUrl: 'https://picsum.photos/800/600?random=2',
    description: 'A major commercial and industrial center in the region.',
    places: []
  },
  {
    id: 'rijal-alma',
    name: 'Rijal Alma',
    arabicName: 'رجال ألمع',
    imageUrl: 'https://picsum.photos/800/600?random=3',
    description: 'A heritage village famous for its stone and quartz architecture.',
    places: []
  },
  {
    id: 'tanomah',
    name: 'Tanomah',
    arabicName: 'تنومة',
    imageUrl: 'https://picsum.photos/800/600?random=4',
    description: 'Known for its cascading waterfalls and lush green mountains.',
    places: []
  }
];

// Database of Real Places for Mock Import
const REAL_PLACES_DB: Record<string, Partial<Record<CategoryType, string[]>>> = {
  'Abha': {
    [CategoryType.TOURIST_SITE]: ['Green Mountain (Jebel Zaraah)', 'Art Street', 'Al Soudah Park', 'Abha Dam Lake', 'Shamsan Ottoman Castle', 'Abu Kheyal Park'],
    [CategoryType.HOTEL]: ['Abha Palace Hotel', 'Sarawat Park Hotel', 'Boudl Abha', 'Citadines Abha'],
    [CategoryType.RESTAURANT]: ['The Revolving Restaurant', 'Nakhil Restaurant', 'Jorry Elite', 'Hashi Basha'],
    [CategoryType.SHOPPING]: ['Al Rashid Mall', 'Aseer Mall', 'Oasis Center'],
    [CategoryType.CAFE]: ['Rain Cafe', 'Boon Cafe', 'Overdose Specialty Coffee'],
    [CategoryType.SPORTS]: ['Prince Sultan Sport City', 'Abha Club']
  },
  'Khamis Mushait': {
    [CategoryType.TOURIST_SITE]: ['Bin Hamsan Heritage Village', 'Al Hayat Park'],
    [CategoryType.SHOPPING]: ['Khamis Avenue', 'Boulevard Khamis Mushait', 'Asir Mall'],
    [CategoryType.RESTAURANT]: ['Herfy', 'Al Tazaj', 'Kudu'],
    [CategoryType.HOTEL]: ['Bayat Hotel', 'Mercure Khamis Mushait']
  },
  'Rijal Alma': {
    [CategoryType.TOURIST_SITE]: ['Rijal Alma Heritage Village', 'Museum of the Tribe', 'Honey Market'],
    [CategoryType.RESTAURANT]: ['Heritage Village Restaurant']
  },
  'Tanomah': {
    [CategoryType.TOURIST_SITE]: ['Al-Sharaf Park', 'Tanomah Waterfall', 'Athrub Mountain', 'Al-Mahfar Park'],
    [CategoryType.HOTEL]: ['Tanomah Aram Hotel']
  }
};

// Helper to load data
export const loadGovernorates = (): Governorate[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize if empty
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
  return SEED_DATA;
};

// Helper to save data
export const saveGovernorates = (data: Governorate[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Helper to get specific governorate
export const getGovernorateById = (id: string): Governorate | undefined => {
  const all = loadGovernorates();
  return all.find(g => g.id === id);
};

// "Mock" Google Maps Import
export const mockImportFromGoogleMaps = async (governorateName: string, category: CategoryType): Promise<Place[]> => {
  await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate API latency

  // Try to fetch real places from our internal "Mock DB"
  const cityPlaces = REAL_PLACES_DB[governorateName];
  const realNames = cityPlaces ? cityPlaces[category] || [] : [];
  
  // If we have real data, pick random items. If not, generate generic ones.
  const itemsToGenerate = 3;
  const selectedNames: string[] = [];

  if (realNames.length > 0) {
    // Shuffle and pick unique
    const shuffled = [...realNames].sort(() => 0.5 - Math.random());
    selectedNames.push(...shuffled.slice(0, itemsToGenerate));
  } else {
    // Fallback for undefined categories/cities
    for(let i = 0; i < itemsToGenerate; i++) {
      selectedNames.push(`Best ${category} Spot ${i + 1}`);
    }
  }

  return selectedNames.map((name, i) => {
    // Construct a robust query for Google Maps
    // If it's a generic name, search for the category in the city to ensure SOMETHING comes up.
    // If it's a real name, search for that specific place.
    const isGeneric = name.startsWith('Best ');
    const searchQuery = isGeneric 
      ? `${category} in ${governorateName} Saudi Arabia`
      : `${name} ${governorateName} Saudi Arabia`;

    return {
      id: `imported_${Date.now()}_${i}`,
      name: name,
      type: category,
      rating: (3.8 + Math.random() * 1.2), // Random rating between 3.8 and 5.0
      shortTitle: isGeneric ? 'Top Rated' : 'Popular Location',
      imageUrl: `https://picsum.photos/400/300?random=${Date.now() + i}`,
      // Real Google Maps Search URL
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(searchQuery)}`,
      isManual: false
    };
  });
};