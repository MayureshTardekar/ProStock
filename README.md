<<<<<<< HEAD
=======
<!-- cd C:\Users\MAYURESH\Desktop\MCA\crashed\Prostock2\Prostock1\prostock-prime-page\backend
npm run dev
cd C:\Users\MAYURESH\Desktop\MCA\crashed\Prostock2\Prostock1\prostock-prime-page
npm run dev -->

>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)
# 📈 ProStock

<p align="center">
  <em>Next-Generation Paper Trading Platform for Indian Stock Markets</em>
</p>

<p align="center">
  <a href="https://github.com/MayureshTardekar/prostock-prime-page"><img src="https://img.shields.io/badge/version-1.0.0-blue.svg?style=for-the-badge" alt="Version"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green.svg?style=for-the-badge" alt="License"></a>
  <a href="https://reactjs.org/"><img src="https://img.shields.io/badge/React-18.3.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5.8.3-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"></a>
  <a href="https://www.mysql.com/"><img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"></a>
</p>

<p align="center">
  <strong>Practice trading without risk. Learn, experiment, and master the markets.</strong>
</p>

<p align="center">
  <a href="https://github.com/MayureshTardekar/prostock-prime-page">🚀 View Repository</a> •
  <a href="https://github.com/MayureshTardekar/prostock-prime-page#-quick-start">📖 Quick Start</a> •
  <a href="https://github.com/MayureshTardekar/prostock-prime-page/issues">🐛 Report Bug</a>
</p>

---

## 🌟 Overview

ProStock is a **feature-rich paper trading platform** for Indian stock markets (NSE/BSE). Built with modern web technologies, it provides a realistic trading environment with **real-time market data, portfolio management, and comprehensive analytics**.

### 🎯 Why ProStock?

```
🚀 Lightning Fast          📊 Real-time Data         🎨 Beautiful UI
🔒 Secure Backend          📱 Mobile Responsive      ⚡ Production Ready
```

---

## ✨ Key Features

### 💹 Trading & Portfolio
<<<<<<< HEAD
- **Live Trading** - Real-time buy/sell with instant confirmation
- **Portfolio Tracking** - Real-time holdings, P&L, and performance analytics
- **Order History** - Complete trade history with detailed breakdowns
- **Money Management** - Virtual funds with ₹5,00,000 starting balance

### 📈 Market Intelligence
- **Live Market Data** - Real-time NSE/BSE prices via Yahoo Finance
- **Market Indices** - NIFTY 50, SENSEX, BANK NIFTY tracking
- **Stock Discovery** - Advanced search and trending stocks
- **Watchlist** - Save and monitor favorite stocks

### 🎨 User Experience
- **Dark/Light Mode** - Elegant theme switching
- **Responsive Design** - Perfect on all devices
- **Smart Notifications** - Real-time trade and account alerts
- **Modern UI** - Built with shadcn/ui and Tailwind CSS

---

## 🏗️ Tech Stack

| Frontend | Backend | Database | Tools |
|:--------:|:-------:|:--------:|:-----:|
| ⚛️ React 18.3 | 🟢 Node.js | 🐬 MySQL 8.0 | ⚡ Vite 5 |
| 📘 TypeScript | 🚂 Express.js | 🔐 JWT Auth | 🎨 Tailwind |
| 🧩 Radix UI | 🔒 bcrypt | 💾 Connections | 🎭 shadcn/ui |
| 🔄 React Router | 📡 Axios | 🗂️ Indexed | 📊 Recharts |

---

## 📋 Prerequisites

**Required:**
- Node.js ≥18.0.0
- MySQL ≥8.0.0
- npm ≥9.0.0

**Recommended:**
- VS Code with ESLint, Prettier, Tailwind IntelliSense
- MySQL Workbench for database management
- Postman for API testing

=======

- **Live Trading** - Real-time buy/sell with instant confirmation
- **Portfolio Tracking** - Real-time holdings, P&L, and performance analytics
- **Order History** - Complete trade history with detailed breakdowns
- **Money Management** - Virtual funds with ₹5,00,000 starting balance

### 📈 Market Intelligence

- **Live Market Data** - Real-time NSE/BSE prices via Yahoo Finance
- **Market Indices** - NIFTY 50, SENSEX, BANK NIFTY tracking
- **Stock Discovery** - Advanced search and trending stocks
- **Watchlist** - Save and monitor favorite stocks

### 🎨 User Experience

