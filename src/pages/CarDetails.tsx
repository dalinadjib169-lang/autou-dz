import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { auth, db } from '@/src/firebase';
import { CarListing, Comment } from '@/src/types';
import { formatPrice } from '@/src/lib/utils';
import { MapPin, Calendar, Gauge, ShieldCheck, Phone, MessageCircle, User, Star, Send, ChevronRight, ChevronLeft } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';

export const CarDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [car, setCar] = useState<CarListing | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchCar = async () => {
      const docRef = doc(db, 'cars', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCar({ id: docSnap.id, ...docSnap.data() } as CarListing);
      }
      setLoading(false);
    };

    fetchCar();

    const q = query(collection(db, 'comments'), where('carId', '==', id), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setComments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Comment)));
    });

    return () => unsubscribe();
  }, [id]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim() || !id) return;

    try {
      await addDoc(collection(db, 'comments'), {
        carId: id,
        userId: user.uid,
        userName: user.displayName || 'مستخدم',
        text: newComment,
        createdAt: new Date().toISOString()
      });
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const startChat = async (initialMessage?: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!car || car.sellerId === user.uid) return;

    // Simplified chat start: just navigate to messages with car info
    navigate(`/messages?carId=${car.id}&sellerId=${car.sellerId}${initialMessage ? `&message=${encodeURIComponent(initialMessage)}` : ''}`);
  };

  const handleGetPhone = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    startChat('السلام عليكم، لقد طلبت رقم هاتفك بخصوص إعلان السيارة.');
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">جاري التحميل...</div>;
  if (!car) return <div className="max-w-7xl mx-auto px-4 py-20 text-center">الإعلان غير موجود</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Images & Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm relative">
            <div className="aspect-video relative">
              <img 
                src={car.images[activeImage]} 
                className="w-full h-full object-cover" 
                alt={car.title}
                referrerPolicy="no-referrer"
              />
              {car.images.length > 1 && (
                <>
                  <button 
                    onClick={() => setActiveImage((prev) => (prev === 0 ? car.images.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-all"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button 
                    onClick={() => setActiveImage((prev) => (prev === car.images.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-all"
                  >
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
            </div>
            <div className="p-4 flex gap-2 overflow-x-auto">
              {car.images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === i ? 'border-dz-green' : 'border-transparent opacity-60'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">{car.title}</h1>
                <div className="flex items-center gap-6 text-slate-500">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-dz-green" />
                    <span className="font-medium">{car.wilaya}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-dz-green" />
                    <span className="font-medium">{car.year}</span>
                  </div>
                  {car.mileage && (
                    <div className="flex items-center gap-2">
                      <Gauge size={18} className="text-dz-green" />
                      <span className="font-medium">{car.mileage.toLocaleString()} كم</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-left">
                <div className="text-3xl font-black text-dz-green">{formatPrice(car.price)}</div>
                {car.bidPrice && (
                  <div className="text-sm font-bold text-slate-400 mt-1">
                    ساموني: <span className="text-dz-red">{formatPrice(car.bidPrice)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <h3 className="text-xl font-bold mb-4">وصف السيارة</h3>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{car.description}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-10 p-6 bg-slate-50 rounded-2xl">
              <div>
                <span className="block text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">المحرك</span>
                <span className="font-bold text-slate-900">{car.engine}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">علبة السرعات</span>
                <span className="font-bold text-slate-900">{car.gearbox}</span>
              </div>
              <div>
                <span className="block text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">حالة المحرك</span>
                <span className="font-bold text-slate-900">
                  {car.engineState === 'perfect' ? 'ما ينقص' : car.engineState === 'consumes_little' ? 'ينقص شوي' : car.engineState === 'consumes' ? 'ينقص' : 'يسخن'}
                </span>
              </div>
              <div className="col-span-full">
                <span className="block text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">حالة الهيكل (المعاودة)</span>
                <span className="font-bold text-slate-900">{car.bodyState || 'نقية'}</span>
              </div>
              {car.replacedParts && (
                <div className="col-span-full">
                  <span className="block text-xs text-slate-400 font-bold mb-1 uppercase tracking-wider">أجزاء مبدلة</span>
                  <span className="font-bold text-slate-900">{car.replacedParts}</span>
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold mb-6">التعليقات ({comments.length})</h3>
            
            {user ? (
              <form onSubmit={handleAddComment} className="flex gap-4 mb-8">
                <input 
                  type="text" 
                  placeholder="اكتب تعليقك هنا..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors"
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                />
                <button className="bg-dz-green text-white p-3 rounded-xl hover:bg-dz-green/90 transition-all">
                  <Send size={20} />
                </button>
              </form>
            ) : (
              <p className="text-slate-500 text-sm mb-8">يرجى تسجيل الدخول لإضافة تعليق</p>
            )}

            <div className="space-y-6">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                    <User size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-sm">{comment.userName}</span>
                      <span className="text-[10px] text-slate-400">{new Date(comment.createdAt).toLocaleDateString('ar-DZ')}</span>
                    </div>
                    <p className="text-slate-600 text-sm">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Seller Info & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl sticky top-24">
            <div className="text-center mb-8">
              <span className="text-4xl font-black text-dz-green block mb-2">{formatPrice(car.price)}</span>
              {car.bidPrice && (
                <div className="inline-flex items-center gap-1.5 bg-dz-red/10 text-dz-red px-3 py-1 rounded-full text-xs font-bold mb-2">
                  <span>ساموني: {formatPrice(car.bidPrice)}</span>
                </div>
              )}
              {car.isVerified && (
                <div className="inline-flex items-center gap-1.5 bg-dz-green/10 text-dz-green px-3 py-1 rounded-full text-xs font-bold">
                  <ShieldCheck size={14} />
                  <span>سيارة موثقة</span>
                </div>
              )}
            </div>

            <div className="border-t border-slate-100 pt-8 mb-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                  <User size={28} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">{car.sellerName}</h4>
                  <div className="flex items-center gap-1 text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <Star size={14} fill="currentColor" />
                    <span className="text-slate-400 text-xs mr-1">(5.0)</span>
                  </div>
                </div>
              </div>
              <p className="text-slate-500 text-xs mb-6">عضو منذ {new Date(car.createdAt).getFullYear()}</p>
              
              <div className="space-y-3">
                {car.showPhone ? (
                  <a 
                    href={`tel:${car.sellerPhone}`}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg"
                  >
                    <Phone size={20} />
                    <span>{car.sellerPhone}</span>
                  </a>
                ) : (
                  <button 
                    onClick={handleGetPhone}
                    className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-lg"
                  >
                    <Phone size={20} />
                    <span>طلب رقم الهاتف</span>
                  </button>
                )}
                <button 
                  onClick={() => startChat()}
                  className="w-full bg-white border-2 border-dz-green text-dz-green py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-dz-green/5 transition-all"
                >
                  <MessageCircle size={20} />
                  <span>مراسلة البائع</span>
                </button>
              </div>
            </div>

            <div className="bg-dz-green/5 p-4 rounded-2xl">
              <p className="text-[10px] text-dz-green font-bold leading-relaxed text-center">
                نصيحة: لا تقم بتحويل أي مبالغ مالية مسبقاً. قم بمعاينة السيارة شخصياً قبل إتمام عملية الشراء.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
