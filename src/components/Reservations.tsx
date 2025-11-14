import { useState } from 'react';
import { MapPin, Clock, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navigation from './Navigation';

interface FormData {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  notes: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  date?: string;
  time?: string;
  guests?: string;
}

export default function Reservations() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    notes: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const validateName = (name: string): string => {
    if (!name || name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return 'Name can only contain letters and spaces';
    }
    return '';
  };

  const validateEmail = (email: string): string => {
    if (!email) {
      return 'Email is required';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePhone = (phone: string): string => {
    if (!phone) {
      return 'Phone number is required';
    }
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 8) {
      return 'Please enter a valid phone number';
    }
    return '';
  };

  const validateDate = (date: string): string => {
    if (!date) {
      return 'Date is required';
    }
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return 'Please select a future date';
    }

    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    if (selectedDate > maxDate) {
      return 'Reservations can only be made up to 3 months in advance';
    }

    return '';
  };

  const validateTime = (time: string): string => {
    if (!time) {
      return 'Time is required';
    }
    const [hours, minutes] = time.split(':').map(Number);
    const timeInMinutes = hours * 60 + minutes;
    const openTime = 11 * 60;
    const closeTime = 24 * 60;

    if (timeInMinutes < openTime || timeInMinutes > closeTime) {
      return 'Please select a time between 11:00 AM and 12:00 AM';
    }

    return '';
  };

  const validateGuests = (guests: string): string => {
    const numGuests = parseInt(guests);
    if (!guests || isNaN(numGuests)) {
      return 'Number of guests is required';
    }
    if (numGuests < 1) {
      return 'At least 1 guest is required';
    }
    if (numGuests > 20) {
      return 'Maximum 20 guests allowed';
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const nameError = validateName(formData.name);
    if (nameError) newErrors.name = nameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const dateError = validateDate(formData.date);
    if (dateError) newErrors.date = dateError;

    const timeError = validateTime(formData.time);
    if (timeError) newErrors.time = timeError;

    const guestsError = validateGuests(formData.guests);
    if (guestsError) newErrors.guests = guestsError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const { error: supabaseError } = await supabase
        .from('reservations')
        .insert([{
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          date: formData.date,
          time: formData.time,
          guests: parseInt(formData.guests),
          notes: formData.notes.trim(),
          status: 'pending'
        }]);

      if (supabaseError) {
        throw supabaseError;
      }

      setMessage({
        type: 'success',
        text: 'Reservation submitted successfully! We will contact you shortly to confirm your booking.',
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        date: '',
        time: '',
        guests: '',
        notes: '',
      });
      setErrors({});

      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 5000);
    } catch (error) {
      console.error('Error submitting reservation:', error);
      setMessage({
        type: 'error',
        text: 'Unable to submit reservation. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-italian-cream">
      <Navigation />

      <div
        className="relative h-[400px] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=1920)'
        }}
      >
        <div className="text-center z-10">
          <h1 className="text-5xl font-bold mb-2">Make a Reservation</h1>
          <p className="text-xl">Book your table today</p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-italian-red mb-4">Reserve Your Table</h2>
            <p className="text-gray-600 leading-relaxed mb-8 max-w-2xl mx-auto">
              Experience authentic Italian cuisine in the heart of Dubai. Book your table now and let us serve you the finest pizzas in town.
            </p>

            <div className="flex justify-center gap-6 flex-wrap">
              <div className="bg-white p-6 rounded-xl shadow-md text-center min-w-[150px]">
                <MapPin className="w-10 h-10 text-italian-red mx-auto mb-2" />
                <p className="font-bold text-gray-700">Dubai Marina</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center min-w-[150px]">
                <Clock className="w-10 h-10 text-italian-green mx-auto mb-2" />
                <p className="font-bold text-gray-700">11 AM - 12 AM</p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-md text-center min-w-[150px]">
                <Users className="w-10 h-10 text-italian-red mx-auto mb-2" />
                <p className="font-bold text-gray-700">Up to 20 Guests</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold text-italian-red mb-6 text-center">Reservation Details</h3>

            <div className="mb-6">
              <label htmlFor="name" className="block font-bold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-italian-red focus:border-transparent transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-200'
                }`}
                required
              />
              {errors.name && <p className="text-red-600 text-sm mt-2">{errors.name}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block font-bold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-italian-red focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-200'
                }`}
                required
              />
              {errors.email && <p className="text-red-600 text-sm mt-2">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="phone" className="block font-bold text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+971 XX XXX XXXX"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all ${
                  errors.phone ? 'border-red-500' : 'border-gray-200'
                }`}
                required
              />
              {errors.phone && <p className="text-red-600 text-sm mt-2">{errors.phone}</p>}
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="date" className="block font-bold text-gray-700 mb-2">
                  Reservation Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all ${
                    errors.date ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.date && <p className="text-red-600 text-sm mt-2">{errors.date}</p>}
              </div>

              <div>
                <label htmlFor="time" className="block font-bold text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all ${
                    errors.time ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.time && <p className="text-red-600 text-sm mt-2">{errors.time}</p>}
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="guests" className="block font-bold text-gray-700 mb-2">
                Number of Guests *
              </label>
              <input
                type="number"
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                min="1"
                max="20"
                placeholder="1-20 guests"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-italian-red focus:border-transparent transition-all ${
                  errors.guests ? 'border-red-500' : 'border-gray-200'
                }`}
                required
              />
              {errors.guests && <p className="text-red-600 text-sm mt-2">{errors.guests}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="notes" className="block font-bold text-gray-700 mb-2">
                Special Requests
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Any special requests or dietary requirements?"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-italian-red focus:border-transparent transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-italian-red text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all hover:-translate-y-1 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Submitting...' : 'Book Now'}
            </button>

            {message.text && (
              <div
                className={`mt-6 p-4 rounded-lg text-center font-medium ${
                  message.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {message.text}
              </div>
            )}
          </form>
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