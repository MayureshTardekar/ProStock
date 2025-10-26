import React from "react";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  percent_change: number;
  provider?: string;
  timestamp?: string;
};

const DEFAULT_SYMBOLS = [
  "RELIANCE",
  "TCS",
  "HDFCBANK",
  "INFY",
  "ITC",
  "LT",
  "SBIN",
  "AXISBANK",
];

function classNames(...c: Array<string | false | null | undefined>) {
  return c.filter(Boolean).join(" ");
}

const StocksTable: React.FC = () => {
  const [symbols] = useState<string[]>(DEFAULT_SYMBOLS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stocks, setStocks] = useState<Stock[]>([]);

  const query = useMemo(() => symbols.join(","), [symbols]);

  async function fetchPrices() {
    try {
      setError(null);
      setLoading(true);
      const resp = await fetch(`/api/market/stocks?symbols=${encodeURIComponent(query)}`);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const json = await resp.json();
      setStocks(Array.isArray(json.stocks) ? json.stocks : []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg || "Failed to load prices");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPrices();
    // refresh every 30s
    const id = setInterval(fetchPrices, 30000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <div className="bg-card/50 backdrop-blur-md border border-border rounded-lg shadow-elegant overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Live Stocks</h2>
        {loading && <span className="text-sm text-muted-foreground">Updating…</span>}
        {error && <span className="text-sm text-red-500">{error}</span>}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Symbol</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">LTP</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Change</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">% Chg</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Source</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {stocks.map((s) => {
              const isUp = (s.change ?? 0) >= 0;
              return (
                <tr key={s.symbol} className="hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{s.symbol}</td>
                  <td className="px-4 py-3 text-sm text-foreground/90">{s.name}</td>
                  <td className="px-4 py-3 text-sm text-right">₹{s.price?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</td>
                  <td className={classNames("px-4 py-3 text-sm text-right font-medium", isUp ? "text-green-500" : "text-red-500")}>{(s.change ?? 0).toFixed(2)}</td>
                  <td className={classNames("px-4 py-3 text-sm text-right font-medium", isUp ? "text-green-500" : "text-red-500")}>{(s.percent_change ?? 0).toFixed(2)}%</td>
                  <td className="px-4 py-3 text-xs text-right text-muted-foreground">{s.provider || "-"}</td>
                </tr>
              );
            })}
            {stocks.length === 0 && !loading && (
              <tr>
                <td className="px-4 py-6 text-sm text-muted-foreground" colSpan={6}>
                  No data. Try again shortly.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StocksTable;
