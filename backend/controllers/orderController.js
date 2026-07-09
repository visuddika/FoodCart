// controllers/orderController.js

// CORRECT IMPORT - Make sure this points to your Order model, not Product model
import Order from '../models/orderModel.js'; // This should match your Order schema

export const createOrder = async (req, res) => {
  try {
    console.log('Creating order with request body:', req.body);
    
    // Generate unique order ID
    const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Extract and validate data
    const { customer, paymentMethod, items, shipping = 0 } = req.body;
    
    // Validation
    if (!customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
      return res.status(400).json({
        success: false,
        message: 'Complete customer information required',
        required: ['customer.name', 'customer.email', 'customer.phone', 'customer.address']
      });
    }
    
    if (!paymentMethod || !['Cash on Delivery', 'Online Payment'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: 'Valid payment method required',
        options: ['Cash on Delivery', 'Online Payment']
      });
    }
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one item required in items array'
      });
    }
    
    // Create order data matching your Order schema
    const orderData = {
      orderId,
      user: req.userId, // From auth middleware if authenticated
      customer,
      paymentMethod,
      items,
      shipping: Number(shipping) || 0
      // subtotal, tax, total calculated by pre-save middleware
    };
    
    // Create order using the correct Order model
    const newOrder = new Order(orderData);
    const savedOrder = await newOrder.save();
    
    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: savedOrder
    });
    
  } catch (error) {
    console.error('Order creation error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Other exports...
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const confirmPayment = async (req, res) => {
  res.json({ message: 'confirmPayment not implemented' });
};

export const updateOrder = async (req, res) => {
  res.json({ message: 'updateOrder not implemented' });
};

export const deleteOrder = async (req, res) => {
  res.json({ message: 'deleteOrder not implemented' });
};