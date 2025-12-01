import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/format";
import { TrendingDown, TrendingUp } from "lucide-react";

interface Trade {
  id: string;
  symbol: string;
  type: string;
  quantity: number;
  price: number;
  pnl: number;
  timestamp: string;
}

interface TradePerformanceTableProps {
  bestTrade: Trade | null;
  worstTrade: Trade | null;
}

export const TradePerformanceTable = ({ bestTrade, worstTrade }: TradePerformanceTableProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="border-l-4 border-l-green-500">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Best Trade 🏆</CardTitle>
        </CardHeader>
        <CardContent>
          {bestTrade ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">{bestTrade.symbol}</span>
                <span className="text-green-500 flex items-center gap-1 font-bold">
                  <TrendingUp className="w-4 h-4" />
                  +{formatCurrency(bestTrade.pnl)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>Qty: {bestTrade.quantity}</span>
                <span>Price: {formatCurrency(bestTrade.price)}</span>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                {new Date(bestTrade.timestamp).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No profitable trades yet.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Worst Trade 📉</CardTitle>
        </CardHeader>
        <CardContent>
          {worstTrade ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">{worstTrade.symbol}</span>
                <span className="text-red-500 flex items-center gap-1 font-bold">
                  <TrendingDown className="w-4 h-4" />
                  {formatCurrency(worstTrade.pnl)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground flex justify-between">
                <span>Qty: {worstTrade.quantity}</span>
                <span>Price: {formatCurrency(worstTrade.price)}</span>
              </div>
              <div className="text-xs text-muted-foreground text-right">
                {new Date(worstTrade.timestamp).toLocaleDateString()}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No loss-making trades yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
