import Footer from "@/components/Footer";
import MainLayout from "@/components/MainLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTrading } from "@/contexts/TradingContext";
import { TrendingDown, TrendingUp } from "lucide-react";

const Orders = () => {
  const { orders } = useTrading();

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <MainLayout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Order Book
          </h1>
          <p className="text-muted-foreground">
            View all your completed orders
          </p>
        </div>

        {/* Orders Table */}
        <Card className="bg-card border-border shadow-elegant">
          <CardHeader>
            <CardTitle>All Orders ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <p className="text-sm text-muted-foreground">
                  Start trading to see your orders here
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border">
                    <tr className="text-left">
                      <th className="pb-3 font-medium text-muted-foreground">
                        Date & Time
                      </th>
                      <th className="pb-3 font-medium text-muted-foreground">
                        Stock
                      </th>
                      <th className="pb-3 font-medium text-muted-foreground">
                        Type
                      </th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">
                        Qty
                      </th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">
                        Price
                      </th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">
                        Total
                      </th>
                      <th className="pb-3 font-medium text-muted-foreground">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-border hover:bg-muted/50 transition-colors"
                      >
                        <td className="py-4">
                          <span className="text-sm">
                            {formatDate(order.timestamp)}
                          </span>
                        </td>
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{order.symbol}</p>
                            <p className="text-xs text-muted-foreground">
                              {order.name}
                            </p>
                          </div>
                        </td>
                        <td className="py-4">
                          <Badge
                            variant="outline"
                            className={`${
                              order.type === "BUY"
                                ? "border-green-500 text-green-500"
                                : "border-red-500 text-red-500"
                            }`}
                          >
                            <div className="flex items-center gap-1">
                              {order.type === "BUY" ? (
                                <TrendingUp className="w-3 h-3" />
                              ) : (
                                <TrendingDown className="w-3 h-3" />
                              )}
                              {order.type}
                            </div>
                          </Badge>
                        </td>
                        <td className="py-4 text-right">{order.quantity}</td>
                        <td className="py-4 text-right">
                          ₹{order.price.toFixed(2)}
                        </td>
                        <td className="py-4 text-right font-medium">
                          ₹
                          {order.total.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td className="py-4">
                          <Badge
                            variant="outline"
                            className="border-primary text-primary"
                          >
                            {order.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Footer />
    </MainLayout>
  );
};

export default Orders;
