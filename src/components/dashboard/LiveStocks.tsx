import { TradeModal } from "@/components/trading/TradeModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  Clock,
  RefreshCw,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

// Yahoo Finance (chart API) - works in dev via proxy and in prod via absolute URL
const YAHOO_CHART_URL = (symbolNS: string) => {
  const isDevHost = typeof window !== 'undefined' && /localhost|127\.|0\.0\.0\.0|::1/.test(window.location.hostname);
  const base = isDevHost ? "/yahoo" : "https://query1.finance.yahoo.com";
  return `${base}/v8/finance/chart/${symbolNS}?range=1d&interval=1m&_=${Date.now()}`;
};

// Popular Indian NSE stocks (fallback defaults)
const STOCKS = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries",
    exchange: "NSE",
    defaultPrice: 1285.5,
    defaultChange: 8.25,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    exchange: "NSE",
    defaultPrice: 4150.75,
    defaultChange: -15.3,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank",
    exchange: "NSE",
    defaultPrice: 1745.8,
    defaultChange: 12.5,
  },
  {
    symbol: "INFY",
    name: "Infosys",
    exchange: "NSE",
    defaultPrice: 1850.6,
    defaultChange: 18.4,
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank",
    exchange: "NSE",
    defaultPrice: 1280.35,
    defaultChange: -8.25,
  },
  {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever",
    exchange: "NSE",
    defaultPrice: 2350.9,
    defaultChange: 15.6,
  },
  {
    symbol: "ITC",
    name: "ITC Limited",
    exchange: "NSE",
    defaultPrice: 465.75,
    defaultChange: 3.5,
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    exchange: "NSE",
    defaultPrice: 825.45,
    defaultChange: -5.8,
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel",
    exchange: "NSE",
    defaultPrice: 1650.25,
    defaultChange: 22.75,
  },
  {
    symbol: "KOTAKBANK",
    name: "Kotak Mahindra Bank",
    exchange: "NSE",
    defaultPrice: 1780.6,
    defaultChange: -10.2,
  },
  {
    symbol: "LT",
    name: "Larsen & Toubro",
    exchange: "NSE",
    defaultPrice: 3650.8,
    defaultChange: 28.5,
  },
  {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance",
    exchange: "NSE",
    defaultPrice: 7250.4,
    defaultChange: -35.6,
  },
  {
    symbol: "HCLTECH",
    name: "HCL Technologies",
    exchange: "NSE",
    defaultPrice: 1880.9,
    defaultChange: 14.25,
  },
  {
    symbol: "WIPRO",
    name: "Wipro",
    exchange: "NSE",
    defaultPrice: 580.5,
    defaultChange: 4.8,
  },
  {
    symbol: "MARUTI",
    name: "Maruti Suzuki",
    exchange: "NSE",
    defaultPrice: 12850.75,
    defaultChange: 95.3,
  },
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharma",
    exchange: "NSE",
    defaultPrice: 1780.65,
    defaultChange: -12.4,
  },
  {
    symbol: "AXISBANK",
    name: "Axis Bank",
    exchange: "NSE",
    defaultPrice: 1150.8,
    defaultChange: 9.5,
  },
  {
    symbol: "TITAN",
    name: "Titan Company",
    exchange: "NSE",
    defaultPrice: 3450.9,
    defaultChange: 18.75,
  },
  {
    symbol: "ASIANPAINT",
    name: "Asian Paints",
    exchange: "NSE",
    defaultPrice: 2450.35,
    defaultChange: -18.9,
  },
  {
    symbol: "NESTLEIND",
    name: "Nestle India",
    exchange: "NSE",
    defaultPrice: 2180.5,
    defaultChange: 25.6,
  },
];

