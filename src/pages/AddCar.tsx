import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '@/src/firebase';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { uploadImage } from '@/src/lib/cloudinary';
import { ALGERIA_WILAYAS, ENGINE_STATES, BODY_TERMS, CAR_BRANDS, YEARS } from '@/src/lib/utils';
import { Camera, X, Loader2, AlertCircle, ChevronDown, Plus } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export const AddCar: React.FC = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [bidPrice, setBidPrice] = useState(''); // ساموني
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState(new Date().getFullYear());
  const [mileage, setMileage] = useState('');
  const [condition, setCondition] = useState('good');
  const [engine, setEngine] = useState('Essence');
  const [gearbox, setGearbox] = useState('Manuelle');
  const [engineState, setEngineState] = useState('perfect');
  const [bodyState, setBodyState] = useState('');
  const [wilaya, setWilaya] = useState('');
  const [replacedParts, setReplacedParts] = useState('');
  const [showPhone, setShowPhone] = useState(true);
  
  const [images, setImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const [customBrand, setCustomBrand] = useState(false);
  const [customModel, setCustomModel] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    if (images.length + acceptedFiles.length > 10) {
      setError('يمكنك رفع 10 صور كحد أقصى');
      return;
    }
    setImages([...images, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop, 
    accept: { 'image/*': [] },
    maxFiles: 10 
  });

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (images.length === 0) {
      setError('يرجى إضافة صورة واحدة على الأقل');
      return;
    }

    setUploading(true);
    setError('');

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      const imageUrls = await Promise.all(images.map(file => uploadImage(file)));

      await addDoc(collection(db, 'cars'), {
        title,
        description,
        price: Number(price),
        bidPrice: bidPrice ? Number(bidPrice) : null,
        brand,
        model,
        year: Number(year),
        mileage: mileage ? Number(mileage) : null,
        condition,
        engine,
        gearbox,
        engineState,
        bodyState,
        wilaya,
        replacedParts,
        images: imageUrls,
        sellerId: user.uid,
        sellerName: `${userData?.firstName} ${userData?.lastName}`,
        sellerPhone: userData?.phone || '',
        showPhone,
        isVerified: false,
        status: 'active',
        createdAt: new Date().toISOString()
      });

      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const selectedBrandData = CAR_BRANDS.find(b => b.name === brand);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <AlertCircle size={48} className="mx-auto text-dz-red mb-4" />
        <h2 className="text-2xl font-bold mb-4">يجب تسجيل الدخول أولاً</h2>
        <button onClick={() => navigate('/login')} className="bg-dz-green text-white px-8 py-3 rounded-xl font-bold">
          تسجيل الدخول
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tighter">أضف سيارة للبيع</h1>
        <div className="flex items-center gap-2 bg-yellow-50 text-yellow-700 px-4 py-2 rounded-xl text-xs font-bold border border-yellow-100">
          <AlertCircle size={16} />
          <span>تذكر: الصدق في الوصف يبارك في الرزق</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-dz-red p-4 rounded-2xl mb-8 flex items-center gap-3 border border-red-100 font-medium">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Image Upload */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <h2 className="text-xl font-bold mb-6">صور السيارة (حتى 10 صور)</h2>
          
          <div {...getRootProps()} className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${isDragActive ? 'border-dz-green bg-dz-green/5' : 'border-slate-200 hover:border-dz-green'}`}>
            <input {...getInputProps()} />
            <Camera size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">اسحب الصور هنا أو اضغط للاختيار</p>
            <p className="text-slate-400 text-xs mt-2">JPG, PNG كحد أقصى 5 ميجابايت للصورة</p>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8">
              {images.map((file, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                  <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-dz-red text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">عنوان الإعلان</label>
            <input 
              type="text" required placeholder="مثال: تويوتا هيلوكس 2022 بحالة ممتازة"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors"
              value={title} onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الماركة</label>
            {!customBrand ? (
              <div className="relative">
                <select 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors appearance-none"
                  value={brand} onChange={e => {
                    if (e.target.value === 'custom') {
                      setCustomBrand(true);
                      setBrand('');
                    } else {
                      setBrand(e.target.value);
                    }
                  }}
                >
                  <option value="">اختر الماركة</option>
                  {CAR_BRANDS.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
                  <option value="custom">+ ماركة أخرى (كتابة يدوية)</option>
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="text" required placeholder="اكتب الماركة هنا"
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors"
                  value={brand} onChange={e => setBrand(e.target.value)}
                />
                <button type="button" onClick={() => setCustomBrand(false)} className="p-3 bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الموديل</label>
            {!customModel && selectedBrandData ? (
              <div className="relative">
                <select 
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors appearance-none"
                  value={model} onChange={e => {
                    if (e.target.value === 'custom') {
                      setCustomModel(true);
                      setModel('');
                    } else {
                      setModel(e.target.value);
                    }
                  }}
                >
                  <option value="">اختر الموديل</option>
                  {selectedBrandData.models.map(m => <option key={m} value={m}>{m}</option>)}
                  <option value="custom">+ موديل آخر (كتابة يدوية)</option>
                </select>
                <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
              </div>
            ) : (
              <div className="flex gap-2">
                <input 
                  type="text" required placeholder="اكتب الموديل هنا"
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors"
                  value={model} onChange={e => setModel(e.target.value)}
                />
                {selectedBrandData && (
                  <button type="button" onClick={() => setCustomModel(false)} className="p-3 bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">السعر المطلوب (دج)</label>
            <input 
              type="number" required placeholder="مثال: 4500000"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors"
              value={price} onChange={e => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">ساموني (اختياري)</label>
            <input 
              type="number" placeholder="المبلغ الذي عُرض عليك"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors"
              value={bidPrice} onChange={e => setBidPrice(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">الولاية</label>
            <div className="relative">
              <select 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors appearance-none"
                value={wilaya} onChange={e => setWilaya(e.target.value)}
              >
                <option value="">اختر الولاية</option>
                {ALGERIA_WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
              <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <input 
              type="checkbox" id="showPhone"
              className="w-5 h-5 accent-dz-green cursor-pointer"
              checked={showPhone} onChange={e => setShowPhone(e.target.checked)}
            />
            <label htmlFor="showPhone" className="text-sm font-bold text-slate-700 cursor-pointer">إظهار رقم الهاتف للجميع</label>
          </div>
        </div>

        {/* Technical Details */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">سنة الصنع</label>
            <div className="relative">
              <select 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors appearance-none"
                value={year} onChange={e => setYear(Number(e.target.value))}
              >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">المسافة المقطوعة (كم)</label>
            <input 
              type="number" placeholder="اختياري"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors"
              value={mileage} onChange={e => setMileage(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">نوع المحرك</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors"
              value={engine} onChange={e => setEngine(e.target.value as any)}
            >
              <option value="Essence">Essence</option>
              <option value="Diesel">Diesel</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">علبة السرعات</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors"
              value={gearbox} onChange={e => setGearbox(e.target.value as any)}
            >
              <option value="Manuelle">Manuelle</option>
              <option value="Automatique">Automatique</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">حالة المحرك (يسخن/ينقص)</label>
            <select 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors"
              value={engineState} onChange={e => setEngineState(e.target.value as any)}
            >
              {ENGINE_STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">حالة الهيكل (المعاودة)</label>
            <div className="flex gap-2">
              <select 
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors"
                value={bodyState} onChange={e => setBodyState(e.target.value)}
              >
                <option value="">اختر أو اكتب يدوياً</option>
                {BODY_TERMS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input 
                type="text" placeholder="أو اكتب هنا..."
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors"
                value={bodyState} onChange={e => setBodyState(e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-slate-700 mb-2">وصف إضافي</label>
            <textarea 
              rows={4} placeholder="اكتب تفاصيل أكثر عن السيارة..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors resize-none"
              value={description} onChange={e => setDescription(e.target.value)}
            />
          </div>
        </div>

        <button 
          type="submit" disabled={uploading}
          className="w-full bg-dz-green text-white py-5 rounded-2xl font-black text-xl hover:bg-dz-green/90 transition-all shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin" />
              <span>جاري الرفع...</span>
            </>
          ) : (
            <span>نشر الإعلان</span>
          )}
        </button>
      </form>
    </div>
  );
};
