import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaCheck, FaPhone, FaTag, FaComment, FaPaperPlane } from 'react-icons/fa';
import contactStyles from '../assets/dummyStyles';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [showToast, setShowToast] = useState(false);

  // Replace with your WhatsApp number (with country code, no '+' or dashes)
  const whatsappNumber = '8299431275';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, phone, subject, message } = formData;
    if (!name || !email || !phone || !subject || !message) {
      alert('Please fill all fields');
      return;
    }

    // Build WhatsApp message
    const text = 
      `Name: ${name}\n` +
      `Email: ${email}\n` +
      `Phone: ${phone}\n` +
      `Subject: ${subject}\n` +
      `Message: ${message}`;

    // Open WhatsApp Web with pre-filled message
    const url = 
      `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    // Show confirmation toast
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);

    // Reset form
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-12 px-4">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in">
          <div className="bg-white border-2 border-green-500 rounded-xl px-6 py-4 shadow-2xl flex items-center">
            <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
              <FaCheck className="text-white text-lg" />
            </div>
            <span className="font-bold text-green-700">Message opened in WhatsApp!</span>
          </div>
        </div>
      )}

      {/* Centered Container */}
      <div className="max-w-2xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-green-700 mb-6">
            Contact FreshGrocers
          </h1>
          <p className="text-gray-700 text-lg font-medium">
            We'd love to hear from you! Send us a message.
          </p>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-3xl shadow-2xl border-4 border-green-500 p-8 relative overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full -mr-32 -mt-32 opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-green-200 rounded-full -ml-24 -mb-24 opacity-30"></div>
          
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600">
                  <FaUser className="text-xl" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-green-50 border-2 border-green-300 rounded-xl pl-12 pr-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all font-medium"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600">
                  <FaEnvelope className="text-xl" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-green-50 border-2 border-green-300 rounded-xl pl-12 pr-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all font-medium"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600">
                  <FaPhone className="text-xl" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-green-50 border-2 border-green-300 rounded-xl pl-12 pr-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all font-medium"
                  placeholder="(123) 456-7890"
                  required
                />
              </div>
            </div>

            {/* Subject Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Subject
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-600">
                  <FaTag className="text-xl" />
                </div>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-green-50 border-2 border-green-300 rounded-xl pl-12 pr-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all font-medium"
                  placeholder="Order Inquiry"
                  required
                />
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Your Message
              </label>
              <div className="relative">
                <div className="absolute left-4 top-4 text-green-600">
                  <FaComment className="text-xl" />
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full bg-green-50 border-2 border-green-300 rounded-xl pl-12 pr-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all font-medium resize-none"
                  placeholder="Type your message here..."
                  required
                ></textarea>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center space-x-3 transform hover:scale-105"
            >
              <span className="text-lg">Send Message</span>
              <FaPaperPlane className="text-xl" />
            </button>
          </form>
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-6 border-2 border-green-300 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaPhone className="text-green-700 text-xl" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Call Us</h3>
            <p className="text-sm text-gray-600">+91 {whatsappNumber}</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border-2 border-green-300 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaEnvelope className="text-green-700 text-xl" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Email Us</h3>
            <p className="text-sm text-gray-600">info@freshgrocers.com</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border-2 border-green-300 text-center shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <FaCheck className="text-green-700 text-xl" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Quick Response</h3>
            <p className="text-sm text-gray-600">Within 24 hours</p>
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ContactUs;