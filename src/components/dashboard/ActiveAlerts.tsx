import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrading } from "@/contexts/TradingContext";
import { Bell, Trash2 } from "lucide-react";

export function ActiveAlerts() {
  const { priceAlerts, cancelPriceAlert } = useTrading();
  const activeAlerts = priceAlerts.filter(a => a.status === 'ACTIVE');

  if (activeAlerts.length === 0) return null;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Active Price Alerts</CardTitle>
        <Bell className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeAlerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="space-y-0.5">
                <div className="text-sm font-medium">{alert.symbol}</div>
                <div className="text-xs text-muted-foreground">
                  Target: {alert.condition === 'ABOVE' ? 'Above' : 'Below'} ₹{alert.targetPrice}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                onClick={() => cancelPriceAlert(alert.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
