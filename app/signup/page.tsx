'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
    shop_name: '',
    shop_type: '',
    village_town: '',
    district: '',
    state: '',
    country: 'India',
    years_in_business: '',
    introduction: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (!formData.full_name || !formData.email || !formData.shop_name) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error?.toLowerCase().includes('rate limit') || result.error?.toLowerCase().includes('over_email_send_rate')) {
          setError('Too many signup attempts. Please wait 2-3 minutes and try again, or use a different email.');
        } else if (result.error?.toLowerCase().includes('already') || result.error?.toLowerCase().includes('duplicate')) {
          setError('This email is already registered. Please sign in instead, or use a different email.');
        } else {
          setError(result.error || 'Could not create account. Please try again.');
        }
        setLoading(false);
        return;
      }

      // Account created successfully — redirect to login so the user can sign in
      // (Supabase may require email confirmation, so login is the right next step)
      router.push('/login?signup=success');
    } catch {
      setError('An unexpected error occurred. Please check your internet connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pandaverse-50 via-stone-50 to-amber-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-800 mb-6">
          &larr; Back to home
        </Link>
        <h1 className="text-3xl font-bold text-stone-900 mb-2">Join as a Gharana Partner</h1>
        <p className="text-stone-600 mb-8">Create your partner account and share your craft with the world.</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 space-y-6">
          <h2 className="text-xl font-semibold text-stone-800 border-b border-stone-100 pb-3">
            Account Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Full Name *</label>
              <input name="full_name" value={formData.full_name} onChange={handleChange} required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-pandaverse-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-pandaverse-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Phone Number</label>
              <input name="phone" value={formData.phone} onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-pandaverse-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Password</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} required minLength={6}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-pandaverse-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Confirm Password</label>
              <input name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-pandaverse-500" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-stone-800 border-b border-stone-100 pb-3 pt-4">
            Shop Information
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Shop Name *</label>
              <input name="shop_name" value={formData.shop_name} onChange={handleChange} required
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-pandaverse-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Shop Type</label>
              <select name="shop_type" value={formData.shop_type} onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-pandaverse-500">
                <option value="">Select type</option>
                <option value="family-business">Family Business</option>
                <option value="individual">Individual Artisan</option>
                <option value="cooperative">Cooperative / SHG</option>
                <option value="online">Online Store</option>
                <option value="retail">Retail Shop</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Village/Town</label>
              <input name="village_town" value={formData.village_town} onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-pandaverse-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">District</label>
              <input name="district" value={formData.district} onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-pandaverse-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">State</label>
              <input name="state" value={formData.state} onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-pandaverse-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Years in Business</label>
              <input name="years_in_business" type="number" min="0" value={formData.years_in_business} onChange={handleChange}
                className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-pandaverse-500" />
            </div>
          </div>

          <h2 className="text-xl font-semibold text-stone-800 border-b border-stone-100 pb-3 pt-4">
            About You
          </h2>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Short Introduction</label>
            <textarea name="introduction" rows={4} value={formData.introduction} onChange={handleChange}
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-pandaverse-500"
              placeholder="Tell us a little about yourself and your craft..." />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-pandaverse-600 text-white rounded-lg hover:bg-pandaverse-700 font-semibold text-lg disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Partner Account'}
          </button>

          <p className="text-center text-stone-600 text-sm">
            Already have an account? <Link href="/login" className="text-pandaverse-700 hover:text-pandaverse-800 font-medium">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