const CACHE_KEY = "prostock_live_data";
const REFRESH_INTERVAL = 60 * 1000; // auto-refresh every 60s

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
  const [tradeModal, setTradeModal] = useState<{
    isOpen: boolean;
    stock: { symbol: string; name: string; price: number } | null;
    type: "BUY" | "SELL";
  }>({
    isOpen: false,
    stock: null,
    type: "BUY",
  });
  const { toast } = useToast();

  async function fetchYahooFor(
    stock: (typeof STOCKS)[number]
  ): Promise<StockData> {
    const symbolNS = `${stock.symbol}.NS`;
    // Try proxied URL first (dev), then absolute URL (prod) as fallback
    let res = await fetch(YAHOO_CHART_URL(symbolNS));
    if (!res.ok) {
      // Force absolute URL fallback in case proxy unavailable
      const abs = `https://query1.finance.yahoo.com/v8/finance/chart/${symbolNS}?range=1d&interval=1m&_=${Date.now()}`;
      res = await fetch(abs);
    }
    if (!res.ok) throw new Error(`Yahoo request failed ${res.status}`);
    const json = await res.json();
    const result = json?.chart?.result?.[0];
    const meta = result?.meta;
    const quote = result?.indicators?.quote?.[0];

    // Use last non-null close when available for a fresher price
    const closes: Array<number | null | undefined> = quote?.close || [];
    const lastClose = [...closes]
      .reverse()
      .find((v) => typeof v === "number" && !Number.isNaN(v)) as
      | number
      | undefined;

    const priceCandidate =
      meta?.regularMarketPrice ?? lastClose ?? meta?.previousClose;
    const price = Number(priceCandidate ?? stock.defaultPrice);

    const changeCandidate =
      meta?.regularMarketChange ??
      (meta?.regularMarketPrice != null && meta?.previousClose != null
        ? meta.regularMarketPrice - meta.previousClose
        : lastClose != null && meta?.previousClose != null
        ? lastClose - meta.previousClose
        : undefined);
    const change = Number(changeCandidate ?? stock.defaultChange);

    const percentCandidate =
      meta?.regularMarketChangePercent ??
      (meta?.regularMarketPrice != null && meta?.previousClose
        ? ((meta.regularMarketPrice - meta.previousClose) /
            meta.previousClose) *
          100
        : lastClose != null && meta?.previousClose
        ? ((lastClose - meta.previousClose) / meta.previousClose) * 100
        : undefined);
    const percent = Number(
      percentCandidate ?? (stock.defaultChange / stock.defaultPrice) * 100
    );

    return {
      symbol: stock.symbol,
      name: stock.name,
      price: isNaN(price) ? stock.defaultPrice : price,
      change: isNaN(change) ? stock.defaultChange : change,
      percent_change: isNaN(percent)
        ? (stock.defaultChange / stock.defaultPrice) * 100
        : percent,
      timestamp: new Date().toISOString(),
    };
  }

  const fetchStockData = async (showToast = false) => {
    try {
      setIsLoading(true);
      const results = await Promise.all(
        STOCKS.map(async (s) => {
          try {
            return await fetchYahooFor(s);
          } catch (e) {
            console.warn(`[LiveStocks] Yahoo failed for ${s.symbol}`, e);
            // Fallback: defaults
            return {
              symbol: s.symbol,
              name: s.name,
              price: s.defaultPrice,
              change: s.defaultChange,
              percent_change: (s.defaultChange / s.defaultPrice) * 100,
              timestamp: new Date().toISOString(),
            } as StockData;
          }
        })
      );

      setStocks(results);
      setLastUpdated(new Date());

      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({ stocks: results, timestamp: new Date().toISOString() })
      );

      if (showToast) {
        toast({
          title: "Data refreshed",
          description: `Stock prices updated at ${new Date().toLocaleTimeString()}`,
        });
      }
    } catch (error) {
      console.error("[LiveStocks] Failed to fetch Yahoo data:", error);
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { stocks: cachedStocks, timestamp } = JSON.parse(cached);
        setStocks(cachedStocks);
        setLastUpdated(new Date(timestamp));
      } else {
        // Fallback to defaults if no cache
        setStocks(
          STOCKS.map((s) => ({
            symbol: s.symbol,
            name: s.name,
            price: s.defaultPrice,
            change: s.defaultChange,
            percent_change: (s.defaultChange / s.defaultPrice) * 100,
            timestamp: new Date().toISOString(),
          }))
        );
        setLastUpdated(new Date());
      }

      toast({
        title: "Yahoo API error",
        description: "Using cached/default data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadDefaultPrices = () => {
    const defaults: StockData[] = STOCKS.map((stock) => ({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.defaultPrice,
      change: stock.defaultChange,
      percent_change: (stock.defaultChange / stock.defaultPrice) * 100,
      timestamp: new Date().toISOString(),
    }));
    setStocks(defaults);
    setLastUpdated(new Date());
  };

  useEffect(() => {
    // Initial load from cache or defaults, then fetch live data
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { stocks: cachedStocks, timestamp } = JSON.parse(cached);
        setStocks(cachedStocks);
        setLastUpdated(new Date(timestamp));
      } catch {
        loadDefaultPrices();
      }
    } else {
      loadDefaultPrices();
    }

    // Kick off initial live fetch (non-blocking UI)
    fetchStockData(false);

    // Auto-refresh timer
    const id = setInterval(() => {
      // If tab is visible, refresh; if hidden, skip to save network
      if (typeof document === 'undefined' || document.visibilityState === 'visible') {
        fetchStockData(false);
      }
    }, REFRESH_INTERVAL);

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        fetchStockData(false);
      }
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualRefresh = () => {
    // Directly refresh without any warning dialogs
    fetchStockData(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Live Market</h2>
          <p className="text-muted-foreground text-sm">
            Real-time NSE stock prices
          </p>
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
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading && stocks.length === 0
          ? Array.from({ length: 8 }).map((_, i) => (
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
          : stocks.map((stock) => {
              const isPositive = stock.percent_change >= 0;
              return (
                <Card
                  key={stock.symbol}
                  className="border-border transition-all duration-200 hover:shadow-lg hover:scale-[1.02] bg-card group relative"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          {stock.symbol}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground truncate">
                          {stock.name}
                        </p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() =>
                          setTradeModal({
                            isOpen: true,
                            stock: {
                              symbol: stock.symbol,
                              name: stock.name,
                              price: stock.price,
                            },
                            type: "BUY",
                          })
                        }
                      >
                        <ShoppingCart className="h-4 w-4 text-primary" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-2xl font-bold">
                      ₹
                      {stock.price.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        isPositive ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {isPositive ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>
                        {isPositive ? "+" : ""}
                        {stock.change.toFixed(2)}
                      </span>
                      <span>
                        ({isPositive ? "+" : ""}
                        {stock.percent_change.toFixed(2)}%)
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
      </div>

      <TradeModal
        isOpen={tradeModal.isOpen}
        onClose={() =>
          setTradeModal({ isOpen: false, stock: null, type: "BUY" })
        }
        stock={tradeModal.stock}
        type={tradeModal.type}
      />
    </div>
  );
};
