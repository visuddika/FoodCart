import React from 'react';
import { FiArrowLeft, FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiPackage } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return '0.00';
    return parseFloat(price).toFixed(2);
  };

  const subtotal = Number(getCartTotal());
  const shipping = 0; // Free shipping
  const taxRate = 0.05;
  const taxes = subtotal * taxRate;
  const total = subtotal + shipping + taxes;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleCheckout = () => {
    if (!cart.length) {
      alert('Your cart is empty!');
      return;
    }
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link to="/items" className="inline-flex items-center text-green-700 hover:text-green-800 transition-colors font-bold">
              <FiArrowLeft className="mr-2" />
              Continue Shopping
            </Link>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center border-4 border-green-500">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-xl">
              <FiShoppingCart className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-4xl font-bold text-green-700 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8 text-lg">Add some organic goodness to your cart!</p>
            <Link to="/items" className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl">
              <FiPackage className="mr-2" />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/items" className="inline-flex items-center text-green-700 hover:text-green-800 transition-colors font-bold">
            <FiArrowLeft className="mr-2" />
            Continue Shopping
          </Link>
          <button onClick={clearCart} className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors font-bold">
            <FiTrash2 className="mr-2" />
            Clear Cart
          </button>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-green-700 mb-2 text-center">Your Shopping Cart</h1>
        <p className="text-gray-600 text-center mb-12 text-lg font-medium">Review your organic selections</p>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl p-6 border-2 border-green-200 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-green-50 shadow-md border-2 border-green-300">
                      <img
                        src={item.image || '/no-image.png'}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = '/no-image.png'; }}
                      />
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{item.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">RS{formatPrice(item.price)} × {item.quantity}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center bg-green-50 rounded-xl border-2 border-green-300">
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)} 
                          className="p-3 text-green-700 hover:text-white hover:bg-green-600 rounded-l-xl transition-colors"
                        >
                          <FiMinus className="w-4 h-4" />
                        </button>
                        <span className="px-6 py-3 text-gray-800 font-bold min-w-[3rem] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)} 
                          className="p-3 text-green-700 hover:text-white hover:bg-green-600 rounded-r-xl transition-colors"
                        >
                          <FiPlus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="p-3 text-red-600 hover:text-white hover:bg-red-600 rounded-xl transition-colors shadow-md" 
                        title="Remove item"
                      >
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total */}
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-700">RS{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-8 border-2 border-green-300 shadow-xl sticky top-8">
              <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">Order Summary</h2>

              <div className="space-y-3 mb-6">
                {cart.map(item => (
                  <div key={item.id} className="flex items-center gap-3 pb-3 border-b-2 border-green-100">
                    <img 
                      src={item.image || '/no-image.png'} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-lg object-cover border-2 border-green-200" 
                    />
                    <div className="flex-1">
                      <p className="text-gray-800 font-bold text-sm">{item.name}</p>
                      <p className="text-gray-600 text-xs">RS {formatPrice(item.price)} × {item.quantity}</p>
                    </div>
                    <p className="text-gray-800 font-bold">RS{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pt-4 border-t-2 border-green-200">
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Subtotal</span>
                  <span className="font-bold">RS  {formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Shipping</span>
                  <span className="font-bold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span className="font-medium">Taxes (5%)</span>
                  <span className="font-bold"> RS {formatPrice(taxes)}</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-xl p-4 mb-6 border-2 border-green-300">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-800">Total</span>
                  <span className="text-3xl font-bold text-green-700">RS {formatPrice(total)}</span>
                </div>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white font-bold py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl mb-4"
              >
                Proceed to Checkout
              </button>

              <Link 
                to="/items" 
                className="flex items-center justify-center text-green-700 hover:text-green-800 transition-colors font-bold"
              >
                <FiArrowLeft className="mr-2" />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;