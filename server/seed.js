import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';
import Product from './src/models/Product.js';

dotenv.config();

const products = [
  {
    name: 'iPhone 15 Pro',
    description: 'The latest iPhone with Titanium design, A17 Pro chip, and advanced Pro camera system.',
    price: 134900,
    category: 'Electronics',
    stock: 15,
    images: [{ public_id: 'seed_iphone15', url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=1000' }],
    rating: 4.8,
    numReviews: 120,
  },
  {
    name: 'MacBook Air M2',
    description: 'Supercharged by M2, the redesigned MacBook Air is more portable than ever and features a 13.6-inch Liquid Retina display.',
    price: 114900,
    category: 'Electronics',
    stock: 10,
    images: [{ public_id: 'seed_macbook', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=1000' }],
    rating: 4.9,
    numReviews: 85,
  },
  {
    name: 'Sony WH-1000XM5',
    description: 'Industry-leading noise canceling with two processors controlling eight microphones.',
    price: 29990,
    category: 'Other',
    stock: 25,
    images: [{ public_id: 'seed_sony', url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000' }],
    rating: 4.7,
    numReviews: 200,
  },
  {
    name: 'Nike Air Max 270',
    description: "Nike's first lifestyle Air Max brings you style, comfort and a big attitude.",
    price: 12995,
    category: 'Clothing',
    stock: 40,
    images: [{ public_id: 'seed_nike', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000' }],
    rating: 4.5,
    numReviews: 150,
  },
  {
    name: 'Samsung Galaxy S23 Ultra',
    description: 'Capture the night with Galaxy S23 Ultra. 200MP camera and built-in S Pen.',
    price: 124999,
    category: 'Electronics',
    stock: 12,
    images: [{ public_id: 'seed_s23', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=1000' }],
    rating: 4.8,
    numReviews: 95,
  },
  {
    name: 'Fujifilm X-T5 Mirrorless Camera',
    description: 'The ultimate photographic tool for stills and video.',
    price: 169999,
    category: 'Electronics',
    stock: 5,
    images: [{ public_id: 'seed_fuji', url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=1000' }],
    rating: 4.9,
    numReviews: 45,
  },
  {
    name: 'Levis 501 Original Fit Jeans',
    description: 'The blueprint for every pair of jeans in existence.',
    price: 4999,
    category: 'Clothing',
    stock: 100,
    images: [{ public_id: 'seed_levis', url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=1000' }],
    rating: 4.4,
    numReviews: 320,
  },
  {
    name: 'Modern Accent Chair',
    description: 'A stylish and comfortable addition to any living room.',
    price: 15999,
    category: 'Home & Garden',
    stock: 20,
    images: [{ public_id: 'seed_chair', url: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1000' }],
    rating: 4.6,
    numReviews: 78,
  },
  {
    name: 'Logitech MX Master 3S',
    description: 'An icon remastered. Precision, performance, and comfort.',
    price: 10999,
    category: 'Other',
    stock: 50,
    images: [{ public_id: 'seed_mouse', url: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1000' }],
    rating: 4.9,
    numReviews: 500,
  },
  {
    name: 'Hydro Flask 32 oz',
    description: 'Wide Mouth bottle with TempShield insulation.',
    price: 3499,
    category: 'Home & Garden',
    stock: 200,
    images: [{ public_id: 'seed_bottle', url: 'https://images.unsplash.com/photo-1602143399827-7fd1b681812a?auto=format&fit=crop&q=80&w=1000' }],
    rating: 4.7,
    numReviews: 1200,
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Deleted existing products.');

    // Find or create a seller
    let seller = await User.findOne({ role: 'seller' });
    if (!seller) {
      console.log('No seller found, creating a demo seller...');
      seller = await User.create({
        name: 'Demo Seller',
        email: 'seller@example.com',
        password: 'password123',
        role: 'seller',
        storeName: 'Premium Tech Store',
        storeDescription: 'Your one-stop shop for high-quality electronics and lifestyle products.'
      });
    }

    // Create a buyer if not exists
    let buyer = await User.findOne({ role: 'buyer' });
    if (!buyer) {
      console.log('Creating a demo buyer...');
      await User.create({
        name: 'Demo Buyer',
        email: 'buyer@example.com',
        password: 'password123',
        role: 'buyer'
      });
    }

    // Insert products
    const itemsWithSeller = products.map(p => ({ ...p, seller: seller._id }));
    await Product.insertMany(itemsWithSeller);
    console.log(`Successfully seeded ${products.length} products.`);

    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
