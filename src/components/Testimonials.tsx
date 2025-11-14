import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navigation from './Navigation';

interface Testimonial {
  id: string;
  customer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface FormData {
  customer_name: string;
  rating: number;
  comment: string;
}

interface FormErrors {
  customer_name?: string;
  rating?: string;
  comment?: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [formData, setFormData] = useState<FormData>({
    customer_name: '',
    rating: 0,
    comment: '',
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      setError('');

      const { data, error: supabaseError } = await supabase
        .from('comments')
        .select('*')
        .eq('approved', true)
        .order('created_at', { ascending: false });

      if (supabaseError) {
        throw supabaseError;
      }

      setTestimonials(data || []);
    } catch (err) {
      setError('Unable to load reviews. Please try again later.');
      console.error('Error loading testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  const validateName = (name: string): string => {
    if (!name || name.trim().length < 2) {
      return 'Name must be at least 2 characters long';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
      return 'Name can only contain letters and spaces';
    }
    return '';
  };

  const validateRating = (rating: number): string => {
    if (!rating || rating < 1 || rating > 5) {
      return 'Please select a rating between 1 and 5 stars';
    }
    return '';
  };

  const validateComment = (comment: string): string => {
    if (!comment || comment.trim().length < 10) {
      return 'Comment must be at least 10 characters long';
    }
    if (comment.trim().length > 500) {
      return 'Comment must be less than 500 characters';
    }
    return '';
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    const nameError = validateName(formData.customer_name);
    if (nameError) newErrors.customer_name = nameError;

    const ratingError = validateRating(formData.rating);
    if (ratingError) newErrors.rating = ratingError;

    const commentError = validateComment(formData.comment);
    if (commentError) newErrors.comment = commentError;

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

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: '' }));
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
        .from('comments')
        .insert([{
          customer_name: formData.customer_name.trim(),
          rating: formData.rating,
          comment: formData.comment.trim(),
          approved: false
        }]);

      if (supabaseError) {
        throw supabaseError;
      }

      setMessage({
        type: 'success',
        text: 'Thank you for your review! It has been submitted for approval.',
      });
      setFormData({
        customer_name: '',
        rating: 0,
        comment: '',
      });
      setErrors({});

      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      setMessage({
        type: 'error',
        text: 'Unable to submit review. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (count: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i < count ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-italian-cream">
      <Navigation />

      <div
        className="relative h-[400px] bg-cover bg-center flex items-center justify-center text-white"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1920)'
        }}
      >
        <div className="text-center z-10">
          <h1 className="text-5xl font-bold mb-2">What Our Customers Say</h1>
          <p className="text-xl">Real reviews from real people</p>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-italian-red mb-4">Share Your Experience</h2>
            <p className="text-xl text-gray-600">
              We'd love to hear from you! Leave a review and let us know how we're doing.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg max-w-3xl mx-auto mb-16">
            <h3 className="text-2xl font-bold text-red-700 mb-6 text-center">Leave a Review</h3>

            <div className="mb-6">
              <label htmlFor="customer_name" className="block font-bold text-gray-700 mb-2">
                Your Name *
              </label>
              <input
                type="text"
                id="customer_name"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                placeholder="Enter your name"
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all ${
                  errors.customer_name ? 'border-red-500' : 'border-gray-200'
                }`}
                required
              />
              {errors.customer_name && <p className="text-red-600 text-sm mt-2">{errors.customer_name}</p>}
            </div>

            <div className="mb-6">
              <label className="block font-bold text-gray-700 mb-2">Rating *</label>
              <div className="flex gap-2">
                {Array.from({ length: 5 }, (_, i) => i + 1).map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleStarClick(rating)}
                    onMouseEnter={() => setHoverRating(rating)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        rating <= (hoverRating || formData.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
              {errors.rating && <p className="text-red-600 text-sm mt-2">{errors.rating}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="comment" className="block font-bold text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows={5}
                placeholder="Tell us about your experience..."
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-700 focus:border-transparent transition-all ${
                  errors.comment ? 'border-red-500' : 'border-gray-200'
                }`}
                required
              />
              {errors.comment && <p className="text-red-600 text-sm mt-2">{errors.comment}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-italian-red text-white py-4 rounded-lg font-bold text-lg hover:opacity-90 transition-all hover:-translate-y-1 hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
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

          <div>
            <h2 className="text-4xl font-bold text-center text-italian-red mb-12">Customer Reviews</h2>

            {loading && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">Loading reviews...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-8 mb-8">
                <div className="bg-red-100 text-red-800 px-6 py-4 rounded-lg inline-block">
                  {error}
                </div>
              </div>
            )}

            {!loading && !error && testimonials.length === 0 && (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">No reviews yet. Be the first to leave a review!</p>
              </div>
            )}

            {!loading && !error && testimonials.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="bg-white p-6 rounded-xl shadow-md hover:-translate-y-2 hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-700 to-red-900 text-white flex items-center justify-center text-xl font-bold">
                        {testimonial.customer_name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-700">{testimonial.customer_name}</p>
                        <div className="flex gap-1 mt-1">{renderStars(testimonial.rating)}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 italic leading-relaxed mb-4">"{testimonial.comment}"</p>
                    <p className="text-gray-400 text-sm">
                      {new Date(testimonial.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                ))}
              </div>
            )}
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