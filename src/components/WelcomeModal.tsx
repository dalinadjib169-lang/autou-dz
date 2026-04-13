import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShinyText } from './ShinyText';
import { ShieldAlert, CheckCircle } from 'lucide-react';

export const WelcomeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenWelcome');
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm"
          dir="rtl"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100"
          >
            <div className="bg-dz-green p-8 text-center text-white relative">
              <div className="absolute top-4 left-4 text-2xl">🇩🇿</div>
              <h2 className="text-2xl font-black mb-2 tracking-tighter">atou dz</h2>
              <ShinyText text="بسم الله الرحمن الرحيم" className="text-xs py-1" />
            </div>

            <div className="p-8 text-center">
              <div className="bg-yellow-50 p-6 rounded-2xl border border-yellow-100 mb-6">
                <ShieldAlert className="mx-auto text-yellow-600 mb-3" size={40} />
                <h3 className="text-xl font-bold text-slate-900 mb-4">نصيحة دينية قبل البدء</h3>
                <p className="text-slate-700 leading-relaxed font-medium italic">
                  "من غشنا فليس منا"
                </p>
                <p className="text-slate-500 text-sm mt-2">
                  صدق رسول الله ﷺ. التجارة أمانة، والصدق في وصف السيارة يبارك لك في رزقك.
                </p>
              </div>

              <p className="text-slate-600 text-sm mb-8">
                أهلاً بك في منصة <span className="font-bold text-dz-green">atou dz</span>. نرجو من جميع المستخدمين تحري الصدق والأمانة في عرض سياراتهم وتجنب الغش في الكيلومتراج أو حالة المحرك أو الهيكل.
              </p>

              <button 
                onClick={handleClose}
                className="w-full bg-dz-green text-white py-4 rounded-2xl font-bold hover:bg-dz-green/90 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle size={20} />
                <span>أوافق وأتعهد بالصدق</span>
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
