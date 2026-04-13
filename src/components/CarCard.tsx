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
    <Link to={`/car/${car.id}`} className="group bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={car.images[0] || 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800'} 
          alt={car.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-2xl text-dz-green font-black text-lg shadow-xl border border-white/20">
          {formatPrice(car.price)}
        </div>
        {car.bidPrice && (
          <div className="absolute top-16 right-4 bg-dz-red text-white px-3 py-1 rounded-xl font-bold text-xs shadow-lg animate-pulse">
            ساموني: {formatPrice(car.bidPrice)}
          </div>
        )}
        {car.isVerified && (
          <div className="absolute top-4 left-4 bg-dz-green text-white p-2 rounded-2xl shadow-xl border border-white/20">
            <ShieldCheck size={18} />
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center gap-2 text-white text-xs font-bold">
            <MapPin size={14} className="text-dz-green" />
            <span>{car.wilaya}</span>
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-black text-xl text-slate-900 mb-3 line-clamp-1 group-hover:text-dz-green transition-colors tracking-tight">
          {car.title}
        </h3>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-slate-500 text-sm font-bold">
            <Calendar size={16} className="text-dz-green" />
            <span>{car.year}</span>
          </div>
          {car.mileage && (
            <div className="flex items-center gap-1.5 text-slate-500 text-sm font-bold">
              <Gauge size={16} className="text-dz-green" />
              <span>{car.mileage.toLocaleString()} كم</span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
              {car.brand}
            </span>
            <span className="text-sm font-bold text-slate-700">
              {car.model}
            </span>
          </div>
          <div className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
            car.condition === 'excellent' ? 'bg-dz-green/10 text-dz-green' : 'bg-slate-100 text-slate-500'
          }`}>
            {car.condition === 'excellent' ? 'حالة ممتازة' : 'حالة جيدة'}
          </div>
        </div>
      </div>
    </Link>
  );
};
