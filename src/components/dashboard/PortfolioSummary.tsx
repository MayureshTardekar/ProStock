import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useTrading } from "@/contexts/TradingContext";

export const PortfolioSummary = () => {
  const [showValues, setShowValues] = useState(true);
  const { getTotalInvestment, getTotalCurrentValue, getTotalProfitLoss, portfolio } = useTrading();

  const totalInvestment = getTotalInvestment();
  const currentValue = getTotalCurrentValue();
  const profitLoss = getTotalProfitLoss();
  const todayProfit = 0; // Can be calculated based on day's opening prices

  const portfolioData = [
    { label: "Investment", value: `₹${totalInvestment.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
    { label: "Current Value", value: `₹${currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}` },
    { label: "Overall Profits", value: `₹${Math.abs(profitLoss).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, isProfit: profitLoss >= 0 },
    { label: "Today's Profit", value: `₹${Math.abs(todayProfit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, isProfit: todayProfit >= 0 },
  ];

  return (
    <Card className="shadow-elegant border-border transition-theme">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">My Portfolio</CardTitle>
          <button
            onClick={() => setShowValues(!showValues)}
            className="text-muted-foreground hover:text-foreground"
          >
            {showValues ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none">
              All
            </TabsTrigger>
            <TabsTrigger value="stocks" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none">
              Stocks
            </TabsTrigger>
            <TabsTrigger value="mf" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none">
              Mutual Fund
            </TabsTrigger>
            <TabsTrigger value="etf" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none">
              ETFs
            </TabsTrigger>
            <TabsTrigger value="smallcase" className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none">
              Smallcases
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {portfolio.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  Start trading to build your portfolio
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-6">
                {portfolioData.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className={`text-2xl font-bold ${
                      item.isProfit ? "text-[#22c55e]" : item.label.includes("Profit") ? "text-red-500" : ""
                    }`}>
                      {showValues ? item.value : "••,••"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          {/* Other tab contents would be similar */}
          <TabsContent value="stocks">Portfolio stocks view</TabsContent>
          <TabsContent value="mf">Mutual funds view</TabsContent>
          <TabsContent value="etf">ETFs view</TabsContent>
          <TabsContent value="smallcase">Smallcases view</TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
