import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export const TrendingStocks = () => {
  const trendingData = {
    mostBought: [
      { name: "Vodafone Idea", price: "8.70", change: "-0.15", percent: "-1.69%", isPositive: false },
      { name: "Titan Intech", price: "3.12", change: "+0.14", percent: "+4.70%", isPositive: true },
      { name: "Adani Power", price: "165.98", change: "+8.61", percent: "+5.47%", isPositive: true },
      { name: "Yes Bank", price: "22.25", change: "-0.87", percent: "-3.76%", isPositive: false },
      { name: "PC Jeweller", price: "4.52", change: "+0.23", percent: "+5.36%", isPositive: true },
      { name: "Murae Organiser", price: "12.80", change: "-0.45", percent: "-3.40%", isPositive: false },
      { name: "Suzlon Energy", price: "89.30", change: "+4.12", percent: "+4.84%", isPositive: true },
      { name: "Spright Agro", price: "6.45", change: "-0.34", percent: "-5.01%", isPositive: false },
    ],
    mostSearched: [
      { name: "Reliance Industries", price: "1,416.80", change: "+18.65", percent: "+1.33%", isPositive: true },
      { name: "TCS", price: "4,235.50", change: "+67.20", percent: "+1.61%", isPositive: true },
      { name: "HDFC Bank", price: "1,002.55", change: "+8.15", percent: "+0.82%", isPositive: true },
      { name: "Infosys", price: "1,887.90", change: "-12.40", percent: "-0.65%", isPositive: false },
    ],
    mostSold: [
      { name: "Paytm", price: "342.15", change: "-15.80", percent: "-4.42%", isPositive: false },
      { name: "Zomato", price: "128.45", change: "-3.25", percent: "-2.47%", isPositive: false },
      { name: "Nykaa", price: "156.30", change: "-5.90", percent: "-3.64%", isPositive: false },
      { name: "Policy Bazaar", price: "892.70", change: "-28.15", percent: "-3.06%", isPositive: false },
    ],
  };

  const StockGrid = ({ stocks }: { stocks: typeof trendingData.mostBought }) => (
    <div className="grid grid-cols-4 gap-4">
      {stocks.map((stock) => (
        <Card key={stock.name} className="shadow-sm border-border hover:shadow-elegant transition-all hover:scale-[1.02] cursor-pointer bg-card">
          <CardContent className="p-4">
            <p className="font-semibold text-sm mb-2">{stock.name}</p>
            <p className="text-xl font-bold mb-1">{stock.price}</p>
            <p className={`text-sm font-medium ${
              stock.isPositive ? "text-[#22c55e]" : "text-[#ef4444]"
            }`}>
              {stock.change} ({stock.percent})
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Trending now on ProStock</h2>
        <button className="text-sm text-primary hover:underline flex items-center gap-1">
          more <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <Tabs defaultValue="bought" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="bought" 
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
          >
            Most Bought
          </TabsTrigger>
          <TabsTrigger 
            value="searched"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
          >
            Most Searched
          </TabsTrigger>
          <TabsTrigger 
            value="sold"
            className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary rounded-none"
          >
            Most Sold
          </TabsTrigger>
        </TabsList>

        <TabsContent value="bought" className="mt-6">
          <StockGrid stocks={trendingData.mostBought} />
        </TabsContent>
        
        <TabsContent value="searched" className="mt-6">
          <StockGrid stocks={trendingData.mostSearched} />
        </TabsContent>
        
        <TabsContent value="sold" className="mt-6">
          <StockGrid stocks={trendingData.mostSold} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
