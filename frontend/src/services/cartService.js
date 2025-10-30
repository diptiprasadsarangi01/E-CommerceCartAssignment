import api from "../api";

export const cartService = {
  getCart: async () => {
    const res = await api.get("/cart");
    return res.data;
  },

  addToCart: async (productId, qty = 1) => {
    const res = await api.post("/cart", { productId, qty });
    return res.data;
  },

  updateQty: async (productId, qty) => {
    const res = await api.post("/cart", { productId, qty });
    return res.data;
  },

  deleteItem: async (productId) => {
    const res = await api.delete(`/cart/${productId}`);
    return res.data;
  },

  checkout: async () => {
    const res = await api.post("/cart/checkout");
    return res.data;
  },
};
