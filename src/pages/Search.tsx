import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { CarListing } from '@/src/types';
import { CarCard } from '@/src/components/CarCard';
import { Search as SearchIcon, Filter, X } from 'lucide-react';
import { ALGERIA_WILAYAS } from '@/src/lib/utils';

export const Search: React.FC = () => {
  const [cars, setCars] = useState<CarListing[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWilaya, setSelectedWilaya] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [minYear, setMinYear] = useState('');
  const [maxYear, setMaxYear] = useState('');
  const [maxMileage, setMaxMileage] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'cars'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allCars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CarListing));
      setCars(allCars);
      setFilteredCars(allCars);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let result = cars;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(car => 
        car.title.toLowerCase().includes(term) || 
        car.brand.toLowerCase().includes(term) || 
        car.model.toLowerCase().includes(term)
      );
    }

    if (selectedWilaya) {
      result = result.filter(car => car.wilaya === selectedWilaya);
    }

    if (minPrice) {
      result = result.filter(car => car.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter(car => car.price <= Number(maxPrice));
    }

    if (minYear) {
      result = result.filter(car => car.year >= Number(minYear));
    }

    if (maxYear) {
      result = result.filter(car => car.year <= Number(maxYear));
    }

    if (maxMileage) {
      result = result.filter(car => (car.mileage || 0) <= Number(maxMileage));
    }

    if (selectedCondition) {
      result = result.filter(car => car.condition === selectedCondition);
    }

    setFilteredCars(result);
  }, [searchTerm, selectedWilaya, minPrice, maxPrice, minYear, maxYear, maxMileage, selectedCondition, cars]);

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedWilaya('');
    setMinPrice('');
    setMaxPrice('');
    setMinYear('');
    setMaxYear('');
    setMaxMileage('');
    setSelectedCondition('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-72 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Filter size={20} className="text-dz-green" />
                <span>الفلاتر</span>
              </h3>
              <button 
                onClick={resetFilters}
                className="text-xs text-slate-400 hover:text-dz-red font-bold transition-colors"
              >
                إعادة تعيين
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">البحث</label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-3 text-slate-300" size={16} />
                  <input 
                    type="text" 
                    placeholder="ابحث هنا..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green text-sm"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">الولاية</label>
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green text-sm appearance-none"
                  value={selectedWilaya}
                  onChange={e => setSelectedWilaya(e.target.value)}
                >
                  <option value="">كل الولايات</option>
                  {ALGERIA_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">السعر (دج)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" placeholder="من"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green text-sm"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                  />
                  <input 
                    type="number" placeholder="إلى"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green text-sm"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">سنة الصنع</label>
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" placeholder="من"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green text-sm"
                    value={minYear}
                    onChange={e => setMinYear(e.target.value)}
                  />
                  <input 
                    type="number" placeholder="إلى"
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green text-sm"
                    value={maxYear}
                    onChange={e => setMaxYear(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">المسافة القصوى (كم)</label>
                <input 
                  type="number" placeholder="مثال: 100000"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green text-sm"
                  value={maxMileage}
                  onChange={e => setMaxMileage(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">الحالة</label>
                <div className="space-y-2">
                  {['excellent', 'good', 'average', 'below_average'].map(c => (
                    <label key={c} className="flex items-center gap-2 cursor-pointer group">
                      <input 
                        type="radio" name="condition" 
                        className="w-4 h-4 accent-dz-green"
                        checked={selectedCondition === c}
                        onChange={() => setSelectedCondition(c)}
                      />
                      <span className="text-sm text-slate-600 group-hover:text-dz-green transition-colors">
                        {c === 'excellent' ? 'ممتازة' : c === 'good' ? 'جيدة' : c === 'average' ? 'متوسطة' : 'أقل من متوسطة'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
              نتائج البحث <span className="text-slate-400 text-lg mr-2">({filteredCars.length})</span>
            </h2>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-100 animate-pulse h-[400px] rounded-2xl" />
              ))}
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-20 rounded-3xl border border-slate-100 text-center">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                <SearchIcon size={40} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد نتائج</h3>
              <p className="text-slate-500">جرب تغيير كلمات البحث أو الفلاتر للحصول على نتائج أفضل</p>
              <button 
                onClick={resetFilters}
                className="mt-6 text-dz-green font-bold hover:underline"
              >
                مسح جميع الفلاتر
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
