require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Category = require('../models/Category');
const User = require('../models/User');
const Post = require('../models/Post');
const Review = require('../models/Review');

const categories = [
  { name: 'Arts', slug: 'arts', description: 'Painting, drawing, digital art and sculpture.' },
  { name: 'Crafts', slug: 'crafts', description: 'Handmade crafts and DIY projects.' },
  { name: 'Photography', slug: 'photography', description: 'Capturing moments, one shot at a time.' },
  { name: 'Cooking', slug: 'cooking', description: 'Recipes, techniques and culinary workshops.' },
  { name: 'Gardening & Plants', slug: 'gardening-plants', description: 'Growing, tending and designing green spaces.' },
  { name: 'Music & Performance', slug: 'music-performance', description: 'Instruments, singing and live performance.' },
];

// Demo accounts - all share the same password so you can log in as any of
// them to see the app from a real user's point of view. Change/remove this
// data before deploying for real.
const DEMO_PASSWORD = 'Shaghaf@2026';

const demoUsers = [
  { username: 'roukaia_fadla', name: 'Roukaia Fadla', email: 'roukaia.fadla@shaghaf.dev', bio: 'Watercolor painter chasing golden-hour light. Sharing sketches and works in progress.' },
  { username: 'amari_soumia', name: 'Amari Soumia', email: 'amari.soumia@shaghaf.dev', bio: 'Home cook obsessed with slow-simmered stews and family recipes with a twist.' },
  { username: 'khiat_rahma', name: 'Khiat Rahma', email: 'khiat.rahma@shaghaf.dev', bio: 'Street and portrait photographer. Always chasing the perfect shadow.' },
  { username: 'adjnag_houda', name: 'Adjnag Houda', email: 'adjnag.houda@shaghaf.dev', bio: 'Balcony gardener turning a small city apartment into a jungle, one pot at a time.' },
  { username: 'khiter_sara', name: 'Khiter Sara', email: 'khiter.sara@shaghaf.dev', bio: 'Self-taught guitarist and weekend open-mic regular. Music is cheaper than therapy.' },
  { username: 'belhouari_khadra', name: 'Belhouari Khadra', email: 'belhouari.khadra@shaghaf.dev', bio: 'Crochet and macrame maker. Turning yarn into things people actually want to wear.' },
];

// Posts: [authorIndex, categorySlug, title, description, image, likerIndexes, comments]
const postSeed = [
  [0, 'arts', 'Golden hour on the terrace', 'Spent the whole afternoon chasing the light for this one - three layers of watercolor wash and a lot of patience.', '/uploads/01.webp', [1, 2, 3, 4, 5], ['Rahma', 'Sara']],
  [0, 'arts', 'Ink study #12', 'Quick 20-minute ink study before bed. Not every piece needs to be precious.', '/uploads/1.webp', [2, 3], []],
  [1, 'cooking', 'Slow-cooked lamb tagine', 'My grandmother\'s recipe, barely changed - just a splash more preserved lemon than she\'d admit to using.', '/uploads/04.webp', [0, 2, 3, 4, 5], ['Roukaia', 'Houda', 'Sara']],
  [1, 'cooking', 'Weeknight shakshuka', 'The 20-minute dinner that saves me every single week. Recipe in the comments if anyone wants it.', '/uploads/4.webp', [3, 4], ['Khadra']],
  [2, 'photography', 'Backstreets of the old town', 'Shot this on an early morning walk before the streets filled up - loved how the shadows fell.', '/uploads/03.webp', [0, 1, 4, 5], ['Soumia']],
  [2, 'photography', 'Portrait series: hands at work', 'Started a series on people and their craft. This one is a potter I met at the local market.', '/uploads/3.webp', [0, 5], []],
  [3, 'gardening-plants', 'My balcony jungle, one year later', 'From three sad pots to this. Mostly pothos, a stubborn fig, and way too much trial and error.', '/uploads/05.webp', [0, 1, 2, 5], ['Rahma', 'Roukaia']],
  [3, 'gardening-plants', 'Propagating mint the lazy way', 'Cuttings in a jar of water on the windowsill - zero effort, endless mint.', '/uploads/5.webp', [1], []],
  [4, 'music-performance', 'First time playing my own song live', 'Hands were shaking the whole time but I did it. Small open mic, huge personal win.', '/uploads/06.webp', [0, 1, 2, 3, 5], ['Houda', 'Khadra', 'Rahma']],
  [4, 'music-performance', 'Practicing fingerstyle again', 'Back to basics this week - slow scales, no shortcuts.', '/uploads/6.webp', [3], []],
  [5, 'crafts', 'Macrame wall hanging, commissioned piece', 'A friend asked for something for her new apartment - three days of knots well spent.', '/uploads/02.webp', [0, 1, 2, 3, 4], ['Sara', 'Soumia']],
  [5, 'crafts', 'Crochet granny square blanket, in progress', 'Square 47 of... honestly I lost count. Getting there.', '/uploads/2.webp', [4], []],
];

