import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, orderBy, limit, onSnapshot, where } from 'firebase/firestore';
import { db } from '@/src/firebase';
import { CarListing } from '@/src/types';
import { CarCard } from '@/src/components/CarCard';
import { Search, Filter, ArrowRight, ShieldCheck, Zap, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { ALGERIA_WILAYAS } from '@/src/lib/utils';

export const Home: React.FC = () => {
  const [latestCars, setLatestCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchWilaya, setSearchWilaya] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, 'cars'),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc'),
      limit(8)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CarListing));
      setLatestCars(cars);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (searchWilaya) params.set('wilaya', searchWilaya);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=1920" 
            alt="Hero Car" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter"
          >
            سوق السيارات في <span className="text-dz-green">الجزائر</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-medium"
          >
            المنصة الأسرع والأكثر أماناً لبيع وشراء السيارات في جميع ولايات الوطن. آلاف الإعلانات المتجددة يومياً.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-2 rounded-2xl shadow-2xl max-w-4xl mx-auto flex flex-col md:flex-row gap-2"
          >
            <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-l border-slate-100 py-3">
              <Search className="text-slate-400 ml-3" size={20} />
              <input 
                type="text" 
                placeholder="ماركة السيارة، الموديل..." 
                className="w-full outline-none text-slate-700 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <div className="flex-1 flex items-center px-4 py-3">
              <Filter className="text-slate-400 ml-3" size={20} />
              <select 
                className="w-full outline-none text-slate-700 font-medium bg-transparent"
                value={searchWilaya}
                onChange={(e) => setSearchWilaya(e.target.value)}
              >
                <option value="">كل الولايات</option>
                {ALGERIA_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <button 
              onClick={handleSearch}
              className="bg-dz-green text-white px-8 py-4 rounded-xl font-bold hover:bg-dz-green/90 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <span>ابحث الآن</span>
              <ArrowRight size={20} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Stats/Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="bg-dz-green/10 p-3 rounded-xl text-dz-green">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">أمان تام</h3>
              <p className="text-slate-500 text-sm">نظام تحقق متطور لضمان جدية الإعلانات وحماية المستخدمين.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="bg-dz-green/10 p-3 rounded-xl text-dz-green">
              <Zap size={32} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">سرعة في البيع</h3>
              <p className="text-slate-500 text-sm">إعلانك يصل لآلاف المشترين المهتمين في دقائق معدودة.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="bg-dz-green/10 p-3 rounded-xl text-dz-green">
              <Users size={32} />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">تواصل مباشر</h3>
              <p className="text-slate-500 text-sm">دردشة فورية واتصال مباشر بين البائع والمشتري بدون وسيط.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="py-20 max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-black text-slate-900 mb-2">أحدث الإعلانات</h2>
            <p className="text-slate-500">اكتشف أفضل العروض المتوفرة حالياً في السوق</p>
          </div>
          <Link to="/search" className="text-dz-green font-bold flex items-center gap-1 hover:underline">
            <span>عرض الكل</span>
            <ArrowRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-slate-100 animate-pulse h-[400px] rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {latestCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
