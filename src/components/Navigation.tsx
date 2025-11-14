import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const Navigation = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  return (
    <nav className="bg-red-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold hover:text-yellow-300 transition">
            Mama Mia's Pizzeria
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="hover:text-yellow-300 transition">
              Home
            </Link>
            <Link to="/menu" className="hover:text-yellow-300 transition">
              Menu
            </Link>
            <Link to="/about" className="hover:text-yellow-300 transition">
              About
            </Link>
            <Link to="/reservations" className="hover:text-yellow-300 transition">
              Reservations
            </Link>
            <Link to="/testimonials" className="hover:text-yellow-300 transition">
              Testimonials
            </Link>
            <Link to="/cart" className="relative hover:text-yellow-300 transition">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-700 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
