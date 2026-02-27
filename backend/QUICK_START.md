# Quick Start Guide

Get the backend running in 5 minutes!

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Setup Environment

```bash
# Copy the example .env file
cp .env.example .env

# Make sure MongoDB is running locally
# MongoDB should be accessible at: mongodb://127.0.0.1:27017/
```

## Step 3: Setup Database

```bash
# Generate Prisma client
npm run prisma:generate

# Create database migrations
npm run prisma:migrate

# Seed with sample data (Admin + User accounts, Products, Categories)
npm run prisma:seed
```

## Step 4: Start Development Server

```bash
npm run dev
```

The server will start on **http://localhost:5000**

## Step 5: Test the API

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Login (Get JWT Token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@jewelry.com",
    "password": "User@123"
  }'
```

### Get All Products
```bash
curl http://localhost:5000/api/products
```

### Get Your Cart (Requires Token)
```bash
curl -X GET http://localhost:5000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Default Test Accounts

### Admin
- Email: `admin@jewelry.com`
- Password: `Admin@123`

### Regular User
- Email: `user@jewelry.com`
- Password: `User@123`

## MongoDB

If MongoDB is not running, start it:

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Windows:**
```bash
# Run MongoDB Service (should be installed as a service)
net start MongoDB
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Or run with Docker:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## Frontend Integration

Configure your frontend to use this backend:

```javascript
const API_URL = 'http://localhost:5000/api';

// In your fetch/axios calls
const response = await fetch(`${API_URL}/products`);
```

## Troubleshooting

**Error: MongoDB connection refused**
- Make sure MongoDB is running
- Check `DATABASE_URL` in `.env` is correct

**Error: Port 5000 already in use**
```bash
# Find what's using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

**Error: JWT_SECRET not set**
- Make sure you've copied `.env.example` to `.env`
- `JWT_SECRET` should be at least 32 characters

**Error: Email sending fails**
- Gmail: Use app password, not your regular password
- Check SMTP credentials in `.env`

## Next Steps

1. ✅ Backend is running
2. 📱 Setup your frontend to connect to this API
3. 🔐 Update JWT_SECRET for production
4. 📧 Configure email for production
5. 🗄️ Setup MongoDB Atlas for production database

## Documentation

For full API documentation, see **README.md**

Happy coding! 🚀
