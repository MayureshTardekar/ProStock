import { Card } from "@/components/ui/card";
import { ChevronDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const WatchlistSidebar = () => {
  const watchlistStocks = [
    { name: "Indusind Bank", exchange: "NSE", price: "751.00", change: "11.50", percent: "1.56%", isPositive: true },
    { name: "Hero Motocorp", exchange: "NSE", price: "5,592.50", change: "13.00", percent: "0.23%", isPositive: true },
    { name: "Apollo Hospitals", exchange: "NSE", price: "7,901.50", change: "68.00", percent: "0.87%", isPositive: true },
    { name: "Dr Reddys Laboratories", exchange: "NSE", price: "1,255.90", change: "15.70", percent: "1.27%", isPositive: true },
    { name: "Tata Consumer Products", exchange: "NSE", price: "1,166.00", change: "16.70", percent: "1.46%", isPositive: true },
    { name: "Cipla", exchange: "NSE", price: "1,577.60", change: "8.20", percent: "0.52%", isPositive: true },
    { name: "Shriram Finance", exchange: "NSE", price: "675.50", change: "3.00", percent: "0.45%", isPositive: true },
  ];

  const segments = ["1", "2", "3", "f", "6"];

  return (
    <aside className="w-96 bg-white border-r border-border p-4 space-y-4 h-[calc(100vh-116px)] overflow-y-auto">
      {/* Nifty 50 Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-100 rounded flex items-center justify-center">
            <span className="text-amber-600 font-bold text-sm">📊</span>
          </div>
          <span className="font-semibold">Nifty 50</span>
        </div>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </div>

      {/* Segment Filters */}
      <div className="flex items-center gap-2">
        {segments.map((segment) => (
          <Badge
            key={segment}
            variant="outline"
            className="w-8 h-8 rounded flex items-center justify-center cursor-pointer hover:bg-muted"
          >
            {segment}
          </Badge>
        ))}
      </div>

      {/* Stocks List */}
      <div className="space-y-2">
        {watchlistStocks.map((stock, index) => (
          <Card
            key={stock.name}
            className="p-3 hover:shadow-md transition-shadow cursor-pointer border-l-4"
            style={{
              borderLeftColor: index === 0 ? '#ef4444' : index === 1 ? '#3b82f6' : index === 2 ? '#f59e0b' : index === 3 ? '#f59e0b' : index === 4 ? '#a855f7' : index === 5 ? '#f59e0b' : '#06b6d4'
            }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <p className="font-semibold text-sm">{stock.name}</p>
                <p className="text-xs text-muted-foreground">{stock.exchange}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{stock.price}</p>
                <div className="flex items-center gap-1 text-xs text-[#22c55e]">
                  <TrendingUp className="w-3 h-3" />
                  <span>{stock.change} ({stock.percent})</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Footer Stats */}
      <div className="pt-4 border-t border-border space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Name</span>
          <span className="text-muted-foreground">LTP</span>
          <span className="text-muted-foreground">LTP %</span>
          <span className="text-muted-foreground">Color</span>
        </div>
      </div>
    </aside>
  );
};
