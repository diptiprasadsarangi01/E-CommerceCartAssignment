import React, { useState } from "react";
import { cartService } from "../services/cartService";
import ReceiptModal from "./ReceiptModal";

export default function CartModal({ cart, onClose, setCart, refreshCart }) {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpdateQty = async (productId, newQty) => {
    if (newQty <= 0) return handleRemove(productId);
    try {
      await cartService.updateQty(productId, newQty);
      await refreshCart();
    } catch (err) {
      console.error("Error updating quantity:", err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await cartService.deleteItem(productId);
      await refreshCart();
    } catch (err) {
      console.error("Error removing item:", err);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const data = await cartService.checkout();
      setReceipt(data.receipt);
      setCart({ items: [], total: 0 });
      await refreshCart();
    } catch (err) {
      console.error("Checkout failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-40">
        <div className="bg-white rounded-lg p-6 w-96">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">🛒 Your Cart</h2>

          {cart.items.length === 0 ? (
            <p className="text-gray-500 text-center">Your cart is empty.</p>
          ) : (
            <>
              <ul className="divide-y divide-gray-200 mb-4">
                {cart.items.map((item) => (
                  <li key={item.product._id} className="flex justify-between items-center py-2">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-500">
                        ₹{item.product.price} × {item.qty}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleUpdateQty(item.product._id, item.qty - 1)}
                        className="px-2 py-1 border rounded-l-md hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3">{item.qty}</span>
                      <button
                        onClick={() => handleUpdateQty(item.product._id, item.qty + 1)}
                        className="px-2 py-1 border rounded-r-md hover:bg-gray-100"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemove(item.product._id)}
                        className="ml-3 text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex justify-between items-center border-t pt-3">
                <p className="text-lg font-semibold">Total: ₹{cart.total}</p>
                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className={`bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md transition ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Processing..." : "Checkout"}
                </button>
              </div>
            </>
          )}

          <button
            onClick={onClose}
            className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
          >
            Close
          </button>
        </div>
      </div>

      {receipt && (
        <ReceiptModal
          receipt={receipt}
          onClose={() => setReceipt(null)}
        />
      )}
    </>
  );
}
