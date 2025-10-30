import express from "express";
import { addToCart, getCart, deleteCartItem, checkoutCart } from "../controllers/cartController.js";

const router = express.Router();


router.post("/", addToCart);
router.get("/", getCart);
router.delete("/:id", deleteCartItem);
router.post("/checkout", checkoutCart);

export default router;
