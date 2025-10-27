import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNotifications } from "@/contexts/NotificationContext";

interface Stock {
  symbol: string;
  name: string;
  price: number;
}

interface PortfolioHolding {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
}

interface Order {
  id: string;
  symbol: string;
  name: string;
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
  total: number;
  timestamp: string;
  status: "COMPLETED";
}

interface Transaction {
  id: string;
  type: "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW";
  amount: number;
  balance: number;
  description: string;
  timestamp: string;
}

interface TradingContextType {
  balance: number;
  portfolio: PortfolioHolding[];
  orders: Order[];
  transactions: Transaction[];
  watchlist: string[];
  buyStock: (stock: Stock, quantity: number) => Promise<boolean>;
  sellStock: (symbol: string, quantity: number, currentPrice: number) => Promise<boolean>;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  addMoney: (amount: number) => Promise<void>;
  withdrawMoney: (amount: number) => Promise<boolean>;
  getTotalInvestment: () => number;
  getTotalCurrentValue: () => number;
  getTotalProfitLoss: () => number;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const INITIAL_BALANCE = 100000; // ₹1 lakh paper trading money
const MAX_BALANCE = 5000000; // ₹50 lakh maximum balance limit

export const TradingProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Helper function to get auth token
  const getAuthToken = () => localStorage.getItem("prostock_token");
  
