
import React, { useState, useMemo, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import ProductCard from './components/ProductCard';
import AgriAuraChat from './components/AgriAuraChat';
import { Product, CartItem, AppTab, User, Order } from './types';
import { PRODUCTS, CATEGORIES, OFFERS, Offer } from './constants.tsx';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Shop);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [pendingCart, setPendingCart] = useState<CartItem[]>([]); 
  const [showCart, setShowCart] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOrdering, setIsOrdering] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [lastOrderId, setLastOrderId] = useState('');
  
  const [currentOfferIndex, setCurrentOfferIndex] = useState(0);
  const [appliedVoucher, setAppliedVoucher] = useState<Offer | null>(null);
  const offerIntervalRef = useRef<number | null>(null);

  const [loginName, setLoginName] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginDistrict, setLoginDistrict] = useState('');
  const [loginTaluk, setLoginTaluk] = useState('');
  const [loginPlace, setLoginPlace] = useState('');
  const [buyerType, setBuyerType] = useState<'Home' | 'Bulk'>('Home');
  const [isMapping, setIsMapping] = useState(false);

  const [editingField, setEditingField] = useState<keyof User | null>(null);
  const [editValue, setEditValue] = useState('');

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('4:00 AM');

  const TIME_SLOTS = [
    { label: 'Early Bird', time: '4:00 AM', icon: '🌅' },
    { label: 'Morning', time: '11:00 AM', icon: '☀️' },
    { label: 'Afternoon', time: '3:00 PM', icon: '🌤️' }
  ];

  useEffect(() => {
    if (activeTab === AppTab.Shop && !showCart && !showProfile) {
      offerIntervalRef.current = window.setInterval(() => {
        setCurrentOfferIndex(prev => (prev + 1) % OFFERS.length);
      }, 3000); 
    }
    return () => {
      if (offerIntervalRef.current) clearInterval(offerIntervalRef.current);
    };
  }, [activeTab, showCart, showProfile]);

  const deliveryDates = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 4; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        full: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
        day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        date: d.getDate()
      });
    }
    return dates;
  }, []);

  useEffect(() => {
    if (!selectedDate && deliveryDates.length > 0) {
      setSelectedDate(deliveryDates[0].full);
    }
  }, [deliveryDates, selectedDate]);

  const handleAutoMapping = (isProfile: boolean = false) => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    setIsMapping(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`, {
            headers: {
              'Accept-Language': 'en-US,en;q=0.9'
            }
          });
          const data = await response.json();
          
          const address = data.address || {};
          const district = address.state_district || address.city || address.county || 'Chennai Central';
          const taluk = address.suburb || address.neighbourhood || address.town || 'Egmore Hub';
          const place = data.display_name || `Geo-Mapped: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
          if (isProfile) {
            setUser(prev => prev ? { ...prev, district, taluk, place } : null);
          } else {
            setLoginDistrict(district);
            setLoginTaluk(taluk);
            setLoginPlace(place);
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          const fallbackPlace = `Geo-Mapped: ${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`;
          if (isProfile) {
            setUser(prev => prev ? { ...prev, place: fallbackPlace } : null);
          } else {
            setLoginPlace(fallbackPlace);
          }
        } finally {
          setIsMapping(false);
        }
      },
      () => { 
        setIsMapping(false); 
        alert("Access denied or location unavailable."); 
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const categoryMatch = selectedCategory === 'All' || p.category === selectedCategory;
      const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      return categoryMatch && searchMatch;
    });
  }, [selectedCategory, searchQuery]);

  // Frequently ordered products for Bulk Buyers
  const bulkFrequentItems = useMemo(() => {
    const ids = ['v5', 's1', 'd1', 'v1', 's2']; // Russet Potatoes, Basmati Rice, Cow Milk, Tomatoes, Sona Masuri Rice
    return PRODUCTS.filter(p => ids.includes(p.id));
  }, []);

  const incrementValue = user?.buyerType === 'Bulk' ? 5 : 1;

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + incrementValue } : item);
      }
      return [...prev, { ...product, quantity: incrementValue }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const item = prev.find(i => i.id === id);
      if (item && item.quantity > incrementValue) {
        return prev.map(i => i.id === id ? { ...i, quantity: i.quantity - incrementValue } : i);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const deleteFromCart = (id: string) => {
    setCart(prev => prev.filter(i => i.id !== id));
    setPendingCart(prev => prev.filter(i => i.id !== id));
  };

  const handleQuickBuy = (product: Product) => {
    addToCart(product);
    setShowCart(true);
  };

  const handleOfferClaim = (offer: Offer) => {
    setAppliedVoucher(offer);
    if (offer.targetCategory) {
      const product = PRODUCTS.find(p => p.category === offer.targetCategory);
      if (product) addToCart(product);
    }
    setShowCart(true);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: loginName, email: loginEmail, phone: loginPhone, state: 'Tamil Nadu',
      district: loginDistrict, taluk: loginTaluk, place: loginPlace, buyerType: buyerType
    });
  };

  const handleSaveField = () => {
    if (!user || !editingField) return;
    setUser({ ...user, [editingField]: editValue });
    setEditingField(null);
  };

  const uniqueCartCount = cart.length;

  const allDisplayItems = [...cart, ...pendingCart];
  const rawTotal = allDisplayItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = appliedVoucher ? (rawTotal > 0 ? Math.floor(rawTotal * 0.15) : 0) : 0; 
  const finalTotal = Math.max(0, rawTotal - discountAmount);

  const commitPending = () => {
    if (pendingCart.length > 0) {
      setCart(prev => {
        let updated = [...prev];
        pendingCart.forEach(pItem => {
          const existing = updated.find(i => i.id === pItem.id);
          if (existing) {
            updated = updated.map(i => i.id === pItem.id ? { ...i, quantity: i.quantity + pItem.quantity } : i);
          } else {
            updated.push(pItem);
          }
        });
        return updated;
      });
      setPendingCart([]);
    }
  };

  const handleCloseCartDrawer = () => {
    setPendingCart([]);
    setShowCart(false);
    setActiveTab(AppTab.Shop);
  };

  const placeOrder = () => {
    const itemsToOrder = [...cart];
    pendingCart.forEach(pItem => {
      const existing = itemsToOrder.find(i => i.id === pItem.id);
      if (existing) {
        existing.quantity += pItem.quantity;
      } else {
        itemsToOrder.push(pItem);
      }
    });

    if (itemsToOrder.length === 0) return;
    setIsOrdering(true);
    setTimeout(() => {
      const newOrderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
      const newOrder: Order = {
        id: newOrderId,
        items: itemsToOrder,
        total: finalTotal,
        date: new Date(),
        status: 'Processing',
        address: `${user?.place}, ${user?.district}`,
        estimatedDelivery: `Scheduled: ${selectedDate} at ${selectedSlot}`
      };
      setOrders(prev => [newOrder, ...prev]);
      setCart([]);
      setPendingCart([]);
      setAppliedVoucher(null);
      setShowCart(false);
      setIsOrdering(false);
      setLastOrderId(newOrderId);
      setShowSuccessNotification(true);
      setActiveTab(AppTab.Orders);
      
      setTimeout(() => setShowSuccessNotification(false), 4000);
    }, 1500);
  };

  const handleReorderItem = (product: Product) => {
    setPendingCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      const qty = incrementValue;
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prev, { ...product, quantity: qty }];
    });
    setShowCart(true);
  };

  const handleAddBasketAll = (items: CartItem[]) => {
    setPendingCart(prev => {
      let updated = [...prev];
      items.forEach(newItem => {
        const existing = updated.find(i => i.id === newItem.id);
        if (existing) {
          updated = updated.map(i => i.id === newItem.id ? { ...i, quantity: i.quantity + newItem.quantity } : i);
        } else {
          updated.push(newItem);
        }
      });
      return updated;
    });
    setShowCart(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-6 text-stone-900 font-['Outfit']">
        <div className="bg-white max-w-xl w-full rounded-[3.5rem] shadow-2xl overflow-hidden border border-stone-100 animate-popIn">
          <div className="bg-emerald-600 p-12 text-center text-white relative">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
             <h1 className="text-4xl font-black italic tracking-tighter relative z-10">Agri Aura</h1>
             <p className="text-emerald-100 text-[10px] font-black uppercase tracking-[0.4em] mt-3 relative z-10">Direct Farm Network</p>
          </div>
          <form onSubmit={handleLogin} className="p-12 space-y-7">
            <div className="flex bg-stone-100 p-1.5 rounded-3xl border border-stone-200 gap-2">
              <button type="button" onClick={() => setBuyerType('Home')} className={`flex-1 py-4 rounded-2xl text-xs font-black transition-all ${buyerType === 'Home' ? 'bg-white text-emerald-700 shadow-md' : 'text-stone-400'}`}>HOME BUYER</button>
              <button type="button" onClick={() => setBuyerType('Bulk')} className={`flex-1 py-4 rounded-2xl text-xs font-black transition-all ${buyerType === 'Bulk' ? 'bg-white text-green-800 shadow-md' : 'text-stone-400'}`}>BULK BUYER</button>
            </div>
            <div className="space-y-4">
              <input required type="text" value={loginName} onChange={(e) => setLoginName(e.target.value)} placeholder="Full Name / Business" className="w-full px-7 py-5 bg-stone-50 border border-stone-200 rounded-[1.5rem] font-bold text-black outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all" />
              <div className="grid grid-cols-2 gap-4">
                <input required type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="Email" className="w-full px-7 py-5 bg-stone-50 border border-stone-200 rounded-[1.5rem] font-bold text-black outline-none transition-all" />
                <input required type="tel" value={loginPhone} onChange={(e) => setLoginPhone(e.target.value)} placeholder="Phone" className="w-full px-7 py-5 bg-stone-50 border border-stone-200 rounded-[1.5rem] font-bold text-black outline-none transition-all" />
              </div>
            </div>
            <div className="pt-6 border-t border-stone-100 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Delivery Details</h3>
                <button type="button" onClick={() => handleAutoMapping(false)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[10px] font-black transition-all border ${isMapping ? 'bg-emerald-50 border-emerald-500 text-emerald-600 animate-pulse' : 'bg-stone-50 border-stone-200 text-stone-500 hover:text-emerald-700 hover:border-emerald-300'}`}>
                   {isMapping ? 'MAPPING...' : 'AUTO-MAP'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input required type="text" value={loginDistrict} onChange={(e) => setLoginDistrict(e.target.value)} placeholder="District" className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl font-bold text-sm text-black" />
                <input required type="text" value={loginTaluk} onChange={(e) => setLoginTaluk(e.target.value)} placeholder="Taluk" className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl font-bold text-sm text-black" />
              </div>
              <input required type="text" value={loginPlace} onChange={(e) => setLoginPlace(e.target.value)} placeholder="Street / Door No / Landmark" className="w-full px-6 py-4 bg-stone-50 border border-stone-200 rounded-2xl font-bold text-sm text-black" />
            </div>
            <button type="submit" className="w-full bg-emerald-700 text-white font-black py-6 rounded-[2rem] shadow-2xl hover:bg-emerald-800 transition-all uppercase tracking-widest text-sm mt-4">Start Shopping</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      cartCount={uniqueCartCount} 
      toggleCart={() => setShowCart(!showCart)} 
      onProfileClick={() => setShowProfile(true)}
    >
      {activeTab === AppTab.Shop && (
        <div className="space-y-8 animate-popIn pb-24 text-stone-900">
          <div className="relative overflow-hidden group rounded-[3rem] shadow-2xl border-4 border-white h-[260px] bg-stone-200">
             <div className="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) h-full" style={{ transform: `translateX(-${currentOfferIndex * 100}%)` }}>
                {OFFERS.map((offer, idx) => (
                  <div key={offer.id} className="w-full shrink-0 h-full relative">
                    <div onClick={() => handleOfferClaim(offer)} className="relative h-full flex flex-col justify-end p-10 md:p-14 text-white overflow-hidden cursor-pointer">
                      <div className="absolute inset-0 z-0">
                        <img src={offer.image} className={`w-full h-full object-cover transition-all duration-[3000ms] ${currentOfferIndex === idx ? 'scale-110' : 'scale-100'}`} alt={offer.title} />
                        <div className={`absolute inset-0 bg-gradient-to-t ${offer.color} opacity-80`}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent"></div>
                      </div>
                      <div className={`relative z-10 transition-all duration-700 ${currentOfferIndex === idx ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}>
                        <span className="inline-block bg-white/20 backdrop-blur-xl px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.4em] mb-4 border border-white/30">LATEST HARVEST</span>
                        <h3 className="text-4xl font-black mb-2 drop-shadow-2xl italic leading-none">{offer.discount}</h3>
                        <p className="text-xl font-black drop-shadow-lg mb-6">{offer.title}</p>
                        <button className="bg-emerald-600 text-white px-10 py-3.5 rounded-2xl font-black text-[10px] tracking-widest shadow-2xl">CLAIM VOUCHER</button>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
             <div className="absolute bottom-0 left-0 w-full h-1.5 bg-black/30 z-30">
                <div key={currentOfferIndex} className="h-full bg-white/70 animate-slideProgress" />
             </div>
          </div>

          <div id="market-grid" className={`${user.buyerType === 'Bulk' ? 'bg-green-950' : 'bg-emerald-950'} rounded-[3rem] p-6 md:p-8 text-white relative shadow-2xl border border-white/10`}>
             <h2 className="text-2xl font-black mb-1 italic leading-none">Vanakkam, {user.name.split(' ')[0]}!</h2>
             <p className="text-white/50 mb-4 font-medium uppercase tracking-[0.2em] text-[9px]">{user.district} Market Hub</p>
             <div className="flex bg-white/10 backdrop-blur-3xl p-1.5 rounded-[1.5rem] border border-white/20 max-w-2xl">
                <div className="flex-1 flex items-center px-4">
                  <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth="2.5"/></svg>
                  <input type="text" placeholder="Search daily harvest..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-transparent border-none focus:ring-0 px-3 py-2 text-white font-black text-sm" />
                </div>
                <button className="bg-white text-emerald-950 px-6 py-2 rounded-xl font-black text-[10px] uppercase hover:bg-emerald-50 transition-all">DISCOVER</button>
             </div>
          </div>

          {/* Frequently Ordered Products - Only for Bulk Buyers */}
          {user.buyerType === 'Bulk' && (
            <div className="bg-white/50 backdrop-blur-xl p-8 rounded-[3rem] border border-stone-200">
               <h3 className="text-xl font-black text-emerald-950 italic tracking-tight mb-6">Frequently Ordered</h3>
               <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                  {bulkFrequentItems.map(item => (
                    <button 
                      key={item.id} 
                      onClick={() => handleQuickBuy(item)}
                      className="flex-shrink-0 group flex items-center gap-4 bg-white p-3 pr-6 rounded-[2rem] border border-stone-100 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all active:scale-95"
                    >
                       <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-md">
                          <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                       </div>
                       <div className="text-left">
                          <p className="text-[13px] font-black text-stone-900 leading-tight mb-0.5">{item.name}</p>
                          <p className="text-[10px] font-bold text-emerald-600 uppercase">₹{item.price * 5} / 5{item.unit.replace(/[0-9.]/g, '')}</p>
                          <span className="text-[8px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full uppercase mt-1 inline-block">Order Again</span>
                       </div>
                    </button>
                  ))}
               </div>
            </div>
          )}

          <div className="sticky top-0 z-40 py-6 -mx-4 px-4 bg-white/95 backdrop-blur-2xl border-b border-stone-200/50 flex gap-4 overflow-x-auto no-scrollbar">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-12 py-4 rounded-2xl text-[10px] font-black tracking-[0.3em] uppercase whitespace-nowrap border-2 ${selectedCategory === cat ? 'bg-emerald-700 text-white border-emerald-700' : 'bg-white text-stone-500 border-stone-100'}`}>
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => {
              const inCartItem = cart.find(i => i.id === product.id);
              return (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  inCartCount={inCartItem?.quantity || 0}
                  onAddToCart={addToCart} 
                  onRemoveFromCart={removeFromCart}
                  onCardClick={() => handleQuickBuy(product)} 
                  buyerType={user.buyerType} 
                />
              );
            })}
          </div>
        </div>
      )}

      {activeTab === AppTab.Expert && (
        <div className="animate-popIn pb-24">
           <AgriAuraChat />
        </div>
      )}

      {activeTab === AppTab.Orders && (
        <div className="space-y-12 animate-popIn pb-24 font-['Outfit']">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-xl border border-stone-100">
            <h2 className="text-4xl font-black italic tracking-tighter text-emerald-900 mb-4 leading-none">Basket History</h2>
            <p className="text-stone-400 font-bold text-xs uppercase tracking-widest">Tracking your farm-to-table journey</p>
          </div>
          
          <div className="space-y-8">
            {orders.length === 0 ? (
              <div className="text-center py-32 bg-stone-100/50 rounded-[4rem] border-2 border-dashed border-stone-200">
                 <p className="text-stone-300 font-black italic text-xl uppercase tracking-tighter">No past baskets found</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-[3rem] shadow-lg border border-stone-100 overflow-hidden group hover:shadow-2xl transition-all">
                  <div className="p-10 flex flex-col md:flex-row justify-between gap-6 border-b border-stone-100 bg-stone-50/50">
                    <div>
                      <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full uppercase mb-3 inline-block leading-none">Basket {order.status}</span>
                      <h3 className="text-2xl font-black text-stone-900 tracking-tighter leading-none">{order.id}</h3>
                      <p className="text-stone-400 text-xs font-bold mt-1">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right flex flex-col items-end">
                       <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest">Total Value</p>
                       <p className="text-4xl font-black text-emerald-800 tracking-tighter leading-none">₹{order.total}</p>
                       <button 
                        onClick={() => handleAddBasketAll(order.items)}
                        className="mt-4 bg-emerald-700 text-white text-[11px] font-black px-8 py-3.5 rounded-2xl uppercase tracking-[0.3em] shadow-2xl hover:bg-emerald-800 active:scale-95 transition-all border-2 border-white/20"
                       >
                         ADD BASKET
                       </button>
                    </div>
                  </div>
                  <div className="p-10 space-y-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {order.items.map(item => (
                          <div 
                            key={item.id} 
                            className="flex flex-col gap-4 bg-stone-50 p-6 rounded-3xl border border-stone-100 hover:border-emerald-300 transition-colors group/item relative"
                          >
                             <div className="flex items-center gap-4">
                               <img src={item.image} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
                               <div className="flex-1">
                                  <p className="font-black text-sm text-stone-900 leading-tight mb-2">{item.name}</p>
                                  <div className="bg-white/70 rounded-xl p-3 border border-stone-200 shadow-inner">
                                    <div className="flex justify-between items-center mb-1 text-[8px] font-black text-stone-400 uppercase tracking-widest">
                                      <span>Weight Ratio</span>
                                      <span className="text-emerald-600">Dynamic Rate</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                      <p className="text-[13px] font-black text-stone-900 leading-none">1{item.unit.replace(/[0-9.]/g, '')} → {item.quantity}{item.unit.replace(/[0-9.]/g, '')}</p>
                                      <p className="text-[13px] font-black text-emerald-800 leading-none">₹{item.price} → ₹{item.price * item.quantity}</p>
                                    </div>
                                  </div>
                               </div>
                             </div>
                             <button 
                               onClick={() => handleReorderItem(item)}
                               className="w-full bg-emerald-600 text-white text-[10px] font-black py-2 rounded-xl uppercase tracking-widest opacity-0 group-hover/item:opacity-100 transition-opacity"
                             >
                               Add to Basket
                             </button>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {showProfile && (
        <div onClick={() => setShowProfile(false)} className="fixed inset-0 z-[120] bg-stone-900/80 backdrop-blur-xl flex items-center justify-center p-6 overflow-y-auto">
          <div onClick={(e) => e.stopPropagation()} className="bg-white max-w-lg w-full rounded-[4rem] overflow-hidden shadow-2xl border border-stone-100 my-auto animate-popIn">
            <div className="bg-emerald-700 p-16 text-white relative">
               <button onClick={() => { setShowProfile(false); setEditingField(null); }} className="absolute top-8 right-8 text-white/50 hover:text-white"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12"/></svg></button>
               <div className="flex items-center gap-8">
                  <div className="w-24 h-24 rounded-3xl border-2 border-white/50 overflow-hidden shadow-2xl"><img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="w-full h-full" /></div>
                  <div><h2 className="text-4xl font-black text-white italic tracking-tighter leading-none">{user.name}</h2><p className="text-emerald-100 font-bold text-[9px] uppercase mt-2">{user.buyerType} ACCESS</p></div>
               </div>
            </div>
            <div className="p-16 space-y-6 bg-white text-black font-['Outfit']">
               <div className="space-y-6">
                  {['name', 'email', 'phone', 'district', 'taluk', 'place'].map((f) => (
                    <ProfileDetailRow 
                      key={f} label={f.toUpperCase()} value={String(user[f as keyof User] || '')} field={f as keyof User}
                      isEditing={editingField === f} onEdit={(field) => { setEditingField(field); setEditValue(String(user[field])); }}
                      onSave={handleSaveField} onCancel={() => setEditingField(null)} editValue={editValue} setEditValue={setEditValue} 
                    />
                  ))}
               </div>
               <button onClick={() => setShowProfile(false)} className="w-full bg-stone-900 text-white py-5 rounded-[2rem] tracking-widest text-[11px] font-black hover:bg-black transition-all">CLOSE PROFILE</button>
            </div>
          </div>
        </div>
      )}

      {showCart && (
        <div onClick={handleCloseCartDrawer} className="fixed inset-0 z-[100] bg-stone-900/60 backdrop-blur-md">
          <div onClick={(e) => e.stopPropagation()} className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-3xl animate-slideLeft flex flex-col">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
              <h2 className="text-xl font-black text-stone-900 tracking-tighter italic uppercase leading-none">Your Cart <span className="text-stone-300 ml-1">({uniqueCartCount})</span></h2>
              <button onClick={handleCloseCartDrawer} className="p-1.5 text-stone-400 bg-white border border-stone-200 rounded-full transition-all hover:rotate-90"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path d="M6 18L18 6M6 6l12 12"/></svg></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {allDisplayItems.length === 0 ? (
                  <div className="text-center py-20"><p className="font-black text-stone-400 italic text-sm">Cart is empty</p></div>
                ) : (
                  <>
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4 p-4 rounded-[2rem] bg-white border border-stone-100 shadow-sm relative group">
                        <button 
                          onClick={() => deleteFromCart(item.id)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                          title="Remove item"
                        >
                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3"/></svg>
                        </button>
                        <img src={item.image} className="w-14 h-14 rounded-2xl object-cover shadow-lg" />
                        <div className="flex-1">
                          <p className="font-black text-stone-900 text-[13px] tracking-tight mb-1 leading-tight">{item.name}</p>
                          <p className="text-[10px] font-bold text-emerald-700 uppercase mb-2">
                            ₹{item.price * item.quantity} / {item.quantity}{item.unit.replace(/[0-9.]/g, '').toUpperCase()}
                          </p>
                          <div className="flex items-center justify-between">
                             <span className="font-black text-emerald-800 text-[15px] tracking-tighter">₹{item.price * item.quantity}</span>
                             <div className="flex items-center gap-3 bg-stone-50 px-3 py-1 rounded-xl border border-stone-200 scale-90">
                                <button onClick={() => removeFromCart(item.id)} className="font-black text-red-500">-</button>
                                <span className="font-black text-xs w-4 text-center">{item.quantity}</span>
                                <button onClick={() => addToCart(item)} className="font-black text-emerald-600">+</button>
                             </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {pendingCart.length > 0 && (
                      <div className="space-y-4 pt-4 border-t-2 border-dashed border-emerald-100">
                        <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest px-2">Staged from History</h3>
                        {pendingCart.map(item => (
                          <div key={item.id} className="flex gap-4 p-4 rounded-[2rem] bg-emerald-50/50 border border-emerald-100 shadow-sm relative group">
                            <button 
                              onClick={() => deleteFromCart(item.id)}
                              className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center shadow-lg transition-all z-10"
                              title="Remove item"
                            >
                               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3"/></svg>
                            </button>
                            <img src={item.image} className="w-14 h-14 rounded-2xl object-cover shadow-lg opacity-80" />
                            <div className="flex-1">
                              <p className="font-black text-emerald-900 text-[13px] tracking-tight mb-1 leading-tight">{item.name}</p>
                              <p className="text-[10px] font-bold text-emerald-700 uppercase mb-2">
                                ₹{item.price * item.quantity} / {item.quantity}{item.unit.replace(/[0-9.]/g, '').toUpperCase()}
                              </p>
                              <div className="flex justify-between items-center">
                                <span className="font-black text-emerald-800 text-[15px] tracking-tighter">₹{item.price * item.quantity}</span>
                                <span className="bg-white border border-emerald-200 px-2 py-0.5 rounded-lg text-[9px] font-black text-emerald-600">PENDING QTY: {item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              {allDisplayItems.length > 0 && (
                <div className="space-y-6 pt-4 border-t border-stone-100">
                   <div>
                      <h3 className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">Select Date</h3>
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {deliveryDates.map(date => (
                          <button key={date.full} onClick={() => setSelectedDate(date.full)} className={`flex flex-col items-center min-w-[65px] p-3 rounded-2xl border-2 transition-all ${selectedDate === date.full ? 'bg-emerald-700 border-emerald-700 text-white shadow-lg' : 'bg-white border-stone-100 text-stone-400'}`}>
                            <span className="text-[7px] uppercase font-black mb-1">{date.day}</span>
                            <span className="text-lg font-black leading-none">{date.date}</span>
                          </button>
                        ))}
                      </div>
                   </div>
                   <div>
                      <h3 className="text-[9px] font-black text-stone-400 uppercase tracking-widest mb-2">Select Slot</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {TIME_SLOTS.map(slot => (
                          <button key={slot.time} onClick={() => setSelectedSlot(slot.time)} className={`flex items-center justify-between p-3.5 rounded-2xl border-2 transition-all ${selectedSlot === slot.time ? 'bg-stone-950 text-white' : 'bg-stone-50 text-stone-500 border-stone-100'}`}>
                            <div className="flex items-center gap-3 text-[13px] font-black"><span>{slot.icon}</span><p>{slot.time}</p></div>
                            <div className={`w-3.5 h-3.5 rounded-full border-2 ${selectedSlot === slot.time ? 'bg-emerald-500 border-emerald-500' : 'border-stone-200'}`}></div>
                          </button>
                        ))}
                      </div>
                   </div>
                </div>
              )}
            </div>
            {allDisplayItems.length > 0 && (
              <div className="p-6 border-t border-stone-100 bg-stone-50">
                 <div className="space-y-1.5 mb-5 px-2">
                    <div className="flex justify-between items-center text-[10px] font-black text-stone-400 uppercase tracking-wider">
                       <span>Subtotal</span>
                       <span>₹{rawTotal}</span>
                    </div>
                    {appliedVoucher && (
                      <div className="flex justify-between items-center text-[10px] font-black text-emerald-600 uppercase tracking-wider">
                         <span>Voucher ({appliedVoucher.code})</span>
                         <span>- ₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-end pt-2 border-t border-stone-200">
                      <div>
                        <span className="text-[9px] font-black text-stone-900 uppercase tracking-[0.2em]">Grand Total</span>
                        <p className="text-3xl font-black text-stone-900 leading-none mt-1">₹{finalTotal}</p>
                      </div>
                    </div>
                 </div>
                 
                 <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => { commitPending(); setShowCart(false); setActiveTab(AppTab.Shop); }} 
                      className={`w-full text-white font-black py-4 rounded-xl text-[10px] uppercase tracking-[0.3em] shadow-xl active:scale-95 transition-all border-2 border-white/20 ${pendingCart.length > 0 ? 'bg-emerald-600 animate-pulse' : 'bg-emerald-700'}`}
                    >
                      ADD TO BASKET
                    </button>
                    <button 
                      onClick={placeOrder} 
                      className="w-full bg-stone-900 text-white font-black py-3.5 rounded-xl text-[9px] uppercase tracking-[0.2em] active:scale-95 transition-all"
                    >
                      Confirm Order
                    </button>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showSuccessNotification && (
        <div className="fixed inset-x-0 bottom-12 z-[200] flex justify-center px-6 pointer-events-none">
           <div className="bg-emerald-900 text-white p-6 rounded-[2.5rem] shadow-[0_20px_50px_rgba(6,78,59,0.3)] border border-emerald-500/30 flex items-center gap-6 animate-popIn pointer-events-auto">
              <div className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M5 13l4 4L19 7"/></svg>
              </div>
              <div>
                 <h4 className="text-xl font-black italic tracking-tighter leading-none">Order Taken Successfully!</h4>
                 <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest mt-1">Ref ID: {lastOrderId}</p>
              </div>
              <button onClick={() => setShowSuccessNotification(false)} className="ml-4 p-2 text-emerald-400 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2.5"/></svg>
              </button>
           </div>
        </div>
      )}
    </Layout>
  );
};

interface ProfileDetailRowProps {
  label: string; value: string; field: keyof User; isEditing: boolean;
  onEdit: (field: keyof User) => void; onSave: () => void; onCancel: () => void;
  editValue: string; setEditValue: (v: string) => void;
}

const ProfileDetailRow: React.FC<ProfileDetailRowProps> = ({ label, value, field, isEditing, onEdit, onSave, onCancel, editValue, setEditValue }) => (
  <div className="flex flex-col border-b border-stone-100 pb-4 group relative">
    <span className="text-[10px] text-stone-400 font-black tracking-[0.3em] uppercase">{label}</span>
    <div className="mt-1 flex items-center justify-between gap-4">
      {isEditing ? (
        <div className="flex-1 flex gap-2">
          <input type="text" autoFocus value={editValue} onChange={(e) => setEditValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && onSave()} className="flex-1 p-2 bg-stone-50 border border-emerald-200 rounded-lg font-black text-sm outline-none" />
          <button onClick={onSave} className="bg-emerald-600 text-white p-2 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" strokeWidth="3"/></svg></button>
          <button onClick={onCancel} className="bg-stone-200 text-stone-600 p-2 rounded-lg"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="3"/></svg></button>
        </div>
      ) : (
        <><span className="text-xl font-black leading-none">{value}</span><button onClick={() => onEdit(field)} className="text-[10px] font-black text-emerald-600 opacity-0 group-hover:opacity-100 transition-all bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 uppercase">Edit</button></>
      )}
    </div>
  </div>
);

export default App;
