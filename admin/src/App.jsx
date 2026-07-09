import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AdminNavbar from './components/AdminNavbar'
import AddItemPage from './components/AddItemPage'
import LisItemPage from './components/LisItemPage'
import OdersPage from './components/OdersPage'
import AdminDashboard from './components/AdminDashboard'

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar />
      <main className="flex-grow bg-slate-50">
        <Routes>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-item" element={<AddItemPage />} />
          <Route path="/admin/list-items" element={<LisItemPage />} />
          <Route path="/admin/orders" element={<OdersPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>

      <footer className="bg-emerald-800 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm">
          <p>© {new Date().getFullYear()} Rush Basket Admin Panel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default App