import { useState } from 'react';
import { CreditCard, Banknote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Navigation from './Navigation';

interface FormData {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  paymentMode: 'cash' | 'card';
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Checkout() {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    paymentMode: 'cash',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  const formatCardNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    const limited = numbers.slice(0, 16);
    const groups = limited.match(/.{1,4}/g) || [];
    return groups.join('-');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      setFormData({ ...formData, [name]: formatCardNumber(value) });
    } else if (name === 'phone') {
      const numbers = value.replace(/\D/g, '');
      setFormData({ ...formData, [name]: numbers });
    } else if (name === 'cvv') {
      const numbers = value.replace(/\D/g, '').slice(0, 3);
      setFormData({ ...formData, [name]: numbers });
    } else if (name === 'expiryMonth') {
      const numbers = value.replace(/\D/g, '').slice(0, 2);
      setFormData({ ...formData, [name]: numbers });
    } else if (name === 'expiryYear') {
      const numbers = value.replace(/\D/g, '').slice(0, 2);
      setFormData({ ...formData, [name]: numbers });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.customerName.trim() || formData.customerName.trim().length < 2) {
      newErrors.customerName = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone.length < 8) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.address.trim() || formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address (at least 10 characters)';
    }

    if (formData.paymentMode === 'card') {
      const cardDigits = formData.cardNumber.replace(/\D/g, '');
      if (cardDigits.length !== 16) {
        newErrors.cardNumber = 'Card number must be 16 digits';
      }

      const month = parseInt(formData.expiryMonth);
      if (!formData.expiryMonth || month < 1 || month > 12) {
        newErrors.expiryMonth = 'Invalid month (01-12)';
      }

      const year = parseInt(formData.expiryYear);
      const currentYear = new Date().getFullYear() % 100;
      if (!formData.expiryYear || year < currentYear) {
        newErrors.expiryYear = 'Card is expired';
      }

      if (formData.cvv.length !== 3) {
        newErrors.cvv = 'CVV must be 3 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const maskCardNumber = (cardNumber: string): string => {
    const digits = cardNumber.replace(/\D/g, '');
    if (digits.length < 4) return cardNumber;
    const lastFour = digits.slice(-4);
    return `xxxx-xxxx-xxxx-${lastFour}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customer_name: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        payment_mode: formData.paymentMode,
        card_number: formData.paymentMode === 'card' ? maskCardNumber(formData.cardNumber) : null,
        expiry_month: formData.paymentMode === 'card' ? formData.expiryMonth : null,
        expiry_year: formData.paymentMode === 'card' ? formData.expiryYear : null,
        items: cart,
        total: getCartTotal() * 1.05,
      };

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/submit-order`;
      const headers = {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit order');
      }

      const result = await response.json();

      clearCart();
      navigate('/order-confirmation', { state: { orderId: result.orderId } });
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Failed to submit order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = getCartTotal() * 1.05;

  return (
    <div className="min-h-screen bg-italian-cream">
      <Navigation />

      <div className="bg-italian-red text-white text-center py-12">
        <h1 className="text-5xl font-bold mb-2">Checkout</h1>
        <p className="text-xl">Complete your order</p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-italian-red mb-6">Customer Details</h2>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-italian-red ${
                      errors.customerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.customerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-italian-red ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-italian-red ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="50 123 4567"
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Delivery Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-italian-red ${
                      errors.address ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your complete delivery address"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-italian-red mb-6">Payment Method</h2>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMode: 'cash' })}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    formData.paymentMode === 'cash'
                      ? 'border-italian-red bg-red-50'
                      : 'border-gray-300 hover:border-italian-red'
                  }`}
                >
                  <Banknote className="w-12 h-12 mx-auto mb-3 text-italian-green" />
                  <p className="font-bold text-lg">Cash on Delivery</p>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMode: 'card' })}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    formData.paymentMode === 'card'
                      ? 'border-italian-red bg-red-50'
                      : 'border-gray-300 hover:border-italian-red'
                  }`}
                >
                  <CreditCard className="w-12 h-12 mx-auto mb-3 text-blue-600" />
                  <p className="font-bold text-lg">Credit/Debit Card</p>
                </button>
              </div>

              {formData.paymentMode === 'card' && (
                <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-bold text-lg text-gray-800 mb-4">Card Details</h3>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      Card Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-italian-red ${
                        errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="1234-5678-9012-3456"
                      maxLength={19}
                    />
                    {errors.cardNumber && (
                      <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Month <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="expiryMonth"
                        value={formData.expiryMonth}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-italian-red ${
                          errors.expiryMonth ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="MM"
                        maxLength={2}
                      />
                      {errors.expiryMonth && (
                        <p className="text-red-500 text-sm mt-1">{errors.expiryMonth}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        Year <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="expiryYear"
                        value={formData.expiryYear}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-italian-red ${
                          errors.expiryYear ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="YY"
                        maxLength={2}
                      />
                      {errors.expiryYear && (
                        <p className="text-red-500 text-sm mt-1">{errors.expiryYear}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">
                        CVV <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-italian-red ${
                          errors.cvv ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="123"
                        maxLength={3}
                      />
                      {errors.cvv && <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-italian-red text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Processing...' : `Place Order - AED ${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-italian-red mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div
                      className="w-16 h-16 rounded bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                    <div className="flex-1">
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x AED {item.price.toFixed(2)}
                      </p>
                    </div>
                    <p className="font-bold text-sm">
                      AED {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span>AED {getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Tax (5%)</span>
                  <span>AED {(getCartTotal() * 0.05).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between text-xl font-bold text-italian-red">
                    <span>Total</span>
                    <span>AED {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
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
