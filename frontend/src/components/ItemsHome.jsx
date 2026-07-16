import React, { useEffect, useState } from 'react';
import { itemsHomeStyles, itemsPageStyles } from '../assets/dummyStyles';
import BannerHome from './BannerHome';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext';
import { FaThList, FaShoppingCart, FaPlus, FaMinus, FaChevronRight } from 'react-icons/fa';
import { products } from '../assets/dummyData';
import axios from 'axios';

const categories = [
  { name: 'Fruits', icon: '🍎', value: 'Fruits' },
  { name: 'Vegetables', icon: '🥦', value: 'Vegetables' },
  { name: 'Dairy', icon: '🥛', value: 'Dairy' },
  { name: 'Beverages', icon: '🥤', value: 'Beverages' },
  { name: 'Snacks', icon: '🍿', value: 'Snacks' },
  { name: 'Seafood', icon: '🦐', value: 'Seafood' },
  { name: 'Bakery', icon: '🍞', value: 'Bakery' },
  { name: 'Meat', icon: '🥩', value: 'Meat' },
];

const ProductCard = ({ product, qty, onIncrease, onDecrease }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={itemsHomeStyles.productCard}>
      <div className={itemsHomeStyles.imageContainer}>
        {!imageError ? (
          <img
            src={product.image || product.imageUrl}
            alt={product.name}
            className={itemsHomeStyles.productImage}
            onError={(e) => {
              console.log('Image failed to load:', product.name);
              setImageError(true);
            }}
            onLoad={() => {
              console.log('Image loaded:', product.name);
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-center p-4">
              <div className="text-gray-400 text-4xl mb-2">📷</div>
              <span className="text-gray-500 text-sm font-medium">Image Not Available</span>
            </div>
          </div>
        )}
      </div>
      
      <div className={itemsHomeStyles.productContent}>
        <h3 className={itemsHomeStyles.productTitle}>{product.name}</h3>
        <div className={itemsHomeStyles.priceContainer}>
          <p className={itemsHomeStyles.currentPrice}>R{(product.price || 0).toFixed(2)}</p>
          <span className={itemsHomeStyles.oldPrice}>R{((product.price || 0) * 1.2).toFixed(2)}</span>
        </div>

        {qty === 0 ? (
          <button
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
            onClick={() => onIncrease(product)}
          >
            <FaShoppingCart className="text-lg" />
            <span>Add to Cart</span>
          </button>
        ) : (
          <div className="w-full bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400 rounded-lg p-3 shadow-lg">
            <div className="flex items-center justify-between">
              <button
                onClick={() => onDecrease(product)}
                className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-200"
              >
                <FaMinus className="text-sm" />
              </button>
              <div className="flex flex-col items-center bg-green-200 px-4 py-2 rounded-lg border border-green-300">
                <span className="text-xs text-green-700 font-medium uppercase tracking-wider">Quantity</span>
                <span className="text-xl font-bold text-green-800">{qty}</span>
              </div>
              <button
                onClick={() => onIncrease(product)}
                className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transform hover:scale-110 transition-all duration-200"
              >
                <FaPlus className="text-sm" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ItemsHome = () => {
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState(() =>
    localStorage.getItem("activeCategory") || "All"
  );

  useEffect(() => {
    localStorage.setItem("activeCategory", activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔄 Fetching products from API...');
        const response = await axios.get("http://localhost:4000/api/items", {
          timeout: 5000
        });
        
        console.log('✅ API Response:', response.data);
        
        if (response.data && Array.isArray(response.data)) {
          const normalized = response.data.map(p => ({
            ...p,
            id: p._id || p.id,
          }));
          setProductsData(normalized);
        } else {
          throw new Error('Invalid API response format');
        }
        
      } catch (err) {
        console.error('❌ API Error:', err.message);
        setError(err.message);
        
        console.log('📦 Loading fallback dummy data...');
        if (products && Array.isArray(products)) {
          setProductsData(products);
        } else {
          const sampleData = [
            {
              id: 'sample-1',
              name: 'Fresh Red Apples',
              price: 120,
              category: 'Fruits',
              image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=400&h=400&fit=crop'
            },
            {
              id: 'sample-2',
              name: 'Organic Bananas',
              price: 80,
              category: 'Fruits',
              image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop'
            },
            {
              id: 'sample-3',
              name: 'Fresh Carrots',
              price: 60,
              category: 'Vegetables',
              image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop'
            },
            {
              id: 'sample-4',
              name: 'Whole Milk',
              price: 95,
              category: 'Dairy',
              image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop'
            }
          ];
          setProductsData(sampleData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const navigate = useNavigate();
  const { cart, addToCart, updateQuantity, removeFromCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ FIXED: Improved cart quantity functions
  const getQuantity = (productId) => {
    const item = cart.find((cartItem) => {
      // Check both productId formats and handle string/number comparison
      const cartProductId = cartItem.productId?.toString();
      const searchProductId = productId?.toString();
      return cartProductId === searchProductId;
    });
    return item ? item.quantity : 0;
  };

  const getLineItemId = (productId) => {
    const item = cart.find((cartItem) => {
      const cartProductId = cartItem.productId?.toString();
      const searchProductId = productId?.toString();
      return cartProductId === searchProductId;
    });
    return item ? item.id : null;
  };

  const handleIncrease = (product) => {
    const productId = product.id || product._id;
    const lineId = getLineItemId(productId);
    if (lineId) {
      updateQuantity(lineId, getQuantity(productId) + 1);
    } else {
      addToCart(productId, 1);
    }
  };

  const handleDecrease = (product) => {
    const productId = product.id || product._id;
    const qty = getQuantity(productId);
    const lineId = getLineItemId(productId);
    if (qty > 1 && lineId) {
      updateQuantity(lineId, qty - 1);
    } else if (lineId) {
      removeFromCart(lineId);
    }
  };

  const productMatchesSearch = (product, term) => {
    if (!term) return true;
    const cleanTerm = term.trim().toLowerCase();
    const searchWords = cleanTerm.split(/\s+/);
    return searchWords.every(word =>
      product.name.toLowerCase().includes(word)
    );
  };

  const searchedProducts = searchTerm
    ? productsData.filter(product =>
        productMatchesSearch(product, searchTerm))
    : (activeCategory === "All"
        ? productsData
        : productsData.filter((product) => product.category === activeCategory));

  const redirectToItemsPage = () => {
    navigate("/items", { state: { category: activeCategory } });
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleCategoryClick = (value) => {
    setActiveCategory(value);
    setSearchTerm("");
  };

  const sidebarCategories = [
    {
      name: "All Items",
      icon: <FaThList className="text-lg" />,
      value: "All"
    },
    ...categories
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${itemsHomeStyles.page} bg-gray-50 min-h-screen`}>
      <BannerHome onSearch={handleSearch} />

      {searchTerm && (
        <div className="max-w-7xl mx-auto px-4 mt-4">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg px-4 py-2 inline-flex items-center space-x-2">
            <span className="text-gray-700 font-medium">
              🔍 Searching for: <span className="font-bold text-green-600">"{searchTerm}"</span>
            </span>
            <button
              onClick={() => setSearchTerm('')}
              className="ml-2 text-green-500 hover:text-green-700 text-sm bg-green-50 px-2 py-1 rounded-full transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row flex-1">
        <aside className={`${itemsPageStyles.sidebar} bg-white rounded-xl p-6 lg:w-64 w-full hidden lg:block shadow-lg border border-gray-200`}>
          <div className={itemsHomeStyles.sidebarHeader}>
            <h1 className={`${itemsHomeStyles.sidebarTitle} text-gray-800 text-2xl mb-6`} style={{ fontFamily: "'Playfair Display', serif", textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
              FreshCart
            </h1>
            <ul className="space-y-2">
              {sidebarCategories.map((category) => (
                <li key={category.name}>
                  <button
                    onClick={() => handleCategoryClick(category.value)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeCategory === category.value && !searchTerm
                        ? 'bg-green-500 text-white shadow-md font-semibold'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                    }`}
                  >
                    <div className="text-lg">{category.icon}</div>
                    <span className="text-sm font-medium">{category.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className={itemsHomeStyles.mainContent}>
          <div className="w-full overflow-x-auto scrollbar-hide py-4 lg:hidden">
            <div className="flex space-x-3 px-4">
              {[{ name: 'All Items', value: 'All' }, ...categories].map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.value)}
                  className={`px-6 py-3 rounded-full border-2 transition-all duration-200 whitespace-nowrap font-medium shadow-sm ${
                    activeCategory === cat.value && !searchTerm
                      ? 'bg-green-500 text-white border-green-500 shadow-md transform scale-105'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="text-center mb-8 max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              {searchTerm ? 'Search Results' : activeCategory === 'All' ? 'Featured Products' : `Best ${activeCategory}`}
            </h2>
            <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
            <p className="text-gray-600 mt-4 text-lg">
              {searchTerm
                ? `Discover products matching "${searchTerm}"`
                : activeCategory === 'All'
                ? 'Handpicked favorites just for you'
                : `Premium ${activeCategory.toLowerCase()} selection`}
            </p>
          </div>

          <div className={itemsHomeStyles.productsGrid}>
            {searchedProducts.length > 0 ? (
              searchedProducts.map((product) => {
                const productId = product.id || product._id;
                const qty = getQuantity(productId);
                return (
                  <ProductCard 
                    key={productId} 
                    product={product} 
                    qty={qty} 
                    onIncrease={handleIncrease} 
                    onDecrease={handleDecrease} 
                  />
                );
              })
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="text-6xl mb-4">
                  {searchTerm ? '🔍' : '📦'}
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {searchTerm ? 'No products found' : 'No products available'}
                </h3>
                <p className="text-gray-500 mb-6 text-center">
                  {searchTerm 
                    ? `We couldn't find any products matching "${searchTerm}"`
                    : `No products available in ${activeCategory} category`
                  }
                </p>
                {searchTerm && (
                  <button 
                    onClick={() => setSearchTerm('')} 
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </div>

          {!searchTerm && searchedProducts.length > 0 && (
            <div className="text-center mt-10 max-w-4xl mx-auto px-4">
              <button
                onClick={redirectToItemsPage}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3 mx-auto group"
              >
                <span className="text-lg">View All {activeCategory === 'All' ? 'Products' : activeCategory}</span>
                <FaChevronRight className="group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ItemsHome;