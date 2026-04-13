import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { auth, db } from '@/src/firebase';
import { collection, query, where, onSnapshot, addDoc, orderBy, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { ChatThread, Message } from '@/src/types';
import { Send, User, ArrowRight, Loader2, MessageCircle } from 'lucide-react';

export const Messages: React.FC = () => {
  const [user] = useAuthState(auth);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const carId = searchParams.get('carId');
  const sellerId = searchParams.get('sellerId');
  const initialMessage = searchParams.get('message');

  const [chats, setChats] = useState<ChatThread[]>([]);
  const [activeChat, setActiveChat] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const threads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatThread));
      setChats(threads);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!activeChat) return;

    const q = query(
      collection(db, `chats/${activeChat.id}/messages`),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Message)));
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [activeChat]);

  useEffect(() => {
    const initChat = async () => {
      if (!user || !carId || !sellerId || user.uid === sellerId) return;

      // Check if chat already exists
      const existingChat = chats.find(c => c.carId === carId && c.participants.includes(sellerId));
      if (existingChat) {
        setActiveChat(existingChat);
        if (initialMessage) {
          // Send initial message if it doesn't exist in the last few messages
          // This is a simplified check
          setNewMessage(initialMessage);
        }
        return;
      }

      // Create new chat
      const chatId = [user.uid, sellerId].sort().join('_') + '_' + carId;
      const chatRef = doc(db, 'chats', chatId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        await setDoc(chatRef, {
          participants: [user.uid, sellerId],
          carId,
          lastMessage: initialMessage || '',
          updatedAt: new Date().toISOString()
        });

        if (initialMessage) {
          await addDoc(collection(db, `chats/${chatId}/messages`), {
            chatId,
            senderId: user.uid,
            text: initialMessage,
            createdAt: new Date().toISOString()
          });
        }
      }
      
      const newChat = { id: chatId, participants: [user.uid, sellerId], carId, lastMessage: initialMessage || '', updatedAt: new Date().toISOString() };
      setActiveChat(newChat);
      if (initialMessage) {
        // Clear message param from URL to prevent re-sending on refresh
        navigate('/messages', { replace: true });
      }
    };

    if (!loading) initChat();
  }, [user, carId, sellerId, loading, chats, initialMessage]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeChat || !newMessage.trim()) return;

    const text = newMessage;
    setNewMessage('');

    try {
      await addDoc(collection(db, `chats/${activeChat.id}/messages`), {
        chatId: activeChat.id,
        senderId: user.uid,
        text,
        createdAt: new Date().toISOString()
      });

      await setDoc(doc(db, 'chats', activeChat.id), {
        lastMessage: text,
        updatedAt: new Date().toISOString()
      }, { merge: true });
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
    <div className="max-w-7xl mx-auto px-4 py-8 h-[calc(100vh-120px)]">
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden h-full flex">
        {/* Sidebar */}
        <div className="w-full md:w-80 border-l border-slate-100 flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-xl font-black text-slate-900 tracking-tighter">المحادثات</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 && !loading && (
              <div className="p-8 text-center text-slate-400 text-sm">
                لا توجد محادثات حالياً
              </div>
            )}
            {chats.map(chat => (
              <button 
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors border-b border-slate-50 ${activeChat?.id === chat.id ? 'bg-dz-green/5 border-r-4 border-r-dz-green' : ''}`}
              >
                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 flex-shrink-0">
                  <User size={24} />
                </div>
                <div className="text-right overflow-hidden">
                  <h4 className="font-bold text-slate-900 text-sm truncate">محادثة الإعلان</h4>
                  <p className="text-xs text-slate-500 truncate">{chat.lastMessage || 'بدء المحادثة...'}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="hidden md:flex flex-1 flex-col bg-slate-50">
          {activeChat ? (
            <>
              <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                    <User size={20} />
                  </div>
                  <h3 className="font-bold text-slate-900">محادثة</h3>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === user.uid ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-4 rounded-2xl text-sm shadow-sm ${msg.senderId === user.uid ? 'bg-dz-green text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none'}`}>
                      <p>{msg.text}</p>
                      <span className={`text-[10px] mt-1 block ${msg.senderId === user.uid ? 'text-white/70' : 'text-slate-400'}`}>
                        {new Date(msg.createdAt).toLocaleTimeString('ar-DZ', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-4">
                <input 
                  type="text" 
                  placeholder="اكتب رسالتك..."
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-dz-green transition-colors"
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                />
                <button className="bg-dz-green text-white p-3 rounded-xl hover:bg-dz-green/90 transition-all shadow-lg">
                  <Send size={20} />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
              <MessageCircle size={64} className="mb-4 opacity-20" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">اختر محادثة للبدء</h3>
              <p className="text-sm">تواصل مع البائعين والمشترين بكل سهولة وأمان</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
