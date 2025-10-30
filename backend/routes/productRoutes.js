import express from 'express';
import { seedProducts, getProducts } from '../controllers/productController.js';

const router = express.Router();

router.get('/seed', seedProducts);
router.get('/', getProducts);

export default router;
