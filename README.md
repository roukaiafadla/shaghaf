# Shaghaf — rebuilt

Shaghaf is a platform for discovering and sharing hobby-related activities
(art, crafts, photography, cooking, gardening, music). This is a rebuild of
the original 2022 frontend-only project: same idea and layout, now with a
real backend, responsive Tailwind UI, and optimized assets.

## What changed from the original

- **Backend added** — Node/Express + MongoDB API: JWT auth, categories,
  posts (with likes/comments), reviews, user profiles with avatar upload.
- **Frontend rewired** — login/signup/profile/settings/category pages now
  talk to the real API instead of `console.log`-ing form data.
- **6 duplicate category files → 1 dynamic page** — `category1.js`...`category6.js`
  were near-identical hardcoded pages; replaced with a single
  `CategoryPage.js` driven by `/category/:slug`.
- **Images: 121MB → 1.5MB** — converted the raw camera JPGs to compressed
  WebP (resized to a sane max dimension). Same visuals, a fraction of the size.
- **Fully responsive** — rebuilt with Tailwind, mobile-first, hamburger nav
  on small screens. The original had a single `@media` query across 14 CSS files.
- **Protected routes** — Profile/Settings now redirect to `/login` if you're
  not authenticated, instead of silently rendering.
- **Real brand palette** — coral (`#FE6F61`) as primary, teal (`#008080`) as
  secondary, gold (`#FFD700`) as a rare accent for star ratings, all taken
  from the original logo/CSS instead of a placeholder color.
- **"Popular" section is actually dynamic** — the old static Articles list
  (six hardcoded external links) is now a `PopularSection` that ranks real
  posts by like count via a backend aggregation (`GET /api/posts/popular`).
  It changes as the community posts and likes things.
- **Seeded demo data** — `npm run seed` now creates 6 demo users, 12 posts
  (with likes/comments) and 6 reviews, so the app looks populated instead of
  empty on first run. See "Demo accounts" below.

## Project structure

```
shaghaf-app/
├── server/     Express + MongoDB API
└── client/     React + Tailwind frontend
```

## Running it locally

### 1. Backend
```bash
cd server
npm install
cp .env.example .env      # then fill in MONGO_URI and a JWT_SECRET
npm run seed               # loads categories + 6 demo users/posts/reviews
npm run dev                 # starts on http://localhost:5000
```
You'll need a MongoDB connection string — either install MongoDB locally,
or create a free cluster at mongodb.com/atlas and paste its URI into `.env`.

### 2. Frontend
```bash
cd client
npm install
cp .env.example .env       # REACT_APP_API_URL, defaults to localhost:5000/api
npm start                   # starts on http://localhost:3000
```

## Demo accounts

After running `npm run seed`, you can log in as any of these (all share the
same password) to see the app populated with real posts, likes, comments and
reviews instead of an empty database:

| Email | Password |
|---|---|
| roukaia.fadla@shaghaf.dev | `Shaghaf@2026` |
| amari.soumia@shaghaf.dev | `Shaghaf@2026` |
| khiat.rahma@shaghaf.dev | `Shaghaf@2026` |
| adjnag.houda@shaghaf.dev | `Shaghaf@2026` |
| khiter.sara@shaghaf.dev | `Shaghaf@2026` |
| belhouari.khadra@shaghaf.dev | `Shaghaf@2026` |

Demo photos live in `server/seed/images/` (committed to git) and get copied
into `server/uploads/` (gitignored, meant for real runtime uploads) each time
the seed runs. Remove or replace this seed data before deploying for real.

## What's not done yet (next steps)

- **Password reset / "forgot password"** flow — link exists, not wired
- **Contact form** — currently shows a success message locally; needs a real
  `/api/contact` route or an email service (e.g. Resend/EmailJS) behind it
- **Security/Notifications/Privacy tabs** in Settings are UI placeholders
- **Deployment** — not deployed yet. Recommended free-tier path: Vercel for
  the client, Render or Railway for the API, MongoDB Atlas for the DB
- **Post editing/deletion**, **follow system**, pagination on category pages
  for when there are many posts

## Design notes

The Tailwind theme (`client/tailwind.config.js`) defines three color scales:
- `brand` — coral `#FE6F61`, the primary/CTA color (buttons, links, focus rings)
- `teal` — `#008080`, the secondary color (badges, category accents, gradients)
- `gold` — `#FFD700`, a rare accent reserved for star ratings and small highlights

All three came from the original logo and CSS files. If your actual brand
hex codes differ slightly, update them here — everything else inherits from
these three scales.
