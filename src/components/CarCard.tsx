import React from 'react';
import { Link } from 'react-router-dom';
import { CarListing } from '@/src/types';
import { formatPrice } from '@/src/lib/utils';
import { MapPin, Calendar, Gauge, ShieldCheck } from 'lucide-react';

interface CarCardProps {
  car: CarListing;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <Link to={`/car/${car.id}`} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={car.images[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'} 
          alt={car.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-dz-green font-bold text-sm shadow-sm">
          {formatPrice(car.price)}
        </div>
        {car.isVerified && (
          <div className="absolute top-3 left-3 bg-dz-green text-white p-1.5 rounded-full shadow-lg">
            <ShieldCheck size={16} />
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg text-slate-900 mb-2 line-clamp-1 group-hover:text-dz-green transition-colors">
          {car.title}
        </h3>
        
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
            <MapPin size={14} />
            <span>{car.wilaya}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
            <Calendar size={14} />
            <span>{car.year}</span>
          </div>
          {car.mileage && (
            <div className="flex items-center gap-1 text-slate-500 text-xs font-medium">
              <Gauge size={14} />
              <span>{car.mileage.toLocaleString()} كم</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            {car.brand} {car.model}
          </span>
          <span className={car.condition === 'excellent' ? 'text-dz-green font-bold text-xs' : 'text-slate-500 font-bold text-xs'}>
            {car.condition === 'excellent' ? 'حالة ممتازة' : 'حالة جيدة'}
          </span>
        </div>
      </div>
    </Link>
  );
};
