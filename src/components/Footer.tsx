import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-slate-800 pb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🇩🇿</span>
              <span className="text-2xl font-black text-white tracking-tighter">atou dz</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              المنصة الجزائرية الأولى لبيع وشراء السيارات. نحن نربط بين البائع والمشتري في جميع ولايات الوطن بكل أمان وسهولة.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">روابط سريعة</h3>
            <ul className="space-y-2 text-slate-400 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">عن المنصة</a></li>
              <li><a href="#" className="hover:text-white transition-colors">شروط الاستخدام</a></li>
              <li><a href="#" className="hover:text-white transition-colors">سياسة الخصوصية</a></li>
              <li><a href="#" className="hover:text-white transition-colors">اتصل بنا</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">تواصل معنا</h3>
            <p className="text-slate-400 text-sm mb-2">البريد الإلكتروني: contact@atoudz.com</p>
            <p className="text-slate-400 text-sm">الهاتف: +213 (0) 555 00 00 00</p>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} atou dz. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
            <span>Developed by</span>
            <span className="text-white font-bold">Dali Nadjib</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
