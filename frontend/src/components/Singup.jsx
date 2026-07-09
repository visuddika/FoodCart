import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
        navigate('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (apiError) {
      setApiError('');
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.agreeToTerms) newErrors.agreeToTerms = 'You must agree to Terms';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(v => !v);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setApiError('');

    try {
      const res = await axios.post(
        'http://localhost:8000/api/user/register',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
        { 
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      if (res.data.success) {
        setShowToast(true);
        setFormData({
          name: '',
          email: '',
          password: '',
          agreeToTerms: false,
        });
      } else {
        setApiError(res.data.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.code === 'ECONNABORTED') {
        setApiError('Request timeout. Please try again.');
      } else if (err.response && err.response.data) {
        setApiError(err.response.data.message || 'Registration failed');
      } else if (err.request) {
        setApiError('Unable to connect to server. Please check if the server is running.');
      } else {
        setApiError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Custom SVG Icons
  const ArrowLeftIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  );

  const CheckIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const MailIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const LockIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  );

  const EyeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L12 12m-3.12-3.12L12 12m0 0l2.122 2.122M15 12l3.878-3.878" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex flex-col items-center justify-center px-4 py-8">
      {/* Back to Login */}
      <Link to="/login" className="inline-flex items-center text-green-700 hover:text-green-800 mb-8 transition-colors no-underline font-bold">
        <ArrowLeftIcon />
        <span className="ml-2">Back to Login</span>
      </Link>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center z-50 border-2 border-white">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-3">
            <CheckIcon />
          </div>
          <span className="font-bold">Account created successfully!</span>
        </div>
      )}

      {/* API Error */}
      {apiError && (
        <div className="bg-red-100 border-2 border-red-500 text-red-700 px-6 py-3 rounded-xl mb-4 text-center font-bold max-w-md">
          {apiError}
        </div>
      )}

      {/* Signup Card */}
      <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-md border-4 border-green-500">
        {/* Logo Avatar */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserIcon />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-green-700 text-center mb-8">Create Account</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600">
              <UserIcon />
            </div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full bg-green-50 text-gray-800 pl-12 pr-4 py-4 rounded-xl border-2 border-green-300 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all disabled:opacity-50 font-medium"
              disabled={isLoading}
            />
            {errors.name && <p className="text-red-500 text-sm mt-2 font-medium">{errors.name}</p>}
          </div>

          {/* Email Field */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600">
              <MailIcon />
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full bg-green-50 text-gray-800 pl-12 pr-4 py-4 rounded-xl border-2 border-green-300 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all disabled:opacity-50 font-medium"
              disabled={isLoading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-2 font-medium">{errors.email}</p>}
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-green-600">
              <LockIcon />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full bg-green-50 text-gray-800 pl-12 pr-14 py-4 rounded-xl border-2 border-green-300 focus:border-green-500 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all disabled:opacity-50 font-medium"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700 transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              disabled={isLoading}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
            {errors.password && <p className="text-red-500 text-sm mt-2 font-medium">{errors.password}</p>}
          </div>

          {/* Terms Agreement */}
          <div>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                className="mt-1 w-5 h-5 text-green-600 bg-green-50 border-2 border-green-300 rounded focus:ring-green-500 focus:ring-2 disabled:opacity-50"
                disabled={isLoading}
              />
              <span className="text-gray-700 text-sm font-medium">I agree to the Terms and Conditions</span>
            </label>
            {errors.agreeToTerms && <p className="text-red-500 text-sm mt-2 font-medium">{errors.agreeToTerms}</p>}
          </div>

          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center transform hover:scale-105"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-gray-700 font-medium">
          Already have an account?{' '}
          <Link to="/login" className="text-green-700 hover:text-green-800 font-bold no-underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;