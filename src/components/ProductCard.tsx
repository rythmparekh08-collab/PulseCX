import React, { useState } from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAskNova: (product: Product, prompt?: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAskNova
}) => {
  const [showSpecs, setShowSpecs] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Product Image Container */}
      <div className="relative h-64 bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm tracking-wide">
            {product.badge}
          </span>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-slate-800 shadow-sm flex items-center gap-1">
          <span className="text-amber-500">★</span>
          <span>{product.rating}</span>
          <span className="text-slate-400 font-normal">({product.reviewsCount})</span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <span className="text-xs uppercase tracking-wider font-semibold text-blue-600">
            {product.category}
          </span>
          <span className="text-2xl font-bold text-slate-900">
            ${product.price}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-3">
          {product.tagline}
        </p>

        <p className="text-sm text-slate-600 mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Feature Highlights */}
        <ul className="space-y-1.5 mb-5 text-xs text-slate-600">
          {product.features.slice(0, 3).map((feat, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <svg className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
              <span>{feat}</span>
            </li>
          ))}
        </ul>

        {/* Reassurance Policy Chip */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 mb-5 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>30-Day Risk-Free Trial</span>
          </div>
          <span className="text-[11px] text-blue-600 font-medium">Free Prepaid Label</span>
        </div>

        {/* Specs Toggle */}
        {showSpecs && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 text-xs space-y-1.5 animate-fadeIn">
            <div className="font-semibold text-slate-800 mb-1">Technical Specifications</div>
            {Object.entries(product.specs).map(([key, val]) => (
              <div key={key} className="flex justify-between py-1 border-b border-slate-200/50 last:border-none">
                <span className="text-slate-500">{key}:</span>
                <span className="font-medium text-slate-700 text-right">{val}</span>
              </div>
            ))}
          </div>
        )}

        {/* Buttons / Actions */}
        <div className="mt-auto space-y-2">
          <div className="flex gap-2">
            <button
              onClick={() => onAddToCart(product)}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm py-2.5 px-4 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <span>Add to Cart</span>
            </button>
            <button
              onClick={() => setShowSpecs(!showSpecs)}
              title="Toggle Specifications"
              className="px-3 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl transition text-xs font-medium"
            >
              {showSpecs ? 'Hide' : 'Specs'}
            </button>
          </div>

          <button
            onClick={() => onAskNova(product, `Can you tell me more about ${product.name} and whether it is right for me?`)}
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/80 font-medium text-xs py-2 px-3 rounded-xl transition duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Ask Nova about {product.name.split(' ')[1] || 'Product'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
