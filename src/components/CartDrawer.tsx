import React from 'react';
import { Product, UserContext } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  userContext: UserContext;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  products: Product[];
  onAskNova: (prompt: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  userContext,
  onUpdateQuantity,
  onRemoveItem,
  products,
  onAskNova
}) => {
  if (!isOpen) return null;

  const freeShippingThreshold = 50;
  const isFreeShipping = userContext.cartTotal >= freeShippingThreshold;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - userContext.cartTotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Shopping Cart ({userContext.cartCount})</h2>
              <p className="text-xs text-slate-400">AuraTech Omnichannel Checkout</p>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
            >
              ✕
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-blue-50 border-b border-blue-100 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-1.5">
              <span>{isFreeShipping ? '🎉 You unlocked Free Standard Shipping!' : `Add $${amountToFreeShipping.toFixed(2)} more for Free Shipping`}</span>
              <span className="text-blue-600 font-bold">{Math.min(100, Math.round((userContext.cartTotal / freeShippingThreshold) * 100))}%</span>
            </div>
            <div className="w-full h-2 bg-blue-200/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (userContext.cartTotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
              <span>🛡️ 30-Day Risk-Free Trial included with free return labels</span>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {userContext.cartItems.length === 0 ? (
              <div className="text-center py-16 text-slate-400 space-y-3">
                <div className="text-4xl">🛒</div>
                <div className="font-semibold text-slate-700">Your cart is empty</div>
                <p className="text-xs max-w-xs mx-auto">
                  Explore our smart wearables, audio gear, and home hub to start building your connected space.
                </p>
              </div>
            ) : (
              userContext.cartItems.map((item) => {
                const prod = products.find((p) => p.id === item.productId);
                if (!prod) return null;

                return (
                  <div key={item.productId} className="flex gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-16 h-16 rounded-xl object-cover bg-white"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                      <p className="text-xs text-blue-600 font-bold mt-0.5">${prod.price}</p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Controls */}
                        <div className="flex items-center border border-slate-300 rounded-lg bg-white text-xs">
                          <button
                            onClick={() => onUpdateQuantity(prod.id, -1)}
                            className="px-2 py-0.5 hover:bg-slate-100 text-slate-600 rounded-l"
                          >
                            -
                          </button>
                          <span className="px-2 font-medium">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(prod.id, 1)}
                            className="px-2 py-0.5 hover:bg-slate-100 text-slate-600 rounded-r"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => onRemoveItem(prod.id)}
                          className="text-xs text-red-500 hover:text-red-700 font-medium"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Cart Footer */}
          {userContext.cartItems.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-800">${userContext.cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard Shipping:</span>
                  <span className="font-semibold text-emerald-600">
                    {isFreeShipping ? 'FREE ($0.00)' : '$4.99'}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Estimated Total:</span>
                  <span>${(userContext.cartTotal + (isFreeShipping ? 0 : 4.99)).toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={() => alert(`Simulated Checkout: Processing $${(userContext.cartTotal + (isFreeShipping ? 0 : 4.99)).toFixed(2)} payment.`)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl text-sm transition shadow-lg shadow-blue-600/25"
                >
                  Proceed to Secure Checkout
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onAskNova('Do you have any discount codes or warranty options for the items in my cart?');
                  }}
                  className="w-full bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 py-2.5 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1.5"
                >
                  <span>✨ Ask Nova for Discounts or Warranty Advice</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default CartDrawer;
