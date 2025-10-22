import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import MarketTicker from "@/components/MarketTicker";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { TradingOptionsGrid } from "@/components/dashboard/TradingOptionsGrid";
import { TrendingStocks } from "@/components/dashboard/TrendingStocks";
import { WatchlistSidebar } from "@/components/dashboard/WatchlistSidebar";
import { LiveStocks } from "@/components/dashboard/LiveStocks";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Dashboard = () => {
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
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for companies to invest or trade"
              className="pl-12 h-12 bg-card border-border shadow-sm"
            />
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
    </div>
  );
};

export default Dashboard;
