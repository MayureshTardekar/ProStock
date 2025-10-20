import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export const MarketOverview = () => {
  const markets = [
    { name: "Nifty 50", value: "25,709.85", change: "+124.55", percent: "+0.49%", isPositive: true },
    { name: "Sensex", value: "84,297.50", change: "+318.74", percent: "+0.38%", isPositive: true },
  ];

  return (
    <div className="bg-white border-b border-border px-6 py-3">
      <div className="flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-8">
          {markets.map((market) => (
            <div key={market.name} className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">{market.name}</span>
              <span className="text-lg font-bold">{market.value}</span>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                market.isPositive ? "text-[#22c55e]" : "text-[#ef4444]"
              }`}>
                {market.isPositive ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                <span>{market.change}</span>
                <span>({market.percent})</span>
              </div>
            </div>
          ))}
        </div>
        
        <Button variant="ghost" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          <span className="text-xs">Auto-refresh</span>
        </Button>
      </div>
    </div>
  );
};
