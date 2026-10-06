require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

const categories = [
  { name: 'Arts', slug: 'arts', description: 'Painting, drawing, digital art and sculpture.' },
  { name: 'Crafts', slug: 'crafts', description: 'Handmade crafts and DIY projects.' },
  { name: 'Photography', slug: 'photography', description: 'Capturing moments, one shot at a time.' },
  { name: 'Cooking', slug: 'cooking', description: 'Recipes, techniques and culinary workshops.' },
  { name: 'Gardening & Plants', slug: 'gardening-plants', description: 'Growing, tending and designing green spaces.' },
  { name: 'Music & Performance', slug: 'music-performance', description: 'Instruments, singing and live performance.' },
];

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  // upsert = safe to run many times, never creates duplicates
  for (const c of categories) {
    await Category.updateOne({ slug: c.slug }, { $set: c }, { upsert: true });
  }
  console.log('Categories ready');
  await mongoose.disconnect();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
