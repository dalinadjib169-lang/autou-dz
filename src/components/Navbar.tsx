import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '@/src/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { LogOut, User, PlusCircle, MessageSquare, Car } from 'lucide-react';
import { ShinyText } from './ShinyText';

export const Navbar: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-dz-green rounded-xl flex items-center justify-center shadow-lg shadow-dz-green/20 group-hover:scale-110 transition-transform">
                <Car className="text-white" size={24} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 tracking-tighter leading-none">ATOU DZ</span>
                <span className="text-[10px] font-black text-dz-green uppercase tracking-widest leading-none mt-1">سوق السيارات</span>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-3 mr-4">
              <ShinyText text="بسم الله الرحمن الرحيم" className="text-[10px] py-1 px-3 bg-slate-50 rounded-full border border-slate-100" />
              <ShinyText text="ﷺ" className="text-[10px] py-1 px-3 bg-slate-50 rounded-full border border-slate-100" />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/search" className="hidden md:flex items-center gap-2 text-slate-600 hover:text-dz-green font-black text-sm transition-colors px-4 py-2 rounded-xl hover:bg-slate-50">
              <span>تصفح السيارات</span>
            </Link>
            
            {user ? (
              <>
                <Link to="/messages" className="p-3 text-slate-600 hover:bg-slate-100 rounded-2xl transition-all relative group">
                  <MessageSquare size={22} className="group-hover:scale-110 transition-transform" />
                  <div className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-dz-red rounded-full border-2 border-white animate-pulse" />
                </Link>
                <Link to="/add-car" className="flex items-center gap-2 bg-dz-green text-white px-5 py-2.5 rounded-2xl hover:bg-dz-green/90 transition-all font-black shadow-xl shadow-dz-green/20">
                  <PlusCircle size={20} />
                  <span className="hidden sm:inline">أضف إعلان</span>
                </Link>
                <Link to="/profile" className="p-3 text-slate-600 hover:bg-slate-100 rounded-2xl transition-all group">
                  <User size={22} className="group-hover:scale-110 transition-transform" />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-dz-red/10 text-dz-red px-4 py-2.5 rounded-2xl hover:bg-dz-red hover:text-white transition-all font-black text-sm group"
                  title="تسجيل الخروج"
                >
                  <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                  <span className="hidden lg:inline">خروج</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-dz-green text-white px-8 py-3 rounded-2xl hover:bg-dz-green/90 transition-all font-black shadow-xl shadow-dz-green/20">
                دخول / تسجيل
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
