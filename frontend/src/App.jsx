import React, { useEffect, useState } from "react";
import api from "./api";
import Navbar from "./components/Navbar";
import ProductCard from "./components/ProductCard";
import CartModal from "./components/CartModal";

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCart, setShowCart] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
      <Navbar
        cartCount={cart.items?.length || 0}
        onCartClick={() => setShowCart(true)}
      />

      <div className="max-w-6xl mx-auto py-10 px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.length > 0 ? (
          products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              cart={cart}
              setCart={setCart}
              refreshCart={fetchCart}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No products available.
          </p>
        )}
      </div>

      {showCart && (
        <CartModal
          cart={cart}
          setCart={setCart}
          onClose={() => setShowCart(false)}
          refreshCart={fetchCart}
        />
      )}
    </div>
  );
}
