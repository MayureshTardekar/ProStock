import { useEffect, useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Three tabs with top weights. Symbols are NSE .NS where applicable
const NIFTY50 = ["RELIANCE.NS","HDFCBANK.NS","ICICIBANK.NS","INFY.NS","ITC.NS","TCS.NS","LT.NS","SBIN.NS","BHARTIARTL.NS","AXISBANK.NS"];
const BANKNIFTY = ["HDFCBANK.NS","ICICIBANK.NS","SBIN.NS","AXISBANK.NS","KOTAKBANK.NS","INDUSINDBK.NS","AUBANK.NS","PNB.NS","IDFCFIRSTB.NS","BANDHANBNK.NS"];
const FINNIFTY = ["HDFCBANK.NS","ICICIBANK.NS","BAJFINANCE.NS","KOTAKBANK.NS","HDFCLIFE.NS","SBIN.NS","AXISBANK.NS","BAJAJFINSV.NS","ICICIPRULI.NS","HDFC.NS"];

async function fetchQuote(symbolNS: string) {
  const isDevHost = typeof window !== 'undefined' && /localhost|127\.|0\.0\.0\.0|::1/.test(window.location.hostname);
  const proxied = `/yahoo/v8/finance/chart/${encodeURIComponent(symbolNS)}?range=1d&interval=1m&_=${Date.now()}`;
  const absolute = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbolNS)}?range=1d&interval=1m&_=${Date.now()}`;
  let res = await fetch(isDevHost ? proxied : absolute);
  if (!res.ok) {
    res = await fetch(absolute);
  }
  if (!res.ok) throw new Error(String(res.status));
  const j = await res.json();
  const r = j?.chart?.result?.[0];
  const m = r?.meta || {};
  const price = Number(m.regularMarketPrice ?? m.previousClose ?? 0);
  const change = Number(m.regularMarketChange ?? (m.regularMarketPrice!=null && m.previousClose!=null ? m.regularMarketPrice - m.previousClose : 0));
  const percent = Number(m.regularMarketChangePercent ?? (m.regularMarketPrice!=null && m.previousClose ? ((m.regularMarketPrice - m.previousClose)/m.previousClose)*100 : 0));
  return { price, change, percent };
}

function TabList({ symbols }: { symbols: string[] }) {
  const [rows, setRows] = useState<Record<string,{price:number,change:number,percent:number}>>({});

  const load = useMemo(()=> async ()=>{
    const entries = await Promise.all(symbols.map(async s=>{ try { const r = await fetchQuote(s); return [s,r] as const;} catch { return [s,{price:0,change:0,percent:0}] as const; }}));
    setRows(Object.fromEntries(entries));
  },[symbols]);

  useEffect(()=>{ load(); const id=setInterval(load,60000); return ()=>clearInterval(id); },[load]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {symbols.map((s)=>{
        const base = s.replace('.NS','');
        const r = rows[s];
        const isUp = (r?.change??0) >= 0;
        return (
          <Card key={s} className="p-4 flex items-center justify-between">
            <div>
              <div className="font-semibold">{base}</div>
              <div className={"text-sm "+(isUp?"text-green-500":"text-red-500")}>{isUp?"+":""}{(r?.change??0).toFixed(2)} ({isUp?"+":""}{(r?.percent??0).toFixed(2)}%)</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-lg font-bold">₹{(r?.price??0).toLocaleString('en-IN',{maximumFractionDigits:2})}</div>
              <div className="flex gap-2">
                <Button size="sm" variant="success">Buy</Button>
                <Button size="sm" variant="destructive">Sell</Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

export function IndexTabs() {
  const [tab, setTab] = useState<'NIFTY'|'BANK'|'FIN'>('NIFTY');
  const current = tab==='NIFTY' ? NIFTY50 : tab==='BANK' ? BANKNIFTY : FINNIFTY;
  return (
    <div className="mt-6 space-y-4">
      <div className="flex gap-2">
        <Button variant={tab==='NIFTY'? 'default':'outline'} size="sm" onClick={()=>setTab('NIFTY')}>Nifty 50</Button>
        <Button variant={tab==='BANK'? 'default':'outline'} size="sm" onClick={()=>setTab('BANK')}>Bank Nifty</Button>
        <Button variant={tab==='FIN'? 'default':'outline'} size="sm" onClick={()=>setTab('FIN')}>Fin Nifty</Button>
      </div>
      <TabList symbols={current} />
    </div>
  );
}
