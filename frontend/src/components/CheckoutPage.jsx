// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiArrowLeft, FiCheck, FiCreditCard, FiTruck, FiUser, 
  FiPackage, FiMapPin, FiMail, FiPhone, FiAlertCircle,
  FiCheckCircle, FiClock
} from 'react-icons/fi';
import { useCart } from '../CartContext';
import axios from 'axios';

const CheckoutPage = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'Cash on Delivery',
    notes: '',
    acceptTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // Auto-save form data to prevent loss
  useEffect(() => {
    const savedData = sessionStorage.getItem('checkoutFormData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    if (formData.name || formData.email || formData.phone || formData.address) {
      sessionStorage.setItem('checkoutFormData', JSON.stringify(formData));
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please provide a complete address';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    } else if (!/^\d{5,6}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Invalid postal code (5 or 6 digits expected)';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const applyPromoCode = async () => {
    if (!promoCode.trim()) {
      alert('Please enter a promo code');
      return;
    }

    setIsApplyingPromo(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const promoCodes = {
        'SAVE10': 10,
        'SAVE20': 20,
        'FIRST50': 50
      };

      if (promoCodes[promoCode.toUpperCase()]) {
        const discountAmount = promoCodes[promoCode.toUpperCase()];
        setDiscount(discountAmount);
        alert(`Promo code applied! You saved $${discountAmount}`);
      } else {
        alert('Invalid promo code');
      }
    } catch (err) {
      alert('Failed to apply promo code');
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const firstError = document.querySelector('.text-red-500');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    if (!cart.length) {
      alert('Your cart is empty!');
      navigate('/items');
      return;
    }

    setIsSubmitting(true);

    // Create order data with proper id field for each item
    const orderData = {
      customer: {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        postalCode: formData.postalCode.trim()
      },
      items: cart.map((item, index) => {
        // Ensure each item has a valid id
        const itemId = item.id || item.productId || `item-${index}-${Date.now()}`;
        return {
          id: itemId,
          name: item.name || 'Unknown Product',
          price: item.price || 0,
          quantity: item.quantity || 1,
          imageUrl: item.imageUrl || ''
        };
      }),
      subtotal: getCartTotal(),
      discount: discount,
      tax: getCartTotal() * 0.05,
      total: getCartTotal() + (getCartTotal() * 0.05) - discount,
      status: 'Pending',
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Unpaid',
      deliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: formData.notes.trim(),
      promoCode: promoCode.trim() || null
    };

    console.log('Submitting order:', orderData);

    try {
      const token = sessionStorage.getItem('authToken');

      const response = await axios.post(
        'http://localhost:8000/api/orders',
        orderData,
        {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` })
          },
          timeout: 10000
        }
      );

      console.log('Order response:', response.data);

      // Handle successful response
      if (response.data.success === true) {
        // Handle Online Payment Redirect
        if (response.data.checkoutUrl) {
          window.location.href = response.data.checkoutUrl;
          return;
        }

        // Get the order ID from response
        const orderDataFromResponse = response.data.data || response.data.order || response.data;
        const displayId = orderDataFromResponse.orderId || orderDataFromResponse._id || orderDataFromResponse.id || `ORDER-${Date.now()}`;
        
        setOrderId(displayId);
        setShowSuccessModal(true);
        sessionStorage.removeItem('checkoutFormData');
        
        setTimeout(() => {
          clearCart();
        }, 2000);
      } else {
        // If success is false, show error message
        throw new Error(response.data.message || 'Order creation failed');
      }
    } catch (error) {
      console.error('Order error:', error);
      
      let errorMessage = 'Failed to place order. Please try again.';
      
      if (error.response?.data) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = getCartTotal();
  const tax = total * 0.05;
  const grandTotal = total + tax - discount;

  // Success Modal
  if (showSuccessModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border-4 border-green-500">
          <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
            <FiCheckCircle className="text-white text-5xl" />
          </div>
          <h2 className="text-4xl font-bold text-green-700 mb-4">
            Order Placed Successfully!
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Thank you for your order. Your order ID is:
          </p>
          <div className="bg-green-100 rounded-xl p-5 mb-6 border-2 border-green-300">
            <p className="text-3xl font-mono font-bold text-green-700">
              #{orderId}
            </p>
          </div>
          <p className="text-green-600 mb-8 flex items-center justify-center text-lg font-medium">
            <FiClock className="inline mr-2" />
            Estimated delivery: 3 days
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // Empty Cart
  if (!cart.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-12 max-w-md w-full text-center shadow-2xl border-4 border-green-500">
          <div className="text-7xl mb-6">🛒</div>
          <h1 className="text-4xl font-bold text-green-700 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8 text-lg">
            You don't have any items to checkout.
          </p>
          <Link 
            to="/items" 
            className="inline-flex items-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105"
          >
            <FiArrowLeft className="mr-2" /> Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <Link 
          to="/cart" 
          className="inline-flex items-center text-green-700 hover:text-green-800 font-semibold mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back to Cart
        </Link>

        <div className="mb-8">
          <h1 className="text-5xl font-bold text-green-700 mb-2">
            Secure Checkout
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your purchase with confidence
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Form Sections */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Personal Information */}
              <div className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-lg">
                <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
                  <FiUser className="mr-2 text-green-600" />
                  Personal Information
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FiUser className="inline mr-1" /> Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full bg-green-50 border-2 ${errors.name ? 'border-red-500' : 'border-green-300'} rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all`}
                      placeholder="John Doe"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-500 flex items-center font-medium">
                        <FiAlertCircle className="mr-1" /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FiMail className="inline mr-1" /> Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={`w-full bg-green-50 border-2 ${errors.email ? 'border-red-500' : 'border-green-300'} rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all`}
                        placeholder="john@example.com"
                      />
                      {errors.email && (
                        <p className="mt-2 text-sm text-red-500 flex items-center font-medium">
                          <FiAlertCircle className="mr-1" /> {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        <FiPhone className="inline mr-1" /> Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className={`w-full bg-green-50 border-2 ${errors.phone ? 'border-red-500' : 'border-green-300'} rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all`}
                        placeholder="9876543210"
                      />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-500 flex items-center font-medium">
                          <FiAlertCircle className="mr-1" /> {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-lg">
                <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
                  <FiMapPin className="mr-2 text-green-600" />
                  Delivery Address
                </h2>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="3"
                      className={`w-full bg-green-50 border-2 ${errors.address ? 'border-red-500' : 'border-green-300'} rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all`}
                      placeholder="House/Flat No., Building, Street, Area"
                    />
                    {errors.address && (
                      <p className="mt-2 text-sm text-red-500 flex items-center font-medium">
                        <FiAlertCircle className="mr-1" /> {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className={`w-full bg-green-50 border-2 ${errors.city ? 'border-red-500' : 'border-green-300'} rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all`}
                        placeholder="Mumbai"
                      />
                      {errors.city && (
                        <p className="mt-2 text-sm text-red-500 flex items-center font-medium">
                          <FiAlertCircle className="mr-1" /> {errors.city}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        className={`w-full bg-green-50 border-2 ${errors.postalCode ? 'border-red-500' : 'border-green-300'} rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all`}
                        placeholder="400001"
                      />
                      {errors.postalCode && (
                        <p className="mt-2 text-sm text-red-500 flex items-center font-medium">
                          <FiAlertCircle className="mr-1" /> {errors.postalCode}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Delivery Instructions (Optional)
                    </label>
                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows="2"
                      className="w-full bg-green-50 border-2 border-green-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all"
                      placeholder="Gate code, landmark, preferred delivery time, etc."
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-lg">
                <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
                  <FiCreditCard className="mr-2 text-green-600" />
                  Payment Method
                </h2>
                
                {errors.paymentMethod && (
                  <p className="mb-4 text-sm text-red-500 flex items-center font-medium">
                    <FiAlertCircle className="mr-1" /> {errors.paymentMethod}
                  </p>
                )}
                
                <div className="space-y-3">
                  <label className="flex items-center p-4 bg-green-50 border-2 border-green-300 rounded-xl cursor-pointer hover:bg-green-100 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cash on Delivery"
                      checked={formData.paymentMethod === 'Cash on Delivery'}
                      onChange={handleChange}
                      className="h-5 w-5 text-green-600 focus:ring-green-500"
                    />
                    <div className="ml-3 flex-grow">
                      <span className="font-bold text-gray-800">
                        Cash on Delivery (COD)
                      </span>
                      <span className="block text-sm text-gray-600">
                        Pay when you receive your order
                      </span>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 bg-green-50 border-2 border-green-300 rounded-xl cursor-pointer hover:bg-green-100 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Online Payment"
                      checked={formData.paymentMethod === 'Online Payment'}
                      onChange={handleChange}
                      className="h-5 w-5 text-green-600 focus:ring-green-500"
                    />
                    <div className="ml-3 flex-grow">
                      <span className="font-bold text-gray-800">
                        Online Payment
                      </span>
                      <span className="block text-sm text-gray-600">
                        Credit/Debit Card, UPI, Net Banking (Redirect to gateway)
                      </span>
                    </div>
                  </label>
                </div>

                {/* Terms & Conditions */}
                <div className="mt-6">
                  <label className="flex items-start space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      name="acceptTerms"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="h-5 w-5 text-green-600 focus:ring-green-500 rounded mt-0.5"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-green-700 hover:text-green-800 underline font-semibold">
                        Terms and Conditions
                      </a>
                      {' '}and{' '}
                      <a href="#" className="text-green-700 hover:text-green-800 underline font-semibold">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                  {errors.acceptTerms && (
                    <p className="mt-2 text-sm text-red-500 flex items-center font-medium">
                      <FiAlertCircle className="mr-1" /> {errors.acceptTerms}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-lg sticky top-4">
                <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
                  <FiPackage className="mr-2 text-green-600" />
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-700 mb-4">
                    Items ({cart.length})
                  </h3>
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                    {cart.map((item, index) => (
                      <div key={`${item.id || item.productId || index}-${index}`} className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border-2 border-green-200">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white flex items-center justify-center flex-shrink-0 border-2 border-green-300">
                          {item.imageUrl ? (
                            <img
                              src={`http://localhost:8000${item.imageUrl}`}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/no-image.png';
                              }}
                            />
                          ) : (
                            <FiPackage className="text-green-600 text-2xl" />
                          )}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="font-bold text-gray-800 truncate">
                            {item.name}
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm text-gray-600">
                              ${item.price.toFixed(2)} × {item.quantity}
                            </span>
                            <span className="font-bold text-green-700">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Have a Promo Code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                      className="flex-grow bg-green-50 border-2 border-green-300 rounded-xl px-4 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500"
                      placeholder="SAVE10"
                    />
                    <button
                      type="button"
                      onClick={applyPromoCode}
                      disabled={isApplyingPromo}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-xl font-bold transition-all disabled:opacity-50 shadow-md hover:shadow-lg"
                    >
                      {isApplyingPromo ? '...' : 'Apply'}
                    </button>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t-2 border-green-200 pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-bold text-gray-800">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-700">Discount</span>
                      <span className="font-bold text-green-600">
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-700">Delivery</span>
                    <span className="text-green-600 font-bold">Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Tax (5%)</span>
                    <span className="font-bold text-gray-800">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 mt-3 border-t-2 border-green-200">
                    <span className="text-xl font-bold text-gray-800">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-green-700">
                      ${grandTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`mt-6 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center transform hover:scale-105 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <FiCheck className="mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCheck className="mr-2" />
                      Place Order
                    </>
                  )}
                </button>

                {/* Delivery Info */}
                <div className="mt-6 p-4 bg-gradient-to-r from-green-100 to-green-50 rounded-xl border-2 border-green-300">
                  <div className="flex items-start">
                    <FiTruck className="text-green-700 text-xl mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-green-800">
                        Fast Delivery
                      </p>
                      <p className="text-xs text-gray-700 mt-1">
                        Delivery within 30-45 minutes. Orders after 9 PM delivered next morning.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;