import { Pizza, Leaf, ChefHat, Flame, Salad, Wine } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      <header
        className="relative h-[600px] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=1920)'
        }}
      >
        <div className="text-center z-10">
          <h1 className="text-6xl font-bold mb-4">Welcome to Mama Mia's Pizzeria</h1>
          <p className="text-2xl mb-8 font-light">Authentic Italian Pizza Made with Love Since 1985</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/menu"
              className="bg-white text-italian-red px-8 py-3 rounded-lg font-bold hover:bg-italian-cream transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              View Menu
            </Link>
            <Link
              to="/menu"
              className="bg-transparent text-white px-8 py-3 rounded-lg font-bold border-2 border-white hover:bg-white hover:text-italian-red transition-all hover:-translate-y-0.5"
            >
              Open Full App
            </Link>
          </div>
        </div>
      </header>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center text-italian-red mb-12">Why Choose Us</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-italian-cream p-10 rounded-xl shadow-md text-center hover:-translate-y-2 transition-all hover:shadow-xl">
              <div className="flex justify-center mb-4">
                <Leaf className="w-16 h-16 text-italian-green" />
              </div>
              <h3 className="text-2xl font-bold text-italian-red mb-4">Fresh Ingredients</h3>
              <p className="text-gray-700">We use only the freshest, locally-sourced ingredients for authentic Italian taste</p>
            </div>

            <div className="bg-italian-cream p-10 rounded-xl shadow-md text-center hover:-translate-y-2 transition-all hover:shadow-xl">
              <div className="flex justify-center mb-4">
                <ChefHat className="w-16 h-16 text-gray-700" />
              </div>
              <h3 className="text-2xl font-bold text-italian-red mb-4">Traditional Recipes</h3>
              <p className="text-gray-700">Passed down through generations of Italian chefs from Naples</p>
            </div>

            <div className="bg-italian-cream p-10 rounded-xl shadow-md text-center hover:-translate-y-2 transition-all hover:shadow-xl">
              <div className="flex justify-center mb-4">
                <Flame className="w-16 h-16 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-italian-red mb-4">Wood-Fired Oven</h3>
              <p className="text-gray-700">Cooked to perfection in our authentic Italian wood-fired oven</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-5xl font-bold text-center text-italian-red mb-12">Featured Items</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-xl shadow-md text-center hover:-translate-y-2 transition-all hover:shadow-xl">
              <div className="flex justify-center mb-4">
                <Pizza className="w-20 h-20 text-italian-red" />
              </div>
              <h3 className="text-2xl font-bold text-italian-red mb-4">Specialty Pizzas</h3>
              <p className="text-gray-600 mb-6">From classic Margherita to our signature Quattro Formaggi</p>
              <Link to="/menu" className="text-italian-red font-bold hover:opacity-80 hover:underline">
                Explore Pizzas
              </Link>
            </div>

            <div className="bg-white p-10 rounded-xl shadow-md text-center hover:-translate-y-2 transition-all hover:shadow-xl">
              <div className="flex justify-center mb-4">
                <Salad className="w-20 h-20 text-italian-green" />
              </div>
              <h3 className="text-2xl font-bold text-italian-red mb-4">Fresh Appetizers</h3>
              <p className="text-gray-600 mb-6">Start your meal with authentic Italian antipasti</p>
              <Link to="/menu" className="text-italian-red font-bold hover:opacity-80 hover:underline">
                View Appetizers
              </Link>
            </div>

            <div className="bg-white p-10 rounded-xl shadow-md text-center hover:-translate-y-2 transition-all hover:shadow-xl">
              <div className="flex justify-center mb-4">
                <Wine className="w-20 h-20 text-purple-700" />
              </div>
              <h3 className="text-2xl font-bold text-italian-red mb-4">Premium Drinks</h3>
              <p className="text-gray-600 mb-6">Fine wines and refreshing beverages to complement your meal</p>
              <Link to="/menu" className="text-italian-red font-bold hover:opacity-80 hover:underline">
                See Drinks
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-italian-red text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-4">Experience Our Full Restaurant App</h2>
          <p className="text-xl mb-8 opacity-95">
            Browse our complete menu, make reservations, and manage your orders with our interactive React application
          </p>
          <Link
            to="/menu"
            className="inline-block bg-white text-italian-red px-10 py-4 rounded-lg font-bold text-lg hover:bg-italian-cream transition-all hover:-translate-y-0.5 hover:shadow-xl"
          >
            Open Full App
          </Link>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-italian-red text-xl font-bold mb-4">Contact Us</h3>
              <p className="mb-2">📍 Sheikh Zayed Road, Dubai Marina</p>
              <p className="mb-2">Dubai, United Arab Emirates</p>
              <p className="mb-2">📞 +971 4 123 4567</p>
              <p className="mb-2">✉️ info@mamamiaspizzeria.ae</p>
            </div>

            <div>
              <h3 className="text-italian-red text-xl font-bold mb-4">Opening Hours</h3>
              <p className="mb-2">Sunday - Thursday: 11:00 AM - 11:00 PM</p>
              <p className="mb-2">Friday - Saturday: 11:00 AM - 12:00 AM</p>
            </div>

            <div>
              <h3 className="text-italian-red text-xl font-bold mb-4">Location</h3>
              <a
                href="https://maps.google.com/?q=Dubai+Marina"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-italian-red font-bold py-2 px-4 border-2 border-italian-red rounded-lg hover:bg-italian-red hover:text-white transition-all"
              >
                View on Google Maps
              </a>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center">
            <p>&copy; 2025 Mama Mia's Pizzeria. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}