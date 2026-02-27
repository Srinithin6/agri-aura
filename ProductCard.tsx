
import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  inCartCount: number;
  onAddToCart: (product: Product) => void;
  onRemoveFromCart: (id: string) => void;
  onCardClick?: (product: Product) => void;
  buyerType?: 'Home' | 'Bulk';
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  inCartCount, 
  onAddToCart, 
  onRemoveFromCart, 
  onCardClick, 
  buyerType = 'Home' 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isBulk = buyerType === 'Bulk';
  const displayPrice = isBulk ? product.price * 5 : product.price;
  
  const getDisplayUnit = () => {
    if (!isBulk) return product.unit;
    const match = product.unit.match(/^(\d+(?:\.\d+)?)\s*(.*)$/i);
    if (match) {
      const val = parseFloat(match[1]);
      const unitType = match[2];
      return `${val * 5}${unitType}`;
    }
    return `5 x ${product.unit}`;
  };

  return (
    <div 
      onClick={() => onCardClick?.(product)}
      className={`bg-white rounded-3xl border transition-all duration-500 flex flex-col group cursor-pointer relative overflow-hidden h-full ${
        isBulk 
          ? 'border-green-200 hover:border-green-400 hover:shadow-2xl' 
          : 'border-stone-100 hover:border-emerald-200 hover:shadow-2xl'
      }`}
    >
      {(product.category === 'Organic' || product.category === 'Regional Org') && (
        <div className="absolute top-4 left-4 z-20 bg-emerald-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Certified
        </div>
      )}
      
      <div className="relative h-48 overflow-hidden bg-stone-50">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-stone-100 animate-pulse" />
        )}
        <img 
          src={product.image} 
          alt={product.name} 
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            setImageLoaded(true);
            (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${product.id}/600/600`;
          }}
          className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-100'
          }`}
        />
        
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-2 py-0.5 rounded-lg text-[10px] font-black text-emerald-900 shadow-xl z-10">
          ★ {product.rating.toFixed(1)}
        </div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">{product.category}</span>
          <h3 className="font-bold text-stone-900 text-md mb-1 leading-tight line-clamp-1">
            {product.name}
          </h3>
          <p className="text-stone-500 text-[10px] line-clamp-1 mb-3">
            {product.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-stone-50">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-stone-400 uppercase tracking-tighter">₹{displayPrice} / {getDisplayUnit()}</span>
            <span className="text-lg font-black text-stone-900 tracking-tighter">₹{displayPrice}</span>
          </div>

          {inCartCount > 0 ? (
            <div className="flex items-center bg-emerald-50 rounded-xl border border-emerald-100 overflow-hidden" onClick={(e) => e.stopPropagation()}>
               <button 
                onClick={() => onRemoveFromCart(product.id)}
                className="w-8 h-8 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition-colors font-black"
               >-</button>
               <span className="w-6 text-center text-xs font-black text-emerald-900">{inCartCount}</span>
               <button 
                onClick={() => onAddToCart(product)}
                className="w-8 h-8 flex items-center justify-center text-emerald-700 hover:bg-emerald-100 transition-colors font-black"
               >+</button>
            </div>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all shadow-lg active:scale-90 ${
                isBulk ? 'bg-green-700 text-white' : 'bg-emerald-600 text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
