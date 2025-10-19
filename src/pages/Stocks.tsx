import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTicker from "@/components/MarketTicker";
import StocksTable from "@/components/StocksTable";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const Stocks = () => {
  const categories = [
    "Intraday Stocks",
    "Under ₹50",
    "Under ₹100",
    "Under ₹200",
    "Under ₹500",
  ];

  return (
    <div className="min-h-screen gradient-hero transition-theme">
      <Navbar activeLink="stocks" />
      
      {/* Market Ticker */}
      <MarketTicker />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search Stocks, Mutual Funds, ETFs..."
              className="pl-12 h-12 bg-card border-border rounded-full shadow-elegant transition-theme"
            />
          </div>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Market Stocks Overview
          </h1>
          <p className="text-sm text-muted-foreground mb-2">
            Last Updated: 19 Oct 2025, 15:59 IST
          </p>
          <div className="bg-card/50 backdrop-blur-md border border-border rounded-lg p-4 shadow-elegant">
            <p className="text-foreground/80 text-sm">
              Here you can view live NSE/BSE stocks with their latest price, change %, and key financial data. 
              Ideal for quick market tracking and analysis.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className="rounded-full border-primary/30 hover:border-primary hover:bg-accent transition-theme"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Table Header Actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-full border-primary bg-accent text-accent-foreground"
            >
              NSE
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
            >
              BSE
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent"
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>

        {/* Stocks Table */}
        <StocksTable />
      </main>

      <Footer />
    </div>
  );
};

export default Stocks;
