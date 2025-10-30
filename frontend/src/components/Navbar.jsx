import React, { useState } from "react";
import { ShoppingCart, Moon, Sun } from "lucide-react";

export default function Navbar({ cartCount = 0, onCartClick, onLogoClick }) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    html.classList.toggle("dark");
    setDarkMode(!darkMode);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md py-4 px-6 flex justify-between items-center transition-colors duration-300">
      <button
        onClick={onLogoClick}
        className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors focus:outline-none"
        aria-label="Go to homepage"
      >
        🛍️VibeStore
      </button>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors focus:outline-none"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-800 dark:text-gray-200" />}
        </button>

        <button
          onClick={onCartClick}
          className="relative bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label={`View Cart (${cartCount} items)`}
        >
          <ShoppingCart size={20} />

          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-xs font-bold text-white w-5 h-5 flex items-center justify-center rounded-full">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
}
