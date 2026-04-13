import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/src/firebase';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { CarListing, UserProfile } from '@/src/types';
import { CarCard } from '@/src/components/CarCard';
import { User, Phone, MapPin, Mail, Settings, LogOut, Package } from 'lucide-react';
import { ALGERIA_WILAYAS } from '@/src/lib/utils';

export const Profile: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myCars, setMyCars] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        setProfile(data);
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setPhone(data.phone);
        setWilaya(data.wilaya);
      }
    };

    fetchProfile();

    const q = query(collection(db, 'cars'), where('sellerId', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMyCars(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as CarListing)));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      await updateDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        phone,
        wilaya
      });
      setIsEditing(false);
      // Refresh profile data
      const docSnap = await getDoc(doc(db, 'users', user.uid));
      if (docSnap.exists()) setProfile(docSnap.data() as UserProfile);
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">يجب تسجيل الدخول أولاً</h2>
        <button onClick={() => navigate('/login')} className="bg-dz-green text-white px-8 py-3 rounded-xl font-bold">
          تسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl text-center">
            <div className="w-24 h-24 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mx-auto mb-6 relative">
              {profile?.photoURL ? (
                <img src={profile.photoURL} className="w-full h-full object-cover rounded-3xl" alt="" />
              ) : (
                <User size={48} />
              )}
              <div className="absolute -bottom-2 -right-2 bg-dz-green text-white p-2 rounded-xl shadow-lg">
                <Settings size={16} />
              </div>
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-1">{profile?.firstName} {profile?.lastName}</h2>
            <p className="text-slate-400 text-sm mb-6">عضو منذ {profile ? new Date(profile.createdAt).getFullYear() : '...'}</p>

            <div className="space-y-4 text-right">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Mail size={18} className="text-dz-green" />
                <span className="text-sm font-medium text-slate-600">{profile?.email}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Phone size={18} className="text-dz-green" />
                <span className="text-sm font-medium text-slate-600">{profile?.phone || 'غير محدد'}</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <MapPin size={18} className="text-dz-green" />
                <span className="text-sm font-medium text-slate-600">{profile?.wilaya || 'غير محدد'}</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="bg-slate-900 text-white py-3 rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
              >
                تعديل الملف
              </button>
              <button 
                onClick={() => auth.signOut()}
                className="bg-red-50 text-dz-red py-3 rounded-xl text-sm font-bold hover:bg-red-100 transition-all"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>

          {isEditing && (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl">
              <h3 className="font-bold text-lg mb-6">تعديل البيانات</h3>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <input 
                  type="text" placeholder="الاسم"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green text-sm"
                  value={firstName} onChange={e => setFirstName(e.target.value)}
                />
                <input 
                  type="text" placeholder="اللقب"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green text-sm"
                  value={lastName} onChange={e => setLastName(e.target.value)}
                />
                <input 
                  type="tel" placeholder="رقم الهاتف"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green text-sm"
                  value={phone} onChange={e => setPhone(e.target.value)}
                />
                <select 
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green text-sm"
                  value={wilaya} onChange={e => setWilaya(e.target.value)}
                >
                  <option value="">اختر الولاية</option>
                  {ALGERIA_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                <button type="submit" className="w-full bg-dz-green text-white py-3 rounded-xl font-bold">حفظ التغييرات</button>
              </form>
            </div>
          )}
        </div>

        {/* My Listings */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
              <Package className="text-dz-green" />
              <span>إعلاناتي</span>
            </h2>
            <button 
              onClick={() => navigate('/add-car')}
              className="bg-dz-green text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg"
            >
              أضف إعلان جديد
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-100 animate-pulse h-[400px] rounded-2xl" />
              ))}
            </div>
          ) : myCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {myCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-20 rounded-3xl border border-slate-100 text-center">
              <h3 className="text-xl font-bold text-slate-900 mb-2">لا توجد إعلانات بعد</h3>
              <p className="text-slate-500">ابدأ ببيع سيارتك الآن عبر منصتنا</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