- **Dark/Light Mode** - Elegant theme switching
- **Responsive Design** - Perfect on all devices
- **Smart Notifications** - Real-time trade and account alerts
- **Modern UI** - Built with shadcn/ui and Tailwind CSS

---

## 🏗️ Tech Stack

|    Frontend     |    Backend    |    Database    |    Tools     |
| :-------------: | :-----------: | :------------: | :----------: |
|  ⚛️ React 18.3  |  🟢 Node.js   |  🐬 MySQL 8.0  |  ⚡ Vite 5   |
|  📘 TypeScript  | 🚂 Express.js |  🔐 JWT Auth   | 🎨 Tailwind  |
|   🧩 Radix UI   |   🔒 bcrypt   | 💾 Connections | 🎭 shadcn/ui |
| 🔄 React Router |   📡 Axios    |   🗂️ Indexed   | 📊 Recharts  |

---

## 📋 Prerequisites

**Required:**

- Node.js ≥18.0.0
- MySQL ≥8.0.0
- npm ≥9.0.0

**Recommended:**

- VS Code with ESLint, Prettier, Tailwind IntelliSense
- MySQL Workbench for database management
- Postman for API testing

>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)
---

## 🚀 Quick Start

Get ProStock running in **5 minutes**:

```bash
# 1. Clone repository
git clone https://github.com/MayureshTardekar/prostock-prime-page.git
cd prostock-prime-page

# 2. Install dependencies
npm install
cd backend && npm install && cd ..

# 3. Setup database
mysql -u root -p < backend/database/schema.sql

# 4. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your MySQL credentials

# 5. Start servers
npm run dev                    # Terminal 1 - Frontend
cd backend && npm run dev      # Terminal 2 - Backend
```

🎉 **Done!** Open [http://localhost:8080](http://localhost:8080)

---

## ⚙️ Configuration

Create `backend/.env` file:

```env
# Database
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=prostock

# Server
PORT=3001
NODE_ENV=development

# Security
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
JWT_EXPIRES_IN=7d

# CORS
FRONTEND_URL=http://localhost:8080
```

---

## 💻 Usage Examples

### Example 1: User Registration & Trading

```typescript
// Register new user
<<<<<<< HEAD
const response = await fetch('http://localhost:3001/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'secure123'
  })
=======
const response = await fetch("http://localhost:3001/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    fullName: "John Doe",
    email: "john@example.com",
    password: "secure123",
  }),
>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)
});

const { token, user } = await response.json();
// User gets ₹5,00,000 initial balance

// Buy stocks
<<<<<<< HEAD
await fetch('http://localhost:3001/api/orders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    type: 'BUY',
    quantity: 10,
    price: 2500.00
  })
=======
await fetch("http://localhost:3001/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    symbol: "RELIANCE",
    name: "Reliance Industries",
    type: "BUY",
    quantity: 10,
    price: 2500.0,
  }),
>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)
});
```

### Example 2: React Component with Trading Context

```typescript
<<<<<<< HEAD
import { useTrading } from '@/contexts/TradingContext';
=======
import { useTrading } from "@/contexts/TradingContext";
>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)

function TradingCard() {
  const { balance, portfolio, buyStock } = useTrading();

  const handleBuy = async () => {
<<<<<<< HEAD
    const stock = { symbol: 'TCS', name: 'TCS Ltd', price: 3500 };
    const success = await buyStock(stock, 5);
    if (success) console.log('Purchase successful!');
=======
    const stock = { symbol: "TCS", name: "TCS Ltd", price: 3500 };
    const success = await buyStock(stock, 5);
    if (success) console.log("Purchase successful!");
>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)
  };

  return (
    <div>
      <h2>Balance: ₹{balance.toLocaleString()}</h2>
      <p>Holdings: {portfolio.length} stocks</p>
      <button onClick={handleBuy}>Buy 5 TCS @ ₹3,500</button>
    </div>
  );
}
```

---

## 🔌 API Reference

### Authentication

```http
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user
```

### Portfolio

```http
GET  /api/portfolio/:userId              # Get holdings
GET  /api/orders/:userId                 # Order history
POST /api/orders                         # Place order (Buy/Sell)
```

### Money Management

```http
POST /api/money/deposit                  # Add funds
POST /api/money/withdraw                 # Withdraw funds
GET  /api/money/transactions/:userId     # Transaction history
```

### Market Data

```http
GET  /api/market/stocks?symbols=RELIANCE,TCS    # Get stock prices
GET  /api/health                                # Health check
```

**Full API Documentation:** See [API_DOCS.md](./docs/API_DOCS.md)

---

## 🗄️ Database Schema

ProStock uses **MySQL** with 6 core tables:

```sql
users          # User accounts and authentication
portfolio      # Stock holdings per user
orders         # Buy/sell order history
transactions   # Money movements log
watchlist      # User's favorite stocks
notifications  # User alerts and messages
```

**Schema File:** `backend/database/schema.sql`

**Quick Setup:**
<<<<<<< HEAD
=======

>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)
```bash
mysql -u root -p < backend/database/schema.sql
```

