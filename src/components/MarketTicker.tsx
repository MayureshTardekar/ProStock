import { useEffect, useMemo, useState } from "react";

const mapIndex = [
  { name: "NIFTY 50", symbol: "^NSEI" },
  { name: "SENSEX", symbol: "^BSESN" },
  { name: "NIFTY BANK", symbol: "^NSEBANK" },
  { name: "NIFTY FIN", symbol: "^CNXFINANCE" },
];

async function fetchIndex(symbol: string) {
  const url = `/yahoo/v8/finance/chart/${encodeURIComponent(
    symbol
  )}?range=1d&interval=1m`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Index ${symbol} failed ${res.status}`);
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
  return { price, change, percent, isPositive: change >= 0 };
}

const MarketTicker = () => {
  const [data, setData] = useState<
    { name: string; price: string; change: string; isPositive: boolean }[]
  >([]);

  const fetchAll = useMemo(
    () => async () => {
      const items = await Promise.all(
        mapIndex.map(async (idx) => {
          try {
            const r = await fetchIndex(idx.symbol);
            return {
              name: idx.name,
              price: r.price.toLocaleString("en-IN", {
                maximumFractionDigits: 2,
              }),
              change: `${r.change >= 0 ? "+" : ""}${r.percent.toFixed(2)}%`,
              isPositive: r.isPositive,
            };
          } catch {
            return {
              name: idx.name,
              price: "-",
              change: "-",
              isPositive: true,
            };
          }
        })
      );
      setData(items);
    },
    []
  );

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 60000);
    return () => clearInterval(id);
  }, [fetchAll]);

  const tickerData = data.length
    ? data
    : mapIndex.map((i) => ({
        name: i.name,
        price: "-",
        change: "-",
        isPositive: true,
      }));

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-card/90 backdrop-blur-md border-b border-border shadow-sm transition-theme">
      <div className="overflow-hidden py-2">
        <div className="flex gap-8 animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused]">
          {[...tickerData, ...tickerData, ...tickerData].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 whitespace-nowrap px-4"
            >
              <span className="font-semibold text-foreground text-sm">
                {item.name}:
              </span>
              <span className="text-foreground/90 text-sm">{item.price}</span>
              <span
                className={`font-medium text-sm ${
                  item.isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketTicker;
