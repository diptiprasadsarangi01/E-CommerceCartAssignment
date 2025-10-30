import React, { useState } from "react";
import { cartService } from "../services/cartService";

export default function ProductCard({ product, cart, setCart, refreshCart }) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (qty < 1) return;
    setLoading(true);

    try {
      const existingItem = cart.items.find(
        (item) => item.product._id === product._id
      );

      const updatedItems = existingItem
        ? cart.items.map((item) =>
            item.product._id === product._id ? { ...item, qty } : item
          )
        : [...cart.items, { product, qty }];

      const updatedCart = {
        items: updatedItems,
        total: updatedItems.reduce(
          (sum, item) => sum + item.product.price * item.qty,
          0
        ),
      };

      setCart(updatedCart);


      await cartService.addToCart(product._id, qty);

      await refreshCart();
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add item to cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const increaseQty = () => setQty((prev) => prev + 1);
  const decreaseQty = () => setQty((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-900/50 rounded-xl p-5 flex flex-col justify-between hover:shadow-lg dark:hover:shadow-gray-700 transition-shadow duration-300">

      <div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {product.name}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          ₹{product.price}
        </p>
      </div>


      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
          <button
            onClick={decreaseQty}
            className="px-3 py-1 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-lg transition-colors"
          >
            -
          </button>
          <span className="px-3 py-1 text-gray-800 dark:text-gray-100 select-none">
            {qty}
          </span>
          <button
            onClick={increaseQty}
            className="px-3 py-1 text-gray-700 dark:text-gray-200 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-lg transition-colors"
          >
            +
          </button>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={loading}
          className={`ml-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