---

## 📁 Project Structure

```
prostock-prime-page/
├── src/
│   ├── components/          # React components
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── trading/         # Trading modal
│   │   └── ui/             # shadcn/ui components
│   ├── contexts/           # React Context (State)
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Route pages
│   ├── lib/                # Utilities
│   └── index.css           # Global styles
├── backend/
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth middleware
│   ├── config/             # Database config
│   ├── database/           # SQL schema
│   └── server.js           # Express server
└── public/                 # Static assets
```

---

## 🧪 Testing

### Manual Testing

```bash
# Test backend health
curl http://localhost:3001/api/health

# Test registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@test.com","password":"test123"}'
```

### Frontend Testing

1. Open `http://localhost:8080`
2. Register a new account
3. Try buying/selling stocks
4. Check portfolio and orders
5. Test money management
6. Update profile

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

```bash
# 1. Fork and clone
git clone https://github.com/MayureshTardekar/prostock-prime-page.git

# 2. Create feature branch
git checkout -b feature/amazing-feature

# 3. Commit changes
git commit -m "feat: add amazing feature"

# 4. Push and create PR
git push origin feature/amazing-feature
# Then create PR at https://github.com/MayureshTardekar/prostock-prime-page/pulls
```

**Commit Convention:** Use [Conventional Commits](https://www.conventionalcommits.org/)
<<<<<<< HEAD
=======

>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring

---

## 🗺️ Roadmap

### v1.1 (Q1 2026)
<<<<<<< HEAD
=======

>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)
- [ ] Full backend authentication integration
- [ ] Real-time WebSocket for live prices
- [ ] Advanced charting with indicators
- [ ] Email notifications

### v1.2 (Q2 2026)
<<<<<<< HEAD
=======

>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)
- [ ] Options & Futures trading
- [ ] Mutual funds support
- [ ] Portfolio analytics dashboard
- [ ] Mobile app (React Native)

### v2.0 (Q3 2026)
<<<<<<< HEAD
=======

>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)
- [ ] Stop Loss & Limit orders
- [ ] Algorithmic trading
- [ ] Backtesting engine
- [ ] Social trading features

---

## ⚠️ Known Issues

### Current Limitations

1. **Data Storage**
<<<<<<< HEAD
=======

>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)
   - Currently using localStorage (browser-only)
   - Backend integration planned for permanent storage
   - **Status:** High priority

2. **Market Data**
<<<<<<< HEAD
=======

>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)
   - Updates every 60 seconds (not true real-time)
   - Yahoo Finance API rate limits may apply
   - **Status:** Acceptable for paper trading

3. **Authentication**
   - Frontend demo auth (localStorage based)
   - Backend JWT ready, needs integration
   - **Status:** In progress

### Browser Support
<<<<<<< HEAD
=======

>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License - Copyright (c) 2025 ProStock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 👥 Maintainers

**Mayuresh Tardekar**
<<<<<<< HEAD
=======

>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)
- GitHub: [@MayureshTardekar](https://github.com/MayureshTardekar)
- Email: mayutardekar1205@gmail.com

### Support
<<<<<<< HEAD
=======

>>>>>>> 54b8f69 (feat: Complete database integration with MySQL)
- 📧 Email: mayutardekar1205@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/MayureshTardekar/prostock-prime-page/issues)

---

## 🙏 Acknowledgments

Built with amazing open-source technologies:

- **Yahoo Finance API** - Market data provider
- **shadcn/ui** - Beautiful UI components
- **Radix UI** - Accessible primitives
- **Tailwind CSS** - Utility-first CSS
- **Vite** - Next-gen frontend tooling
- **React Community** - Amazing ecosystem

---

<p align="center">
  <strong>🌟 Show Your Support</strong>
</p>

<p align="center">
  If you find ProStock helpful, please ⭐ star the repository!
</p>

<p align="center">
  <strong>Built with ❤️ for traders and developers</strong>
</p>

<p align="center">
  <em>ProStock - Making paper trading accessible to everyone</em>
</p>
