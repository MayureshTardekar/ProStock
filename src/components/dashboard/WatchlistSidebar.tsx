import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCurrency, formatNumber } from "@/utils/format";
import { TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

// Top 10 weighted stocks for each index (symbol + friendly name)
const NIFTY50 = [
  { symbol: "RELIANCE.NS", name: "Reliance Industries" },
  { symbol: "HDFCBANK.NS", name: "HDFC Bank" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank" },
  { symbol: "INFY.NS", name: "Infosys" },
  { symbol: "ITC.NS", name: "ITC" },
  { symbol: "TCS.NS", name: "TCS" },
  { symbol: "LT.NS", name: "Larsen & Toubro" },
  { symbol: "SBIN.NS", name: "SBI" },
  { symbol: "BHARTIARTL.NS", name: "Bharti Airtel" },
  { symbol: "AXISBANK.NS", name: "Axis Bank" },
];

const BANKNIFTY = [
  { symbol: "HDFCBANK.NS", name: "HDFC Bank" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank" },
  { symbol: "SBIN.NS", name: "SBI" },
  { symbol: "AXISBANK.NS", name: "Axis Bank" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Bank" },
  { symbol: "INDUSINDBK.NS", name: "IndusInd Bank" },
  { symbol: "AUBANK.NS", name: "AU Bank" },
  { symbol: "PNB.NS", name: "PNB" },
  { symbol: "IDFCFIRSTB.NS", name: "IDFC First Bank" },
  { symbol: "BANDHANBNK.NS", name: "Bandhan Bank" },
];

const FINNIFTY = [
  { symbol: "HDFCBANK.NS", name: "HDFC Bank" },
  { symbol: "ICICIBANK.NS", name: "ICICI Bank" },
  { symbol: "BAJFINANCE.NS", name: "Bajaj Finance" },
  { symbol: "KOTAKBANK.NS", name: "Kotak Bank" },
  { symbol: "HDFCLIFE.NS", name: "HDFC Life" },
  { symbol: "SBIN.NS", name: "SBI" },
  { symbol: "AXISBANK.NS", name: "Axis Bank" },
  { symbol: "BAJAJFINSV.NS", name: "Bajaj Finserv" },
  { symbol: "ICICIPRULI.NS", name: "ICICI Pru Life" },
  { symbol: "HDFC.NS", name: "HDFC" },
];

const ALL: Record<string, { symbol: string; name: string }[]> = {
  nifty: NIFTY50,
  bank: BANKNIFTY,
  fin: FINNIFTY,
};

const REFRESH_MS = 60_000;

async function fetchQuote(symbolNS: string) {
  const isDevHost = typeof window !== 'undefined' && /localhost|127\.|0\.0\.0\.0|::1/.test(window.location.hostname);
  const proxied = `/yahoo/v8/finance/chart/${encodeURIComponent(symbolNS)}?range=1d&interval=1m&_=${Date.now()}`;
  const absolute = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbolNS)}?range=1d&interval=1m&_=${Date.now()}`;
  let res = await fetch(isDevHost ? proxied : absolute);
  if (!res.ok) res = await fetch(absolute);
  if (!res.ok) throw new Error(String(res.status));
  const j = await res.json();
  const r = j?.chart?.result?.[0];
  const m = r?.meta || {};
  const price = Number(m.regularMarketPrice ?? m.previousClose ?? 0);
  const change = Number(m.regularMarketChange ?? (m.regularMarketPrice!=null && m.previousClose!=null ? m.regularMarketPrice - m.previousClose : 0));
  const percent = Number(m.regularMarketChangePercent ?? (m.regularMarketPrice!=null && m.previousClose ? ((m.regularMarketPrice - m.previousClose)/m.previousClose)*100 : 0));
  return { price, change, percent };
}

export const WatchlistSidebar = () => {
  const [tab, setTab] = useState<'nifty'|'bank'|'fin'>('nifty');
  const [rows, setRows] = useState<Record<string,{price:number,change:number,percent:number}>>({});

  const load = useMemo(()=> async (symbols: {symbol:string}[])=>{
    const entries = await Promise.all(symbols.map(async s=>{ try { const r = await fetchQuote(s.symbol); return [s.symbol,r] as const;} catch { return [s.symbol,{price:0,change:0,percent:0}] as const; }}));
    setRows(prev=>({ ...prev, ...Object.fromEntries(entries) }));
  },[]);

  useEffect(() => {
    const fetchActiveTab = () => {
      const activeList = ALL[tab];
      if (activeList) {
        load(activeList);
      }
    };

    fetchActiveTab(); // Initial load for the active tab
    const id = setInterval(fetchActiveTab, REFRESH_MS);
    return () => clearInterval(id);
  }, [tab, load]);

  const triggerTrade = (type: 'BUY'|'SELL', baseSymbol: string, name: string, price: number)=>{
    const detail = { type, stock: { symbol: baseSymbol, name, price } };
    window.dispatchEvent(new CustomEvent('prostock-trade', { detail }));
  };

  const renderList = (symbols: {symbol:string; name:string}[]) => (
    <div className="space-y-2">
      {symbols.map((it, idx)=>{
        const base = it.symbol.replace('.NS','');
        const r = rows[it.symbol] || {price:0,change:0,percent:0};
        const isUp = r.change >= 0;
        return (
          <Card key={it.symbol} className="p-3 border-l-4 bg-card">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="font-semibold text-sm truncate flex items-center gap-2">
                  <span className="inline-block h-2 w-2 rounded-full" style={{backgroundColor: idx<3? 'hsl(var(--primary))':'hsl(var(--muted-foreground))'}} />
                  {it.name}
                  <span className="text-xs text-muted-foreground">{base}</span>
                </div>
                <div className={`text-xs ${isUp?'text-green-500':'text-red-500'} flex items-center gap-1 mt-0.5`}>
                  {isUp? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                  {isUp?'+':''}{formatNumber(r.change)} ({isUp?'+':''}{formatNumber(r.percent)}%)
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <div className="text-sm font-bold min-w-[86px] text-right">{formatCurrency(r.price)}</div>
                <div className="flex gap-2">
                  <Button size="sm" className="h-7 px-3 bg-green-600 text-white hover:bg-green-700" onClick={()=>triggerTrade('BUY', base, it.name, r.price)}>
                    Buy
                  </Button>
                  <Button size="sm" variant="destructive" className="h-7 px-3" onClick={()=>triggerTrade('SELL', base, it.name, r.price)}>
                    Sell
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );

  return (
    <aside className="w-96 bg-card border-r border-border p-4 space-y-3 h-[calc(100vh-7rem)] overflow-y-auto transition-theme scrollbar-hide">
      <TooltipProvider>
        <Tabs value={tab} onValueChange={(v)=>setTab(v as any)} className="w-full">
          {/* Tabs placed clear below ticker */}
          <TabsList className="grid w-full grid-cols-3 mb-3 sticky top-0 z-10 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="nifty" className="text-xs">Nifty 50</TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>Top weighted stocks of NIFTY 50</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="bank" className="text-xs">Bank Nifty</TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>Top weighted stocks of BANKNIFTY</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="fin" className="text-xs">Fin Nifty</TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>Top weighted stocks of FINNIFTY</TooltipContent>
            </Tooltip>
          </TabsList>

          <TabsContent value="nifty" className="space-y-2 mt-0">{renderList(NIFTY50)}</TabsContent>
          <TabsContent value="bank" className="space-y-2 mt-0">{renderList(BANKNIFTY)}</TabsContent>
          <TabsContent value="fin" className="space-y-2 mt-0">{renderList(FINNIFTY)}</TabsContent>
        </Tabs>
      </TooltipProvider>
    </aside>
  );
};