const reviewSeed = [
  [0, 5, 'Found my people here. The art community on Shaghaf is genuinely supportive, not just performative likes.'],
  [1, 5, 'I\'ve tried three recipes shared here so far and all three were great. Love that it\'s real people, not influencers.'],
  [2, 4, 'Great place to get feedback on photos without the toxicity of bigger platforms. Wish uploads were a bit faster.'],
  [3, 5, 'My balcony plants have never looked better since I started following the gardening tips shared here.'],
  [4, 4, 'Nervous to post my first video but everyone was kind about it. Already looking forward to my next one.'],
  [5, 5, 'The crafts category alone is worth signing up for. So many ideas I would never have thought of myself.'],
];

// The demo photos live in seed/images/ (committed to git as sample content).
// uploads/ is gitignored since it's meant for real runtime user uploads, so
// we copy the demo files there each time the seed runs, rather than
// committing them directly into uploads/.
const copyDemoImages = () => {
  const src = path.join(__dirname, 'images');
  const dest = path.join(__dirname, '..', 'uploads');
  fs.mkdirSync(dest, { recursive: true });
  const files = fs.readdirSync(src);
  files.forEach((file) => fs.copyFileSync(path.join(src, file), path.join(dest, file)));
  console.log(`Copied ${files.length} demo images into uploads/`);
};

const run = async () => {
  copyDemoImages();
  await connectDB();

  console.log('Clearing existing categories, demo users, posts and reviews...');
  await Promise.all([
    Category.deleteMany({}),
    User.deleteMany({ email: { $in: demoUsers.map((u) => u.email) } }),
    Post.deleteMany({}),
    Review.deleteMany({}),
  ]);

  const createdCategories = await Category.insertMany(categories);
  const categoryBySlug = Object.fromEntries(createdCategories.map((c) => [c.slug, c]));
  console.log(`Seeded ${createdCategories.length} categories`);

  // Created one at a time (not insertMany) so the User model's pre-save
  // password-hashing hook runs for each one.
  const createdUsers = [];
  for (const u of demoUsers) {
    const user = await User.create({
      username: u.username,
      email: u.email,
      password: DEMO_PASSWORD,
      bio: u.bio,
    });
    createdUsers.push(user);
  }
  console.log(`Seeded ${createdUsers.length} demo users (password for all: "${DEMO_PASSWORD}")`);

  // Explicit first-name -> created user lookup, so comment authorship in
  // postSeed below is always correct (matching usernames by string prefix
  // was unreliable since "firstname_lastname" doesn't always start with the
  // first name we'd want to display, e.g. "amari_soumia" for Soumia).
  const userByFirstName = {
    roukaia: createdUsers[0],
    soumia: createdUsers[1],
    rahma: createdUsers[2],
    houda: createdUsers[3],
    sara: createdUsers[4],
    khadra: createdUsers[5],
  };

  const createdPosts = [];
  for (const [authorIdx, slug, title, description, image, likerIdxs, commentAuthors] of postSeed) {
    const post = await Post.create({
      title,
      description,
      image,
      category: categoryBySlug[slug]._id,
      author: createdUsers[authorIdx]._id,
      likes: likerIdxs.map((i) => createdUsers[i]._id),
      comments: commentAuthors.map((firstName) => {
        const commenter = userByFirstName[firstName.toLowerCase()] || createdUsers[(authorIdx + 1) % createdUsers.length];
        return { author: commenter._id, text: sampleComment(firstName) };
      }),
    });
    createdPosts.push(post);
  }
  console.log(`Seeded ${createdPosts.length} posts with likes and comments`);

  const createdReviews = await Review.insertMany(
    reviewSeed.map(([userIdx, rating, text]) => ({
      reviewer: createdUsers[userIdx]._id,
      rating,
      text,
    }))
  );
  console.log(`Seeded ${createdReviews.length} reviews`);

  console.log('\nDone. Demo login for any account:');
  demoUsers.forEach((u) => console.log(`  ${u.email}  /  ${DEMO_PASSWORD}`));

  await mongoose.connection.close();
  process.exit(0);
};

function sampleComment(name) {
  const options = [
    'This is beautiful, love the colors!',
    'Okay I need the full tutorial for this 👀',
    'Saving this for later, thank you for sharing!',
    'The progress on this is amazing to see.',
    'Definitely trying this myself this weekend.',
  ];
  return options[name.length % options.length];
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
