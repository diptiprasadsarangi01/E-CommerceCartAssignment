import fs from 'fs';
import path from 'path';
import Product from '../models/Product.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export const seedProducts = async (req, res) => {
  try {
    const count = await Product.countDocuments();
    if (count > 0) {
      return res.json({ seeded: false, message: 'Already seeded' });
    }

    const mockProductsPath = path.join(rootDir, 'mockProducts.json');
    const mockProducts = JSON.parse(fs.readFileSync(mockProductsPath, 'utf-8'));

    await Product.insertMany(mockProducts);
    res.json({ seeded: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Seeding failed' });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().limit(10);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};
