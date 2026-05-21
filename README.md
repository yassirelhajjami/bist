# Badrane International School — Full Stack

## Structure

```
bist/
├── src/               # School website (React + Vite) — port 5173
├── admin/             # Admin dashboard (React + Vite) — port 5174
└── server/            # REST API (Node.js + Express + MongoDB) — port 5000
```

## Getting started

### 1. Start MongoDB
Make sure MongoDB is running locally on the default port (27017).

### 2. Configure the server
```bash
cd server
cp .env.example .env   # already done
# Edit .env and set your JWT_SECRET to a strong random string
```

### 3. Seed the database (first time only)
```bash
cd server
npm run seed
```
Default credentials:
- Email: `admin@badraneschool.ma`
- Password: `Admin@2024!`

**Change the password after first login!**

### 4. Start all three services

**Server (API):**
```bash
cd server
npm run dev
```

**School website:**
```bash
cd ..          # back to bist/
npm run dev
```

**Admin dashboard:**
```bash
cd admin
npm run dev
```

## URLs
| Service       | URL                          |
|---------------|------------------------------|
| School site   | http://localhost:5173         |
| Admin panel   | http://localhost:5174         |
| API           | http://localhost:5000/api     |
| Uploads       | http://localhost:5000/uploads |

## API Endpoints
| Resource     | Endpoints                                    |
|--------------|----------------------------------------------|
| Auth         | POST /login · GET /me · PATCH /me/password   |
| Posts        | GET · POST · PATCH /:id · DELETE /:id        |
| Gallery      | GET · POST · PATCH /:id · DELETE /:id        |
| Events       | GET · POST · PATCH /:id · DELETE /:id        |
| Staff        | GET · POST · PATCH /:id · DELETE /:id        |
| Content      | GET /:page · PATCH /:page                    |
| Settings     | GET · PATCH                                  |
| Stats        | GET /stats                                   |
| Upload       | POST /upload/image                           |

All protected routes require `Authorization: Bearer <token>` header.
