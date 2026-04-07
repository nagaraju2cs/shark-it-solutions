# 🦈 Shark IT Solutions — Backend API

A production-ready **Node.js + Express + MongoDB** REST API powering the Shark IT Solutions website.

---

## 🗂️ Project Structure

```
shark-it-backend/
├── server.js               # Main entry point
├── package.json
├── .env.example            # Environment variable template
├── config/
│   └── db.js               # MongoDB connection
├── middleware/
│   ├── auth.js             # JWT authentication & role authorization
│   └── errorHandler.js     # Global error handler
├── models/
│   ├── User.js             # Admin/editor user model
│   ├── Contact.js          # Contact form submissions
│   ├── Blog.js             # Blog posts with auto-slug
│   └── ReviewAndQuote.js   # Customer reviews & quote requests
├── routes/
│   ├── auth.js             # Register, login, profile
│   ├── contact.js          # Contact form + email notifications
│   ├── services.js         # IT services listing
│   ├── blog.js             # Blog CRUD
│   ├── reviews.js          # Review submission & approval
│   ├── quotes.js           # Quote request handling
│   └── admin.js            # Admin dashboard & analytics
└── utils/
    ├── logger.js           # Winston logger
    └── email.js            # Nodemailer + email templates
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd shark-it-backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI, email credentials, JWT secret
```

### 3. Start Development Server
```bash
npm run dev        # Uses nodemon for hot reload
# OR
npm start          # Production mode
```

---

## 🔌 API Endpoints

### Health Check
```
GET   /api/v1/health
```

### Authentication
```
POST  /api/v1/auth/register         Register new admin/user
POST  /api/v1/auth/login            Login → returns JWT token
GET   /api/v1/auth/me               Get current user (protected)
PUT   /api/v1/auth/updatedetails    Update name/email
PUT   /api/v1/auth/updatepassword   Change password
```

### Contact Form
```
POST  /api/v1/contact               Submit contact form (public)
GET   /api/v1/contact               Get all contacts (admin only)
PATCH /api/v1/contact/:id           Update contact status
DELETE /api/v1/contact/:id          Delete contact (admin)
```

### Services
```
GET   /api/v1/services              Get all IT services (public)
GET   /api/v1/services/:slug        Get single service by slug
```

### Blog
```
GET   /api/v1/blog                  Get all published blogs (public)
GET   /api/v1/blog/:slug            Get single blog post (public)
POST  /api/v1/blog                  Create blog (admin/editor)
PUT   /api/v1/blog/:id              Update blog (admin/editor)
DELETE /api/v1/blog/:id             Delete blog (admin)
```

### Reviews
```
GET   /api/v1/reviews               Get approved reviews (public)
POST  /api/v1/reviews               Submit review (public)
PATCH /api/v1/reviews/:id           Approve/feature review (admin)
DELETE /api/v1/reviews/:id          Delete review (admin)
```

### Quote Requests
```
POST  /api/v1/quotes                Submit quote request (public)
GET   /api/v1/quotes                Get all quotes (admin)
PATCH /api/v1/quotes/:id            Update quote status (admin)
```

### Admin Dashboard
```
GET   /api/v1/admin/dashboard       Full analytics overview (admin)
GET   /api/v1/admin/users           List all users (admin)
PATCH /api/v1/admin/users/:id       Update user role/status (admin)
DELETE /api/v1/admin/users/:id      Delete user (admin)
```

---

## 🔐 Authentication

Use **Bearer Token** in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### User Roles
| Role    | Permissions                                      |
|---------|--------------------------------------------------|
| admin   | Full access — all routes                         |
| editor  | Create/edit blogs, update contacts               |
| viewer  | Read-only access to own profile                  |

---

## 📧 Email Notifications

The backend sends two emails on contact form submission:
1. **Confirmation email** to the user with next steps
2. **Admin notification** to `ADMIN_EMAIL` with full details

Configure `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` in `.env`.

For Gmail, use an **App Password** (not your regular password):
> Google Account → Security → 2FA → App Passwords → Generate

---

## 🗄️ Database (MongoDB)

### Local MongoDB
```
MONGO_URI=mongodb://localhost:27017/sharkitsolutions
```

### MongoDB Atlas (Cloud — Recommended for Production)
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/sharkitsolutions
```

---

## 🌐 Connecting Frontend to Backend

Update your HTML contact form to call the API:
```javascript
const response = await fetch('http://localhost:5000/api/v1/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, phone, service, message })
});
const data = await response.json();
```

---

## 🛡️ Security Features

- **Helmet** — HTTP security headers
- **CORS** — Configurable origin whitelist
- **Rate Limiting** — 100 requests per 15 minutes per IP
- **MongoDB Sanitization** — Prevents NoSQL injection
- **bcryptjs** — Password hashing (12 salt rounds)
- **JWT** — Stateless authentication
- **Express Validator** — Input validation on all routes
- **Winston** — Structured logging to files

---

## 📦 Tech Stack

| Layer       | Technology                    |
|-------------|-------------------------------|
| Runtime     | Node.js 18+                   |
| Framework   | Express.js 4                  |
| Database    | MongoDB + Mongoose            |
| Auth        | JWT + bcryptjs                |
| Email       | Nodemailer                    |
| Validation  | express-validator             |
| Logging     | Winston                       |
| Security    | Helmet, CORS, rate-limit      |

---

## 🚢 Production Deployment

### Deploy on VPS / Ubuntu Server
```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs

# Clone & install
git clone <your-repo>
cd shark-it-backend
npm install --production

# Use PM2 for process management
npm install -g pm2
pm2 start server.js --name shark-api
pm2 save
pm2 startup
```

### Deploy on Railway / Render (Recommended — Free tier)
1. Push code to GitHub
2. Connect repo to Railway.app or Render.com
3. Set environment variables in dashboard
4. Deploy — done!

---

## 📞 Support

**Shark IT Solutions**
- Email: info@sharkitsolutions.com
- LinkedIn: [linkedin.com/in/shark-itsolutions-4b52a3256](https://www.linkedin.com/in/shark-itsolutions-4b52a3256)
- Location: Hyderabad, Telangana, India
