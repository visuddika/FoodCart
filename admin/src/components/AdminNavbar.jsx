import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiPackage, FiPlusCircle, FiShoppingBag, FiX, FiMenu, FiLogOut, FiHome } from 'react-icons/fi';

const AdminNavbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogout = () => {
    closeMobileMenu();
    navigate('/admin');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-white/20 text-white' : 'text-emerald-50 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <nav className="border-b border-emerald-700 bg-emerald-700 text-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <NavLink to="/admin" className="flex items-center gap-3" onClick={closeMobileMenu}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-700">
              <FiPackage size={18} />
            </div>
            <div>
              <h1 className="text-base font-semibold">Shopping Cart</h1>
              <p className="text-xs text-emerald-100">Admin Panel</p>
            </div>
          </NavLink>

          <div className="desktop-links hidden items-center gap-2 md:flex">
            <NavLink to="/admin" className={linkClass} end>
              <FiHome size={16} />
              Dashboard
            </NavLink>
            <NavLink to="/admin/add-item" className={linkClass}>
              <FiPlusCircle size={16} />
              Add Products
            </NavLink>
            <NavLink to="/admin/list-items" className={linkClass}>
              <FiPackage size={16} />
              List Items
            </NavLink>
            <NavLink to="/admin/orders" className={linkClass}>
              <FiShoppingBag size={16} />
              Orders
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-emerald-50 transition hover:bg-white/10 hover:text-white"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>

          <button
            onClick={toggleMobileMenu}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 p-2 text-white md:hidden"
          >
            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-emerald-600 bg-emerald-700 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            <NavLink to="/admin" onClick={closeMobileMenu} className={linkClass} end>
              <FiHome size={16} />
              Dashboard
            </NavLink>
            <NavLink to="/admin/add-item" onClick={closeMobileMenu} className={linkClass}>
              <FiPlusCircle size={16} />
              Add Products
            </NavLink>
            <NavLink to="/admin/list-items" onClick={closeMobileMenu} className={linkClass}>
              <FiPackage size={16} />
              List Items
            </NavLink>
            <NavLink to="/admin/orders" onClick={closeMobileMenu} className={linkClass}>
              <FiShoppingBag size={16} />
              Orders
            </NavLink>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full px-3 py-2 text-left text-sm font-medium text-emerald-50 transition hover:bg-white/10 hover:text-white"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;