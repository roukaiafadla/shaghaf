# Shaghaf

**A community platform for discovering and sharing hobbies and creative activities** — art, crafts, photography, cooking, gardening and music.

People can sign up, share what they're working on with a photo and a description, like and comment on other people's posts, and leave reviews of the platform.

Shaghaf (شغف) means *passion* in Arabic.

> Full-stack **MERN** project: React + Tailwind CSS on the front end, Node.js + Express + MongoDB on the back end.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Setting up the database](#setting-up-the-database)
- [API reference](#api-reference)
- [Security notes](#security-notes)
- [Roadmap](#roadmap)

---

## Features

**Community**
- Sign up and log in with secure JWT authentication
- Share a post with a title, category, description and photo
- Delete your own posts (only the author is allowed to, enforced on the server)
- Like and comment on posts
- Leave a review of the platform with a star rating

**Discovery**
- Six categories: Arts, Crafts, Photography, Cooking, Gardening & Plants, Music & Performance
- Home page with a row of recent posts per category
- A **Popular** section that ranks real posts by number of likes
- Search across posts from the navbar
- Live platform statistics (users, posts, likes) on the About page

**Profile**
- Personal profile page with avatar upload and bio
- "My Posts" grid with photo, category, likes and comments count
- Settings page to update your bio

**Design**
- Fully responsive, mobile-first layout built with Tailwind CSS
- Hamburger navigation on small screens
- Protected routes: profile, settings and create-post redirect guests to the login page

---

## Tech stack

| Layer | Technologies |
|---|---|
| Front end | React 18, React Router 6, Tailwind CSS 3, Axios, React Icons |
| Back end | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB (local or MongoDB Atlas) |
| Auth | JSON Web Tokens, bcryptjs password hashing |
| Uploads | Multer (images only: jpg, png, webp, max 5 MB) |

---

## Project structure

```
shaghaf/
├── client/                  React front end
│   ├── public/
│   └── src/
│       ├── api/             Axios instance (attaches the JWT automatically)
│       ├── components/      Navbar, Hero, PostsSection, PopularSection, ...
│       ├── context/         AuthContext (login state shared across the app)
│       ├── pages/           Home, Login, Signup, CreatePost, PostDetail, Profile, ...
│       └── images/
└── server/                  Express API
    ├── config/              Database connection
    ├── controllers/         Route logic (auth, posts, reviews, users, stats)
    ├── middleware/          Auth guard, image upload, error handling
    ├── models/              Mongoose schemas: User, Post, Category, Review
    ├── routes/              API route definitions
    ├── uploads/             User-uploaded images (not tracked by git)
    └── server.js            App entry point
```

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A MongoDB database: either [MongoDB installed locally](https://www.mongodb.com/docs/manual/installation/) or a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)

### 1. Clone the repository

```bash
git clone https://github.com/roukaiafadla/shaghaf.git
cd shaghaf
```

### 2. Start the back end

```bash
cd server
npm install
cp .env.example .env     # on Windows: copy .env.example .env
```

Open `server/.env` and fill in your values (see [Environment variables](#environment-variables)), then:

```bash
npm run dev              # API runs on http://localhost:5000
```

### 3. Start the front end

Open a second terminal:

```bash
cd client
npm install
cp .env.example .env     # on Windows: copy .env.example .env
npm start                # app runs on http://localhost:3000
```

### 4. Set up the categories

The app needs its six categories to exist in the database before people can post. See [Setting up the database](#setting-up-the-database).

---

## Environment variables

### `server/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the API listens on | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:password@cluster.mongodb.net/shaghaf` |
| `JWT_SECRET` | Long random string used to sign login tokens | *(generate your own)* |
| `CLIENT_URL` | Front-end URL allowed by CORS | `http://localhost:3000` |

### `client/.env`

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Base URL of the API | `http://localhost:5000/api` |

> Never commit your real `.env` files. They are already listed in `.gitignore`.

To generate a strong `JWT_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## Setting up the database

Posts must belong to a category, and the app has no screen for creating categories, so they need to be added once to a new database.

Add these six documents to a collection named **`categories`** (in MongoDB Atlas: *Browse Collections → your database → Insert Document*, or with MongoDB Compass):

| name | slug | description |
|---|---|---|
| Arts | `arts` | Painting, drawing, digital art and sculpture. |
| Crafts | `crafts` | Handmade crafts and DIY projects. |
| Photography | `photography` | Capturing moments, one shot at a time. |
| Cooking | `cooking` | Recipes, techniques and culinary workshops. |
| Gardening & Plants | `gardening-plants` | Growing, tending and designing green spaces. |
| Music & Performance | `music-performance` | Instruments, singing and live performance. |

Each document has the fields `name`, `slug` and `description`. The `slug` values must match the table exactly, because the URLs and the post form use them.

---

## API reference

Base URL: `/api`. Routes marked 🔒 require the header `Authorization: Bearer <token>`.

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/signup` | Create an account |
| POST | `/auth/login` | Log in and receive a token |
| GET | `/auth/me` 🔒 | Get the logged-in user |

### Posts
| Method | Endpoint | Description |
|---|---|---|
| GET | `/posts` | List posts (`?category=slug` and `?search=term` supported) |
| GET | `/posts/popular` | Posts ranked by number of likes |
| GET | `/posts/:id` | A single post with author and comments |
| POST | `/posts` 🔒 | Create a post (`multipart/form-data`: title, category, description, image) |
| DELETE | `/posts/:id` 🔒 | Delete a post (author only) |
| PUT | `/posts/:id/like` 🔒 | Like or unlike a post |
| POST | `/posts/:id/comments` 🔒 | Add a comment |

### Categories, reviews, users, stats
| Method | Endpoint | Description |
|---|---|---|
| GET | `/categories` | List all categories |
| GET | `/categories/:slug` | A single category |
| GET | `/reviews` | Latest reviews |
| POST | `/reviews` 🔒 | Create a review |
| PUT | `/users/me` 🔒 | Update bio and avatar |
| GET | `/users/me/posts` 🔒 | Posts written by the logged-in user |
| GET | `/stats` | Platform totals (users, posts, categories, likes) |
| GET | `/health` | Health check |

---

## Security notes

- Passwords are hashed with bcrypt and never returned by the API
- Protected routes verify a signed JWT on every request
- Only a post's author can delete it, and this is checked on the server, not just hidden in the UI
- Uploads accept images only (jpg, png, webp) and are limited to 5 MB
- CORS only allows the origin set in `CLIENT_URL`

---

## Roadmap

- [ ] Edit existing posts (text and photo)
- [ ] Store images in cloud storage (Cloudinary or S3) so they survive redeploys on hosts with temporary disks
- [ ] Script to create the default categories automatically
- [ ] Deployment (front end + API + MongoDB Atlas)

---

## Author

Built by [@roukaiafadla](https://github.com/roukaiafadla).