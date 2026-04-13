import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { CarListing } from '@/src/types';
import { CarCard } from '@/src/components/CarCard';
import { Search as SearchIcon, Filter, X, ChevronDown, Package } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ALGERIA_WILAYAS } from '@/src/lib/utils';

export const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState<CarListing[]>([]);
  const [filteredCars, setFilteredCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [selectedWilaya, setSelectedWilaya] = useState(searchParams.get('wilaya') || '');
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
    // Sync URL params if they change (e.g. from home search)
    const qParam = searchParams.get('q');
    const wParam = searchParams.get('wilaya');
    if (qParam !== null) setSearchTerm(qParam);
    if (wParam !== null) setSelectedWilaya(wParam);
  }, [searchParams]);

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
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl sticky top-24">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-xl flex items-center gap-2 tracking-tighter">
                <Filter size={24} className="text-dz-green" />
                <span>تصفية النتائج</span>
              </h3>
              <button 
                onClick={resetFilters}
                className="text-xs text-slate-400 hover:text-dz-red font-black transition-colors uppercase tracking-widest"
              >
                إعادة تعيين
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">البحث السريع</label>
                <div className="relative">
                  <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="text" 
                    placeholder="ماركة، موديل..."
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-dz-green focus:bg-white transition-all text-sm font-bold"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">الولاية</label>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-dz-green focus:bg-white transition-all text-sm font-bold appearance-none"
                    value={selectedWilaya}
                    onChange={e => setSelectedWilaya(e.target.value)}
                  >
                    <option value="">كل الولايات</option>
                    {ALGERIA_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                  <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">السعر (دج)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number" placeholder="من"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-dz-green focus:bg-white transition-all text-sm font-bold"
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                  />
                  <input 
                    type="number" placeholder="إلى"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-dz-green focus:bg-white transition-all text-sm font-bold"
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">سنة الصنع</label>
                <div className="grid grid-cols-2 gap-3">
                  <input 
                    type="number" placeholder="من"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-dz-green focus:bg-white transition-all text-sm font-bold"
                    value={minYear}
                    onChange={e => setMinYear(e.target.value)}
                  />
                  <input 
                    type="number" placeholder="إلى"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-dz-green focus:bg-white transition-all text-sm font-bold"
                    value={maxYear}
                    onChange={e => setMaxYear(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">المسافة القصوى (كم)</label>
                <input 
                  type="number" placeholder="مثال: 100000"
                  className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-dz-green focus:bg-white transition-all text-sm font-bold"
                  value={maxMileage}
                  onChange={e => setMaxMileage(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">الحالة</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'excellent', label: 'ممتازة' },
                    { id: 'good', label: 'جيدة' },
                    { id: 'average', label: 'متوسطة' },
                    { id: 'below_average', label: 'ضعيفة' }
                  ].map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCondition(selectedCondition === c.id ? '' : c.id)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                        selectedCondition === c.id 
                          ? 'bg-dz-green border-dz-green text-white shadow-lg shadow-dz-green/20' 
                          : 'bg-slate-50 border-slate-100 text-slate-600 hover:border-dz-green/30'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">النتائج المتاحة</h2>
              <p className="text-slate-500 font-medium">وجدنا {filteredCars.length} سيارة تطابق بحثك</p>
            </div>
            
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
              <button className="p-2 bg-white rounded-lg shadow-sm text-dz-green">
                <Package size={20} />
              </button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-slate-100 animate-pulse h-[450px] rounded-[2rem]" />
              ))}
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchIcon size={48} className="text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">لم نجد أي نتائج</h3>
              <p className="text-slate-500 font-medium mb-8">حاول تغيير كلمات البحث أو الفلاتر للحصول على نتائج أكثر</p>
              <button 
                onClick={resetFilters}
                className="bg-dz-green text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-dz-green/20 hover:scale-105 transition-transform"
              >
                إعادة تعيين الفلاتر
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
