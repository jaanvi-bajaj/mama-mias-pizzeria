import { useState, useEffect } from 'react';
import { Pizza, Heart, ChefHat } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navigation from './Navigation';

interface HistoryItem {
  id: string;
  year: number;
  title: string;
  description: string;
}

export default function About() {
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error: supabaseError } = await supabase
        .from('history')
        .select('*')
        .order('year', { ascending: true });

      if (supabaseError) {
        throw supabaseError;
      }

      setHistoryItems(data || []);
    } catch (err) {
      setError('Unable to load history. Please try again later.');
      console.error('Error loading history:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-italian-cream">
      <Navigation />

      <div
        className="relative h-[400px] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1920)'
        }}
      >
        <div className="text-center z-10">
          <h1 className="text-5xl font-bold mb-2">About Us</h1>
          <p className="text-xl">Our Story, Our Passion</p>
        </div>
      </div>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-italian-red mb-4">Welcome to Mama Mia's Pizzeria</h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Since 1985, we've been bringing the authentic taste of Naples to Dubai. Our journey began with a passion for traditional Italian cuisine and a commitment to quality that continues to this day.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:-translate-y-2 transition-all">
              <div className="flex justify-center mb-4">
                <Pizza className="w-20 h-20 text-italian-red" />
              </div>
              <h3 className="text-2xl font-bold text-italian-red mb-4">Our Story</h3>
              <p className="text-gray-600 leading-relaxed">
                Founded by Jaanvi Bajaj, who brought her family's traditional pizza recipes from Naples, Italy. For over three decades, we've been serving authentic Italian pizza to our community with love and dedication.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:-translate-y-2 transition-all">
              <div className="flex justify-center mb-4">
                <Heart className="w-20 h-20 text-italian-red" />
              </div>
              <h3 className="text-2xl font-bold text-italian-red mb-4">Our Philosophy</h3>
              <p className="text-gray-600 leading-relaxed">
                We believe in using only the finest ingredients, traditional cooking methods, and treating every customer like family. Our wood-fired oven, imported from Italy, gives our pizzas that authentic taste.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md text-center hover:-translate-y-2 transition-all">
              <div className="flex justify-center mb-4">
                <ChefHat className="w-20 h-20 text-italian-red" />
              </div>
              <h3 className="text-2xl font-bold text-italian-red mb-4">Our Team</h3>
              <p className="text-gray-600 leading-relaxed">
                Our chefs are trained in the art of traditional Italian pizza making, ensuring every pizza that leaves our kitchen meets the high standards set by Mama Maria herself.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-italian-red mb-12">Our Journey Through Time</h2>

          {loading && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">Loading our history...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-8 mb-8">
              <div className="bg-red-100 text-red-800 px-6 py-4 rounded-lg inline-block">
                {error}
              </div>
            </div>
          )}

          {!loading && !error && historyItems.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600">No history items available.</p>
            </div>
          )}

          {!loading && !error && historyItems.length > 0 && (
            <div className="relative">
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-italian-red transform -translate-x-1/2 hidden md:block" />

              {historyItems.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center mb-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } flex-col md:gap-0 gap-4`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12 md:text-left'} text-center`}>
                    <div className="bg-white p-6 rounded-xl shadow-lg relative">
                      {index % 2 === 0 ? (
                        <div className="hidden md:block absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-white" />
                      ) : (
                        <div className="hidden md:block absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-white" />
                      )}
                      <h3 className="text-2xl font-bold text-italian-red mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 w-24 h-24 bg-italian-red rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg z-10">
                    {item.year}
                  </div>

                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 mt-16">
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