import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import MarketTicker from "@/components/MarketTicker";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { TradingOptionsGrid } from "@/components/dashboard/TradingOptionsGrid";
import { TrendingStocks } from "@/components/dashboard/TrendingStocks";
import { WatchlistSidebar } from "@/components/dashboard/WatchlistSidebar";
import { LiveStocks } from "@/components/dashboard/LiveStocks";
import { Input } from "@/components/ui/input";
import { Search, TrendingUp } from "lucide-react";
import { TradeModal } from "@/components/trading/TradeModal";

// Popular stocks for search (accurate Jan 2025 prices)
const SEARCH_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 1285.50 },
  { symbol: "TCS", name: "Tata Consultancy Services", price: 4150.75 },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1745.80 },
  { symbol: "INFY", name: "Infosys", price: 1850.60 },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 1280.35 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", price: 2350.90 },
  { symbol: "ITC", name: "ITC Limited", price: 465.75 },
  { symbol: "SBIN", name: "State Bank of India", price: 825.45 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", price: 1650.25 },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", price: 1780.60 },
  { symbol: "LT", name: "Larsen & Toubro", price: 3650.80 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", price: 7250.40 },
  { symbol: "HCLTECH", name: "HCL Technologies", price: 1880.90 },
  { symbol: "WIPRO", name: "Wipro", price: 580.50 },
  { symbol: "MARUTI", name: "Maruti Suzuki", price: 12850.75 },
  { symbol: "SUNPHARMA", name: "Sun Pharma", price: 1780.65 },
  { symbol: "AXISBANK", name: "Axis Bank", price: 1150.80 },
  { symbol: "TITAN", name: "Titan Company", price: 3450.90 },
  { symbol: "ASIANPAINT", name: "Asian Paints", price: 2450.35 },
  { symbol: "NESTLEIND", name: "Nestle India", price: 2180.50 },
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [tradeModal, setTradeModal] = useState<{ isOpen: boolean; stock: any; type: "BUY" | "SELL" }>({
    isOpen: false,
    stock: null,
    type: "BUY",
  });

  // Filter stocks based on search query
  const filteredStocks = searchQuery.trim()
    ? SEARCH_STOCKS.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8) // Show max 8 results
    : [];

  const handleStockSelect = (stock: typeof SEARCH_STOCKS[0]) => {
    setTradeModal({
      isOpen: true,
      stock: { symbol: stock.symbol, name: stock.name, price: stock.price },
      type: "BUY",
    });
    setSearchQuery("");
    setShowSearchResults(false);
  };

  return (
    <div className="min-h-screen bg-background transition-theme">
      <DashboardHeader />
      <MarketTicker />
      
      <div className="flex pt-4">
        {/* Left Sidebar - Watchlist - Sticky */}
        <div className="sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
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
                    {filteredStocks.length} result{filteredStocks.length !== 1 ? 's' : ''} found
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
                          <p className="text-xs text-muted-foreground">{stock.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-sm">₹{stock.price.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-muted-foreground">NSE</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* No Results Message */}
            {showSearchResults && searchQuery.trim() && filteredStocks.length === 0 && (
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

          {/* Trending Stocks */}
          <TrendingStocks />
        </main>
      </div>

      {/* Trade Modal */}
      <TradeModal
        isOpen={tradeModal.isOpen}
        onClose={() => setTradeModal({ isOpen: false, stock: null, type: "BUY" })}
        stock={tradeModal.stock}
        type={tradeModal.type}
      />
    </div>
  );
};

export default Dashboard;
