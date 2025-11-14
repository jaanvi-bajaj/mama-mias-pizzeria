import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navigation from './Navigation';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, getCartTotal } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-italian-cream">
        <Navigation />

        <div className="bg-italian-red text-white text-center py-12">
          <h1 className="text-5xl font-bold mb-2">Your Cart</h1>
          <p className="text-xl">Review your items before checkout</p>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="bg-white rounded-xl p-12 text-center shadow-md">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some delicious items from our menu!</p>
            <Link
              to="/menu"
              className="inline-block bg-italian-red text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
            >
              Browse Menu
            </Link>
          </div>
        </div>

        <footer className="bg-gray-900 text-white py-12 mt-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="border-t border-gray-700 pt-8 text-center">
              <p>&copy; 2025 Mama Mia's Pizzeria. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-italian-cream">
      <Navigation />

      <div className="bg-italian-red text-white text-center py-12">
        <h1 className="text-5xl font-bold mb-2">Your Cart</h1>
        <p className="text-xl">Review your items before checkout</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {cart.map((item) => (
                <div key={item.id} className="p-6 border-b border-gray-200 last:border-b-0">
                  <div className="flex gap-6">
                    <div
                      className="w-32 h-32 rounded-lg bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-italian-red">{item.name}</h3>
                          {item.description && (
                            <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                          title="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-lg font-bold w-8 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-italian-red text-white hover:opacity-90 flex items-center justify-center transition-all"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">AED {item.price.toFixed(2)} each</p>
                          <p className="text-xl font-bold text-italian-green">
                            AED {(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-italian-red mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>AED {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (5%)</span>
                  <span>AED {(getCartTotal() * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-italian-red">
                    <span>Total</span>
                    <span>AED {(getCartTotal() * 1.05).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-italian-red text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/menu"
                className="block text-center text-italian-red font-bold hover:underline"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="border-t border-gray-700 pt-8 text-center">
            <p>&copy; 2025 Mama Mia's Pizzeria. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
