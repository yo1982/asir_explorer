import React, { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Star, Navigation, Phone, Globe } from 'lucide-react';
import { getGovernorateById } from '../services/dataService';
import { fetchRegionalWeather } from '../services/weatherService';
import { Governorate, CategoryType, WeatherData, Place } from '../types';
import WeatherBadge from '../components/WeatherBadge';

const CATEGORIES = Object.values(CategoryType);

const GovernorateView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [governorate, setGovernorate] = useState<Governorate | undefined>(undefined);
  const [weather, setWeather] = useState<WeatherData | undefined>(undefined);
  const [activeCategory, setActiveCategory] = useState<CategoryType>(CategoryType.TOURIST_SITE);

  useEffect(() => {
    if (!id) return;
    const gov = getGovernorateById(id);
    setGovernorate(gov);

    // Initial weather fetch
    fetchRegionalWeather([id]).then(w => setWeather(w[id]));
  }, [id]);

  const filteredPlaces = useMemo(() => {
    if (!governorate) return [];
    return governorate.places.filter(p => p.type === activeCategory);
  }, [governorate, activeCategory]);

  if (!governorate) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* City Header */}
      <div className="relative h-80 w-full">
        <img 
          src={governorate.imageUrl} 
          alt={governorate.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end pb-8 px-4 md:px-12">
          <div className="container mx-auto flex justify-between items-end">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 mb-2">
                <MapPin size={20} />
                <span className="uppercase tracking-wider text-sm font-semibold">Asir Region</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{governorate.name}</h1>
              <p className="text-xl text-white/80">{governorate.arabicName}</p>
            </div>
            <div className="mb-2">
              <WeatherBadge data={weather} large />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar / Category Navigation */}
          <aside className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-4 sticky top-24">
              <h3 className="text-lg font-bold mb-4 px-2 text-slate-800">Explore Categories</h3>
              <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`flex-shrink-0 text-left px-4 py-3 rounded-lg transition-all ${
                      activeCategory === cat 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              {/* Ad Placeholder */}
              <div className="mt-6 bg-slate-100 rounded-lg p-6 text-center border border-dashed border-slate-300">
                <span className="text-slate-400 text-sm font-medium">Sponsored Ad Space</span>
              </div>
            </div>
          </aside>

          {/* Listings Grid */}
          <div className="lg:w-3/4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-800">{activeCategory}</h2>
              <p className="text-slate-500">Found {filteredPlaces.length} locations</p>
            </div>

            {filteredPlaces.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
                  <MapPin size={32} className="text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900">No places added yet</h3>
                <p className="text-slate-500 mt-2">Check back soon or visit the admin panel to import data.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPlaces.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const PlaceCard: React.FC<{ place: Place }> = ({ place }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full border border-slate-100">
      <div className="relative h-48">
        <img 
          src={place.imageUrl} 
          alt={place.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
          <Star size={14} className="text-yellow-500 fill-yellow-500" />
          <span className="text-xs font-bold text-slate-700">{place.rating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="mb-1 text-xs font-bold uppercase tracking-wide text-emerald-600">
          {place.shortTitle || place.type}
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{place.name}</h3>
        <p className="text-slate-500 text-sm mb-4 flex-grow">
          {place.description || "No description available."}
        </p>
        
        <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
          <a 
            href={place.googleMapsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Navigation size={16} />
            <span>Maps</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default GovernorateView;