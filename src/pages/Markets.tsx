import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

const Markets = () => {
  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const [trendingStocks] = useState([
    { name: "Reliance Industries", symbol: "RELIANCE", ltp: 2456.75, change: 45.30, changePercent: 1.88 },
    { name: "TCS", symbol: "TCS", ltp: 3678.20, change: -23.15, changePercent: -0.63 },
    { name: "HDFC Bank", symbol: "HDFCBANK", ltp: 1623.40, change: 28.90, changePercent: 1.81 },
    { name: "Infosys", symbol: "INFY", ltp: 1543.60, change: 15.75, changePercent: 1.03 },
    { name: "ICICI Bank", symbol: "ICICIBANK", ltp: 1087.30, change: -12.45, changePercent: -1.13 },
    { name: "Bharti Airtel", symbol: "BHARTIARTL", ltp: 1256.80, change: 34.20, changePercent: 2.80 },
    { name: "ITC", symbol: "ITC", ltp: 456.25, change: 5.60, changePercent: 1.24 },
    { name: "State Bank of India", symbol: "SBIN", ltp: 678.90, change: -8.35, changePercent: -1.21 },
    { name: "Larsen & Toubro", symbol: "LT", ltp: 3456.15, change: 67.85, changePercent: 2.00 },
    { name: "HCL Technologies", symbol: "HCLTECH", ltp: 1234.50, change: 18.95, changePercent: 1.56 },
  ]);

  return (
    <div className="min-h-screen gradient-hero transition-theme">
      <Navbar activeLink="markets" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Markets
          </h1>
          <p className="text-muted-foreground">
            Trending as of {today}
          </p>
        </div>

        <Card className="bg-card border-border shadow-elegant">
          <CardHeader>
            <CardTitle>Top Trending Stocks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr className="text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Name</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">LTP</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Change</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Change %</th>
                  </tr>
                </thead>
                <tbody>
                  {trendingStocks.map((stock) => (
                    <tr key={stock.symbol} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="py-4">
                        <div>
                          <p className="font-medium">{stock.name}</p>
                          <p className="text-sm text-muted-foreground">{stock.symbol}</p>
                        </div>
                      </td>
                      <td className="py-4 text-right font-medium">
                        ₹{stock.ltp.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className={`py-4 text-right font-medium ${stock.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stock.change >= 0 ? '+' : ''}₹{Math.abs(stock.change).toFixed(2)}
                      </td>
                      <td className={`py-4 text-right font-medium ${stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        <div className="flex items-center justify-end gap-1">
                          {stock.changePercent >= 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  );
};

export default Markets;
