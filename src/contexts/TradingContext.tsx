import { useNotifications } from "@/contexts/NotificationContext";
import { useToast } from "@/hooks/use-toast";
import { isMarketOpen } from "@/utils/marketStatus";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

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
  status: "COMPLETED" | "PENDING" | "CANCELLED" | "REJECTED";
}

interface Transaction {
  id: string;
  type: "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW";
  amount: number;
  balance: number;
  description: string;
  timestamp: string;
}

interface StopLossOrder {
  id: string;
  symbol: string;
  name: string;
  triggerPrice: number;
  quantity: number;
  status: "PENDING" | "TRIGGERED" | "CANCELLED";
  createdAt: string;
}

interface PriceAlert {
  id: string;
  symbol: string;
  name: string;
  targetPrice: number;
  condition: "ABOVE" | "BELOW";
  status: "ACTIVE" | "TRIGGERED" | "CANCELLED";
  createdAt: string;
}

interface TradingContextType {
  balance: number;
  portfolio: PortfolioHolding[];
  orders: Order[];
  transactions: Transaction[];
  watchlist: string[];
  stopLossOrders: StopLossOrder[];
  priceAlerts: PriceAlert[];
  buyStock: (stock: Stock, quantity: number) => Promise<boolean>;
  sellStock: (symbol: string, quantity: number, currentPrice: number) => Promise<boolean>;
  placeStopLossOrder: (symbol: string, name: string, triggerPrice: number, quantity: number) => Promise<boolean>;
  cancelStopLossOrder: (id: string) => Promise<boolean>;
  setPriceAlert: (symbol: string, name: string, targetPrice: number, condition: "ABOVE" | "BELOW") => Promise<boolean>;
  cancelPriceAlert: (id: string) => Promise<boolean>;
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
  const [stopLossOrders, setStopLossOrders] = useState<StopLossOrder[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Helper function to get auth token with expiry check
  const getAuthToken = () => {
    const token = localStorage.getItem("prostock_token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Check if token is expired (exp is in seconds)
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem("prostock_token");
        localStorage.removeItem("prostock_auth");
        localStorage.removeItem("prostock_user");
        return null;
      }
    } catch (e) {
      return null;
    }
    return token;
  };
  
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
    
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const response = await fetch(`${API_URL}${url}`, {
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
  const loadDataFromBackend = async () => {
    if (isLoadingData) return;
    setIsLoadingData(true);

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
          setStopLossOrders(data.stopLossOrders || []);
          setPriceAlerts(data.priceAlerts || []);
        }
        return;
      }

      const userId = getUserId();
      if (!userId) return;

      // Fetch user profile for balance
      try {
        const userData = await apiCall(`/api/auth/me`);
        if (userData && userData.user) {
          setBalance(Number(userData.user.balance));
        }
      } catch (e) {
        console.error("Failed to fetch user balance", e);
      }

      // Fetch portfolio
      try {
        const portfolioData = await apiCall(`/api/portfolio`);
        setPortfolio(portfolioData.portfolio || []);
      } catch (e) {
        console.error("Failed to fetch portfolio", e);
      }

      // Fetch orders
      try {
        const ordersData = await apiCall(`/api/orders`);
        setOrders(ordersData.orders || []);
      } catch (e) {
        console.error("Failed to fetch orders", e);
      }

      // Fetch transactions
      try {
        const transactionsData = await apiCall(`/api/transactions`);
        setTransactions(transactionsData.transactions || []);
      } catch (e) {
        console.error("Failed to fetch transactions", e);
      }

      // Fetch stop loss orders
      try {
        const slData = await apiCall(`/api/stop-loss`);
        setStopLossOrders(slData.stopLossOrders.map((o: any) => ({
          id: o.id.toString(),
          symbol: o.symbol,
          name: o.name,
          triggerPrice: parseFloat(o.trigger_price),
          quantity: o.quantity,
          status: o.status,
          createdAt: o.created_at
        })) || []);
      } catch (e) {
        console.error("Failed to fetch stop loss orders", e);
      }

      // Fetch price alerts
      try {
        const alertsData = await apiCall(`/api/alerts`);
        setPriceAlerts(alertsData.map((a: any) => ({
          id: a.id.toString(),
          symbol: a.symbol,
          name: a.name,
          targetPrice: parseFloat(a.target_price),
          condition: a.condition_type,
          status: a.status,
          createdAt: a.created_at
        })) || []);
      } catch (e) {
        console.error("Failed to fetch price alerts", e);
      }

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
        setStopLossOrders(data.stopLossOrders || []);
        setPriceAlerts(data.priceAlerts || []);
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
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
      stopLossOrders,
      priceAlerts,
    };
    localStorage.setItem("prostock_trading_data", JSON.stringify(data));
  }, [balance, portfolio, orders, transactions, watchlist, stopLossOrders, priceAlerts]);

  const buyStock = async (stock: Stock, quantity: number): Promise<boolean> => {
    const marketOpen = isMarketOpen();
    const status = marketOpen ? "COMPLETED" : "PENDING";

    toast({
      title: marketOpen ? "Processing Order" : "Order Submitted",
      description: marketOpen ? "Placing your buy order..." : "Market is closed. Order will be placed when market opens.",
      duration: 2000,
    });
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
            status // Send status to backend
          }),
        });

        // Update local state with backend response
        setBalance(Number(result.newBalance));
        
        // Reload portfolio and orders from backend
        loadDataFromBackend();
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
          status: status,
        };

        // Deduct balance for both COMPLETED and PENDING (block funds)
        const newBalance = balance - total;
        setBalance(newBalance);
        setOrders([order, ...orders]);

        if (status === "COMPLETED") {
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
          
          const transaction: Transaction = {
            id: Date.now().toString() + "_tx",
            type: "BUY",
            amount: total,
            balance: newBalance,
            description: `Bought ${quantity} shares of ${stock.name}`,
            timestamp: new Date().toISOString(),
          };
          setTransactions([transaction, ...transactions]);
        } else {
          // For PENDING, we record the transaction as "Order Placed"
          const transaction: Transaction = {
            id: Date.now().toString() + "_tx",
            type: "BUY",
            amount: total,
            balance: newBalance,
            description: `Order Placed: Buy ${quantity} shares of ${stock.name} (Pending)`,
            timestamp: new Date().toISOString(),
          };
          setTransactions([transaction, ...transactions]);
        }
      }

      toast({
        title: marketOpen ? "Order Executed" : "Order Submitted",
        description: marketOpen 
          ? `Successfully bought ${quantity} shares of ${stock.symbol} for ₹${total.toFixed(2)}`
          : `Buy order for ${quantity} shares of ${stock.symbol} submitted.`,
      });

      addNotification(
        marketOpen
          ? `Bought ${quantity} shares of ${stock.symbol} for ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
          : `Buy Order Submitted: ${quantity} shares of ${stock.symbol}`,
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
    if (!holding) {
      toast({
        title: "Error",
        description: "You don't own this stock",
        variant: "destructive",
      });
      return false;
    }

    if (holding.quantity < quantity) {
       toast({
        title: "Error",
        description: `You only have ${holding.quantity} shares`,
        variant: "destructive",
      });
      return false;
    }

    const marketOpen = isMarketOpen();
    const status = marketOpen ? "COMPLETED" : "PENDING";

    toast({
      title: marketOpen ? "Processing Order" : "Order Submitted",
      description: marketOpen ? "Placing your sell order..." : "Market is closed. Order will be placed when market opens.",
      duration: 2000,
    });
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
            status // Send status
          }),
        });

        // Update local state with backend response
        setBalance(Number(result.newBalance));
        
        // Reload portfolio and orders from backend
        loadDataFromBackend();
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
          status: status,
        };

        // Block shares for both COMPLETED and PENDING
        if (holding.quantity === quantity) {
          setPortfolio(portfolio.filter(h => h.symbol !== symbol));
        } else {
          setPortfolio(portfolio.map(h => 
            h.symbol === symbol 
              ? { ...h, quantity: h.quantity - quantity, currentPrice }
              : h
          ));
        }
        
        setOrders([order, ...orders]);

        if (status === "COMPLETED") {
          const newBalance = balance + total;
          setBalance(newBalance);
          
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
        } else {
          // For PENDING SELL, we don't add funds yet.
          const transaction: Transaction = {
            id: Date.now().toString() + "_tx",
            type: "SELL",
            amount: 0, // No funds added yet
            balance: balance,
            description: `Order Placed: Sell ${quantity} shares of ${holding.name} (Pending)`,
            timestamp: new Date().toISOString(),
          };
          setTransactions([transaction, ...transactions]);
        }
      }

      const profitLoss = (currentPrice - holding.avgPrice) * quantity;
      const profitLossText = profitLoss >= 0 ? `+₹${profitLoss.toFixed(2)}` : `-₹${Math.abs(profitLoss).toFixed(2)}`;

      toast({
        title: marketOpen ? "Order Executed" : "Order Submitted",
        description: marketOpen 
          ? `Successfully sold ${quantity} shares of ${symbol} for ₹${total.toFixed(2)}`
          : `Sell order for ${quantity} shares of ${symbol} submitted.`,
      });

      addNotification(
        marketOpen
          ? `Sold ${quantity} shares of ${symbol} for ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (P&L: ${profitLossText})`
          : `Sell Order Submitted: ${quantity} shares of ${symbol}`,
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

  const placeStopLossOrder = async (symbol: string, name: string, triggerPrice: number, quantity: number): Promise<boolean> => {
    try {
      const token = getAuthToken();
      if (token) {
        await apiCall('/api/stop-loss', {
          method: 'POST',
          body: JSON.stringify({ symbol, name, triggerPrice, quantity }),
        });
        loadDataFromBackend();
      } else {
        // Offline mode
        const newOrder: StopLossOrder = {
          id: Date.now().toString(),
          symbol,
          name,
          triggerPrice,
          quantity,
          status: "PENDING",
          createdAt: new Date().toISOString()
        };
        setStopLossOrders([newOrder, ...stopLossOrders]);
      }
      
      toast({
        title: "Stop Loss Set",
        description: `Stop loss for ${quantity} ${symbol} at ₹${triggerPrice}`,
      });
      return true;
    } catch (error) {
      console.error("Place stop loss error:", error);
      toast({
        title: "Failed to Set Stop Loss",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelStopLossOrder = async (id: string): Promise<boolean> => {
    try {
      const token = getAuthToken();
      if (token) {
        await apiCall(`/api/stop-loss/${id}`, {
          method: 'DELETE',
        });
        loadDataFromBackend();
      } else {
        setStopLossOrders(stopLossOrders.filter(o => o.id !== id));
      }
      
      toast({
        title: "Stop Loss Cancelled",
        description: "Order cancelled successfully",
      });
      return true;
    } catch (error) {
      console.error("Cancel stop loss error:", error);
      toast({
        title: "Failed to Cancel",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return false;
    }
  };

  const setPriceAlert = async (symbol: string, name: string, targetPrice: number, condition: "ABOVE" | "BELOW"): Promise<boolean> => {
    try {
      const token = getAuthToken();
      if (token) {
        await apiCall('/api/alerts', {
          method: 'POST',
          body: JSON.stringify({ symbol, name, targetPrice, condition }),
        });
        loadDataFromBackend();
      } else {
        // Offline mode
        const newAlert: PriceAlert = {
          id: Date.now().toString(),
          symbol,
          name,
          targetPrice,
          condition,
          status: "ACTIVE",
          createdAt: new Date().toISOString()
        };
        setPriceAlerts([newAlert, ...priceAlerts]);
      }
      
      toast({
        title: "Price Alert Set",
        description: `Alert for ${symbol} when price goes ${condition.toLowerCase()} ₹${targetPrice}`,
      });
      return true;
    } catch (error) {
      console.error("Set alert error:", error);
      toast({
        title: "Failed to Set Alert",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return false;
    }
  };

  const cancelPriceAlert = async (id: string): Promise<boolean> => {
    try {
      const token = getAuthToken();
      if (token) {
        await apiCall(`/api/alerts/${id}`, {
          method: 'DELETE',
        });
        loadDataFromBackend();
      } else {
        setPriceAlerts(priceAlerts.filter(a => a.id !== id));
      }
      
      toast({
        title: "Alert Cancelled",
        description: "Price alert removed successfully",
      });
      return true;
    } catch (error) {
      console.error("Cancel alert error:", error);
      toast({
        title: "Failed to Cancel",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
      return false;
    }
  };

  const addToWatchlist = (symbol: string) => {
    const cleanSymbol = symbol.trim().toUpperCase();
    if (!watchlist.includes(cleanSymbol)) {
      setWatchlist([...watchlist, cleanSymbol]);
      toast({
        title: "Added to Watchlist",
        description: `${cleanSymbol} has been added to your watchlist`,
      });
    } else {
      toast({
        title: "Already in Watchlist",
        description: `${cleanSymbol} is already in your watchlist`,
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

        setBalance(Number(result.balance));
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

        setBalance(Number(result.balance));
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
        stopLossOrders,
        priceAlerts,
        buyStock,
        sellStock,
        placeStopLossOrder,
        cancelStopLossOrder,
        setPriceAlert,
        cancelPriceAlert,
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