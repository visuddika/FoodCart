import { CartItem } from '../models/cartModel.js';
import { Product } from '../models/productModel.js'; // මේක import කරන්න
import mongoose from 'mongoose';

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cartItems = await CartItem.find({ user: userId })
      .populate('product', 'name price imageUrl description category')
      .sort({ createdAt: -1 });

    res.json({ success: true, items: cartItems });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message,
    });
  }
};

// Add item to cart - FIXED VERSION
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user._id;

    // ✅ Product එක numeric ID එකෙන් හොයන්න
    let product;
    
    // Check if productId is a MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(productId) && String(productId).length === 24) {
      product = await Product.findById(productId);
    } else {
      // Otherwise, search by custom numeric 'id' field
      product = await Product.findOne({ id: productId });
    }

    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }

    // Check if item already in cart (use MongoDB _id)
    const existingItem = await CartItem.findOne({ 
      user: userId, 
      product: product._id // MongoDB _id use කරන්න
    });

    if (existingItem) {
      existingItem.quantity += parseInt(quantity);
      await existingItem.save();
      await existingItem.populate('product', 'name price imageUrl description category');
      return res.json({ 
        success: true, 
        message: 'Cart updated', 
        item: existingItem 
      });
    }

    // Create new cart item
    const newCartItem = new CartItem({
      user: userId,
      product: product._id, // MongoDB _id use කරන්න
      quantity: parseInt(quantity),
    });

    await newCartItem.save();
    await newCartItem.populate('product', 'name price imageUrl description category');

    res.json({ 
      success: true, 
      message: 'Item added to cart', 
      item: newCartItem 
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error adding to cart', 
      error: error.message 
    });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid cart item ID' });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });
    }

    const cartItem = await CartItem.findOne({ _id: id, user: userId });
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    cartItem.quantity = parseInt(quantity);
    await cartItem.save();
    await cartItem.populate('product', 'name price imageUrl description category');

    res.json({ success: true, message: 'Cart item updated', item: cartItem });
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ success: false, message: 'Error updating cart', error: error.message });
  }
};

// Delete cart item
export const deleteCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid cart item ID' });
    }

    const cartItem = await CartItem.findOneAndDelete({ _id: id, user: userId });
    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    res.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Delete cart item error:', error);
    res.status(500).json({ success: false, message: 'Error removing item', error: error.message });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    await CartItem.deleteMany({ user: userId });
    res.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ success: false, message: 'Error clearing cart', error: error.message });
  }
};