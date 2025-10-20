import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { PortfolioSummary } from "@/components/dashboard/PortfolioSummary";
import { TradingOptionsGrid } from "@/components/dashboard/TradingOptionsGrid";
import { TrendingStocks } from "@/components/dashboard/TrendingStocks";
import { WatchlistSidebar } from "@/components/dashboard/WatchlistSidebar";
import { Input } from "@/components/ui/input";
import { Search, Megaphone, X } from "lucide-react";
import { useState } from "react";

const Dashboard = () => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <DashboardHeader />
      <MarketOverview />
      
      <div className="flex">
        {/* Left Sidebar - Watchlist */}
        <WatchlistSidebar />
        
        {/* Main Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Notification Banner */}
          {showBanner && (
            <div className="bg-white border border-border rounded-lg p-4 flex items-start gap-3 shadow-sm">
              <Megaphone className="w-5 h-5 text-blue-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-semibold text-sm">Muhurat Trading on 21 Oct, 1:45 -2:45 PM</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Trade with ₹0 brokerage on Dhan! Stay prepared, there are important updates for your trades.
                </p>
              </div>
              <button onClick={() => setShowBanner(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for companies to invest or trade"
              className="pl-12 h-12 bg-white border-border shadow-sm"
            />
          </div>

          {/* Portfolio Summary */}
          <PortfolioSummary />

          {/* Trading Options */}
          <TradingOptionsGrid />

          {/* Trending Stocks */}
          <TrendingStocks />

          {/* Footer */}
          <footer className="text-center text-sm text-muted-foreground py-6">
            © 2025 ProStock. All Rights Reserved.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
