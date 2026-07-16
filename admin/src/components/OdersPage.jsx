import React, { useState, useEffect } from 'react';
import {
  FiCheck,
  FiX,
  FiTruck,
  FiPackage,
  FiCreditCard,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiEdit,
  FiRefreshCw
} from 'react-icons/fi';
import axios from 'axios';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editedStatus, setEditedStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const statusOptions = ['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  // Fetch orders from backend API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = sessionStorage.getItem('authToken');
      const response = await axios.get('http://localhost:8000/api/orders', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      console.log('Fetched orders:', response.data);
      
      if (response.data.success) {
        // Handle different response formats
        const ordersData = response.data.orders || response.data.data || response.data;
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else {
        setError(response.data.message || 'Failed to fetch orders');
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again.');
      // Fallback to mock data if API fails
      setOrders(getMockOrders());
    } finally {
      setLoading(false);
    }
  };

  // Mock data fallback
  const getMockOrders = () => [
    {
      _id: '66f9a1c7b2f4a3d8e7c5b1a9',
      orderId: 'ORDER-1758952243587-ckhyg6bav',
      customer: {
        name: 'naven',
        email: 'naven@example.com',
        phone: '123-456-7890',
        address: '123 Main Street'
      },
      date: '2025-09-27T05:30:43.590Z',
      items: [
        {
          _id: 'item1',
          name: 'Product Name',
          price: 25.00,
          quantity: 2,
          imageUrl: '/uploads/product1.jpg'
        }
      ],
      total: 52.50,
      status: 'Pending',
      paymentStatus: 'Unpaid',
      paymentMethod: 'Cash on Delivery',
      notes: 'Please deliver between 2-5 PM'
    }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = [...orders];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order =>
        order._id?.toLowerCase().includes(term) ||
        order.orderId?.toLowerCase().includes(term) ||
        order.customer?.name?.toLowerCase().includes(term) ||
        order.customer?.phone?.includes(term) ||
        (order.customer?.email && order.customer.email.toLowerCase().includes(term))
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(order => order.status === statusFilter);
    }

    if (paymentFilter !== 'All') {
      result = result.filter(order => order.paymentStatus === paymentFilter);
    }

    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = sessionStorage.getItem('authToken');
      
      // Update in backend
      const response = await axios.put(
        `http://localhost:8000/api/orders/${orderId}`,
        { status: newStatus },
        {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        // Update local state
        setOrders(prev =>
          prev.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        setFilteredOrders(prev =>
          prev.map(o =>
            o._id === orderId ? { ...o, status: newStatus } : o
          )
        );
      } else {
        alert('Failed to update order status');
      }
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order status');
    }
  };

  const cancelOrder = (orderId) => {
    updateOrderStatus(orderId, 'Cancelled');
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setEditedStatus(order.status);
    setIsDetailModalOpen(true);
  };

  const closeModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
    setEditedStatus('');
  };

  const handleSaveChanges = () => {
    if (selectedOrder && editedStatus !== selectedOrder.status) {
      updateOrderStatus(selectedOrder._id, editedStatus);
      setSelectedOrder({ ...selectedOrder, status: editedStatus });
    }
    closeModal();
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Processing': 'bg-blue-100 text-blue-800 border-blue-200',
      'Shipped': 'bg-purple-100 text-purple-800 border-purple-200',
      'Delivered': 'bg-green-100 text-green-800 border-green-200',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPaymentBadgeColor = (status) => {
    return status === 'Paid' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FiRefreshCw className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-600 mt-2">View, manage, and track customer orders</p>
            </div>
            <button
              onClick={fetchOrders}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <FiRefreshCw className="mr-2" />
              Refresh
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FiX className="h-5 w-5 text-red-400 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <input
                type="text"
                placeholder="Search orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Payment</option>
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-blue-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <FiPackage className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-amber-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-amber-100">
                <FiTruck className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Processing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'Processing').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-emerald-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-emerald-100">
                <FiCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === 'Delivered').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-red-100">
                <FiCreditCard className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Payment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.paymentStatus === 'Unpaid').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <FiPackage className="h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {orders.length === 0 ? 'No orders yet' : 'No orders found'}
                        </h3>
                        <p className="text-gray-500">
                          {orders.length === 0 ? 'Orders will appear here once customers place orders' : 'Try changing your filters'}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-mono text-blue-600">
                          {order.orderId || order._id}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.customer?.name}</div>
                        <div className="text-sm text-gray-500">{order.customer?.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.date || order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.items?.length || 0} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${order.total?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadgeColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPaymentBadgeColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewOrderDetails(order)}
                            className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded border border-blue-300 hover:bg-blue-50"
                          >
                            View
                          </button>
                          <button
                            onClick={() => cancelOrder(order._id)}
                            disabled={order.status === 'Cancelled' || order.status === 'Delivered'}
                            className={`px-3 py-1 rounded border ${
                              order.status === 'Cancelled' || order.status === 'Delivered'
                                ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'text-red-600 hover:text-red-900 border-red-300 hover:bg-red-50'
                            }`}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal - Keep the same modal code from your original */}
      {isDetailModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Order Details: {selectedOrder.orderId || selectedOrder._id}
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Ordered on {formatDate(selectedOrder.date || selectedOrder.createdAt)}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div>
                    <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                      <FiUser className="mr-2" />
                      Customer Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="font-medium text-gray-900">{selectedOrder.customer?.name}</div>
                      <div className="flex items-center text-gray-600">
                        <FiMail className="mr-2 flex-shrink-0" />
                        {selectedOrder.customer?.email || 'No email provided'}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiPhone className="mr-2 flex-shrink-0" />
                        {selectedOrder.customer?.phone}
                      </div>
                      <div className="flex items-start text-gray-600">
                        <FiMapPin className="mr-2 mt-1 flex-shrink-0" />
                        <span>{selectedOrder.customer?.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Notes */}
                  {selectedOrder.notes && (
                    <div>
                      <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                        <FiEdit className="mr-2" />
                        Delivery Notes
                      </h3>
                      <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                        <p className="text-gray-700">{selectedOrder.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Status Controls */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Update Order Status
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Status
                      </label>
                      <select
                        value={editedStatus}
                        onChange={(e) => setEditedStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {statusOptions.filter(o => o !== 'All').map(option => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {editedStatus !== selectedOrder.status && (
                        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700">
                          Status will be changed from "{selectedOrder.status}" to "{editedStatus}"
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Order Summary */}
                  <div>
                    <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                      <FiPackage className="mr-2" />
                      Order Summary
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                      {selectedOrder.items?.map((item, index) => (
                        <div
                          key={item._id || index}
                          className={`flex items-center space-x-4 ${
                            index < selectedOrder.items.length - 1 ? 'border-b border-gray-200 pb-4' : ''
                          }`}
                        >
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FiPackage className="text-gray-400" />
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-gray-600">${item.price.toFixed(2)} × {item.quantity}</div>
                          </div>
                          <div className="font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}

                      {/* Order Totals */}
                      <div className="border-t border-gray-200 pt-4 space-y-2">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal</span>
                          <span>${selectedOrder.total?.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Shipping</span>
                          <span className="text-emerald-600">Free</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Tax (5%)</span>
                          <span>${(selectedOrder.total * 0.05).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-300 pt-2">
                          <span>Total</span>
                          <span className="text-emerald-700">
                            ${(selectedOrder.total * 1.05).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div>
                    <h3 className="flex items-center text-lg font-semibold text-gray-900 mb-4">
                      <FiCreditCard className="mr-2" />
                      Payment Information
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium text-gray-900">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Payment Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPaymentBadgeColor(selectedOrder.paymentStatus)}`}>
                          {selectedOrder.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveChanges}
                  disabled={editedStatus === selectedOrder.status}
                  className={`px-4 py-2 rounded-lg ${
                    editedStatus === selectedOrder.status
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersPage;