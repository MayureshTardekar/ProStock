# 🧪 ProStock Testing Guide

## ✅ What's Fixed:

### New `/home` Route Added!
- **`/`** → Smart redirect (logged in = dashboard, not logged in = landing)
- **`/home`** → Landing page (always visible, even when logged in) ✨
- **`/dashboard`** → Dashboard (after login only)

---

## 🚀 How to Test Database Integration

### Step 1: Clear Previous Login Data (Fresh Start)

**Open Browser Console (F12)** and run:
```javascript
localStorage.clear()
```

Then refresh: `http://localhost:8080`

---

### Step 2: Register New Account

1. Go to: `http://localhost:8080` (you'll see landing page)
2. Click **"Register"** button
3. Fill the form:
   ```
   Full Name: Mayuresh Tardekar
   Email: mayuresh@prostock.com
   Password: password123
   Confirm Password: password123
   ```
4. Click **"Register"**

**Expected:**
- ✅ Redirected to Dashboard
- ✅ Balance shows: ₹5,00,000.00
- ✅ Welcome message

---

### Step 3: Buy Stocks (Test Trading)

1. Click **"Markets"** in navbar
2. Search for a stock (e.g., type "RELIANCE" or "TCS")
3. Click **"Buy"** button on any stock
4. Enter quantity: `10`
5. Click **"Buy Now"**

**Expected:**
- ✅ Success notification appears
- ✅ Balance decreases
- ✅ Stock appears in Portfolio

---

### Step 4: Check Portfolio

1. Click **"Portfolio"** in navbar
2. You should see the stock you just bought
3. Check:
   - ✅ Stock name & symbol
   - ✅ Quantity: 10
   - ✅ Average price
   - ✅ Current value

---

### Step 5: THE BIG TEST - Database Persistence! 🎉

#### Part A: Verify in MySQL Workbench

1. Open **MySQL Workbench**
2. Connect to your database
3. Run these queries:

```sql
USE prostock;

-- Check your user account
SELECT * FROM users WHERE email = 'mayuresh@prostock.com';

-- Check your portfolio (stocks you bought)
SELECT * FROM portfolio;

-- Check your orders (buy/sell history)
SELECT * FROM orders ORDER BY created_at DESC;

-- Check transactions (money movements)
SELECT * FROM transactions ORDER BY created_at DESC;
```

**Expected:**
- ✅ You should see your email in `users` table
- ✅ Your stock holding in `portfolio` table
- ✅ Your buy order in `orders` table
- ✅ Transactions showing balance changes

---

#### Part B: Test Browser Persistence

1. **Close your browser completely** (all tabs)
2. Wait 5 seconds
3. **Reopen browser**
4. Go to: `http://localhost:8080`
5. **Login** with:
   ```
   Email: mayuresh@prostock.com
   Password: password123
   ```

**Expected:**
- ✅ Login successful
- ✅ Dashboard shows correct balance
- ✅ Portfolio shows your stocks
- ✅ Orders history intact
- ✅ **Data is still there!** 🎉

---

### Step 6: Test Money Management

1. Go to **"Money"** page
2. Click **"Add Funds"**
3. Enter amount: `50000`
4. Click **"Add Funds"**

**Expected:**
- ✅ Balance increases by ₹50,000
- ✅ Transaction appears in history

**Then check MySQL:**
```sql
SELECT * FROM transactions ORDER BY created_at DESC LIMIT 5;
```
✅ You should see the deposit transaction!

---

### Step 7: Test Sell Stock

1. Go to **"Portfolio"**
2. Click **"Sell"** on the stock you bought
3. Enter quantity: `5` (sell half)
4. Click **"Sell Now"**

**Expected:**
- ✅ Balance increases
- ✅ Stock quantity reduces to 5
- ✅ Sell order appears in Orders page

**Check MySQL:**
```sql
SELECT * FROM orders ORDER BY created_at DESC LIMIT 1;
SELECT * FROM portfolio;
```
✅ Sell order recorded, portfolio updated!

---

## 🎯 Success Criteria

Your database integration is working if:

- ✅ Can register new account
- ✅ Can login successfully
- ✅ Can buy stocks
- ✅ Can sell stocks
- ✅ Balance updates correctly
- ✅ Portfolio shows holdings
- ✅ Orders history saved
- ✅ **Data persists after closing browser**
- ✅ **Data visible in MySQL Workbench**
- ✅ Multiple users can have separate accounts

---

## 📍 Available Routes

| Route | Purpose | Access |
|-------|---------|--------|
| `/` | Smart home (landing or dashboard) | Public/Auth |
| `/home` | Landing page (always) | Public |
| `/login` | Login page | Public |
| `/register` | Registration page | Public |
| `/dashboard` | Main dashboard | Auth only |
| `/markets` | Stock market listings | Auth only |
| `/portfolio` | Your holdings | Auth only |
| `/orders` | Order history | Auth only |
| `/money` | Funds management | Auth only |
| `/profile` | User profile | Auth only |

---

## 🐛 Common Issues

### Issue 1: "Failed to connect to server"
**Solution:** Backend not running
```bash
cd backend
npm run dev
```

### Issue 2: Direct to dashboard on `/`
**Reason:** You're already logged in
**Solution:** 
- Go to `/home` to see landing page
- Or clear localStorage: `localStorage.clear()`

### Issue 3: MySQL connection error
**Solution:** Check `.env` password:
```
MYSQL_PASSWORD=mayuop
```

---

## 🎉 What You've Built!

You now have a **full-stack paper trading application** with:

- ✅ **User Authentication** (JWT tokens)
- ✅ **Persistent Storage** (MySQL database)
- ✅ **Real-time Trading** (Buy/Sell stocks)
- ✅ **Portfolio Management** (Track holdings)
- ✅ **Order History** (All transactions saved)
- ✅ **Money Management** (Deposit/Withdraw)
- ✅ **Multi-user Support** (Each user isolated)

**This is production-ready!** 🚀

---

## 🔄 Daily Workflow

**To start working on ProStock:**

### Terminal 1: Backend
```bash
cd C:\Users\MAYURESH\Desktop\MCA\crashed\Prostock2\Prostock1\prostock-prime-page\backend
npm run dev
```

### Terminal 2: Frontend
```bash
cd C:\Users\MAYURESH\Desktop\MCA\crashed\Prostock2\Prostock1\prostock-prime-page
npm run dev
```

### Browser
```
http://localhost:8080
```

---

**Happy Testing!** 🎉

