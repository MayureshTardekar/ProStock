import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useTrading } from "@/contexts/TradingContext";
import { Bell, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface AlertModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  stock: {
    symbol: string;
    name: string;
    price: number;
  };
}

export function AlertModal({ isOpen, onOpenChange, stock }: AlertModalProps) {
  const { setPriceAlert } = useTrading();
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [condition, setCondition] = useState<"ABOVE" | "BELOW">("ABOVE");
  const [isLoading, setIsLoading] = useState(false);

  // Set default target price based on condition
  useEffect(() => {
    if (isOpen) {
      if (condition === "ABOVE") {
        setTargetPrice((stock.price * 1.05).toFixed(2));
      } else {
        setTargetPrice((stock.price * 0.95).toFixed(2));
      }
    }
  }, [isOpen, condition, stock.price]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const price = parseFloat(targetPrice);
    if (isNaN(price) || price <= 0) {
      setIsLoading(false);
      return;
    }

    const success = await setPriceAlert(stock.symbol, stock.name, price, condition);
    
    setIsLoading(false);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Set Price Alert
          </DialogTitle>
          <DialogDescription>
            Get notified when {stock.symbol} reaches your target price.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Current Price</Label>
            <div className="col-span-3 font-medium">₹{stock.price.toFixed(2)}</div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Condition</Label>
            <RadioGroup 
              value={condition} 
              onValueChange={(v) => setCondition(v as "ABOVE" | "BELOW")}
              className="col-span-3 flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ABOVE" id="above" />
                <Label htmlFor="above">Above</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BELOW" id="below" />
                <Label htmlFor="below">Below</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target-price" className="text-right">
              Target Price
            </Label>
            <Input
              id="target-price"
              type="number"
              step="0.05"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              className="col-span-3"
              required
            />
          </div>
          
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Alert
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
