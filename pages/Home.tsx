import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MapPin } from 'lucide-react';
import { loadGovernorates } from '../services/dataService';
import { fetchRegionalWeather } from '../services/weatherService';
import { Governorate, WeatherMap } from '../types';
import WeatherBadge from '../components/WeatherBadge';

const Home: React.FC = () => {
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [weather, setWeather] = useState<WeatherMap>({});

  useEffect(() => {
    // Load structure
    const data = loadGovernorates();
    setGovernorates(data);

    // Load weather
    const ids = data.map(g => g.id);
    const getWx = async () => {
      const w = await fetchRegionalWeather(ids);
      setWeather(w);
    };
    
    getWx();
    const interval = setInterval(getWx, 60000); // Update every minute
    return () => clearInterval(interval);
  }, []);

  const scrollToExplore = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('explore');
    if (element) {
      // Calculate offset to account for sticky header
      // Header is ~80px, adding a little extra padding
      const headerOffset = 120;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="relative h-[500px] flex items-center justify-center text-white overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://picsum.photos/1920/1080?grayscale" 
            alt="Asir Region" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-slate-50"></div>
        </div>
        
        <div className="relative container mx-auto px-4 text-center pt-20">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">Discover Asir</h2>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-white/90 mb-8">
            Experience the breathtaking mountains, rich heritage, and cool weather above the clouds.
          </p>
          <button 
            onClick={scrollToExplore} 
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-emerald-500/30 cursor-pointer hover:-translate-y-1"
          >
            Start Exploring <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Governorates Grid */}
      <div id="explore" className="container mx-auto px-4 py-16 -mt-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {governorates.map((gov) => (
            <Link 
              to={`/gov/${gov.id}`} 
              key={gov.id}
              className="group bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={gov.imageUrl} 
                  alt={gov.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4">
                  <WeatherBadge data={weather[gov.id]} />
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">{gov.name}</h3>
                  <h4 className="text-emerald-400 font-serif">{gov.arabicName}</h4>
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 line-clamp-2 mb-4">{gov.description}</p>
                <div className="flex items-center text-emerald-600 font-medium group-hover:gap-2 transition-all">
                  View Guide <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;