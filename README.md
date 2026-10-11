<div align="center">

<img src="docs/assets/logo.png" alt="Shaghaf logo" width="132" />

# Shaghaf &nbsp;<sub>شغف</sub>

**Where hobbies find their community.**<br/>
Share what you create, discover what others are making, and keep your passion alive.

<br/>

[![Live Demo](https://img.shields.io/badge/Live_Demo-shaghaf--sigma.vercel.app-FE6F61?style=for-the-badge&logo=vercel&logoColor=white)](https://shaghaf-sigma.vercel.app)
&nbsp;
[![API Status](https://img.shields.io/badge/API-Render-008080?style=for-the-badge&logo=render&logoColor=white)](https://shaghaf-dkjh.onrender.com/api/health)

<br/>

![React](https://img.shields.io/badge/React_18-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_3-0F172A?style=flat-square&logo=tailwindcss&logoColor=38BDF8)
![Node.js](https://img.shields.io/badge/Node.js-1B1F23?style=flat-square&logo=nodedotjs&logoColor=5FA04E)
![Express](https://img.shields.io/badge/Express_4-1B1F23?style=flat-square&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB_Atlas-0B2B1C?style=flat-square&logo=mongodb&logoColor=47A248)
![Cloudinary](https://img.shields.io/badge/Cloudinary-1A2B6D?style=flat-square&logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)

<br/>

[**Live demo**](https://shaghaf-sigma.vercel.app) &nbsp;·&nbsp;
[**Features**](#features) &nbsp;·&nbsp;
[**Architecture**](#architecture) &nbsp;·&nbsp;
[**Getting started**](#getting-started) &nbsp;·&nbsp;
[**API**](#api-reference) &nbsp;·&nbsp;
[**Deployment**](#deployment)

</div>

<br/>

<div align="center">
  <sub>The demo runs on free hosting, so the first visit after a quiet period can take up to a minute while the server wakes up.</sub>
</div>

<br/>

<div align="center">
  <img src="docs/screenshots/home.png" alt="Shaghaf home page" width="92%" />
</div>

---

## Table of contents

- [About](#about)
- [Features](#features)
- [Screenshots](#screenshots)
- [Architecture](#architecture)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API reference](#api-reference)
- [Deployment](#deployment)
- [Security](#security)
- [Roadmap](#roadmap)
- [Author](#author)

---

## About

**Shaghaf** (شغف) means *passion* in Arabic. It is a community platform for people who love making things: painting, crafts, photography, cooking, gardening and music.

Members share what they are working on with a photo and a story, react to each other's work with likes and comments, and leave reviews of the platform itself. Every number you see on the site (popular posts, platform statistics) is computed live from the database, not hard-coded.

It is a complete, deployed **MERN** application: a React single-page app talking to a REST API built with Express and MongoDB, with images stored on Cloudinary.

---

## Features

<table>
<tr>
<td width="50%" valign="top">

### Community
- Sign up and log in with **JWT** authentication
- Share a post with a title, category, description and photo
- **Like** and **comment** on posts
- Leave a **star-rated review** of the platform
- **Edit** your own posts, including the photo
- **Delete** your own posts, and delete comments (your own, or any comment on your posts)
- Everything above is checked on the server, not just hidden in the UI

</td>
<td width="50%" valign="top">

### Discovery
- **Six categories**: Arts, Crafts, Photography, Cooking, Gardening & Plants, Music & Performance
- Home page with the latest posts of every category
- **Popular** section ranked by real like counts
- **Search** across posts from the navbar
- **More from this author** at the bottom of every post page
- Live platform statistics on the About page
- Members directory with search by name or bio, and member results in the navbar search
</td>
</tr>
<tr>
<td width="50%" valign="top">

### Profile
- Personal profile page with **avatar upload** and bio
- "My posts" grid with photo, category, likes and comments
- Settings page to update your bio
- **Public member pages** at `/u/<username>`: bio, join date, totals and posts. Every author name on the site links to one, with the member's avatar beside it

</td>
<td width="50%" valign="top">

### Design and experience
- Responsive, mobile-first layout built with **Tailwind CSS**
- Hamburger navigation on small screens
- **Protected routes**: profile, settings and create-post redirect guests to login
- Custom brand palette (coral, teal, gold) and Poppins typography

</td>
</tr>
</table>

---

## Screenshots

<table>
<tr>
<td align="center" width="50%">
  <img src="docs/screenshots/post-detail.png" alt="Post detail page with likes and comments" /><br/>
  <sub><b>Post detail</b>: photo, likes and comments</sub>
</td>
<td align="center" width="50%">
  <img src="docs/screenshots/profile.png" alt="Profile page with avatar and personal posts" /><br/>
  <sub><b>Profile</b>: avatar, bio and your posts</sub>
</td>
</tr>
<tr>
<td align="center" width="50%">
  <img src="docs/screenshots/create-post.png" alt="Create post form" /><br/>
  <sub><b>Create a post</b>: category, description and photo</sub>
</td>
<td align="center" width="50%">
  <img src="docs/screenshots/mobile.png" alt="Shaghaf on a phone" width="45%" /><br/>
  <sub><b>Mobile</b>: fully responsive</sub>
</td>
</tr>
</table>

---

## Architecture

The front end and the API are deployed separately and talk over HTTPS. Images never pass through the database: the API uploads them to Cloudinary and stores only the resulting URL.

```mermaid
flowchart LR
    U([Browser]) -->|HTTPS| V["Vercel<br/>React single-page app"]
    V -->|"REST + JWT"| R["Render<br/>Express API"]
    R -->|Mongoose| M[("MongoDB Atlas")]
    R -->|"upload_stream"| C["Cloudinary<br/>image storage and CDN"]
    C -.->|"images served by URL"| U
```

### What happens when someone shares a post

```mermaid
sequenceDiagram
    actor User
    participant Client as React client
    participant API as Express API
    participant Cloud as Cloudinary
    participant DB as MongoDB Atlas

    User->>Client: Fill in the form and pick a photo
    Client->>API: POST /api/posts (multipart form + JWT)
    API->>API: Verify the JWT and validate the image (type, 5 MB max)
    API->>Cloud: Upload the image from memory
    Cloud-->>API: Permanent secure_url
    API->>DB: Save the post with the image URL
    DB-->>API: Saved post
    API-->>Client: 201 Created
    Client-->>User: The post appears with its photo
```

### Data model

```mermaid
erDiagram
    USER ||--o{ POST : writes
    USER ||--o{ REVIEW : leaves
    CATEGORY ||--o{ POST : groups
    POST ||--o{ COMMENT : embeds
    USER ||--o{ COMMENT : writes
    USER }o--o{ POST : likes

    USER {
        ObjectId _id
        string username UK
        string email UK
        string password "bcrypt hash"
        string bio
        string avatar "Cloudinary URL"
    }
    CATEGORY {
        ObjectId _id
        string name UK
        string slug UK
        string description
    }
    POST {
        ObjectId _id
        string title
        string description
        string image "Cloudinary URL"
        ObjectId category FK
        ObjectId author FK
        ObjectId[] likes
    }
    COMMENT {
        ObjectId author FK
        string text
    }
    REVIEW {
        ObjectId reviewer FK
        number rating "1 to 5"
        string text
    }
```

> Comments are embedded inside their post document, and likes are stored as an array of user ids on the post. That keeps reads fast and the like-toggle a single update.

---

## Tech stack

| Layer | Technologies |
|---|---|
| **Front end** | React 18, React Router 6, Tailwind CSS 3, Axios, React Icons |
| **Back end** | Node.js, Express 4, Mongoose 8 |
| **Database** | MongoDB (local, or MongoDB Atlas in production) |
| **Authentication** | JSON Web Tokens, bcryptjs password hashing |
| **Image storage** | Multer (in-memory) + Cloudinary |
| **Hardening** | Helmet, express-rate-limit, CORS allow-list |
| **Hosting** | Vercel (client), Render (API), MongoDB Atlas (database), Cloudinary (images) |

---

## Project structure

```
shaghaf/
├── client/                      React front end
│   ├── public/
│   ├── vercel.json              SPA rewrite so deep links survive a refresh
│   └── src/
│       ├── api/                 Axios instance (attaches the JWT automatically)
│       ├── components/          Navbar, Hero, PostsSection, PopularSection, AuthorLink, Avatar, MoreFromAuthor, ...
│       ├── context/             AuthContext (login state shared across the app)
│       ├── pages/               Home, Login, Signup, CreatePost, PostDetail, Profile, UserProfile, ...
│       ├── utils/               imageUrl helper
│       └── images/
├── server/                      Express API
│   ├── config/                  Database connection
│   ├── controllers/             Route logic (auth, posts, reviews, users, stats)
│   ├── middleware/              Auth guard, image upload, error handling
│   ├── models/                  Mongoose schemas: User, Post, Category, Review
│   ├── routes/                  API route definitions
│   ├── scripts/                 seedCategories.js
│   ├── utils/                   Cloudinary upload and delete helpers
│   └── server.js                App entry point
└── docs/                        Logo and screenshots used by this README
```

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- A MongoDB database: [MongoDB installed locally](https://www.mongodb.com/docs/manual/installation/) or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A free [Cloudinary](https://cloudinary.com/) account (for image uploads)

### 1. Clone the repository

```bash
git clone https://github.com/roukaiafadla/shaghaf.git
cd shaghaf
```

### 2. Set up and start the API

```bash
cd server
npm install
cp .env.example .env        # Windows: copy .env.example .env
```

Fill in `server/.env` (see [Environment variables](#environment-variables)), then create the six categories and start the server:

```bash
npm run seed:categories     # safe to run more than once
npm run dev                 # API on http://localhost:5000
```

### 3. Start the client

In a second terminal:

```bash
cd client
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm start                   # App on http://localhost:3000
```

Open <http://localhost:3000>, create an account and share your first post.

> **Why a seed script?** Every post belongs to a category and the app has no screen for managing categories, so the six defaults are created once with `npm run seed:categories`. It uses upserts, so running it again never creates duplicates.

---

## Environment variables

### `server/.env`

| Variable | Description | Example |
|---|---|---|
| `PORT` | Port the API listens on (set automatically by most hosts) | `5000` |
| `MONGO_URI` | MongoDB connection string, database name included | `mongodb+srv://user:pass@cluster.mongodb.net/shaghaf` |
| `JWT_SECRET` | Long random string used to sign login tokens | *(generate your own)* |
| `CLIENT_URL` | Front-end origin allowed by CORS, no trailing slash | `http://localhost:3000` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary dashboard value | `my-cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary dashboard value | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary dashboard value | *(keep private)* |

### `client/.env`

| Variable | Description | Example |
|---|---|---|
| `REACT_APP_API_URL` | Base URL of the API, ending in `/api` | `http://localhost:5000/api` |

Generate a strong `JWT_SECRET` with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

> [!WARNING]
> Never commit a real `.env` file. They are already listed in `.gitignore`.

---

## API reference

Base URL: `/api`. Routes marked 🔒 need the header `Authorization: Bearer <token>`.

<details open>
<summary><b>Auth</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/auth/signup` | Create an account and receive a token |
| `POST` | `/auth/login` | Log in and receive a token |
| `GET` | `/auth/me` 🔒 | Get the logged-in user |

</details>

<details open>
<summary><b>Posts</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/posts` | List posts (`?category=slug` and `?search=term` supported) |
| `GET` | `/posts/popular` | Posts ranked by number of likes (`?limit=6`) |
| `GET` | `/posts/:id` | One post with its author and comments |
| `GET` | `/posts/:id/more` | Other posts by the same author (`?limit=3`) |
| `POST` | `/posts` 🔒 | Create a post (`multipart/form-data`: `title`, `category`, `description`, `image`) |
| `PUT` | `/posts/:id` 🔒 | Edit a post (author only, `multipart/form-data`, photo optional) |
| `DELETE` | `/posts/:id` 🔒 | Delete a post (author only) |
| `PUT` | `/posts/:id/like` 🔒 | Like or unlike a post |
| `POST` | `/posts/:id/comments` 🔒 | Add a comment |
| `DELETE` | `/posts/:id/comments/:commentId` 🔒 | Delete a comment (comment author or post owner) |

</details>

<details open>
<summary><b>Categories, reviews, users and stats</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/categories` | List all categories |
| `GET` | `/categories/:slug` | One category |
| `GET` | `/reviews` | Latest reviews |
| `POST` | `/reviews` 🔒 | Create a review (rating 1 to 5 and text) |
| `PUT` | `/users/me` 🔒 | Update bio and avatar (`multipart/form-data`) |
| `GET` | `/users/me/posts` 🔒 | Posts written by the logged-in user |
| `GET` | `/users/:username` | Public profile: bio, avatar, totals and posts (never the email) |
| `GET` | `/stats` | Platform totals: users, posts, categories, likes |
| `GET` | `/health` | Health check |
| `GET` | `/users` | Members directory (`?search=` and `?limit=`), public fields only |
</details>

**Limits and validation:** images must be JPG, PNG or WebP and at most 5 MB. Titles are limited to 120 characters, descriptions to 2000, comments and reviews to 500 and bios to 300. Passwords need at least 6 characters. Login and signup are rate limited per IP address.

---

## Deployment

The project runs in production on four free services. Every `git push` to `main` redeploys the client and the API automatically.

| Part | Service | Key settings |
|---|---|---|
| **Database** | [MongoDB Atlas](https://www.mongodb.com/atlas) | Allow network access from `0.0.0.0/0`, create a database user, and put the database name (`/shaghaf`) in the connection string |
| **API** | [Render](https://render.com) Web Service | Root directory `server`, build `npm install`, start `npm start`, plus all variables from `server/.env` |
| **Client** | [Vercel](https://vercel.com) | Root directory `client`, variable `REACT_APP_API_URL` set to `https://<your-api>.onrender.com/api` |
| **Images** | [Cloudinary](https://cloudinary.com) | Add the three `CLOUDINARY_*` variables to the API service |

**Order of operations**

1. Create the Atlas cluster, then run `npm run seed:categories` once against it.
2. Deploy the API on Render and check `/api/health` returns `{"status":"ok"}`.
3. Deploy the client on Vercel with `REACT_APP_API_URL` pointing at the API.
4. Set `CLIENT_URL` on Render to the exact Vercel URL (no trailing slash) so CORS allows it.

> Images are stored on Cloudinary rather than on the API's disk, because free hosting platforms wipe local files on every restart or redeploy.

---

## Security

- Passwords are hashed with **bcrypt** and never returned by the API
- Protected routes verify a signed **JWT** on every request
- Only a post's author can edit or delete it, and only a comment's author or the post owner can delete a comment, all **enforced on the server** and not only hidden in the UI
- Public profiles expose only the username, bio, avatar and join date, **never the email**, and posts are returned with counts instead of lists of who liked or commented
- Uploads accept **images only** (JPG, PNG, WebP) and are capped at 5 MB, and files are kept in memory instead of being written to disk
- **Helmet** sets secure HTTP headers
- **Rate limiting** on the auth routes slows down brute-force attempts
- **CORS** only allows the origin set in `CLIENT_URL`
- Search input is regex-escaped before it reaches MongoDB
- Secrets live in environment variables and are never committed

---

## Roadmap

**Shipped**
- [x] Cloud image storage with Cloudinary
- [x] Script that creates the default categories
- [x] Production deployment (Vercel, Render, MongoDB Atlas)
- [x] Security headers and rate limiting
- [x] Edit posts (text and photo)
- [x] Delete comments
- [x] Public member profiles
- [x] Avatars next to names and "More from this author"

**Next**
- [ ] Members page and people search
- [ ] Follow system, following feed and notifications
- [ ] Photo cropping and resizing before upload
- [ ] Email verification and password reset
- [ ] Pagination for post lists
- [ ] Request validation with a schema library
- [ ] Automated tests and a CI workflow
- [ ] Store the session in an httpOnly cookie instead of local storage

---

## Author

Built by [**@roukaiafadla**](https://github.com/roukaiafadla).

<div align="center">

<br/>

If you like this project, a ⭐ on the repository means a lot.

</div>
