# ProStock Backend - Express + MySQL

Backend API for ProStock paper trading application.

## Tech Stack

- **Node.js** + **Express.js** - REST API server
- **MySQL** - Relational database (via mysql2/promise)
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **Axios** - HTTP client for Yahoo Finance API
- **CORS** - Cross-origin resource sharing

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the following values:
- `MYSQL_PASSWORD` - Your MySQL root password
- `JWT_SECRET` - A random secret key for JWT signing
- `YAHOO_FINANCE_API_KEY` - Your Yahoo Finance API key

### 3. Create Database

Run the SQL schema to create database and tables:

```bash
mysql -u root -p < database/schema.sql
```

Or manually execute the SQL file in MySQL Workbench/phpMyAdmin.

### 4. Start Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server will run on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
  - Body: `{ fullName, email, password }`
  
- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: JWT token

### User Profile

- `GET /api/user/:id/profile` - Get user profile (auth required)
- `PUT /api/user/:id/profile` - Update profile (auth required)

### Portfolio

- `GET /api/portfolio/:userId` - Get user portfolio holdings (auth required)

### Orders

- `POST /api/orders` - Place BUY/SELL order (auth required)
  - Body: `{ symbol, name, exchange, type, quantity, price }`
  
- `GET /api/orders/:userId` - Get order history (auth required)

### Money Management

- `POST /api/money/deposit` - Add funds (auth required)
  - Body: `{ amount }`
  
- `POST /api/money/withdraw` - Withdraw funds (auth required)
  - Body: `{ amount }`
  
- `GET /api/money/transactions/:userId` - Get transaction history (auth required)

### Market Data

- `GET /api/market/stocks?symbols=RELIANCE,TCS,INFY` - Fetch stock prices
  - Uses Yahoo Finance API with 10-minute caching

## Authentication

All protected endpoints require JWT token in Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Database Schema

See `database/schema.sql` for complete schema with:
- `users` - User accounts and authentication
- `portfolio` - Stock holdings per user
- `orders` - Buy/sell order history
- `transactions` - Money deposits/withdrawals/trades
- `watchlist` - User watchlists
- `notifications` - User notifications

## Default Demo User

After running schema.sql, you'll have a demo user:
- Email: `demo@prostock.com`
- Password: `demo123`
- Initial Balance: ₹500,000

## Testing

Health check:
```bash
curl http://localhost:3001/api/health
```

Test registration:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@test.com","password":"test123"}'
```

## Production Deployment

1. Set `NODE_ENV=production` in .env
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name prostock-backend
   ```
3. Configure reverse proxy (nginx/Apache)
4. Use HTTPS in production
5. Secure database credentials

## License

MIT
