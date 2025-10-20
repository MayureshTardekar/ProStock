import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, RefreshCw, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

// Twelve Data API configuration
const TWELVE_API_KEY = "f65d68779eb1457f830a6a89aa80ba70";
const STOCKS = ["RELIANCE.NSE", "TCS.NSE", "SBIN.NSE", "INFY.NSE", "HDFCBANK.NSE", "ITC.NSE", "LT.NSE", "WIPRO.NSE"];
const CACHE_KEY = "prostock_live_data";
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent_change: number;
  timestamp: string;
}

export const LiveStocks = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const { toast } = useToast();

  const fetchStockData = async (showToast = false) => {
    try {
      setIsLoading(true);
      const symbolsQuery = STOCKS.join(",");
      const response = await fetch(
        `https://api.twelvedata.com/quote?symbol=${symbolsQuery}&apikey=${TWELVE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();
      
      // Handle both single and multiple stocks response
      const stocksArray = Array.isArray(data) ? data : Object.values(data);
      
      const formattedStocks: StockData[] = stocksArray
        .filter((stock: any) => stock.symbol) // Filter out invalid responses
        .map((stock: any) => ({
          symbol: stock.symbol,
          name: stock.name || stock.symbol.replace('.NSE', ''),
          price: parseFloat(stock.close) || 0,
          change: parseFloat(stock.change) || 0,
          percent_change: parseFloat(stock.percent_change) || 0,
          timestamp: stock.timestamp || new Date().toISOString(),
        }));

      setStocks(formattedStocks);
      setLastUpdated(new Date());
      
      // Cache data to localStorage
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        stocks: formattedStocks,
        timestamp: new Date().toISOString()
      }));

      if (showToast) {
        toast({
          title: "Data refreshed",
          description: "Stock prices updated successfully",
        });
      }
    } catch (error) {
      console.error("Failed to fetch stock data:", error);
      
      // Load from cache if available
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { stocks: cachedStocks, timestamp } = JSON.parse(cached);
        setStocks(cachedStocks);
        setLastUpdated(new Date(timestamp));
        
        toast({
          title: "Using cached data",
          description: "Unable to fetch live data. Showing last updated prices.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load - check cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { stocks: cachedStocks, timestamp } = JSON.parse(cached);
      setStocks(cachedStocks);
      setLastUpdated(new Date(timestamp));
      setIsLoading(false);
    }
    
    // Fetch fresh data
    fetchStockData();

    // Set up auto-refresh
    const interval = setInterval(() => {
      fetchStockData();
    }, REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const handleManualRefresh = () => {
    fetchStockData(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Live Market</h2>
          <p className="text-muted-foreground text-sm">Real-time NSE stock prices</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{lastUpdated.toLocaleTimeString()}</span>
            </div>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading && stocks.length === 0 ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="border-border">
              <CardHeader className="pb-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32 mt-1" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20 mb-2" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))
        ) : (
          stocks.map((stock) => {
            const isPositive = stock.percent_change >= 0;
            return (
              <Card
                key={stock.symbol}
                className="border-border transition-all duration-200 hover:shadow-lg hover:scale-[1.02] cursor-pointer bg-card"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stock.symbol.replace('.NSE', '')}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground truncate">{stock.name}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-2xl font-bold">
                    ₹{stock.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-medium ${
                    isPositive ? 'text-[#22c55e]' : 'text-[#ef4444]'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)}</span>
                    <span>({isPositive ? '+' : ''}{stock.percent_change.toFixed(2)}%)</span>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
