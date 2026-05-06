import React, { useState } from 'react';
import { Mail, Lock, User, Phone, Calendar } from 'lucide-react';
import InputField from './InputField';
import { signup } from '../services/api';

export default function SignupCard({ onBackToLogin, onSignupSuccess, selectedRole }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password_hash: '',
    phone: '',
    date_of_birth: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      role: selectedRole.toUpperCase(),
      phone: formData.phone || null,
      date_of_birth: formData.date_of_birth || null,
      profile_image_url: null
    };

    console.log("Signup formData:", formData);
    console.log("Signup payload:", payload);

    try {
      const result = await signup(payload);
      onSignupSuccess(selectedRole);
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto glass-card rounded-2xl p-8 sm:p-10 shadow-soft relative z-10">
      <div className="flex flex-col items-center mb-6 text-center">
        <img src="/brand/logo.png" alt="OvaCare Logo" className="h-32 w-auto object-contain mb-2" />
        <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-500 mt-1 text-sm">Joining as {selectedRole}</p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-500 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          id="username"
          label="Full Name"
          type="text"
          placeholder="Jane Doe"
          icon={User}
          required
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <InputField
          id="email"
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
          icon={Mail}
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <InputField
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={Lock}
          required
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <InputField
            id="phone"
            label="Phone"
            type="tel"
            placeholder="+123..."
            icon={Phone}
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <InputField
            id="dob"
            label="Birth Date"
            type="date"
            icon={Calendar}
            value={formData.date_of_birth}
            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-ai-accent hover:bg-deep-lavender text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-lavender/50 mt-4 disabled:opacity-50"
        >
          {loading ? 'Creating Account...' : 'Sign up'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="#" onClick={(e) => { e.preventDefault(); onBackToLogin(); }} className="font-semibold text-ai-accent hover:text-deep-lavender transition-colors">
          Log in
        </a>
      </p>
    </div>
  );
}
