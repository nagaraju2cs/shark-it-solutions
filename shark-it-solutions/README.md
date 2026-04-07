# 🦈 Shark IT Solutions — Full Stack Project

## Project Structure

```
shark-it-solutions/
├── frontend/
│   └── index.html              # Complete website (HTML + CSS + JS)
│
├── backend/                    # Node.js / Express REST API
│   ├── server.js               # Entry point
│   ├── package.json
│   ├── .env.example            # Copy to .env and fill in values
│   ├── .gitignore
│   ├── README.md
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js             # JWT protect + role authorize
│   │   └── errorHandler.js     # Global error handler
│   ├── models/
│   │   ├── User.js             # Admin / Editor / Viewer users
│   │   ├── Blog.js             # Blog posts with auto-slug
│   │   ├── Contact.js          # Contact form submissions
│   │   └── ReviewAndQuote.js   # Reviews + Quote requests
│   ├── routes/
│   │   ├── auth.js             # POST /login, /register, GET /me
│   │   ├── admin.js            # Dashboard + user management
│   │   ├── blog.js             # Blog CRUD
│   │   ├── contact.js          # Contact form + admin view
│   │   ├── reviews.js          # Reviews submit + approve
│   │   ├── quotes.js           # Quote requests
│   │   └── services.js         # Static services data
│   ├── utils/
│   │   ├── logger.js           # Winston logger
│   │   └── email.js            # Nodemailer + HTML templates
│   └── logs/                   # Auto-created log files
│
└── README.md                   # This file
```

## Quick Start

### Frontend
Just open `frontend/index.html` in a browser — no build step needed.

### Backend
```bash
cd backend
npm install
cp .env.example .env          # Fill in your MongoDB URI, JWT secret, email creds
npm run dev                   # Development (nodemon)
npm start                     # Production
```

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | /api/v1/auth/register | Public | Register user |
| POST | /api/v1/auth/login | Public | Login + get JWT |
| GET | /api/v1/auth/me | JWT | Get current user |
| POST | /api/v1/contact | Public | Submit contact form |
| GET | /api/v1/contact | Admin | List all contacts |
| GET | /api/v1/services | Public | Get all services |
| GET | /api/v1/blog | Public | Get published blogs |
| POST | /api/v1/blog | Admin/Editor | Create blog |
| GET | /api/v1/reviews | Public | Get approved reviews |
| POST | /api/v1/reviews | Public | Submit review |
| POST | /api/v1/quotes | Public | Submit quote request |
| GET | /api/v1/admin/dashboard | Admin | Analytics dashboard |
| GET | /api/v1/health | Public | Health check |

## Tech Stack
- **Frontend**: Vanilla HTML5, CSS3, JS (zero dependencies)
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Auth**: JWT + bcrypt
- **Email**: Nodemailer (Gmail / SMTP)
- **Security**: Helmet, CORS, rate limiting, mongo-sanitize
- **Logging**: Winston
