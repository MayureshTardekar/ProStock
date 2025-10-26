import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MarketTicker from "@/components/MarketTicker";
import StocksTable from "@/components/StocksTable";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

interface Suggestion {
  symbol: string;
  name: string;
  exchDisp?: string;
  price?: number;
}

async function searchYahoo(q: string): Promise<Suggestion[]> {
  if (!q) return [];
  const res = await fetch(`/yahoo/v1/finance/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) return [];
  const json = await res.json();
  const items: Array<{ symbol?: string; shortname?: string; longname?: string; exchDisp?: string }> = json?.quotes || [];
  const out: Suggestion[] = items
    .filter((it) => ((it.symbol ?? '') as string).endsWith('.NS'))
    .slice(0, 5)
    .map((it) => ({ symbol: it.symbol!, name: it.shortname || it.longname || it.symbol!, exchDisp: it.exchDisp }));
  // fetch price for each quickly
  const withPrice = await Promise.all(
    out.map(async (s) => {
      try {
        const url = `/yahoo/v8/finance/chart/${encodeURIComponent(s.symbol)}?range=1d&interval=1m`;
        const r = await fetch(url);
        const j = await r.json();
        const meta = j?.chart?.result?.[0]?.meta;
        const price = Number(meta?.regularMarketPrice ?? meta?.previousClose ?? 0);
        return { ...s, price };
      } catch {
        return s;
      }
    })
  );
  return withPrice;
}

const Stocks = () => {
  const [q, setQ] = useState("");
  const [suggs, setSuggs] = useState<Suggestion[]>([]);

  useEffect(() => {
    const id = setTimeout(async () => {
      if (q.trim().length >= 2) {
        setSuggs(await searchYahoo(q.trim()));
      } else {
        setSuggs([]);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [q]);

  const categories = [
    "Intraday Stocks",
    "Under ₹50",
    "Under ₹100",
    "Under ₹200",
    "Under ₹500",
  ];

  return (
    <div className="min-h-screen gradient-hero transition-theme">
      <Navbar activeLink="stocks" />
      
      {/* Market Ticker */}
      <MarketTicker />

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Stocks, Mutual Funds, ETFs..."
              className="pl-12 h-12 bg-card border-border rounded-full shadow-elegant transition-theme"
            />
            {suggs.length > 0 && (
              <div className="absolute z-30 mt-2 w-full bg-popover border border-border rounded-md shadow-md">
                {suggs.map((s) => (
                  <div key={s.symbol} className="px-4 py-2 flex items-center justify-between hover:bg-muted/50 cursor-pointer">
                    <span className="text-sm text-foreground/90">{s.name}</span>
                    <span className="text-sm text-muted-foreground">{s.symbol.replace('.NS','')} • ₹{(s.price ?? 0).toLocaleString('en-IN',{maximumFractionDigits:2})}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
            Market Stocks Overview
          </h1>
          <p className="text-sm text-muted-foreground mb-2">
            Last Updated: 19 Oct 2025, 15:59 IST
          </p>
          <div className="bg-card/50 backdrop-blur-md border border-border rounded-lg p-4 shadow-elegant">
            <p className="text-foreground/80 text-sm">
              Here you can view live NSE/BSE stocks with their latest price, change %, and key financial data. 
              Ideal for quick market tracking and analysis.
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant="outline"
                className="rounded-full border-primary/30 hover:border-primary hover:bg-accent transition-theme"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Table Header Actions */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="rounded-full border-primary bg-accent text-accent-foreground"
            >
              NSE
            </Button>
            <Button
              variant="outline"
              className="rounded-full"
            >
              BSE
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent"
          >
            <Download className="h-5 w-5" />
          </Button>
        </div>

        {/* Stocks Table */}
        <StocksTable />
      </main>

      <Footer />
    </div>
  );
};

export default Stocks;
