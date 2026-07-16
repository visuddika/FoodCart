import React from 'react';
import { footerStyles } from '../assets/dummyStyles';
import { 
  FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, 
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, 
  FaCcVisa, FaCcMastercard, FaCcPaypal, FaCcAmex, FaCcApplePay 
} from 'react-icons/fa';
import { FiLink } from 'react-icons/fi';
import { BiMailSend } from 'react-icons/bi';

const Footer = () => {
  const socialLinks = [
    { icon: FaFacebookF, url: 'https://www.facebook.com/' },
    { icon: FaTwitter, url: 'https://twitter.com/' },
    { icon: FaInstagram, url: 'https://www.instagram.com/' },
    { icon: FaLinkedinIn, url: 'https://www.linkedin.com/' },
  ];

  const quickLinks = [
    { name: 'Home', url: '/' },
    { name: 'Items', url: '/items' },
    { name: 'About', url: '/about' },
    { name: 'Contact', url: '/contact' }
  ];

  return (
    <footer className="relative pt-16 pb-8 bg-gradient-to-br from-green-700 via-green-600 to-green-700 overflow-hidden">
      {/* Decorative shapes */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-white opacity-5 rounded-full"></div>
      <div className="absolute -bottom-40 -left-24 w-96 h-96 bg-white opacity-5 rounded-full"></div>
      <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-green-800 opacity-20 rounded-full animate-pulse"></div>

      {/* Content wrapper */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-white">
          
          {/* Brand Section */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white mb-4">
                RUSH<span className="text-green-200">BASKET</span>
              </h2>
              <p className="text-green-100 text-sm leading-relaxed mb-6">
                Bringing you the freshest organic produce since 2020. Our mission is to deliver farm-fresh goodness straight to your doorsteps.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, idx) => (
                <a 
                  key={idx}
                  href={social.url}
                  className="w-10 h-10 bg-white text-green-700 rounded-lg flex items-center justify-center hover:bg-green-200 hover:scale-110 transition-all duration-300 shadow-md"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="text-base" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <FiLink className="text-green-200 mr-2 text-xl" />
              <h3 className="text-xl font-bold text-white">Quick Links</h3>
            </div>
            <ul className="space-y-3">
              {quickLinks.map((link, idx) => (
                <li key={idx}>
                  <a 
                    href={link.url}
                    className="flex items-center text-green-100 hover:text-white hover:translate-x-2 transition-all duration-200 font-medium"
                  >
                    <span className="w-2 h-2 bg-green-300 rounded-full mr-3"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <FaPhoneAlt className="text-green-200 mr-2 text-xl" />
              <h3 className="text-xl font-bold text-white">Contact Us</h3>
            </div>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start">
                <FaMapMarkerAlt className="text-green-300 mr-3 mt-1 flex-shrink-0 text-lg" />
                <span className="text-green-100">123 Malabe,Colombo</span>
              </li>
              <li className="flex items-center">
                <FaPhoneAlt className="text-green-300 mr-3 flex-shrink-0 text-lg" />
                <span className="text-green-100">0741599503</span>
              </li>
              <li className="flex items-center">
                <FaEnvelope className="text-green-300 mr-3 flex-shrink-0 text-lg" />
                <span className="text-green-100">udumullagevisuddika@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-6">
              <BiMailSend className="text-green-200 mr-2 text-xl" />
              <h3 className="text-xl font-bold text-white">Newsletter</h3>
            </div>
            <p className="text-green-100 text-sm mb-4 leading-relaxed">
              Subscribe to our newsletter for fresh updates, exclusive offers, and seasonal recipes!
            </p>

            <div className="mb-4">
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter Email Address"
                  className="flex-1 px-4 py-3 text-sm bg-white text-gray-800 border-2 border-green-500 rounded-l-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 font-medium"
                />
                <button className="px-6 py-3 bg-white text-green-700 text-sm font-bold rounded-r-lg hover:bg-green-100 transition-colors duration-300 shadow-md">
                  Subscribe
                </button>
              </div>
            </div>
            <p className="text-green-200 text-xs">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        {/* Unified Bottom Bar */}
        <div className="mt-12 pt-8 border-t-2 border-green-500 flex flex-col md:flex-row items-center justify-between text-green-100 text-sm">
          
          {/* Payment Methods */}
          <div className="flex space-x-3 mb-6 md:mb-0">
            {[
              { Icon: FaCcVisa, color: 'text-blue-600' },
              { Icon: FaCcMastercard, color: 'text-red-500' },
              { Icon: FaCcPaypal, color: 'text-blue-500' },
              { Icon: FaCcAmex, color: 'text-blue-700' },
              { Icon: FaCcApplePay, color: 'text-gray-800' }
            ].map(({ Icon, color }, idx) => (
              <div key={idx} className="w-14 h-10 bg-white rounded-lg flex items-center justify-center shadow-md border-2 border-green-200 hover:scale-110 hover:shadow-lg transition-all">
                <Icon className={`${color} text-2xl`} />
              </div>
            ))}
          </div>
          {/* Copyright */}
          <p className="text-green-100 font-medium">&copy; 2024 RUSHBASKET. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;