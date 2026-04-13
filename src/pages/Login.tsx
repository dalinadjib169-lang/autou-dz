import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/src/firebase';
import { signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ShinyText } from '@/src/components/ShinyText';
import { Mail, Lock, User, Phone, MapPin, ArrowRight } from 'lucide-react';
import { ALGERIA_WILAYAS } from '@/src/lib/utils';

export const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ')[1] || '',
          email: user.email,
          photoURL: user.photoURL,
          wilaya: '',
          phone: '',
          role: 'user',
          rating: 5,
          ratingCount: 0,
          createdAt: new Date().toISOString()
        });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          firstName,
          lastName,
          email,
          phone,
          wilaya,
          role: 'user',
          rating: 5,
          ratingCount: 0,
          createdAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
        <div className="p-8 text-center bg-slate-900 text-white relative">
          <div className="absolute top-4 left-4">
            <span className="text-2xl">🇩🇿</span>
          </div>
          <h1 className="text-3xl font-black mb-2 tracking-tighter">atou dz</h1>
          <p className="text-slate-400 text-sm">أهلاً بك في أكبر سوق للسيارات في الجزائر</p>
          <div className="mt-4 flex justify-center gap-2">
            <ShinyText text="بسم الله الرحمن الرحيم" className="text-[10px] py-0.5" />
          </div>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-dz-red p-3 rounded-xl text-sm mb-6 font-medium border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isRegister && (
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text" placeholder="الاسم" required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors text-sm"
                    value={firstName} onChange={e => setFirstName(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text" placeholder="اللقب" required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors text-sm"
                    value={lastName} onChange={e => setLastName(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="email" placeholder="البريد الإلكتروني" required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors text-sm"
                value={email} onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
              <input 
                type="password" placeholder="كلمة المرور" required
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors text-sm"
                value={password} onChange={e => setPassword(e.target.value)}
              />
            </div>

            {isRegister && (
              <>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="tel" placeholder="رقم الهاتف" required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors text-sm"
                    value={phone} onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                  <select 
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors text-sm appearance-none"
                    value={wilaya} onChange={e => setWilaya(e.target.value)}
                  >
                    <option value="">اختر الولاية</option>
                    {ALGERIA_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </>
            )}

            <button 
              type="submit" disabled={loading}
              className="w-full bg-dz-green text-white py-4 rounded-xl font-bold hover:bg-dz-green/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{isRegister ? 'إنشاء حساب' : 'تسجيل الدخول'}</span>
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-2 text-slate-400">أو عبر</span></div>
          </div>

          <button 
            onClick={handleGoogleLogin} disabled={loading}
            className="w-full bg-white border border-slate-200 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/pjax/google.png" className="w-5 h-5" alt="Google" />
            <span>تسجيل الدخول عبر Google</span>
          </button>

          <p className="mt-8 text-center text-sm text-slate-500">
            {isRegister ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}
            <button 
              onClick={() => setIsRegister(!isRegister)}
              className="mr-1 text-dz-green font-bold hover:underline"
            >
              {isRegister ? 'سجل دخولك' : 'أنشئ حساباً جديداً'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
