import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const StocksTable = () => {
  const stocksData = [
    {
      name: "Reliance Industries",
      ltp: "₹1,416.80",
      change: "+1.32%",
      volume: "12.5M",
      marketCap: "9,58,432",
      pe: "25.4",
      industryPe: "24.8",
      high52w: "₹1,608",
      low52w: "₹1,215",
      return1m: "+5.2%",
      return3m: "+12.8%",
      isPositive: true,
    },
    {
      name: "HDFC Bank",
      ltp: "₹1,002.55",
      change: "+0.82%",
      volume: "8.2M",
      marketCap: "7,65,234",
      pe: "19.2",
      industryPe: "18.5",
      high52w: "₹1,125",
      low52w: "₹895",
      return1m: "+3.5%",
      return3m: "+8.2%",
      isPositive: true,
    },
    {
      name: "TCS",
      ltp: "₹3,456.20",
      change: "-0.45%",
      volume: "4.1M",
      marketCap: "12,56,890",
      pe: "28.6",
      industryPe: "27.2",
      high52w: "₹3,789",
      low52w: "₹3,012",
      return1m: "-2.1%",
      return3m: "+4.5%",
      isPositive: false,
    },
    {
      name: "Infosys",
      ltp: "₹1,789.30",
      change: "+1.15%",
      volume: "6.8M",
      marketCap: "7,42,156",
      pe: "26.8",
      industryPe: "27.2",
      high52w: "₹1,892",
      low52w: "₹1,456",
      return1m: "+6.8%",
      return3m: "+15.2%",
      isPositive: true,
    },
    {
      name: "Bharti Airtel",
      ltp: "₹2,012.00",
      change: "+2.27%",
      volume: "5.3M",
      marketCap: "11,23,567",
      pe: "45.2",
      industryPe: "42.8",
      high52w: "₹2,145",
      low52w: "₹1,678",
      return1m: "+8.5%",
      return3m: "+18.9%",
      isPositive: true,
    },
    {
      name: "ICICI Bank",
      ltp: "₹1,234.50",
      change: "+1.05%",
      volume: "9.7M",
      marketCap: "8,67,432",
      pe: "18.5",
      industryPe: "18.5",
      high52w: "₹1,345",
      low52w: "₹978",
      return1m: "+4.2%",
      return3m: "+10.5%",
      isPositive: true,
    },
  ];

  return (
    <div className="bg-card/50 backdrop-blur-md border border-border rounded-lg shadow-elegant overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50 sticky top-0 z-10">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold text-foreground">Name</TableHead>
              <TableHead className="font-bold text-foreground">LTP</TableHead>
              <TableHead className="font-bold text-foreground">Change %</TableHead>
              <TableHead className="font-bold text-foreground">Volume</TableHead>
              <TableHead className="font-bold text-foreground">Market Cap (Cr.)</TableHead>
              <TableHead className="font-bold text-foreground">PE Ratio</TableHead>
              <TableHead className="font-bold text-foreground">Industry PE</TableHead>
              <TableHead className="font-bold text-foreground">52W High</TableHead>
              <TableHead className="font-bold text-foreground">52W Low</TableHead>
              <TableHead className="font-bold text-foreground">1M Returns</TableHead>
              <TableHead className="font-bold text-foreground">3M Returns</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocksData.map((stock, index) => (
              <TableRow
                key={index}
                className="hover:bg-accent/30 transition-colors cursor-pointer"
              >
                <TableCell className="font-medium text-foreground">
                  {stock.name}
                </TableCell>
                <TableCell className="text-foreground/90">{stock.ltp}</TableCell>
                <TableCell
                  className={`font-semibold ${
                    stock.isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stock.change}
                </TableCell>
                <TableCell className="text-foreground/80">{stock.volume}</TableCell>
                <TableCell className="text-foreground/80">{stock.marketCap}</TableCell>
                <TableCell className="text-foreground/80">{stock.pe}</TableCell>
                <TableCell className="text-foreground/80">{stock.industryPe}</TableCell>
                <TableCell className="text-foreground/80">{stock.high52w}</TableCell>
                <TableCell className="text-foreground/80">{stock.low52w}</TableCell>
                <TableCell
                  className={`font-medium ${
                    stock.return1m.startsWith("+") ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stock.return1m}
                </TableCell>
                <TableCell
                  className={`font-medium ${
                    stock.return3m.startsWith("+") ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {stock.return3m}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StocksTable;
