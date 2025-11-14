import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Database, RefreshCw, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DatabaseViewer() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState('menu_items');

  const fetchData = async () => {
    setLoading(true);
    console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
    console.log('Supabase Key exists:', !!import.meta.env.VITE_SUPABASE_ANON_KEY);
    try {
      const [menuRes, resRes, ordersRes, commentsRes, contactRes, historyRes] = await Promise.all([
        supabase.from('menu_items').select('*').order('category', { ascending: true }),
        supabase.from('reservations').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('comments').select('*').order('created_at', { ascending: false }),
        supabase.from('contact_messages').select('*').order('created_at', { ascending: false }),
        supabase.from('history').select('*').order('year', { ascending: true }),
      ]);

      console.log('Menu response:', menuRes);
      console.log('Menu data:', menuRes.data);
      console.log('Menu error:', menuRes.error);

      setMenuItems(menuRes.data || []);
      setReservations(resRes.data || []);
      setOrders(ordersRes.data || []);
      setComments(commentsRes.data || []);
      setContactMessages(contactRes.data || []);
      setHistory(historyRes.data || []);

      if (menuRes.error) {
        setError(`Menu error: ${menuRes.error.message}`);
      } else {
        setError('');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { id: 'menu_items', label: 'Menu Items', count: menuItems.length },
    { id: 'reservations', label: 'Reservations', count: reservations.length },
    { id: 'orders', label: 'Orders', count: orders.length },
    { id: 'comments', label: 'Testimonials', count: comments.length },
    { id: 'contact_messages', label: 'Contact Messages', count: contactMessages.length },
    { id: 'history', label: 'History', count: history.length },
  ];

  const renderTable = (data: any[], columns: string[]) => {
    if (data.length === 0) {
      return <div className="text-center py-8 text-gray-500">No data yet</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((col) => (
                <th key={col} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                {columns.map((col) => (
                  <td key={col} className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                    {typeof row[col] === 'object' ? JSON.stringify(row[col]) : String(row[col] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'menu_items':
        return renderTable(menuItems, ['name', 'category', 'price', 'available', 'created_at']);
      case 'reservations':
        return renderTable(reservations, ['name', 'email', 'phone', 'date', 'time', 'guests', 'status', 'created_at']);
      case 'orders':
        return renderTable(orders, ['customer_name', 'customer_phone', 'total_amount', 'payment_method', 'status', 'created_at']);
      case 'comments':
        return renderTable(comments, ['customer_name', 'rating', 'comment', 'approved', 'created_at']);
      case 'contact_messages':
        return renderTable(contactMessages, ['name', 'email', 'subject', 'message', 'created_at']);
      case 'history':
        return renderTable(history, ['year', 'title', 'description', 'created_at']);
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <Link to="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 mb-4">
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="w-8 h-8" />
                <div>
                  <h1 className="text-2xl font-bold">Database Viewer</h1>
                  <p className="text-orange-100 text-sm">Live updates every 3 seconds</p>
                </div>
              </div>
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-600 text-orange-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 px-2 py-1 text-xs rounded-full bg-gray-100">
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {loading && <div className="text-center py-8 text-gray-500">Loading...</div>}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                <strong>Error:</strong> {error}
                <div className="text-sm mt-2">
                  <div>Supabase URL: {import.meta.env.VITE_SUPABASE_URL || 'Not set'}</div>
                  <div>Anon Key: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</div>
                </div>
              </div>
            )}
            {!loading && renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
