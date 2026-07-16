import React, { useState, useEffect } from "react";
import { bannerStyles } from "../assets/dummyStyles";
import { FiTruck, FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import BannerFood1 from "../assets/FoodBanner.jpg";
import BannerFood2 from "../assets/FoodBanner2.jpg";
import BannerFood3 from "../assets/FoodBanner3.jpg";
import BannerFood4 from "../assets/FoodBanner4.jpg";
import BannerFood5 from "../assets/FoodBanner5.jpg";
import BannerFood6 from "../assets/FoodBanner6.jpg";

// Example features
const features = [
  { icon: <FiTruck />, text: "Fast Delivery" },
  { icon: <FiTruck />, text: "Fresh Products" },
  { icon: <FiTruck />, text: "Best Prices" },
  { icon: <FiTruck />, text: "24/7 Support" },
];

// Banners for background + cart frame
const banners = [
  BannerFood1,
  BannerFood2,
  BannerFood3,
  BannerFood4,
  BannerFood5,
  BannerFood6,
];

const BannerHome = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentBanner, setCurrentBanner] = useState(0);
  const navigate = useNavigate();

  // Auto-slide banners every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedTerm = searchTerm.trim();
    if (trimmedTerm) {
      if (onSearch) {
        const searchWords = trimmedTerm.toLowerCase().split(/\s+/);
        onSearch(searchWords.join(" "));
      } else {
        navigate(`/items?search=${encodeURIComponent(trimmedTerm)}`);
      }
    }
    setSearchTerm("");
  };

  return (
    <div className="relative overflow-hidden pt-16 bg-white">
      {/* Cycling background images */}
      <div className="absolute inset-0 z-0">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentBanner ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={banner}
              alt={`Background ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.3) blur(2px)" }}
            />
          </div>
        ))}
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-white/60"></div>
      </div>

      {/* Decorative circles */}
      <div className="hidden sm:block absolute top-6 left-6 w-20 h-20 rounded-full bg-teal-500 opacity-30 z-5"></div>
      <div className="hidden md:block absolute bottom-12 right-28 w-32 h-32 rounded-full bg-seafoam-200 opacity-30 z-5"></div>
      <div className="hidden lg:block absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-mint-200 opacity-30 z-5"></div>

      <div className="relative z-10 mt-8 sm:mt-10 lg:mt-12 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* LEFT content */}
          <div className="text-center lg:text-left">
            <div className={`${bannerStyles.tag} bg-white/80 backdrop-blur-sm`}>
              <span className="flex items-center justify-center lg:justify-start text-sm sm:text-base">
                <FiTruck className="mr-2" /> Free delivery on orders over $500
              </span>
            </div>

            <h1 className={`${bannerStyles.heading} drop-shadow-lg`}>
              Fresh <span className={bannerStyles.headingItalic}>Groceries</span>
              <br /> Delivered to Your Door
            </h1>

            <p className={`${bannerStyles.paragraph} drop-shadow-sm`}>
              Discover the freshest produce, top-quality meats, and pantry
              essentials — all delivered within 30 minutes.
            </p>

            {/* Search form */}
            <form
              onSubmit={handleSubmit}
              className={`${bannerStyles.form} backdrop-blur-sm`}
            >
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`${bannerStyles.input} bg-white/90 backdrop-blur-sm`}
                placeholder="Search groceries..."
              />
              <button type="submit" className={bannerStyles.searchButton}>
                <FiSearch className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </form>

            {/* Features */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className={`${bannerStyles.featureItem} bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-sm`}
                >
                  <div className="text-teal-600 mb-1">{f.icon}</div>
                  <span className={bannerStyles.featureText}>{f.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT CART IMAGE SECTION */}
          <div className="relative flex justify-center lg:justify-end">
            <div
              className="relative flex items-center justify-center bg-gradient-to-br from-teal-100 to-teal-200 rounded-3xl shadow-2xl overflow-hidden"
              style={{
                width: "100%",
                maxWidth: "500px",
                height: "400px",
              }}
            >
              {/* Grocery Image changes with banner */}
              <img
                src={banners[currentBanner]} // 🔹 Sync with rotating banners
                alt="Shopping Banner"
                className="object-cover w-full h-full rounded-3xl"
              />

              {/* Overlay CTA text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white">
                <h3 className="text-2xl font-bold mb-2">Start Shopping</h3>
                <p className="text-lg">Fill your cart with fresh groceries</p>
              </div>

              {/* Decorative elements */}
              <div className="hidden sm:block absolute -top-4 -right-4 w-16 h-16 rounded-full bg-teal-300 opacity-40 animate-pulse"></div>
              <div className="hidden md:block absolute -bottom-4 -left-4 w-20 h-20 rounded-full bg-mint-200 opacity-30"></div>
              <div className="hidden lg:block absolute top-8 -left-6 w-12 h-12 rounded-full bg-teal-400 opacity-25"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Banner Navigation Dots */}
      <div className="relative z-10 flex justify-center space-x-2 pb-8">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 shadow-lg ${
              index === currentBanner
                ? "bg-teal-500 scale-125 shadow-teal-300"
                : "bg-white/70 hover:bg-white/90 backdrop-blur-sm"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default BannerHome;
