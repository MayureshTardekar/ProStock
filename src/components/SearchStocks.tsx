import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';

// Popular Indian NSE stocks
const POPULAR_STOCKS = [
  { symbol: 'RELIANCE.NS', name: 'Reliance Industries', price: 1285.5 },
  { symbol: 'TCS.NS', name: 'Tata Consultancy Services', price: 4150.75 },
  { symbol: 'HDFCBANK.NS', name: 'HDFC Bank', price: 1745.8 },
  { symbol: 'INFY.NS', name: 'Infosys', price: 1850.6 },
  { symbol: 'ICICIBANK.NS', name: 'ICICI Bank', price: 1280.35 },
  { symbol: 'HINDUNILVR.NS', name: 'Hindustan Unilever', price: 2350.9 },
  { symbol: 'ITC.NS', name: 'ITC Limited', price: 465.75 },
  { symbol: 'SBIN.NS', name: 'State Bank of India', price: 825.45 },
  { symbol: 'BHARTIARTL.NS', name: 'Bharti Airtel', price: 1650.25 },
  { symbol: 'KOTAKBANK.NS', name: 'Kotak Mahindra Bank', price: 1780.6 },
  { symbol: 'LT.NS', name: 'Larsen & Toubro', price: 3650.8 },
  { symbol: 'BAJFINANCE.NS', name: 'Bajaj Finance', price: 7250.4 },
  { symbol: 'HCLTECH.NS', name: 'HCL Technologies', price: 1880.9 },
  { symbol: 'WIPRO.NS', name: 'Wipro', price: 580.5 },
  { symbol: 'MARUTI.NS', name: 'Maruti Suzuki', price: 12850.75 },
  { symbol: 'SUNPHARMA.NS', name: 'Sun Pharma', price: 1780.65 },
  { symbol: 'AXISBANK.NS', name: 'Axis Bank', price: 1150.8 },
  { symbol: 'TITAN.NS', name: 'Titan Company', price: 3450.9 },
  { symbol: 'ASIANPAINT.NS', name: 'Asian Paints', price: 2450.35 },
  { symbol: 'NESTLEIND.NS', name: 'Nestle India', price: 2180.5 },
];

interface SearchStocksProps {
  onSelect: (stock: { symbol: string; name: string; price: number }) => void;
}

export function SearchStocks({ onSelect }: SearchStocksProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const results = useMemo(() => {
    if (!query.trim()) return [];
    
    const q = query.toLowerCase();
    return POPULAR_STOCKS.filter(stock => 
      stock.symbol.toLowerCase().includes(q) ||
      stock.name.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [query]);

  return (
    <div className="relative w-full">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
        <Input
          placeholder="Search stocks by name or symbol (e.g. RELIANCE, TCS, INFY...)"
          className="pl-12 h-14 bg-card border-border shadow-sm text-base"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-2">
            <p className="text-xs text-muted-foreground px-3 py-2">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
            {results.map((stock) => {
              const cleanSymbol = stock.symbol.replace('.NS', '');
              const firstLetter = cleanSymbol.charAt(0);
              
              // Company-specific colors
              const colorMap: Record<string, string> = {
                'RELIANCE': 'bg-orange-500',
                'TCS': 'bg-blue-600',
                'HDFCBANK': 'bg-red-600',
                'INFY': 'bg-green-600',
                'ICICIBANK': 'bg-orange-600',
                'HINDUNILVR': 'bg-blue-500',
                'ITC': 'bg-yellow-600',
                'SBIN': 'bg-blue-700',
                'BHARTIARTL': 'bg-red-500',
                'KOTAKBANK': 'bg-red-700',
                'LT': 'bg-indigo-600',
                'BAJFINANCE': 'bg-purple-600',
                'HCLTECH': 'bg-blue-600',
                'WIPRO': 'bg-orange-500',
                'MARUTI': 'bg-red-600',
                'SUNPHARMA': 'bg-cyan-600',
                'AXISBANK': 'bg-purple-700',
                'TITAN': 'bg-yellow-700',
                'ASIANPAINT': 'bg-red-500',
                'NESTLEIND': 'bg-blue-500',
              };
              
              const bgColor = colorMap[cleanSymbol] || 'bg-primary';
              
              return (
                <button
                  key={stock.symbol}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-lg transition-colors text-left"
                  onClick={() => {
                    onSelect(stock);
                    setQuery('');
                    setShowResults(false);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center text-white font-bold text-lg`}>
                      {firstLetter}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{cleanSymbol}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-xs">
                        {stock.name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm">
                      ₹{stock.price.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-muted-foreground">NSE</p>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {showResults && query.trim() && results.length === 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No stocks found for "{query}"
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Try searching for RELIANCE, TCS, INFY, HDFC, etc.
          </p>
        </Card>
      )}
    </div>
  );
}
