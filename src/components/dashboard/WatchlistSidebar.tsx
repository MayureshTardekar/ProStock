import { useState } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Stock data for each index
const NIFTY_50_STOCKS = [
  { name: "Reliance Industries", exchange: "NSE", symbol: "RELIANCE", price: "1,285.50", change: "8.25", percent: "0.65%", isPositive: true },
  { name: "TCS", exchange: "NSE", symbol: "TCS", price: "4,150.75", change: "-15.30", percent: "-0.37%", isPositive: false },
  { name: "HDFC Bank", exchange: "NSE", symbol: "HDFCBANK", price: "1,745.80", change: "12.50", percent: "0.72%", isPositive: true },
  { name: "Infosys", exchange: "NSE", symbol: "INFY", price: "1,850.60", change: "18.40", percent: "1.00%", isPositive: true },
  { name: "ICICI Bank", exchange: "NSE", symbol: "ICICIBANK", price: "1,280.35", change: "-8.25", percent: "-0.64%", isPositive: false },
  { name: "Hindustan Unilever", exchange: "NSE", symbol: "HINDUNILVR", price: "2,350.90", change: "15.60", percent: "0.67%", isPositive: true },
  { name: "ITC Limited", exchange: "NSE", symbol: "ITC", price: "465.75", change: "3.50", percent: "0.76%", isPositive: true },
];

const BANK_NIFTY_STOCKS = [
  { name: "HDFC Bank", exchange: "NSE", symbol: "HDFCBANK", price: "1,745.80", change: "12.50", percent: "0.72%", isPositive: true },
  { name: "ICICI Bank", exchange: "NSE", symbol: "ICICIBANK", price: "1,280.35", change: "-8.25", percent: "-0.64%", isPositive: false },
  { name: "State Bank of India", exchange: "NSE", symbol: "SBIN", price: "825.45", change: "-5.80", percent: "-0.70%", isPositive: false },
  { name: "Kotak Mahindra Bank", exchange: "NSE", symbol: "KOTAKBANK", price: "1,780.60", change: "-10.20", percent: "-0.57%", isPositive: false },
  { name: "Axis Bank", exchange: "NSE", symbol: "AXISBANK", price: "1,150.80", change: "9.50", percent: "0.83%", isPositive: true },
  { name: "IndusInd Bank", exchange: "NSE", symbol: "INDUSINDBK", price: "751.00", change: "11.50", percent: "1.56%", isPositive: true },
  { name: "Bajaj Finance", exchange: "NSE", symbol: "BAJFINANCE", price: "7,250.40", change: "-35.60", percent: "-0.49%", isPositive: false },
];

const FIN_NIFTY_STOCKS = [
  { name: "HDFC Bank", exchange: "NSE", symbol: "HDFCBANK", price: "1,745.80", change: "12.50", percent: "0.72%", isPositive: true },
  { name: "ICICI Bank", exchange: "NSE", symbol: "ICICIBANK", price: "1,280.35", change: "-8.25", percent: "-0.64%", isPositive: false },
  { name: "Bajaj Finance", exchange: "NSE", symbol: "BAJFINANCE", price: "7,250.40", change: "-35.60", percent: "-0.49%", isPositive: false },
  { name: "Bajaj Finserv", exchange: "NSE", symbol: "BAJAJFINSV", price: "1,650.25", change: "22.75", percent: "1.40%", isPositive: true },
  { name: "SBI Life Insurance", exchange: "NSE", symbol: "SBILIFE", price: "1,580.90", change: "14.30", percent: "0.91%", isPositive: true },
  { name: "HDFC Life Insurance", exchange: "NSE", symbol: "HDFCLIFE", price: "680.50", change: "-5.20", percent: "-0.76%", isPositive: false },
  { name: "Shriram Finance", exchange: "NSE", symbol: "SHRIRAMFIN", price: "2,890.75", change: "28.50", percent: "1.00%", isPositive: true },
];

export const WatchlistSidebar = () => {
  const [activeTab, setActiveTab] = useState("nifty50");

  const getStocksForTab = () => {
    switch (activeTab) {
      case "banknifty":
        return BANK_NIFTY_STOCKS;
      case "finnifty":
        return FIN_NIFTY_STOCKS;
      default:
        return NIFTY_50_STOCKS;
    }
  };

  const stocks = getStocksForTab();

  return (
    <aside className="w-96 bg-card border-r border-border p-4 space-y-4 h-[calc(100vh-116px)] overflow-y-auto transition-theme">
      <TooltipProvider>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="nifty50" className="text-xs">
                  Nifty 50
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Top 50 companies by market cap on NSE</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="banknifty" className="text-xs">
                  Bank Nifty
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Banking sector index with 12 major banks</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="finnifty" className="text-xs">
                  Fin Nifty
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Financial services sector index</p>
              </TooltipContent>
            </Tooltip>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-2 mt-0">
            {/* Stocks List */}
            <div className="space-y-2">
              {stocks.map((stock, index) => (
                <Card
                  key={stock.symbol}
                  className="p-3 hover:shadow-elegant transition-all hover:scale-[1.01] cursor-pointer border-l-4 bg-card"
                  style={{
                    borderLeftColor:
                      index === 0
                        ? "hsl(var(--primary))"
                        : index === 1
                        ? "hsl(217.2, 91.2%, 59.8%)"
                        : index === 2
                        ? "hsl(var(--primary))"
                        : "hsl(var(--muted))",
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{stock.name}</p>
                      <p className="text-xs text-muted-foreground">{stock.exchange}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">₹{stock.price}</p>
                      <div
                        className={`flex items-center gap-1 text-xs ${
                          stock.isPositive ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {stock.isPositive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>
                          {stock.change} ({stock.percent})
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </TooltipProvider>
    </aside>
  );
};
