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
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🇩🇿</span>
              <span className="text-xl font-black text-dz-green tracking-tighter">atou dz</span>
            </Link>
            <div className="hidden md:flex items-center gap-4">
              <ShinyText text="بسم الله الرحمن الرحيم" className="text-xs py-0.5" />
              <ShinyText text="ﷺ" className="text-xs py-0.5 px-2" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/search" className="text-slate-600 hover:text-dz-green font-medium transition-colors">
              تصفح السيارات
            </Link>
            
            {user ? (
              <>
                <Link to="/messages" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors relative">
                  <MessageSquare size={20} />
                </Link>
                <Link to="/add-car" className="flex items-center gap-2 bg-dz-green text-white px-4 py-2 rounded-lg hover:bg-dz-green/90 transition-all font-bold shadow-sm">
                  <PlusCircle size={18} />
                  <span className="hidden sm:inline">أضف إعلان</span>
                </Link>
                <Link to="/profile" className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                  <User size={20} />
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-slate-600 hover:bg-red-50 hover:text-dz-red rounded-full transition-colors"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/login" className="bg-dz-green text-white px-6 py-2 rounded-lg hover:bg-dz-green/90 transition-all font-bold shadow-sm">
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
