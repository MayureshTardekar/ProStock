import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export const PortfolioSummary = () => {
  const [showValues, setShowValues] = useState(true);

  const portfolioData = [
    { label: "Investment", value: "₹5,47,823" },
    { label: "Current Value", value: "₹6,12,456" },
    { label: "Overall Profits", value: "₹64,633", isProfit: true },
    { label: "Today's Profit", value: "₹2,847", isProfit: true },
  ];

  return (
    <Card className="shadow-sm border-border">
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
            <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-[#22c55e] rounded-none">
              All
            </TabsTrigger>
            <TabsTrigger value="stocks" className="data-[state=active]:border-b-2 data-[state=active]:border-[#22c55e] rounded-none">
              Stocks
            </TabsTrigger>
            <TabsTrigger value="mf" className="data-[state=active]:border-b-2 data-[state=active]:border-[#22c55e] rounded-none">
              Mutual Fund
            </TabsTrigger>
            <TabsTrigger value="etf" className="data-[state=active]:border-b-2 data-[state=active]:border-[#22c55e] rounded-none">
              ETFs
            </TabsTrigger>
            <TabsTrigger value="smallcase" className="data-[state=active]:border-b-2 data-[state=active]:border-[#22c55e] rounded-none">
              Smallcases
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-4 gap-6">
              {portfolioData.map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className={`text-2xl font-bold ${
                    item.isProfit ? "text-[#22c55e]" : ""
                  }`}>
                    {showValues ? item.value : "••,••"}
                  </p>
                </div>
              ))}
            </div>
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
