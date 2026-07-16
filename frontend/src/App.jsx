import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Items from './pages/Items';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import CheckoutPage from './components/CheckoutPage'; // ✅ Added import
import MyOrders from './components/MyOrders';

import { CartProvider } from './CartContext';
import Login from './components/Login';
import Signup from './components/Singup';
import Logout from './components/Logout';
import Navbar from './components/Navbar';

// Scroll to top on route change
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem('authToken'))
  );

  // Listen to authentication changes
  useEffect(() => {
    const handler = () => {
      setIsAuthenticated(Boolean(localStorage.getItem('authToken')));
    };
    window.addEventListener('authStateChanged', handler);
    return () => window.removeEventListener('authStateChanged', handler);
  }, []);

  return (
    <CartProvider>
      <ScrollToTop />
      <Navbar isAuthenticated={isAuthenticated} />

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/items" element={<Items />} />
          
        {/* Protected Pages */}
        <Route
          path="/cart"
          element={
            isAuthenticated ? <Cart /> : <Navigate replace to="/login" />
          }
        />
        <Route
          path="/checkout"
          element={
            isAuthenticated ? <CheckoutPage /> : <Navigate replace to="/login" />
          }
        />
        <Route
          path="/myorders"
          element={
            isAuthenticated ? <MyOrders /> : <Navigate replace to="/login" />
          }
        />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </CartProvider>
  );
};

export default App;
