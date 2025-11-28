import Footer from "@/components/Footer";
import MainLayout from "@/components/MainLayout";
import { SearchStocks } from "@/components/SearchStocks";
import { TradeModal } from "@/components/trading/TradeModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";

interface Row {
  name: string;
  symbol: string;
  ltp: number;
  change: number;
  changePercent: number;
}

const SYMBOLS: Row[] = [
  {
    name: "Vodafone Idea",
    symbol: "IDEA.NS",
    ltp: 0,
    change: 0,
    changePercent: 0,
  },
  {
    name: "Utkarsh Small Finance Bank",
    symbol: "UTKARSHBANK.NS",
    ltp: 0,
    change: 0,
    changePercent: 0,
  },
  {
    name: "Shipping Corporation of India",
    symbol: "SCI.NS",
    ltp: 0,
    change: 0,
    changePercent: 0,
  },
  {
    name: "PTC India Financial Services",
    symbol: "PFS.NS",
    ltp: 0,
    change: 0,
    changePercent: 0,
  },
  {
    name: "Sammaan Capital",
    symbol: "SAMMAANCAP.NS",
    ltp: 0,
    change: 0,
    changePercent: 0,
  },
  {
    name: "PC Jeweller",
    symbol: "PCJEWELLER.NS",
    ltp: 0,
    change: 0,
    changePercent: 0,
  },
  {
    name: "GACM Technologies",
    symbol: "GACMTECH.NS",
    ltp: 0,
    change: 0,
    changePercent: 0,
  },
  {
    name: "NALCO",
    symbol: "NATIONALUM.NS",
    ltp: 0,
    change: 0,
    changePercent: 0,
  },
];

async function fetchYahoo(symbolNS: string) {
  const url = `/yahoo/v8/finance/chart/${encodeURIComponent(
    symbolNS
  )}?range=1d&interval=1m`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Yahoo ${symbolNS} ${res.status}`);
  const json = await res.json();
  const r = json?.chart?.result?.[0];
  const meta = r?.meta || {};
  const price = Number(meta.regularMarketPrice ?? meta.previousClose ?? 0);
  const change = Number(
    meta?.regularMarketChange ??
      (meta?.regularMarketPrice != null && meta?.previousClose != null
        ? meta.regularMarketPrice - meta.previousClose
        : 0)
  );
  const percent = Number(
    meta?.regularMarketChangePercent ??
      (meta?.regularMarketPrice != null && meta?.previousClose
        ? ((meta.regularMarketPrice - meta.previousClose) /
            meta.previousClose) *
          100
        : 0)
  );
  return { price, change, percent };
}

export default function Markets() {
  const [rows, setRows] = useState<Row[]>(SYMBOLS);
  const [isLoading, setIsLoading] = useState(true);
  const [trade, setTrade] = useState<{
    open: boolean;
    symbol?: string;
    name?: string;
    price?: number;
    type?: "BUY" | "SELL";
  }>({ open: false });

  const load = useMemo(
    () => async () => {
      setIsLoading(true);
      const out = await Promise.all(
        SYMBOLS.map(async (s) => {
          try {
            const r = await fetchYahoo(s.symbol);
            return {
              ...s,
              ltp: r.price,
              change: r.change,
              changePercent: r.percent,
            };
          } catch {
            return s;
          }
        })
      );
      setRows(out);
      setIsLoading(false);
    },
    []
  );

  useEffect(() => {
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, [load]);

  return (
    <MainLayout>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Markets
        </h1>
        
        {/* Search Bar */}
        <div className="mb-8">
          <SearchStocks 
            onSelect={(stock) => setTrade({
              open: true,
              symbol: stock.symbol,
              name: stock.name,
              price: stock.price,
              type: "BUY"
            })}
          />
        </div>
        
        <h2 className="text-2xl font-bold mb-4">Trending as of Today</h2>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-4 py-3 text-left">Name</th>
                  <th className="px-4 py-3 text-right">LTP</th>
                  <th className="px-4 py-3 text-right">Change</th>
                  <th className="px-4 py-3 text-right">Change %</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((r) => {
                  const isUp = (r.change ?? 0) >= 0;
                  return (
                    <tr key={r.symbol} className="group hover:bg-muted/50">
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{r.name}</span>
                          <span className="text-muted-foreground text-xs">
                            NSE
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-right">
                        ₹
                        {r.ltp.toLocaleString("en-IN", {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-right ${
                          isUp ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {isUp ? "+" : ""}
                        {(r.change ?? 0).toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-3 text-sm text-right ${
                          isUp ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {isUp ? "+" : ""}
                        {(r.changePercent ?? 0).toFixed(2)}%
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-500 hover:text-green-600"
                            onClick={() =>
                              setTrade({
                                open: true,
                                symbol: r.symbol,
                                name: r.name,
                                price: r.ltp,
                                type: "BUY",
                              })
                            }
                          >
                            Buy
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-500 hover:text-red-600"
                            onClick={() =>
                              setTrade({
                                open: true,
                                symbol: r.symbol,
                                name: r.name,
                                price: r.ltp,
                                type: "SELL",
                              })
                            }
                          >
                            Sell
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {isLoading && (
                  <tr>
                    <td
                      className="px-4 py-6 text-sm text-muted-foreground"
                      colSpan={5}
                    >
                      Loading live data…
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </main>

      <TradeModal
        isOpen={!!trade.open}
        onClose={() => setTrade({ open: false })}
        stock={
          trade.symbol
            ? { symbol: trade.symbol, name: trade.name!, price: trade.price! }
            : null
        }
        type={(trade.type ?? "BUY") as "BUY" | "SELL"}
      />
      <Footer />
    </MainLayout>
  );
}
