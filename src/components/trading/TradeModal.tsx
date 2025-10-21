import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTrading } from "@/contexts/TradingContext";
import { TrendingUp, TrendingDown, IndianRupee } from "lucide-react";

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: {
    symbol: string;
    name: string;
    price: number;
  } | null;
  type: "BUY" | "SELL";
}

export const TradeModal = ({ isOpen, onClose, stock, type }: TradeModalProps) => {
  const [quantity, setQuantity] = useState<number>(1);
  const { balance, portfolio, buyStock, sellStock } = useTrading();

  if (!stock) return null;

  const total = stock.price * quantity;
  const holding = portfolio.find(h => h.symbol === stock.symbol);
  const maxSellQuantity = holding?.quantity || 0;

  const handleSubmit = () => {
    if (type === "BUY") {
      if (buyStock(stock, quantity)) {
        onClose();
        setQuantity(1);
      }
    } else {
      if (sellStock(stock.symbol, quantity, stock.price)) {
        onClose();
        setQuantity(1);
      }
    }
  };

  const canExecute = type === "BUY" 
    ? total <= balance && quantity > 0
    : quantity > 0 && quantity <= maxSellQuantity;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "BUY" ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
            {type} {stock.symbol}
          </DialogTitle>
          <DialogDescription>{stock.name}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Price */}
          <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
            <span className="text-sm text-muted-foreground">Current Price</span>
            <span className="text-lg font-bold">₹{stock.price.toFixed(2)}</span>
          </div>

          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={type === "SELL" ? maxSellQuantity : undefined}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-background border-border"
            />
            {type === "SELL" && (
              <p className="text-xs text-muted-foreground">
                Available: {maxSellQuantity} shares
              </p>
            )}
          </div>

          {/* Total Amount */}
          <div className="flex justify-between items-center p-3 bg-accent rounded-lg border border-primary/20">
            <span className="text-sm font-medium">Total Amount</span>
            <span className="text-xl font-bold text-primary flex items-center gap-1">
              <IndianRupee className="w-5 h-5" />
              {total.toFixed(2)}
            </span>
          </div>

          {/* Available Balance */}
          {type === "BUY" && (
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Available Balance</span>
              <span className="font-semibold">₹{balance.toFixed(2)}</span>
            </div>
          )}

          {/* Holding Info */}
          {type === "SELL" && holding && (
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Avg. Buy Price</span>
                <span>₹{holding.avgPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Est. P&L</span>
                <span className={
                  (stock.price - holding.avgPrice) * quantity >= 0 
                    ? "text-green-500" 
                    : "text-red-500"
                }>
                  ₹{((stock.price - holding.avgPrice) * quantity).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canExecute}
            className={`flex-1 ${
              type === "BUY" 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {type === "BUY" ? "Buy Now" : "Sell Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};