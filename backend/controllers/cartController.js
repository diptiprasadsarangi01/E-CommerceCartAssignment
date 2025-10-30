import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const productId =
      req.body?.productId ||
      req.body?.id ||
      req.body?.product?.productId ||
      req.body?.product?.id ||
      req.body?.product?._id;

    const qty =
      (typeof req.body?.qty === 'number' && req.body.qty) ||
      (typeof req.body?.quantity === 'number' && req.body.quantity) ||
      (req.body?.product && (req.body.product.qty || req.body.product.quantity)) ||
      1; 

    if (!productId) {
      return res.status(400).json({ error: 'productId is required in request body' });
    }

    if (!Number.isInteger(qty) || qty <= 0) {
      return res.status(400).json({ error: 'qty must be a positive integer' });
    }

    let cart = await Cart.findOne();
  
    if (!cart) cart = new Cart({ items: [] });

    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.qty = qty;
    } else {
      cart.items.push({ product: productId, qty });
    }

    await cart.save();
    await cart.populate('items.product');

    res.json(cart);
  } catch (err) {
    console.error('addToCart error:', err);
    res.status(500).json({ error: 'Failed to update cart' });
  }
};

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne().populate('items.product');
    if (!cart) return res.json({ items: [], total: 0 });
    cart.items = cart.items.filter((item) => item.product);

    const total = cart.items.reduce(
      (sum, item) => sum + (item.product.price || 0) * item.qty,
      0
    );

    res.json({ items: cart.items, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

export const deleteCartItem = async (req, res) => { 
  const { id } = req.params; 
 try{ 
  const cart = await Cart.findOne(); 
  if (!cart) return res.status(404).json({ error: 'Cart not found' });
  const index = cart.items.findIndex((i) => i.product.toString() === id); 
  if (index === -1) { 
    return res.status(404).json({ error: 'Item not found in cart' }); 
  } 
  cart.items.splice(index, 1); 
  await cart.save(); 
  
  res.json({ message: 'Item removed', cart }); }
   catch (err) { 
    console.error(err); 
    res.status(500).json({ error: 'Failed to remove item' }); 
  } 
};

export const checkoutCart = async (req, res) => {
  try {
    const cart = await Cart.findOne().populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    const validItems = cart.items.filter((item) => item.product);

    const total = validItems.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.qty,
      0
    );

    const receipt = {
      total,
      timestamp: new Date().toISOString(),
      items: validItems.map((item) => ({
        name: item.product.name,
        price: item.product.price,
        qty: item.qty,
        subtotal: item.product.price * item.qty,
      })),
    };
    await Cart.deleteMany();
    res.json({ message: "Checkout successful", receipt });
  } catch (err) {
    console.error("checkoutCart error:", err);
    res.status(500).json({ error: "Checkout failed" });
  }
};