import React from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiPlusCircle, FiShoppingBag, FiBarChart2 } from 'react-icons/fi';

const cards = [
  {
    title: 'Add Product',
    description: 'Create a new product listing with image, price and stock details.',
    icon: FiPlusCircle,
    to: '/admin/add-item',
    accent: 'from-emerald-500 to-green-600',
  },
  {
    title: 'Manage Products',
    description: 'Review, edit and remove existing products from the catalog.',
    icon: FiPackage,
    to: '/admin/list-items',
    accent: 'from-sky-500 to-blue-600',
  },
  {
    title: 'Orders',
    description: 'Track customer orders and update order status quickly.',
    icon: FiShoppingBag,
    to: '/admin/orders',
    accent: 'from-violet-500 to-fuchsia-600',
  },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">
                Admin panel
              </p>
              <h1 className="text-3xl font-bold text-slate-800">
                Welcome back, Admin
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
                Manage products, monitor orders and keep your shopping store running smoothly.
              </p>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-emerald-700">
              <FiBarChart2 className="text-xl" />
              <span className="font-medium">Store dashboard</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.to}
                className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className={`mb-4 inline-flex rounded-xl bg-gradient-to-r ${card.accent} p-3 text-white`}>
                  <Icon className="text-2xl" />
                </div>
                <h2 className="text-xl font-semibold text-slate-800">{card.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">{card.description}</p>
                <span className="mt-4 inline-flex text-sm font-medium text-emerald-600 transition group-hover:translate-x-1">
                  Open now →
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
