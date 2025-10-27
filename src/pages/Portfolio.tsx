import Footer from "@/components/Footer";
import MainLayout from "@/components/MainLayout";
import { TradeModal } from "@/components/trading/TradeModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrading } from "@/contexts/TradingContext";
import {
  ArrowDownRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useState, useEffect } from "react";

// Live price fetcher
async function fetchLivePrice(symbol: string) {
  try {
    const isDevHost =
      typeof window !== "undefined" &&
      /localhost|127\.|0\.0\.0\.0|::1/.test(window.location.hostname);
    const symbolNS = `${symbol}.NS`;
    const proxied = `/yahoo/v8/finance/chart/${encodeURIComponent(
      symbolNS
    )}?range=1d&interval=1m&_=${Date.now()}`;
    const absolute = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(
      symbolNS
    )}?range=1d&interval=1m&_=${Date.now()}`;
    let res = await fetch(isDevHost ? proxied : absolute);
    if (!res.ok) res = await fetch(absolute);
    if (!res.ok) throw new Error();
    const j = await res.json();
    const meta = j?.chart?.result?.[0]?.meta || {};
    return Number(meta.regularMarketPrice ?? meta.previousClose ?? 0);
  } catch {
    return 0;
  }
}

const Portfolio = () => {
  const {
    portfolio,
    balance,
    getTotalInvestment,
    getTotalCurrentValue,
    getTotalProfitLoss,
  } = useTrading();
  const [showValues, setShowValues] = useState(true);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [tradeModal, setTradeModal] = useState<{
    isOpen: boolean;
    stock: any;
    type: "BUY" | "SELL";
  }>({
    isOpen: false,
    stock: null,
    type: "BUY",
  });

  // Fetch live prices for all portfolio holdings
  useEffect(() => {
    const loadLivePrices = async () => {
      const prices: Record<string, number> = {};
      for (const holding of portfolio) {
        const livePrice = await fetchLivePrice(holding.symbol);
        if (livePrice > 0) {
          prices[holding.symbol] = livePrice;
        } else {
          // Fallback to current price from database
          prices[holding.symbol] = holding.currentPrice;
        }
      }
      setLivePrices(prices);
    };

    if (portfolio.length > 0) {
      loadLivePrices();
      // Refresh every 60 seconds
      const interval = setInterval(loadLivePrices, 60000);
      return () => clearInterval(interval);
    }
  }, [portfolio]);

  // Get live price or fallback to database price
  const getLivePrice = (symbol: string, fallbackPrice: number) => {
    return livePrices[symbol] || fallbackPrice;
  };

  const totalInvestment = getTotalInvestment();
  const currentValue = getTotalCurrentValue();
  const profitLoss = getTotalProfitLoss();
  const profitLossPercent =
    totalInvestment > 0 ? (profitLoss / totalInvestment) * 100 : 0;

  const openTradeModal = (holding: any, type: "BUY" | "SELL") => {
    const livePrice = getLivePrice(holding.symbol, holding.currentPrice);
    setTradeModal({
      isOpen: true,
      stock: {
        symbol: holding.symbol,
        name: holding.name,
        price: livePrice,
      },
      type,
    });
  };

  const maskValue = (value: number) => {
    return showValues
      ? `₹${value.toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`
      : "••,•••.••";
  };

  return (
    <MainLayout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            My Portfolio
          </h1>
          <p className="text-muted-foreground">
            Track your investments and performance
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border shadow-elegant">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Available Balance
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => setShowValues(!showValues)}
              >
                {showValues ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{maskValue(balance)}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Investment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {maskValue(totalInvestment)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Current Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {maskValue(currentValue)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-elegant">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total P&L
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold flex items-center gap-2 ${
                  profitLoss >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {profitLoss >= 0 ? (
                  <TrendingUp className="w-5 h-5" />
                ) : (
                  <TrendingDown className="w-5 h-5" />
                )}
                {maskValue(Math.abs(profitLoss))}
              </div>
              {showValues && (
                <p
                  className={`text-sm ${
                    profitLoss >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {profitLoss >= 0 ? "+" : "-"}
                  {Math.abs(profitLossPercent).toFixed(2)}%
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Holdings Table */}
        <Card className="bg-card border-border shadow-elegant">
          <CardHeader>
            <CardTitle>Holdings ({portfolio.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {portfolio.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No holdings yet</p>
                <Button onClick={() => (window.location.href = "/stocks")}>
                  Start Trading
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr className="text-left">
                      <th className="pb-3 font-medium text-muted-foreground">
                        Stock
                      </th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">
                        Qty
                      </th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">
                        Avg Price
                      </th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">
                        LTP
                      </th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">
                        Current Value
                      </th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">
                        P&L
                      </th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {portfolio.map((holding) => {
                      const livePrice = getLivePrice(holding.symbol, holding.currentPrice);
                      const invested = holding.avgPrice * holding.quantity;
                      const current = livePrice * holding.quantity;
                      const pl = current - invested;
                      const plPercent = (pl / invested) * 100;

                      return (
                        <tr
                          key={holding.symbol}
                          className="border-b border-border hover:bg-muted/50 transition-colors"
                        >
                          <td className="py-4">
                            <div>
                              <p className="font-medium">{holding.symbol}</p>
                              <p className="text-sm text-muted-foreground">
                                {holding.name}
                              </p>
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            {holding.quantity}
                          </td>
                          <td className="py-4 text-right">
                            ₹{holding.avgPrice.toFixed(2)}
                          </td>
                          <td className="py-4 text-right font-medium">
                            ₹{livePrice.toFixed(2)}
                          </td>
                          <td className="py-4 text-right font-medium">
                            ₹
                            {current.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          <td
                            className={`py-4 text-right font-medium ${
                              pl >= 0 ? "text-green-500" : "text-red-500"
                            }`}
                          >
                            <div className="flex items-center justify-end gap-1">
                              {pl >= 0 ? (
                                <ArrowUpRight className="w-4 h-4" />
                              ) : (
                                <ArrowDownRight className="w-4 h-4" />
                              )}
                              <span>₹{Math.abs(pl).toFixed(2)}</span>
                            </div>
                            <span className="text-xs">
                              ({pl >= 0 ? "+" : ""}
                              {plPercent.toFixed(2)}%)
                            </span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openTradeModal(holding, "BUY")}
                                className="text-green-500 hover:text-green-600"
                              >
                                Buy
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => openTradeModal(holding, "SELL")}
                                className="text-red-500 hover:text-red-600"
                              >
                                Sell
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />

      <TradeModal
        isOpen={tradeModal.isOpen}
        onClose={() =>
          setTradeModal({ isOpen: false, stock: null, type: "BUY" })
        }
        stock={tradeModal.stock}
        type={tradeModal.type}
      />
    </MainLayout>
  );
};

export default Portfolio;
