import React, { useState, useEffect } from 'react';
import { FiArrowLeft, FiChevronDown, FiChevronUp, FiPlus, FiMinus, FiSearch, FiShoppingCart, FiCheck, FiX, FiZoomIn } from 'react-icons/fi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { products, categories } from '../assets/dummyData';
import { itemsPageStyles } from '../assets/dummyStyles';
import axios from 'axios';

const BACKEND = "http://localhost:8000";

// Image Popup Component
const ImagePopup = ({ image, title, onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="relative max-w-4xl max-h-full w-full">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 z-10"
        >
          <FiX className="w-8 h-8" />
        </button>
        
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl border-4 border-green-500">
          <img
            src={image}
            alt={title}
            className="w-full h-auto max-h-[80vh] object-contain"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTBiMSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-700/90 to-transparent p-4">
            <h3 className="text-white text-xl font-bold">{title}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

// Notification Component
const Notification = ({ message, type = 'success', isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
  const icon = type === 'success' ? <FiCheck className="w-5 h-5" /> : <FiX className="w-5 h-5" />;

  return (
    <div className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center space-x-3 transform transition-all duration-300 border-2 border-white ${
      isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
    } max-w-sm`}>
      <div className="flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1">
        <p className="font-bold text-sm">{message}</p>
      </div>
      <button 
        onClick={onClose}
        className="flex-shrink-0 hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
        aria-label="Close notification"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
};

// ProductCard component
const ProductCard = ({ item, onNotification, onImageClick }) => {
  const { addToCart, removeFromCart, updateQuantity, cart } = useCart();

  const productId = item.id || item._id;
  
  const cartItem = cart.find(cartItem => {
    const cartProductId = cartItem.productId?.toString();
    const currentProductId = productId?.toString();
    return cartProductId === currentProductId;
  });
  
  const lineId = cartItem?.id;
  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    console.log('Adding to cart:', productId, item.name);
    addToCart(item, 1);
    onNotification(`${item.name} added to cart!`, 'success');
  };

  const handleIncrement = () => {
    if (lineId) {
      console.log('Incrementing:', lineId, quantity + 1);
      updateQuantity(lineId, quantity + 1);
      onNotification(`${item.name} quantity updated!`, 'success');
    } else {
      addToCart(item, 1);
      onNotification(`${item.name} added to cart!`, 'success');
    }
  };

  const handleDecrement = () => {
    if (lineId) {
      console.log('Decrementing:', lineId, quantity);
      if (quantity <= 1) {
        removeFromCart(lineId);
        onNotification(`${item.name} removed from cart!`, 'success');
      } else {
        updateQuantity(lineId, quantity - 1);
        onNotification(`${item.name} quantity updated!`, 'success');
      }
    }
  };

  const getImageSrc = () => {
    if (!item.image) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTBiMSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
    }
    return item.image;
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) {
      return '0.00';
    }
    return parseFloat(price).toFixed(2);
  };

  const currentPrice = item.price ? parseFloat(item.price) : 0;
  const oldPrice = currentPrice * 1.15;

  const getUnit = (category) => {
    const units = {
      'Fruits': 'kg',
      'Vegetables': 'kg', 
      'Dairy': 'piece',
      'Beverages': 'bottle',
      'Snacks': 'pack',
      'Seafood': 'kg',
      'Bakery': 'piece',
      'Meat': 'kg'
    };
    return units[category] || 'piece';
  };

  const unit = getUnit(item.category);
  const imageSrc = getImageSrc();

  return (
    <div className="bg-white rounded-2xl shadow-lg border-2 border-green-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative group">
        <div className="h-56 bg-green-50 flex items-center justify-center overflow-hidden">
          <img
            src={imageSrc}
            className="w-full h-full object-cover cursor-pointer transition-transform duration-200 group-hover:scale-110"
            alt={item.name || 'Product image'}
            onClick={() => onImageClick(imageSrc, item.name)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTBiMSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==';
            }}
          />
        </div>
        
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
          <FiZoomIn className="w-10 h-10 text-white" />
        </div>
        
        <div className="absolute top-3 right-3 bg-green-600 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-lg">
          {unit}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-800 flex-1">
            {item.name || 'Unnamed Product'}
          </h3>
          <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-bold ml-2">
            ORGANIC
          </span>
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          Fresh organic {item.name ? item.name.toLowerCase() : 'product'} sourced locally from premium suppliers
        </p>
        
        <div className="flex items-center space-x-2 mb-4">
          <span className="text-2xl font-bold text-green-700">RS {formatPrice(currentPrice)}</span>
          {currentPrice > 0 && (
            <span className="text-sm text-gray-400 line-through"> RS {formatPrice(oldPrice)}</span>
          )}
        </div>
        
        <div className="space-y-3">
          {quantity > 0 ? (
            <>
              <div className="flex items-center justify-center bg-green-50 rounded-xl p-3 border-2 border-green-200">
                <button 
                  onClick={handleDecrement} 
                  className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors shadow-md disabled:opacity-50"
                  title="Decrease quantity"
                >
                  <FiMinus className="w-5 h-5" />
                </button>
                <span className="font-bold text-xl text-gray-800 px-8 min-w-[4rem] text-center">{quantity}</span>
                <button 
                  onClick={handleIncrement} 
                  className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center hover:bg-green-700 transition-colors shadow-md"
                  title="Increase quantity"
                >
                  <FiPlus className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center">
                <span className="text-sm font-bold text-green-700">
                  Total: Rs {formatPrice(currentPrice * quantity)}
                </span>
              </div>
            </>
          ) : (
            <button 
              onClick={handleAddToCart} 
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              title="Add to cart"
            >
              <FiShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Items = () => {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [allExpanded, setAllExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [notification, setNotification] = useState({ 
    isVisible: false, 
    message: '', 
    type: 'success' 
  });
  const [imagePopup, setImagePopup] = useState({
    isVisible: false,
    image: '',
    title: ''
  });
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount } = useCart();

  const showNotification = (message, type = 'success') => {
    setNotification({ isVisible: true, message, type });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  const handleImageClick = (image, title) => {
    setImagePopup({ isVisible: true, image, title });
  };

  const closeImagePopup = () => {
    setImagePopup({ isVisible: false, image: '', title: '' });
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        closeImagePopup();
      }
    };
    
    if (imagePopup.isVisible) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [imagePopup.isVisible]);

  const processProductData = () => {
    if (!products || !Array.isArray(products)) {
      console.error('Products data is not available');
      return [];
    }

    console.log('Processing products data:', products.length, 'items');

    const groupedData = products.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = {
          id: category,
          name: category,
          items: []
        };
      }
      acc[category].items.push(item);
      return acc;
    }, {});
    
    Object.values(groupedData).forEach(category => {
      category.items.sort((a, b) => {
        switch(sortBy) {
          case 'price-low':
            return (a.price || 0) - (b.price || 0);
          case 'price-high':
            return (b.price || 0) - (a.price || 0);
          case 'name':
          default:
            return (a.name || '').localeCompare(b.name || '');
        }
      });
    });
    
    const result = Object.values(groupedData);
    console.log('Processed categories:', result.length);
    return result;
  };

  const data = processProductData();
  const availableCategories = ['All', ...categories.map(cat => cat.name)];

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const search = queryParams.get('search');
    if (search) setSearchTerm(search);
  }, [location.search]);

  const itemMatchesSearch = (item, term) => {
    if (!term) return true;
    const cleanTerm = term.trim().toLowerCase();
    const searchWords = cleanTerm.split(/\s+/);
    const searchableText = `${item.name} ${item.category}`.toLowerCase();
    return searchWords.every(word => searchableText.includes(word));
  };

  const filteredData = data
    .filter(category => selectedCategory === 'All' || category.name === selectedCategory)
    .map(category => ({
      ...category,
      items: category.items.filter(item => itemMatchesSearch(item, searchTerm))
    }))
    .filter(category => category.items.length > 0);

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    navigate('/items');
  };

  const toggleCategory = categoryId => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleAllCategories = () => {
    if (allExpanded) {
      setExpandedCategories({});
    } else {
      const expanded = {};
      data.forEach(category => {
        expanded[category.id] = true;
      });
      setExpandedCategories(expanded);
    }
    setAllExpanded(!allExpanded);
  };

  const totalProducts = filteredData.reduce((sum, category) => sum + category.items.length, 0);

  if (!products || !Array.isArray(products)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-2xl p-12 border-4 border-red-500 shadow-2xl max-w-md text-center">
              <h3 className="text-2xl font-bold text-red-700 mb-4">Data Error</h3>
              <p className="text-gray-700">
                Unable to load product data. Please check your dummyData.jsx file.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="inline-flex items-center text-green-700 hover:text-green-800 font-bold transition-colors">
              <FiArrowLeft className="mr-2 w-5 h-5" />
              <span>Back</span>
            </Link>
            
            {cartCount > 0 && (
              <Link 
                to="/cart" 
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 transform hover:scale-105"
              >
                <FiShoppingCart className="w-5 h-5" />
                <span>Cart ({cartCount})</span>
              </Link>
            )}
          </div>

          <h1 className="text-6xl font-bold text-center mb-4">
            <span className="text-green-700">ORGANIC</span> <span className="text-gray-800">PANTRY</span>
          </h1>

          <p className="text-center text-gray-700 text-lg font-medium">
            Premium quality groceries sourced from local organic farms
          </p>
        </header>

        {/* Search and Controls */}
        <div className="mb-10 space-y-6">
          <div className="max-w-2xl mx-auto">
            <form
              onSubmit={e => {
                e.preventDefault();
                if (searchTerm.trim()) {
                  navigate(`/items?search=${encodeURIComponent(searchTerm)}`);
                }
              }}
              className="relative"
            >
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Search fruits, vegetables, meats..."
                className="w-full bg-white border-2 border-green-300 rounded-xl px-6 py-4 pr-14 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all shadow-md font-medium"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg transition-colors shadow-md">
                <FiSearch className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 justify-center">
            {availableCategories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-md ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white scale-105 shadow-lg'
                    : 'bg-white text-green-700 border-2 border-green-300 hover:bg-green-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white rounded-xl p-4 border-2 border-green-200 shadow-md">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-bold text-gray-700">
                {totalProducts} products found
                {searchTerm && ` for "${searchTerm}"`}
                {selectedCategory !== 'All' && ` in ${selectedCategory}`}
              </span>
              {(searchTerm || selectedCategory !== 'All') && (
                <button
                  onClick={clearSearch}
                  className="text-green-700 hover:text-green-800 text-sm font-bold underline"
                >
                  Clear filters
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <label className="text-sm font-bold text-gray-700">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="border-2 border-green-300 bg-white text-gray-800 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Expand/Collapse All Button */}
        {filteredData.length > 1 && (
          <div className="flex justify-center mb-10">
            <button
              onClick={toggleAllCategories}
              className="bg-white border-2 border-green-300 text-green-700 hover:bg-green-50 font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
            >
              <span>
                {allExpanded ? 'Collapse All' : 'Expand All'}
              </span>
              {allExpanded ? <FiChevronUp className="w-5 h-5" /> : <FiChevronDown className="w-5 h-5" />}
            </button>
          </div>
        )}

        {/* Products Display */}
        {filteredData.length > 0 ? (
          filteredData.map(category => {
            const isExpanded = expandedCategories[category.id] || allExpanded;
            const visibleItems = isExpanded
              ? category.items
              : category.items.slice(0, 8);
            const hasMoreItems = category.items.length > 8;

            return (
              <section
                key={category.id}
                className="mb-16"
              >
                <div className="flex items-center mb-8">
                  <h2 className="text-3xl font-bold text-green-700 mr-4">
                    {category.name} <span className="text-gray-600">({category.items.length})</span>
                  </h2>
                  <div className="flex-1 h-1 bg-gradient-to-r from-green-400 to-transparent rounded-full"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {visibleItems.map(item => (
                    <ProductCard 
                      key={item.id} 
                      item={item}
                      onNotification={showNotification}
                      onImageClick={handleImageClick}
                    />
                  ))}
                </div>

                {hasMoreItems && (
                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="bg-white border-2 border-green-300 text-green-700 hover:bg-green-50 font-bold py-3 px-8 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center space-x-2"
                    >
                      <span>
                        {isExpanded
                          ? `Show Less ${category.name}`
                          : `Show More ${category.name} (${category.items.length - 8}+ more)`}
                      </span>
                      {isExpanded ? (
                        <FiChevronUp className="text-lg" />
                      ) : (
                        <FiChevronDown className="text-lg" />
                      )}
                    </button>
                  </div>
                )}
              </section>
            );
          })
        ) : (
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="bg-white rounded-2xl p-12 border-4 border-green-500 shadow-2xl max-w-md text-center">
              <div className="mb-6">
                <FiSearch className="mx-auto h-20 w-20 text-green-600" />
              </div>
              <h3 className="text-3xl font-bold text-green-700 mb-4">
                No products found
              </h3>
              <p className="text-gray-700 mb-6">
                We couldn't find any items matching your criteria
              </p>
              <button
                onClick={clearSearch}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Image Popup */}
      <ImagePopup 
        image={imagePopup.image}
        title={imagePopup.title}
        isVisible={imagePopup.isVisible}
        onClose={closeImagePopup}
      />

      {/* Notification */}
      <Notification 
        message={notification.message}
        type={notification.type}
        isVisible={notification.isVisible}
        onClose={hideNotification}
      />
    </div>
  );
};

export default Items;