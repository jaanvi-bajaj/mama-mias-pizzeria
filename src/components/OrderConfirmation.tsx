import { CheckCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import Navigation from './Navigation';

export default function OrderConfirmation() {
  const location = useLocation();
  const orderId = location.state?.orderId || 'N/A';

  return (
    <div className="min-h-screen bg-italian-cream">
      <Navigation />

      <div className="bg-italian-red text-white text-center py-12">
        <h1 className="text-5xl font-bold mb-2">Order Confirmed</h1>
        <p className="text-xl">Thank you for your order!</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="w-24 h-24 text-italian-green" />
          </div>

          <h2 className="text-3xl font-bold text-italian-red mb-4">
            Order Successfully Placed!
          </h2>

          <div className="mb-8">
            <p className="text-2xl font-semibold text-italian-green mb-3">
              Grazie Mille! 🍕
            </p>
            <p className="text-gray-700 text-lg mb-2">
              Thank you for choosing Mama Mia's Pizzeria!
            </p>
            <p className="text-gray-600">
              Your order has been received and is being prepared with care by our expert chefs.
              We appreciate your business and can't wait to serve you the finest Italian cuisine!
            </p>
          </div>

          <div className="bg-italian-cream rounded-lg p-6 mb-8">
            <p className="text-sm text-gray-600 mb-2">Order ID</p>
            <p className="text-2xl font-bold text-italian-red font-mono">
              {orderId.toString().slice(0, 8).toUpperCase()}
            </p>
          </div>

          <div className="space-y-4 text-left mb-8">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-italian-red text-white flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <h3 className="font-bold text-lg">Order Confirmed</h3>
                <p className="text-gray-600">We've received your order and payment details</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-italian-red text-white flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <h3 className="font-bold text-lg">Preparing Your Food</h3>
                <p className="text-gray-600">Our chefs are making your delicious meal fresh</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-white flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-500">Out for Delivery</h3>
                <p className="text-gray-600">Your order will be on its way soon</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-700">
              A confirmation email has been sent to your email address with order details.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="bg-italian-red text-white px-8 py-3 rounded-lg font-bold hover:opacity-90 transition-all"
            >
              Order More
            </Link>
            <Link
              to="/"
              className="bg-white text-italian-red border-2 border-italian-red px-8 py-3 rounded-lg font-bold hover:bg-italian-red hover:text-white transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Need help with your order?</p>
          <a
            href="tel:+97141234567"
            className="text-italian-red font-bold hover:underline"
          >
            Call us at +971 4 123 4567
          </a>
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
