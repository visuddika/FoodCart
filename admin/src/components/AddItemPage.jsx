import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { 
  FiUpload, FiX, FiSave, FiRefreshCcw, FiAlertCircle, 
  FiCheckCircle, FiEye, FiCamera, FiDollarSign, FiPackage,
  FiInfo, FiTrendingUp
} from "react-icons/fi";
import FoodBanner from "../assets/Grocery1.jpg";

const initialFormState = {
  name: "",
  description: "",
  category: "",
  oldPrice: "",
  price: "",
  stock: "",
  sku: "",
  tags: "",
  image: null,
  preview: "",
};

const categories = [
  "Fruits",
  "Vegetables", 
  "Dairy",
  "Beverages",
  "Snacks",
  "Seafood",
  "Bakery",
  "Meat",
  "Organic",
  "Frozen",
];

const suggestedTags = [
  "organic", "fresh", "premium", "local", "seasonal", "healthy",
  "natural", "gluten-free", "vegan", "low-fat", "sugar-free"
];

export default function AddItemPage() {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 6000);
  };

  const generateSKU = () => {
    const category = formData.category.substring(0, 3).toUpperCase();
    const name = formData.name.substring(0, 3).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${category}${name}${random}`;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Product name must be at least 2 characters";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.oldPrice) {
      newErrors.oldPrice = "Original price is required";
    } else if (parseFloat(formData.oldPrice) <= 0) {
      newErrors.oldPrice = "Original price must be greater than 0";
    }
    
    if (!formData.price) {
      newErrors.price = "Selling price is required";
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = "Selling price must be greater than 0";
    }
    
    if (formData.oldPrice && formData.price && parseFloat(formData.price) > parseFloat(formData.oldPrice)) {
      newErrors.price = "Selling price cannot be higher than original price";
    }

    if (formData.stock && parseInt(formData.stock) < 0) {
      newErrors.stock = "Stock quantity cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Auto-generate SKU when name or category changes
    if (name === 'name' || name === 'category') {
      if (formData.name && formData.category) {
        setFormData((prev) => ({ ...prev, sku: generateSKU() }));
      }
    }
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageFile(e.dataTransfer.files[0]);
    }
  };

  const handleImageFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      showNotification('error', 'File size must be less than 5MB');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showNotification('error', 'Only JPEG, JPG, PNG, and WebP files are allowed');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      image: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    handleImageFile(file);
  };

  const removeImage = () => {
    if (formData.preview && formData.image) {
      URL.revokeObjectURL(formData.preview);
    }
    setFormData((prev) => ({ ...prev, image: null, preview: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const generateAIImage = async () => {
    if (!formData.name.trim()) {
      showNotification('error', 'Please enter a product name first to generate relevant image');
      return;
    }

    setLoadingAI(true);
    try {
      const searchTerm = encodeURIComponent(`${formData.name} ${formData.category || 'food'}`);
      const aiImageUrl = `https://source.unsplash.com/600x600/?${searchTerm}`;
      
      // Download the image and convert to file
      const response = await fetch(aiImageUrl);
      const blob = await response.blob();
      const file = new File([blob], `ai-${formData.name.replace(/\s+/g, '-')}.jpg`, { type: 'image/jpeg' });
      
      setFormData((prev) => ({
        ...prev,
        image: file, // Save as actual file instead of just URL
        preview: URL.createObjectURL(file),
      }));
      
      showNotification('success', 'AI image generated and ready for upload!');
      
    } catch (error) {
      console.error("AI image generation failed:", error);
      showNotification('error', 'Failed to generate AI image');
    } finally {
      setLoadingAI(false);
    }
  };

  const addTag = (tag) => {
    const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    if (!currentTags.includes(tag)) {
      const newTags = [...currentTags, tag].join(', ');
      setFormData(prev => ({ ...prev, tags: newTags }));
    }
  };

  const resetForm = () => {
    if (formData.preview && formData.image) {
      URL.revokeObjectURL(formData.preview);
    }
    setFormData(initialFormState);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showNotification('error', 'Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("category", formData.category);
      formDataToSend.append("oldPrice", parseFloat(formData.oldPrice).toFixed(2));
      formDataToSend.append("price", parseFloat(formData.price).toFixed(2));
      formDataToSend.append("stock", parseInt(formData.stock) || 0);
      formDataToSend.append("sku", formData.sku || generateSKU());
      formDataToSend.append("tags", formData.tags);
      
      if (formData.image) {
        // Real uploaded image file
        formDataToSend.append("image", formData.image);
      } else if (formData.preview && !formData.image) {
        // AI generated image URL
        formDataToSend.append("imageUrl", formData.preview);
      }

      const response = await axios.post(
        "http://localhost:8000/api/items",
        formDataToSend,
        { 
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000
        }
      );

      console.log("Product created successfully:", response.data);
      showNotification('success', 'Product added successfully! 🎉');
      resetForm();
      
    } catch (error) {
      console.error('Error adding product:', error);
      
      if (error.response) {
        const message = error.response.data?.message || `Server error (${error.response.status})`;
        showNotification('error', message);
      } else if (error.request) {
        showNotification('error', 'Network error. Please check your connection and server status.');
      } else {
        showNotification('error', 'Request setup error: ' + error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (formData.preview && formData.image) {
        URL.revokeObjectURL(formData.preview);
      }
    };
  }, []);

  const { name, description, category, oldPrice, price, stock, sku, tags, preview } = formData;

  const InputField = ({ label, name, type = "text", required = false, error, icon, ...props }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        <div className="flex items-center gap-2">
          {icon && <span className="text-gray-500">{icon}</span>}
          {label} {required && <span className="text-red-500">*</span>}
        </div>
      </label>
      <input
        type={type}
        name={name}
        className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition duration-200 ${
          error 
            ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
            : 'border-gray-300 focus:ring-emerald-400 focus:border-emerald-400'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
          <FiAlertCircle size={14} />
          {error}
        </p>
      )}
    </div>
  );

  const calculateProfit = () => {
    if (oldPrice && price) {
      const profit = parseFloat(price) - (parseFloat(oldPrice) * 0.7); // Assuming 70% cost
      return profit > 0 ? profit.toFixed(2) : '0.00';
    }
    return '0.00';
  };

  return (
    <div className="min-h-screen flex justify-center items-start py-8 px-4 relative">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center filter blur-md"
        style={{ backgroundImage: `url(${FoodBanner})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50" />

      {/* Enhanced Notification */}
      {notification.show && (
        <div className={`fixed top-6 right-6 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 max-w-md transform transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200' 
            : 'bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border border-red-200'
        }`}>
          <div className={`p-2 rounded-full ${notification.type === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
            {notification.type === 'success' ? <FiCheckCircle size={20} /> : <FiAlertCircle size={20} />}
          </div>
          <div>
            <p className="font-medium">{notification.message}</p>
          </div>
        </div>
      )}

      {/* Product Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Product Preview</h3>
              <button onClick={() => setShowPreview(false)} className="text-gray-500 hover:text-gray-700">
                <FiX size={20} />
              </button>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-lg">{name || "Product Name"}</h4>
              <p className="text-gray-600 text-sm">{description || "Product description"}</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 line-through">₹{oldPrice || "0"}</span>
                <span className="text-emerald-600 font-bold text-lg">₹{price || "0"}</span>
              </div>
              <div className="text-xs text-gray-500">SKU: {sku || "AUTO-GENERATED"}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="relative w-full max-w-5xl bg-white/95 shadow-2xl rounded-3xl p-8 md:p-12 backdrop-blur-lg border border-white/30 z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full">
              <FiPackage className="text-white" size={32} />
            </div>
            <h1 className="text-4xl font-bold text-emerald-700">Add New Product</h1>
          </div>
          <div className="w-32 h-1 bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 mx-auto mb-4 rounded-full" />
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Create and customize your product with advanced options and real-time preview</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info Section */}
          <div className="bg-gradient-to-br from-emerald-50 to-blue-50 p-8 rounded-2xl border border-emerald-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FiInfo className="text-emerald-600" size={24} />
                <h3 className="text-xl font-semibold text-gray-800">Basic Information</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
              >
                <FiEye size={16} />
                Preview
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField
                label="Product Name"
                name="name"
                value={name}
                onChange={handleChange}
                required
                error={errors.name}
                placeholder="Enter product name"
                icon={<FiPackage size={16} />}
              />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <FiPackage className="text-gray-500" size={16} />
                    Category <span className="text-red-500">*</span>
                  </div>
                </label>
                <select
                  name="category"
                  value={category}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 transition duration-200 ${
                    errors.category 
                      ? 'border-red-300 focus:ring-red-400 focus:border-red-400' 
                      : 'border-gray-300 focus:ring-emerald-400 focus:border-emerald-400'
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <FiAlertCircle size={14} />
                    {errors.category}
                  </p>
                )}
              </div>

              <InputField
                label="SKU (Auto-generated)"
                name="sku"
                value={sku}
                onChange={handleChange}
                placeholder="Will be auto-generated"
                icon={<FiPackage size={16} />}
                disabled
              />
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-2xl border border-blue-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <FiInfo className="text-blue-600" size={24} />
              Product Description & Tags
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe your product features, benefits, and details..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition duration-200 resize-vertical"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={tags}
                  onChange={handleChange}
                  placeholder="organic, fresh, premium, local..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 transition duration-200"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  {suggestedTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => addTag(tag)}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-blue-100 hover:text-blue-700 transition"
                    >
                      + {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Pricing Section */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-8 rounded-2xl border border-yellow-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <FiDollarSign className="text-yellow-600" size={24} />
              Pricing & Inventory
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <InputField
                label="Original Price (₹)"
                name="oldPrice"
                type="number"
                value={oldPrice}
                onChange={handleChange}
                required
                error={errors.oldPrice}
                min="0"
                step="0.01"
                placeholder="0.00"
                icon={<FiDollarSign size={16} />}
              />
              
              <InputField
                label="Selling Price (₹)"
                name="price"
                type="number"
                value={price}
                onChange={handleChange}
                required
                error={errors.price}
                min="0"
                step="0.01"
                placeholder="0.00"
                icon={<FiDollarSign size={16} />}
              />

              <InputField
                label="Stock Quantity"
                name="stock"
                type="number"
                value={stock}
                onChange={handleChange}
                error={errors.stock}
                min="0"
                placeholder="0"
                icon={<FiPackage size={16} />}
              />
            </div>
            
            {oldPrice && price && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/80 rounded-xl border border-white/50">
                  <div className="flex items-center gap-2 mb-2">
                    <FiTrendingUp className="text-green-600" size={16} />
                    <span className="font-medium text-gray-700">Discount</span>
                  </div>
                  <p className="text-lg font-bold text-green-600">
                    ₹{(parseFloat(oldPrice) - parseFloat(price)).toFixed(2)} 
                    <span className="text-sm text-gray-500 ml-1">
                      ({(((parseFloat(oldPrice) - parseFloat(price)) / parseFloat(oldPrice)) * 100).toFixed(1)}% off)
                    </span>
                  </p>
                </div>

                <div className="p-4 bg-white/80 rounded-xl border border-white/50">
                  <div className="flex items-center gap-2 mb-2">
                    <FiDollarSign className="text-blue-600" size={16} />
                    <span className="font-medium text-gray-700">Est. Profit</span>
                  </div>
                  <p className="text-lg font-bold text-blue-600">₹{calculateProfit()}</p>
                </div>

                <div className="p-4 bg-white/80 rounded-xl border border-white/50">
                  <div className="flex items-center gap-2 mb-2">
                    <FiPackage className="text-purple-600" size={16} />
                    <span className="font-medium text-gray-700">Stock Value</span>
                  </div>
                  <p className="text-lg font-bold text-purple-600">
                    ₹{stock && price ? (parseInt(stock) * parseFloat(price)).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Image Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border border-purple-100 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
              <FiCamera className="text-purple-600" size={24} />
              Product Image
            </h3>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <button
                type="button"
                onClick={generateAIImage}
                disabled={loadingAI || !name.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
              >
                <FiRefreshCcw className={loadingAI ? 'animate-spin' : ''} />
                {loadingAI ? "Generating..." : "Generate AI Image"}
              </button>
              
              {preview && (
                <button
                  type="button"
                  onClick={removeImage}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg hover:from-red-600 hover:to-pink-700 transition shadow-md"
                >
                  <FiX />
                  Remove Image
                </button>
              )}
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl h-80 flex justify-center items-center cursor-pointer transition-all duration-200 relative overflow-hidden ${
                dragActive 
                  ? 'border-emerald-400 bg-emerald-50 scale-105 shadow-lg' 
                  : 'border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/50'
              }`}
            >
              {preview ? (
                <div className="relative group h-full w-full">
                  <img
                    src={preview}
                    alt="Product preview"
                    className="h-full w-full object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-lg flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                      <FiUpload size={32} className="mx-auto mb-2" />
                      <p className="text-sm font-medium">Click or drag to change</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500 text-center">
                  <div className={`p-6 rounded-full mb-4 ${dragActive ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                    <FiUpload size={32} className={dragActive ? 'text-emerald-600' : 'text-gray-400'} />
                  </div>
                  <p className="text-lg font-medium mb-2">
                    {dragActive ? 'Drop image here' : 'Click or drag to upload image'}
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG, JPEG, WebP up to 5MB
                  </p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Enhanced Submit Section */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex justify-center items-center gap-3 bg-gradient-to-r from-emerald-500 via-emerald-600 to-emerald-700 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:via-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <FiSave size={20} className={loading ? 'animate-pulse' : ''} />
              {loading ? 'Adding Product...' : 'Add Product'}
            </button>
            
            <button
              type="button"
              onClick={resetForm}
              disabled={loading}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}