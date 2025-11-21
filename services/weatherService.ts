import { WeatherMap, WeatherData } from "../types";

// Simulates an API call to a weather provider
const getRandomTemp = (base: number) => Math.floor(base + Math.random() * 5 - 2);

const MOCK_BASE_TEMPS: Record<string, number> = {
  'abha': 22,
  'khamis': 26,
  'rijal-alma': 28,
  'tanomah': 19,
  'namas': 18,
  'mahayil': 32
};

const CONDITIONS = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'];

export const fetchRegionalWeather = async (governorateIds: string[]): Promise<WeatherMap> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const result: WeatherMap = {};
  
  governorateIds.forEach(id => {
    const base = MOCK_BASE_TEMPS[id] || 25;
    const temp = getRandomTemp(base);
    const condition = CONDITIONS[Math.floor(Math.random() * CONDITIONS.length)];
    
    let icon = '☀️';
    if (condition.includes('Cloud')) icon = '⛅';
    if (condition.includes('Rain')) icon = '🌧️';

    result[id] = {
      temp,
      condition,
      icon
    };
  });

  return result;
};