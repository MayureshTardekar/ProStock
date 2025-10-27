import { LiveStocks } from "@/components/dashboard/LiveStocks";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { TradingOptionsGrid } from "@/components/dashboard/TradingOptionsGrid";
import { WatchlistSidebar } from "@/components/dashboard/WatchlistSidebar";
import MarketTicker from "@/components/MarketTicker";
import { TradeModal } from "@/components/trading/TradeModal";
import { Input } from "@/components/ui/input";
import MainLayout from "@/components/MainLayout";
import { Search, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

// Live price fetcher
async function fetchLivePrice(symbol: string) {
  try {
    const isDevHost =
      typeof window !== "undefined" &&
      /localhost|127\.|0\.0\.0\.0|::1/.test(window.location.hostname);
    const symbolNS = `${symbol}.NS`;
    const proxied = `/yahoo/v8/finance/chart/${encodeURIComponent(
      symbolNS
    )}?range=1d&interval=1m&_=${Date.now()}`;
    const absolute = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbolNS
    )}?range=1d&interval=1m&_=${Date.now()}`;
    let res = await fetch(isDevHost ? proxied : absolute);
    if (!res.ok) res = await fetch(absolute);
    if (!res.ok) throw new Error();
    const j = await res.json();
    const meta = j?.chart?.result?.[0]?.meta || {};
    return Number(meta.regularMarketPrice ?? meta.previousClose ?? 0);
  } catch {
    return 0;
  }
}

// Popular stocks for search with default fallback prices
const SEARCH_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries", fallbackPrice: 1285.5 },
  { symbol: "TCS", name: "Tata Consultancy Services", fallbackPrice: 4150.75 },
  { symbol: "HDFCBANK", name: "HDFC Bank", fallbackPrice: 1745.8 },
  { symbol: "INFY", name: "Infosys", fallbackPrice: 1850.6 },
  { symbol: "ICICIBANK", name: "ICICI Bank", fallbackPrice: 1280.35 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", fallbackPrice: 2350.9 },
  { symbol: "ITC", name: "ITC Limited", fallbackPrice: 465.75 },
  { symbol: "SBIN", name: "State Bank of India", fallbackPrice: 825.45 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", fallbackPrice: 1650.25 },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", fallbackPrice: 1780.6 },
  { symbol: "LT", name: "Larsen & Toubro", fallbackPrice: 3650.8 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", fallbackPrice: 7250.4 },
  { symbol: "HCLTECH", name: "HCL Technologies", fallbackPrice: 1880.9 },
  { symbol: "WIPRO", name: "Wipro", fallbackPrice: 580.5 },
  { symbol: "MARUTI", name: "Maruti Suzuki", fallbackPrice: 12850.75 },
  { symbol: "SUNPHARMA", name: "Sun Pharma", fallbackPrice: 1780.65 },
  { symbol: "AXISBANK", name: "Axis Bank", fallbackPrice: 1150.8 },
  { symbol: "TITAN", name: "Titan Company", fallbackPrice: 3450.9 },
  { symbol: "ASIANPAINT", name: "Asian Paints", fallbackPrice: 2450.35 },
  { symbol: "NESTLEIND", name: "Nestle India", fallbackPrice: 2180.5 },
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [tradeModal, setTradeModal] = useState<{
    isOpen: boolean;
    stock: any;
    type: "BUY" | "SELL";
  }>({
    isOpen: false,
    stock: null,
    type: "BUY",
  });

  // Load live prices for search results
  useEffect(() => {
    const loadPrices = async () => {
      const prices: Record<string, number> = {};
      for (const stock of SEARCH_STOCKS) {
        const livePrice = await fetchLivePrice(stock.symbol);
        prices[stock.symbol] = livePrice || stock.fallbackPrice;
      }
      setLivePrices(prices);
    };
    loadPrices();
    const id = setInterval(loadPrices, 60000);
    return () => clearInterval(id);
  }, []);

  // Filter stocks based on search query
  const filteredStocks = searchQuery.trim()
    ? SEARCH_STOCKS.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8) // Show max 8 results
    : [];

  const handleStockSelect = (stock: (typeof SEARCH_STOCKS)[0]) => {
    setTradeModal({
      isOpen: true,
      stock: {
        symbol: stock.symbol,
        name: stock.name,
        price: livePrices[stock.symbol] || stock.fallbackPrice,
      },
      type: "BUY",
    });
    setSearchQuery("");
    setShowSearchResults(false);
  };

  // Listen for trade events from sidebar to open TradeModal
  useEffect(() => {
    const handler = (e: any) => {
      const detail = e.detail as {
        type: "BUY" | "SELL";
        stock: { symbol: string; name: string; price: number };
      };
      if (detail?.stock) {
        setTradeModal({ isOpen: true, stock: detail.stock, type: detail.type });
      }
    };
    window.addEventListener("prostock-trade", handler as any);
    return () => window.removeEventListener("prostock-trade", handler as any);
  }, []);

  return (
    <MainLayout>
      <MarketTicker />

      <div className="flex pt-4">
        {/* Left Sidebar - Watchlist - Sticky */}
        <div className="sticky top-28 h-[calc(100vh-7rem)] overflow-y-auto">
          <WatchlistSidebar />
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Search Bar with Dropdown */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
            <Input
              placeholder="Search for companies to invest or trade"
              className="pl-12 h-12 bg-card border-border shadow-sm"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            />

            {/* Search Results Dropdown */}
            {showSearchResults && filteredStocks.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                <div className="p-2">
                  <p className="text-xs text-muted-foreground px-3 py-2">
                    {filteredStocks.length} result
                    {filteredStocks.length !== 1 ? "s" : ""} found
                  </p>
                  {filteredStocks.map((stock) => (
                    <button
                      key={stock.symbol}
                      className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors text-left"
                      onClick={() => handleStockSelect(stock)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{stock.symbol}</p>
                          <p className="text-xs text-muted-foreground">
                            {stock.name}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">
                          ₹
                          {(
                            livePrices[stock.symbol] || stock.fallbackPrice
                          ).toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">NSE</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* No Results Message */}
            {showSearchResults &&
              searchQuery.trim() &&
              filteredStocks.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 p-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    No stocks found for "{searchQuery}"
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try searching for TCS, RELIANCE, INFY, etc.
                  </p>
                </div>
              )}
          </div>

          {/* Live Stocks Section */}
          <LiveStocks />

          {/* Portfolio Summary */}
          <PortfolioSummary />

          {/* Trading Options */}
          <TradingOptionsGrid />
        </main>
      </div>

      {/* Trade Modal */}
      <TradeModal
        isOpen={tradeModal.isOpen}
        onClose={() =>
          setTradeModal({ isOpen: false, stock: null, type: "BUY" })
        }
        stock={tradeModal.stock}
        type={tradeModal.type}
      />
    </MainLayout>
  );
};

export default Dashboard;
