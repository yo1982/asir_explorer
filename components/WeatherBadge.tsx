import React from 'react';
import { WeatherData } from '../types';
import { Thermometer } from 'lucide-react';

interface WeatherBadgeProps {
  data?: WeatherData;
  large?: boolean;
}

const WeatherBadge: React.FC<WeatherBadgeProps> = ({ data, large = false }) => {
  if (!data) return (
    <div className={`animate-pulse bg-gray-200 rounded-full ${large ? 'h-12 w-24' : 'h-8 w-16'}`}></div>
  );

  return (
    <div className={`flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-full shadow-sm ${large ? 'px-4 py-2' : 'px-3 py-1'}`}>
      <span className={large ? 'text-2xl' : 'text-lg'}>{data.icon}</span>
      <div className="flex flex-col leading-none">
        <span className={`font-bold ${large ? 'text-xl' : 'text-sm'}`}>
          {data.temp}°C
        </span>
        {large && <span className="text-xs opacity-90">{data.condition}</span>}
      </div>
    </div>
  );
};

export default WeatherBadge;