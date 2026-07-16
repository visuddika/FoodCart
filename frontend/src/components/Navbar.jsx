import React, { useState, useEffect, useRef } from 'react';
import { navbarStyles } from '../assets/dummyStyles';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import {
  FaHome,
  FaBox,
  FaEnvelope,
  FaOpencart,
  FaBars,
  FaTimes,
  FaClipboardList,
} from 'react-icons/fa';
import { FiX, FiUser } from 'react-icons/fi';
import { useCart } from '../CartContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItems, cart } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState(location.pathname);
  const [isOpen, setIsOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const [showCartPulse, setShowCartPulse] = useState(false);
  const [showCartPreview, setShowCartPreview] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem('authToken')));
  const prevCartCountRef = useRef(totalItems);
  const mobileMenuRef = useRef(null);
  const cartPreviewRef = useRef(null);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    localStorage.clear();
    window.dispatchEvent(new Event('authStateChanged'));
    setIsLoggedIn(false);
    navigate('/');
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active tab update
  useEffect(() => setActiveTab(location.pathname), [location.pathname]);

  // Cart animation
  useEffect(() => {
    if (totalItems > prevCartCountRef.current) {
      setCartBounce(true);
      setShowCartPulse(true);
      const bounceTimeout = setTimeout(() => setCartBounce(false), 800);
      const pulseTimeout = setTimeout(() => setShowCartPulse(false), 2000);
      return () => {
        clearTimeout(bounceTimeout);
        clearTimeout(pulseTimeout);
      };
    }
    prevCartCountRef.current = totalItems;
  }, [totalItems]);

  // Close cart preview on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartPreviewRef.current && !cartPreviewRef.current.contains(event.target)) {
        setShowCartPreview(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-hide cart preview
  useEffect(() => {
    if (showCartPreview) {
      const timer = setTimeout(() => setShowCartPreview(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showCartPreview]);

  // Navigation items (conditionally show My Orders)
  const navItems = [
    { name: 'Home', path: '/', icon: <FaHome /> },
    { name: 'Items', path: '/items', icon: <FaBox /> },
    { name: 'Contact', path: '/contact', icon: <FaEnvelope /> },
    ...(isLoggedIn ? [{ name: 'My Orders', path: '/myorders', icon: <FaClipboardList /> }] : []),
  ];

  return (
    <nav className={`${navbarStyles.nav} ${scrolled ? navbarStyles.scrolledNav : navbarStyles.unscrolledNav}`}>
      <div className={navbarStyles.borderGradient} />

      {/* Logo + Desktop Nav */}
      <div className={navbarStyles.container}>
        <div className={navbarStyles.innerContainer}>
          {/* Logo */}
          <Link to="/" className={navbarStyles.logoLink}>
            <img src={logo} alt="FoodCart Logo" className={`${navbarStyles.logoImage} ${scrolled ? 'h-10 w-10' : 'h-12 w-12'}`} />
            <span className={navbarStyles.logoText}>FoodCart</span>
          </Link>

          {/* Desktop Navigation */}
          <div className={navbarStyles.desktopNav}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setActiveTab(item.path)}
                className={`${navbarStyles.navItem} ${activeTab === item.path ? navbarStyles.activeNavItem : navbarStyles.inactiveNavItem}`}
              >
                <div className="flex items-center">
                  <span className={`${navbarStyles.navIcon} ${activeTab === item.path ? navbarStyles.activeNavIcon : navbarStyles.inactiveNavIcon}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>
                <div className={`${navbarStyles.navIndicator} ${activeTab === item.path ? navbarStyles.activeIndicator : navbarStyles.inactiveIndicator}`} />
              </Link>
            ))}
          </div>

          {/* Icons: Login/Logout + Cart + Hamburger */}
          <div className={navbarStyles.iconsContainer}>
            {isLoggedIn ? (
              <button onClick={handleLogout} className={navbarStyles.loginLink} aria-label="Logout">
                <FiUser className={navbarStyles.loginIcon} />
                <span className="ml-1 text-white">Logout</span>
              </button>
            ) : (
              <Link to="/login" className={navbarStyles.loginLink}>
                <FiUser className={navbarStyles.loginIcon} />
                <span className="ml-1 text-white">Login</span>
              </Link>
            )}

            {/* Cart */}
            <div className="relative" ref={cartPreviewRef}>
              <Link
                to="/cart"
                className={`${navbarStyles.cartLink} ${showCartPulse ? 'animate-pulse' : ''}`}
                onMouseEnter={() => totalItems > 0 && setShowCartPreview(true)}
              >
                <FaOpencart className={`${navbarStyles.cartIcon} ${cartBounce ? 'animate-bounce' : ''} ${showCartPulse ? 'animate-ping' : ''}`} />
                {totalItems > 0 && (
                  <>
                    <span className={`${navbarStyles.cartBadge}`}>{totalItems > 99 ? '99+' : totalItems}</span>
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-400 rounded-full animate-ping opacity-75"></span>
                  </>
                )}
              </Link>

              {/* Cart Preview */}
              {showCartPreview && totalItems > 0 && (
                <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 transform transition-all duration-200 animate-slideDown">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-800">Cart Items ({totalItems})</h3>
                      <button onClick={() => setShowCartPreview(false)} className="text-gray-400 hover:text-gray-600">
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {cart.slice(0, 4).map((item, index) => (
                        <div key={item.id || index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md">
                          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                          <div className="flex-1">
                            <div className="text-sm text-gray-700">Item #{item.productId}</div>
                            <div className="text-xs text-gray-500">Quantity: {item.quantity}</div>
                          </div>
                        </div>
                      ))}
                      {cart.length > 4 && <div className="text-xs text-gray-500 text-center py-2">+{cart.length - 4} more items</div>}
                    </div>
                    <Link to="/cart" onClick={() => setShowCartPreview(false)} className="block mt-4 text-center bg-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:bg-emerald-700 transition-colors">
                      View Full Cart
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button onClick={() => setIsOpen(!isOpen)} className={navbarStyles.hamburgerButton} aria-label={isOpen ? 'Close menu' : 'Open menu'}>
              {isOpen ? <FaTimes className="h-6 w-6 text-white" /> : <FaBars className="h-6 w-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${navbarStyles.mobileOverlay} ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'} fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-300`} onClick={() => setIsOpen(false)}>
        <div
          ref={mobileMenuRef}
          className={`${navbarStyles.mobilePanel} ${isOpen ? 'translate-x-0' : 'translate-x-full'} fixed right-0 top-0 bottom-0 z-50 w-4/5 max-w-sm transition-transform duration-300`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={navbarStyles.mobileHeader}>
            <div className={navbarStyles.mobileLogo}>
              <img src={logo} alt="FoodCart Logo" className={navbarStyles.mobileLogoImage} />
              <span className={navbarStyles.mobileLogoText}>FoodCart</span>
            </div>
            <button onClick={() => setIsOpen(false)} className={navbarStyles.closeButton} aria-label="Close menu">
              <FiX className="h-6 w-6 text-white" />
            </button>
          </div>

          <div className={navbarStyles.mobileItemsContainer}>
            {navItems.map((item, idx) => (
              <Link
                key={item.name}
                to={item.path}
                className={navbarStyles.mobileItem}
                style={{
                  transitionDelay: isOpen ? `${idx * 100}ms` : '0ms',
                  opacity: isOpen ? 1 : 0,
                  transform: `translateX(${isOpen ? 0 : '20px'})`,
                }}
                onClick={() => setIsOpen(false)}
              >
                <span className={navbarStyles.mobileItemIcon}>{item.icon}</span>
                <span className={navbarStyles.mobileItemText}>{item.name}</span>
              </Link>
            ))}

            {/* Mobile Cart Link */}
            <Link to="/cart" className={`${navbarStyles.mobileItem} relative`} onClick={() => setIsOpen(false)}>
              <span className={navbarStyles.mobileItemIcon}>
                <FaOpencart className={cartBounce ? 'animate-bounce' : ''} />
              </span>
              <span className={navbarStyles.mobileItemText}>Cart</span>
              {totalItems > 0 && (
                <span className="absolute right-4 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems > 99 ? '99+' : totalItems}
                </span>
              )}
            </Link>

            {/* Login/Logout */}
            <div className={navbarStyles.mobileButtons}>
              {isLoggedIn ? (
                <button onClick={() => { handleLogout(); setIsOpen(false); }} className={navbarStyles.loginButton}>
                  <FiUser className={navbarStyles.loginButtonIcon} /> Logout
                </button>
              ) : (
                <Link to="/login" className={navbarStyles.loginButton} onClick={() => setIsOpen(false)}>
                  <FiUser className={navbarStyles.loginButtonIcon} /> Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        @keyframes slideDown { from {opacity:0; transform:translateY(-10px);} to {opacity:1; transform:translateY(0);} }
        .animate-slideDown { animation: slideDown 0.2s ease-out; }
        @keyframes cartPulse { 0%,100%{transform:scale(1);} 50%{transform:scale(1.1);} }
        .cart-pulse { animation: cartPulse 1s infinite; }
      `}</style>
    </nav>
  );
};

export default Navbar;
