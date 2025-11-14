import { useState, useEffect } from 'react';
import { Pizza, Leaf, Salad, Cake, Coffee } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useCart } from '../context/CartContext';
import Navigation from './Navigation';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
}

const categoryIcons: { [key: string]: JSX.Element } = {
  pizza: <Pizza className="w-6 h-6" />,
  appetizer: <Leaf className="w-6 h-6" />,
  salad: <Salad className="w-6 h-6" />,
  dessert: <Cake className="w-6 h-6" />,
  beverage: <Coffee className="w-6 h-6" />,
};

const categoryImages: { [key: string]: string } = {
  pizza: 'https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=400',
  appetizer: 'https://images.pexels.com/photos/1410235/pexels-photo-1410235.jpeg?auto=compress&cs=tinysrgb&w=400',
  salad: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400',
  dessert: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400',
  beverage: 'https://images.pexels.com/photos/1283219/pexels-photo-1283219.jpeg?auto=compress&cs=tinysrgb&w=400',
};

export default function Menu() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    loadMenu();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredItems(menuItems);
    } else {
      setFilteredItems(menuItems.filter(item => item.category === selectedCategory));
    }
  }, [selectedCategory, menuItems]);

  const loadMenu = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error: supabaseError } = await supabase
        .from('menu_items')
        .select('*')
        .eq('available', true)
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      setMenuItems(data || []);
      setFilteredItems(data || []);
    } catch (err) {
      setError('Unable to load menu items. Please try again later.');
      console.error('Error loading menu:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'pizza', label: 'Pizzas' },
    { id: 'appetizer', label: 'Appetizers' },
    { id: 'salad', label: 'Salads' },
    { id: 'dessert', label: 'Desserts' },
    { id: 'beverage', label: 'Beverages' },
  ];

  const handleAddToCart = (item: MenuItem) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price * 3.67,
      image: item.image || categoryImages[item.category] || categoryImages.pizza,
      description: item.description,
    });
  };

  return (
    <div className="min-h-screen bg-italian-cream">
      <Navigation />

      <div className="bg-italian-red text-white text-center py-12">
        <h1 className="text-5xl font-bold mb-2">Our Menu</h1>
        <p className="text-xl">Delicious pizzas made fresh daily</p>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center flex-wrap gap-4 mb-12">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-bold transition-all border-2 border-italian-red ${
                  selectedCategory === category.id
                    ? 'bg-italian-red text-white'
                    : 'bg-white text-italian-red hover:bg-italian-red hover:text-white hover:-translate-y-0.5'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          {loading && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading menu items...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8 mb-8">
              <div className="bg-red-100 text-red-800 px-6 py-4 rounded-lg inline-block">
                {error}
              </div>
            </div>
          )}

          {!loading && !error && filteredItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No items found in this category.</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:-translate-y-2 hover:shadow-xl transition-all"
              >
                <div
                  className="h-56 bg-cover bg-center relative"
                  style={{
                    backgroundImage: `url('${item.image || categoryImages[item.category] || categoryImages.pizza}')`,
                  }}
                >
                  <div className="absolute top-4 right-4 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-md">
                    {categoryIcons[item.category] || categoryIcons.pizza}
                  </div>
                </div>

                <div className="p-6">
                  <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-bold capitalize mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-bold text-italian-red mb-3">{item.name}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>

                  <div className="flex justify-between items-center mt-4">
                    <p className="text-2xl font-bold text-italian-green">
                      AED {(item.price * 3.67).toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-italian-red text-white px-5 py-2 rounded-lg font-bold hover:opacity-90 transition-all"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-red-700 text-xl font-bold mb-4">Contact Us</h3>
              <p className="mb-2">📍 Sheikh Zayed Road, Dubai Marina</p>
              <p className="mb-2">Dubai, United Arab Emirates</p>
              <p className="mb-2">📞 +971 4 123 4567</p>
              <p className="mb-2">✉️ info@mamamiaspizzeria.ae</p>
            </div>

            <div>
              <h3 className="text-red-700 text-xl font-bold mb-4">Opening Hours</h3>
              <p className="mb-2">Sunday - Thursday: 11:00 AM - 11:00 PM</p>
              <p className="mb-2">Friday - Saturday: 11:00 AM - 12:00 AM</p>
            </div>

            <div>
              <h3 className="text-red-700 text-xl font-bold mb-4">Location</h3>
              <a
                href="https://maps.google.com/?q=Dubai+Marina"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-red-700 font-bold py-2 px-4 border-2 border-red-700 rounded-lg hover:bg-red-700 hover:text-white transition-all"
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