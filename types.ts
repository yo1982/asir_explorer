export enum CategoryType {
  TOURIST_SITE = 'Tourist Sites',
  HOTEL = 'Hotels & Accommodation',
  RESTAURANT = 'Restaurants',
  HOSPITAL = 'Health Centers',
  SPORTS = 'Sports Clubs',
  CAFE = 'Cafes',
  SHOPPING = 'Shopping',
}

export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Place {
  id: string;
  name: string;
  type: CategoryType;
  rating: number;
  shortTitle: string; // e.g. "5-star Hotel"
  description?: string; // AI Enhanced description
  imageUrl: string;
  googleMapsUrl: string;
  isManual: boolean; // True if added/edited manually, false if raw import
}

export interface Governorate {
  id: string;
  name: string;
  arabicName: string;
  imageUrl: string;
  description: string;
  places: Place[];
}

export interface WeatherData {
  temp: number;
  condition: string;
  icon: string;
}

export type WeatherMap = Record<string, WeatherData>; // GovernorateId -> Weather