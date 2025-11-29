import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTrading } from "@/contexts/TradingContext";
import { formatCurrency } from "@/utils/format";
import { ShieldAlert, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

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

export const TradeModal = ({ isOpen, onClose, stock, type: initialType }: TradeModalProps) => {
  const [activeTab, setActiveTab] = useState<"MARKET" | "STOP_LOSS">("MARKET");
  const [quantity, setQuantity] = useState<number>(1);
  const [triggerPrice, setTriggerPrice] = useState<number>(0);
  const { balance, portfolio, buyStock, sellStock, placeStopLossOrder } = useTrading();

  useEffect(() => {
    if (stock) {
      setTriggerPrice(stock.price * 0.95); // Default 5% below current price
    }
  }, [stock]);

  if (!stock) return null;

  const total = stock.price * quantity;
  const holding = portfolio.find(h => h.symbol === stock.symbol);
  const maxSellQuantity = holding?.quantity || 0;

  const handleSubmit = async () => {
    let success = false;
    
    if (activeTab === "STOP_LOSS") {
      success = await placeStopLossOrder(stock.symbol, stock.name, triggerPrice, quantity);
    } else if (initialType === "BUY") {
      success = await buyStock(stock, quantity);
    } else {
      success = await sellStock(stock.symbol, quantity, stock.price);
    }

    if (success) {
      onClose();
      setQuantity(1);
      setActiveTab("MARKET");
    }
  };

  const canExecute = () => {
    if (quantity <= 0) return false;
    
    if (activeTab === "STOP_LOSS") {
      // For stop loss, we need to have the shares (assuming it's a sell stop loss)
      // Currently only implementing Sell Stop Loss (to protect long positions)
      return quantity <= maxSellQuantity && triggerPrice > 0 && triggerPrice < stock.price;
    }

    if (initialType === "BUY") {
      return total <= balance;
    } else {
      return quantity <= maxSellQuantity;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {initialType === "BUY" ? (
              <TrendingUp className="w-5 h-5 text-green-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-red-500" />
            )}
            {initialType} {stock.symbol}
          </DialogTitle>
          <DialogDescription>{stock.name}</DialogDescription>
        </DialogHeader>

        {initialType === "SELL" ? (
           <Tabs defaultValue="MARKET" value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="MARKET">Market Order</TabsTrigger>
              <TabsTrigger value="STOP_LOSS">Stop Loss</TabsTrigger>
            </TabsList>
            
            <TabsContent value="MARKET" className="space-y-4 py-4">
               {/* Market Order Content (Same as before) */}
               <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                <span className="text-sm text-muted-foreground">Current Price</span>
                <span className="text-lg font-bold">{formatCurrency(stock.price)}</span>
              </div>
            </TabsContent>

            <TabsContent value="STOP_LOSS" className="space-y-4 py-4">
              <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex gap-2 items-start">
                <ShieldAlert className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-500">
                  Stop Loss triggers a market sell order when the price drops to or below your trigger price.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="triggerPrice">Trigger Price (₹)</Label>
                <Input
                  id="triggerPrice"
                  type="number"
                  step="0.05"
                  value={triggerPrice}
                  onChange={(e) => setTriggerPrice(parseFloat(e.target.value) || 0)}
                  className="bg-background border-border"
                />
                <p className="text-xs text-muted-foreground">
                  Current Price: {formatCurrency(stock.price)}
                </p>
              </div>
            </TabsContent>
           </Tabs>
        ) : (
          <div className="space-y-4 py-4">
             <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
              <span className="text-sm text-muted-foreground">Current Price</span>
              <span className="text-lg font-bold">{formatCurrency(stock.price)}</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {/* Quantity Input */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              max={initialType === "SELL" || activeTab === "STOP_LOSS" ? maxSellQuantity : undefined}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="bg-background border-border"
            />
            {(initialType === "SELL" || activeTab === "STOP_LOSS") && (
              <p className="text-xs text-muted-foreground">
                Available: {maxSellQuantity} shares
              </p>
            )}
          </div>

          {/* Total Amount (Only for Market Orders) */}
          {activeTab === "MARKET" && (
            <div className="flex justify-between items-center p-3 bg-accent rounded-lg border border-primary/20">
              <span className="text-sm font-medium">Total Amount</span>
              <span className="text-xl font-bold text-primary flex items-center gap-1">
                {formatCurrency(total)}
              </span>
            </div>
          )}

          {/* Available Balance (Only for Buy) */}
          {initialType === "BUY" && (
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Available Balance</span>
              <span className="font-semibold">{formatCurrency(balance)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canExecute()}
            className={`flex-1 ${
              activeTab === "STOP_LOSS"
                ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                : initialType === "BUY" 
                  ? "bg-green-500 hover:bg-green-600 text-white" 
                  : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            {activeTab === "STOP_LOSS" 
              ? "Set Stop Loss" 
              : initialType === "BUY" ? "Buy Now" : "Sell Now"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};