  // Helper function to get user ID
  const getUserId = () => {
    const userStr = localStorage.getItem("prostock_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  // Helper function to make authenticated API calls
  const apiCall = async (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };
    
    const response = await fetch(`http://localhost:3001${url}`, {
      ...options,
      headers,
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API call failed');
    }
    
    return response.json();
  };

  // Load data from backend on mount
  useEffect(() => {
    const loadDataFromBackend = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          // Not logged in, load from localStorage
          const savedData = localStorage.getItem("prostock_trading_data");
          if (savedData) {
            const data = JSON.parse(savedData);
            setBalance(data.balance || INITIAL_BALANCE);
            setPortfolio(data.portfolio || []);
            setOrders(data.orders || []);
            setTransactions(data.transactions || []);
            setWatchlist(data.watchlist || []);
          }
          return;
        }

        const userId = getUserId();
        if (!userId) return;

        // Fetch user profile for balance
        const userData = await apiCall(`/api/user/${userId}/profile`);
        setBalance(userData.balance || INITIAL_BALANCE);

        // Fetch portfolio
        const portfolioData = await apiCall(`/api/portfolio/${userId}`);
        setPortfolio(portfolioData.portfolio || []);

        // Fetch orders
        const ordersData = await apiCall(`/api/orders/${userId}`);
        setOrders(ordersData.orders || []);

        // Fetch transactions
        const transactionsData = await apiCall(`/api/money/transactions/${userId}`);
        setTransactions(transactionsData.transactions || []);

        // Fetch watchlist - Note: This endpoint might not exist, commenting out for now
        // const watchlistData = await apiCall(`/api/portfolio/${userId}/watchlist`);
        // setWatchlist(watchlistData.watchlist?.map((w: any) => w.symbol) || []);

      } catch (error) {
        console.error("Failed to load data from backend:", error);
        // Fallback to localStorage
        const savedData = localStorage.getItem("prostock_trading_data");
        if (savedData) {
          const data = JSON.parse(savedData);
          setBalance(data.balance || INITIAL_BALANCE);
          setPortfolio(data.portfolio || []);
          setOrders(data.orders || []);
          setTransactions(data.transactions || []);
          setWatchlist(data.watchlist || []);
        }
      }
    };

    loadDataFromBackend();
  }, []);

  // Save data to localStorage as backup (keep for offline access)
  useEffect(() => {
    const data = {
      balance,
      portfolio,
      orders,
      transactions,
      watchlist,
    };
    localStorage.setItem("prostock_trading_data", JSON.stringify(data));
  }, [balance, portfolio, orders, transactions, watchlist]);

  const buyStock = async (stock: Stock, quantity: number): Promise<boolean> => {
    const total = stock.price * quantity;
    
    if (total > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You need ₹${total.toFixed(2)} but only have ₹${balance.toFixed(2)}`,
        variant: "destructive",
      });
      return false;
    }

    try {
      const token = getAuthToken();
      
      if (token) {
        // Call backend API
        const result = await apiCall('/api/orders', {
          method: 'POST',
          body: JSON.stringify({
            symbol: stock.symbol,
            name: stock.name,
            exchange: 'NSE',
            type: 'BUY',
            quantity,
            price: stock.price,
          }),
        });

        // Update local state with backend response
        setBalance(result.newBalance);
        
        // Reload portfolio and orders from backend
        const userId = getUserId();
        if (userId) {
          const portfolioData = await apiCall(`/api/portfolio/${userId}`);
          setPortfolio(portfolioData.portfolio || []);
          
          const ordersData = await apiCall(`/api/orders/${userId}`);
          setOrders(ordersData.orders || []);
        }
      } else {
        // Fallback to localStorage (offline mode)
        const order: Order = {
          id: Date.now().toString(),
          symbol: stock.symbol,
          name: stock.name,
          type: "BUY",
          quantity,
          price: stock.price,
          total,
          timestamp: new Date().toISOString(),
          status: "COMPLETED",
        };

        const existingHolding = portfolio.find(h => h.symbol === stock.symbol);
        if (existingHolding) {
          const totalQuantity = existingHolding.quantity + quantity;
          const totalValue = (existingHolding.avgPrice * existingHolding.quantity) + total;
          const newAvgPrice = totalValue / totalQuantity;
          
          setPortfolio(portfolio.map(h => 
            h.symbol === stock.symbol 
              ? { ...h, quantity: totalQuantity, avgPrice: newAvgPrice, currentPrice: stock.price }
              : h
          ));
        } else {
          setPortfolio([...portfolio, {
            symbol: stock.symbol,
            name: stock.name,
            quantity,
            avgPrice: stock.price,
            currentPrice: stock.price,
          }]);
        }

        const newBalance = balance - total;
        setBalance(newBalance);
        setOrders([order, ...orders]);
        
        const transaction: Transaction = {
          id: Date.now().toString() + "_tx",
          type: "BUY",
          amount: total,
          balance: newBalance,
          description: `Bought ${quantity} shares of ${stock.name}`,
          timestamp: new Date().toISOString(),
        };
        setTransactions([transaction, ...transactions]);
      }

      toast({
        title: "Order Executed",
        description: `Successfully bought ${quantity} shares of ${stock.symbol} for ₹${total.toFixed(2)}`,
      });

      addNotification(
        `Bought ${quantity} shares of ${stock.symbol} for ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
        "BUY"
      );

      return true;
    } catch (error) {
      console.error("Buy stock error:", error);
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Failed to execute buy order",
        variant: "destructive",
      });
      return false;
    }
  };

  const sellStock = async (symbol: string, quantity: number, currentPrice: number): Promise<boolean> => {
    const holding = portfolio.find(h => h.symbol === symbol);
    
    if (!holding || holding.quantity < quantity) {
      toast({
        title: "Insufficient Holdings",
        description: `You don't have enough shares to sell`,
        variant: "destructive",
      });
      return false;
    }

    const total = currentPrice * quantity;

    try {
      const token = getAuthToken();
      
      if (token) {
        // Call backend API
        const result = await apiCall('/api/orders', {
          method: 'POST',
          body: JSON.stringify({
            symbol,
            name: holding.name,
            exchange: 'NSE',
            type: 'SELL',
            quantity,
            price: currentPrice,
          }),
        });

        // Update local state with backend response
        setBalance(result.newBalance);
        
        // Reload portfolio and orders from backend
        const userId = getUserId();
        if (userId) {
          const portfolioData = await apiCall(`/api/portfolio/${userId}`);
          setPortfolio(portfolioData.portfolio || []);
          
          const ordersData = await apiCall(`/api/orders/${userId}`);
          setOrders(ordersData.orders || []);
        }
      } else {
        // Fallback to localStorage (offline mode)
        const order: Order = {
          id: Date.now().toString(),
          symbol: holding.symbol,
          name: holding.name,
          type: "SELL",
          quantity,
          price: currentPrice,
          total,
          timestamp: new Date().toISOString(),
          status: "COMPLETED",
        };

        if (holding.quantity === quantity) {
          setPortfolio(portfolio.filter(h => h.symbol !== symbol));
        } else {
          setPortfolio(portfolio.map(h => 
            h.symbol === symbol 
              ? { ...h, quantity: h.quantity - quantity, currentPrice }
              : h
          ));
        }

        const newBalance = balance + total;
        setBalance(newBalance);
        setOrders([order, ...orders]);
        
        const profitLoss = (currentPrice - holding.avgPrice) * quantity;
        const transaction: Transaction = {
          id: Date.now().toString() + "_tx",
          type: "SELL",
          amount: total,
          balance: newBalance,
          description: `Sold ${quantity} shares of ${holding.name} (P&L: ₹${profitLoss.toFixed(2)})`,
          timestamp: new Date().toISOString(),
        };
        setTransactions([transaction, ...transactions]);
      }

      toast({
        title: "Order Executed",
        description: `Successfully sold ${quantity} shares of ${symbol} for ₹${total.toFixed(2)}`,
      });

      const profitLoss = (currentPrice - holding.avgPrice) * quantity;
      const profitLossText = profitLoss >= 0 ? `+₹${profitLoss.toFixed(2)}` : `-₹${Math.abs(profitLoss).toFixed(2)}`;
      addNotification(
        `Sold ${quantity} shares of ${symbol} for ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (P&L: ${profitLossText})`,
        "SELL"
      );

      return true;
    } catch (error) {
      console.error("Sell stock error:", error);
      toast({
        title: "Order Failed",
        description: error instanceof Error ? error.message : "Failed to execute sell order",
        variant: "destructive",
      });
      return false;
    }
  };

  const addToWatchlist = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist([...watchlist, symbol]);
      toast({
        title: "Added to Watchlist",
        description: `${symbol} has been added to your watchlist`,
      });
    }
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(watchlist.filter(s => s !== symbol));
    toast({
      title: "Removed from Watchlist",
      description: `${symbol} has been removed from your watchlist`,
    });
  };

  const addMoney = async (amount: number) => {
    const newBalance = balance + amount;
    
    if (newBalance > MAX_BALANCE) {
      toast({
        title: "Maximum Balance Exceeded",
        description: `Cannot exceed maximum balance of ₹${MAX_BALANCE.toLocaleString('en-IN')}. You can add up to ₹${(MAX_BALANCE - balance).toLocaleString('en-IN')}`,
        variant: "destructive",
      });
      return;
    }
    
    try {
      const token = getAuthToken();
      
      if (token) {
        // Call backend API
        const result = await apiCall('/api/money/deposit', {
          method: 'POST',
          body: JSON.stringify({ amount }),
        });

        setBalance(result.balance);
        setTransactions([result.transaction, ...transactions]);
      } else {
        // Fallback to localStorage (offline mode)
        setBalance(newBalance);
        
        const transaction: Transaction = {
          id: Date.now().toString(),
          type: "DEPOSIT",
          amount,
          balance: newBalance,
          description: `Added funds to account`,
          timestamp: new Date().toISOString(),
        };
        setTransactions([transaction, ...transactions]);
      }

      toast({
        title: "Funds Added",
        description: `₹${amount.toFixed(2)} has been added to your account`,
      });

      addNotification(
        `Added ₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} to your account`,
        "DEPOSIT"
      );
    } catch (error) {
      console.error("Add money error:", error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to add funds",
        variant: "destructive",
      });
    }
  };

  const withdrawMoney = async (amount: number): Promise<boolean> => {
    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You cannot withdraw more than your available balance`,
        variant: "destructive",
      });
      return false;
    }

    try {
      const token = getAuthToken();
      
      if (token) {
        // Call backend API
        const result = await apiCall('/api/money/withdraw', {
          method: 'POST',
          body: JSON.stringify({ amount }),
        });

        setBalance(result.balance);
        setTransactions([result.transaction, ...transactions]);
      } else {
        // Fallback to localStorage (offline mode)
        const newBalance = balance - amount;
        setBalance(newBalance);
        
        const transaction: Transaction = {
          id: Date.now().toString(),
          type: "WITHDRAW",
          amount,
          balance: newBalance,
          description: `Withdrew funds from account`,
          timestamp: new Date().toISOString(),
        };
        setTransactions([transaction, ...transactions]);
      }

      toast({
        title: "Funds Withdrawn",
        description: `₹${amount.toFixed(2)} has been withdrawn from your account`,
      });

      addNotification(
        `Withdrew ₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} from your account`,
        "WITHDRAW"
      );

      return true;
    } catch (error) {
      console.error("Withdraw money error:", error);
      toast({
        title: "Transaction Failed",
        description: error instanceof Error ? error.message : "Failed to withdraw funds",
        variant: "destructive",
      });
      return false;
    }
  };

  const getTotalInvestment = () => {
    return portfolio.reduce((sum, holding) => sum + (holding.avgPrice * holding.quantity), 0);
  };

  const getTotalCurrentValue = () => {
    return portfolio.reduce((sum, holding) => sum + (holding.currentPrice * holding.quantity), 0);
  };

  const getTotalProfitLoss = () => {
    return getTotalCurrentValue() - getTotalInvestment();
  };

  return (
    <TradingContext.Provider
      value={{
        balance,
        portfolio,
        orders,
        transactions,
        watchlist,
        buyStock,
        sellStock,
        addToWatchlist,
        removeFromWatchlist,
        addMoney,
        withdrawMoney,
        getTotalInvestment,
        getTotalCurrentValue,
        getTotalProfitLoss,
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error("useTrading must be used within TradingProvider");
  }
  return context;
};