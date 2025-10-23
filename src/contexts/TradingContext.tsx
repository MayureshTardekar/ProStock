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
  buyStock: (stock: Stock, quantity: number) => boolean;
  sellStock: (symbol: string, quantity: number, currentPrice: number) => boolean;
  addToWatchlist: (symbol: string) => void;
  removeFromWatchlist: (symbol: string) => void;
  addMoney: (amount: number) => void;
  withdrawMoney: (amount: number) => boolean;
  getTotalInvestment: () => number;
  getTotalCurrentValue: () => number;
  getTotalProfitLoss: () => number;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const INITIAL_BALANCE = 100000; // ₹1 lakh paper trading money

export const TradingProvider = ({ children }: { children: ReactNode }) => {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const { toast } = useToast();
  const { addNotification } = useNotifications();

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("prostock_trading_data");
    if (savedData) {
      const data = JSON.parse(savedData);
      setBalance(data.balance || INITIAL_BALANCE);
      setPortfolio(data.portfolio || []);
      setOrders(data.orders || []);
      setTransactions(data.transactions || []);
      setWatchlist(data.watchlist || []);
    } else {
      // Initialize with welcome transaction
      const welcomeTx: Transaction = {
        id: Date.now().toString(),
        type: "DEPOSIT",
        amount: INITIAL_BALANCE,
        balance: INITIAL_BALANCE,
        description: "Welcome to ProStock! Paper trading account credited.",
        timestamp: new Date().toISOString(),
      };
      setTransactions([welcomeTx]);
    }
  }, []);

  // Save data to localStorage whenever it changes
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

  const buyStock = (stock: Stock, quantity: number): boolean => {
    const total = stock.price * quantity;
    
    if (total > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You need ₹${total.toFixed(2)} but only have ₹${balance.toFixed(2)}`,
        variant: "destructive",
      });
      return false;
    }

    // Create order
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

    // Update portfolio
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

    // Update balance
    const newBalance = balance - total;
    setBalance(newBalance);

    // Add order and transaction
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

    toast({
      title: "Order Executed",
      description: `Successfully bought ${quantity} shares of ${stock.symbol} for ₹${total.toFixed(2)}`,
    });

    // Add notification
    addNotification(
      `Bought ${quantity} shares of ${stock.symbol} for ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      "BUY"
    );

    return true;
  };

  const sellStock = (symbol: string, quantity: number, currentPrice: number): boolean => {
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

    // Create order
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

    // Update portfolio
    if (holding.quantity === quantity) {
      setPortfolio(portfolio.filter(h => h.symbol !== symbol));
    } else {
      setPortfolio(portfolio.map(h => 
        h.symbol === symbol 
          ? { ...h, quantity: h.quantity - quantity, currentPrice }
          : h
      ));
    }

    // Update balance
    const newBalance = balance + total;
    setBalance(newBalance);

    // Add order and transaction
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

    toast({
      title: "Order Executed",
      description: `Successfully sold ${quantity} shares of ${symbol} for ₹${total.toFixed(2)}`,
    });

    // Add notification
    const profitLossText = profitLoss >= 0 ? `+₹${profitLoss.toFixed(2)}` : `-₹${Math.abs(profitLoss).toFixed(2)}`;
    addNotification(
      `Sold ${quantity} shares of ${symbol} for ₹${total.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (P&L: ${profitLossText})`,
      "SELL"
    );

    return true;
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

  const addMoney = (amount: number) => {
    const newBalance = balance + amount;
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

    toast({
      title: "Funds Added",
      description: `₹${amount.toFixed(2)} has been added to your account`,
    });

    // Add notification
    addNotification(
      `Added ₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} to your account`,
      "DEPOSIT"
    );
  };

  const withdrawMoney = (amount: number): boolean => {
    if (amount > balance) {
      toast({
        title: "Insufficient Balance",
        description: `You cannot withdraw more than your available balance`,
        variant: "destructive",
      });
      return false;
    }

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

    toast({
      title: "Funds Withdrawn",
      description: `₹${amount.toFixed(2)} has been withdrawn from your account`,
    });

    // Add notification
    addNotification(
      `Withdrew ₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })} from your account`,
      "WITHDRAW"
    );

    return true;
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