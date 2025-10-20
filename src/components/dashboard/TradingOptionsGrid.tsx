import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, TrendingUp, PieChart, Package, LineChart, Zap } from "lucide-react";

export const TradingOptionsGrid = () => {
  const tradingOptions = [
    {
      icon: BarChart3,
      title: "Equities",
      description: "Trade in company shares",
      color: "text-[#3b82f6]",
      bgColor: "bg-blue-50",
    },
    {
      icon: TrendingUp,
      title: "Futures",
      description: "Discover futures to trade",
      color: "text-[#f59e0b]",
      bgColor: "bg-amber-50",
    },
    {
      icon: PieChart,
      title: "Mutual Funds",
      description: "Higher returns with Direct MF",
      color: "text-[#10b981]",
      bgColor: "bg-emerald-50",
    },
    {
      icon: Package,
      title: "Commodities",
      description: "Trade in goods & metals",
      color: "text-[#f59e0b]",
      bgColor: "bg-orange-50",
    },
    {
      icon: LineChart,
      title: "ETFs",
      description: "Exchange Traded Funds",
      color: "text-[#06b6d4]",
      bgColor: "bg-cyan-50",
    },
    {
      icon: Zap,
      title: "Options",
      description: "Find options to trade in",
      color: "text-[#8b5cf6]",
      bgColor: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Invest / Trade on Stock Exchanges</h2>
      
      <div className="grid grid-cols-3 gap-4">
        {tradingOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card
              key={option.title}
              className="shadow-sm border-border hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <CardContent className="p-6 flex items-start gap-4">
                <div className={`${option.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${option.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Money Info Bar */}
      <div className="flex items-center justify-between bg-white border border-border rounded-lg p-4 shadow-sm">
        <div className="flex items-center gap-8">
          <div>
            <span className="text-sm text-muted-foreground">Money in Dhan: </span>
            <span className="font-bold">••,••</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Margin Used: </span>
            <span className="font-bold">••,••</span>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Utilization: </span>
            <span className="font-bold">••,••</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">₹ 50,000.00</span>
          <button className="bg-[#22c55e] hover:bg-[#16a34a] text-white px-6 py-2 rounded-md font-medium transition-colors">
            + Top Up
          </button>
        </div>
      </div>
    </div>
  );
};
