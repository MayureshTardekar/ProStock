import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useTrading } from "@/contexts/TradingContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";

const Money = () => {
  const { balance, transactions, addMoney, withdrawMoney } = useTrading();
  const [amount, setAmount] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"deposit" | "withdraw">("deposit");

  const handleSubmit = () => {
    if (amount <= 0) return;
    
    if (activeTab === "deposit") {
      addMoney(amount);
    } else {
      withdrawMoney(amount);
    }
    
    setAmount(0);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "BUY":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "SELL":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      case "DEPOSIT":
        return <ArrowDownRight className="w-4 h-4 text-blue-500" />;
      case "WITHDRAW":
        return <ArrowUpRight className="w-4 h-4 text-orange-500" />;
      default:
        return <Wallet className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen gradient-hero transition-theme">
      <Navbar />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Money Management
          </h1>
          <p className="text-muted-foreground">
            Manage your paper trading funds
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Card */}
          <div className="lg:col-span-1">
            <Card className="bg-card border-border shadow-elegant">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Available Balance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold mb-6">
                  ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>

                {/* Add/Withdraw Money */}
                <div className="space-y-4">
                  <div className="flex gap-2 border-b border-border pb-3">
                    <Button
                      variant={activeTab === "deposit" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTab("deposit")}
                      className="flex-1"
                    >
                      Add Money
                    </Button>
                    <Button
                      variant={activeTab === "withdraw" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveTab("withdraw")}
                      className="flex-1"
                    >
                      Withdraw
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="0"
                      step="100"
                      value={amount || ""}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      placeholder="Enter amount"
                      className="bg-background border-border"
                    />
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount(1000)}
                        className="flex-1"
                      >
                        +₹1,000
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount(5000)}
                        className="flex-1"
                      >
                        +₹5,000
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAmount(10000)}
                        className="flex-1"
                      >
                        +₹10,000
                      </Button>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={amount <= 0 || (activeTab === "withdraw" && amount > balance)}
                      className="w-full gradient-primary"
                    >
                      {activeTab === "deposit" ? "Add Money" : "Withdraw Money"}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      This is paper trading. No real money is involved.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <Card className="bg-card border-border shadow-elegant">
              <CardHeader>
                <CardTitle>Transaction History ({transactions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No transactions yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-muted rounded-full">
                            {getTransactionIcon(tx.type)}
                          </div>
                          <div>
                            <p className="font-medium">{tx.description}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(tx.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            tx.type === "DEPOSIT" || tx.type === "SELL"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}>
                            {tx.type === "DEPOSIT" || tx.type === "SELL" ? "+" : "-"}
                            ₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Balance: ₹{tx.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Money;