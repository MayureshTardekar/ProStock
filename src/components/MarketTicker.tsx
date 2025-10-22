const MarketTicker = () => {
  const tickerData = [
    { name: "NIFTY 50", price: "24,180.80", change: "+0.65%", isPositive: true },
    { name: "SENSEX", price: "79,486.32", change: "+0.52%", isPositive: true },
    { name: "NIFTY BANK", price: "51,234.15", change: "+1.12%", isPositive: true },
    { name: "NIFTY FIN", price: "23,456.90", change: "+0.89%", isPositive: true },
    { name: "NIFTY IT", price: "38,923.45", change: "-0.34%", isPositive: false },
    { name: "NIFTY AUTO", price: "19,876.23", change: "+1.45%", isPositive: true },
    { name: "NIFTY FMCG", price: "55,234.67", change: "+0.23%", isPositive: true },
    { name: "NIFTY PHARMA", price: "17,234.89", change: "+0.67%", isPositive: true },
    { name: "NIFTY ENERGY", price: "35,678.12", change: "-0.12%", isPositive: false },
  ];

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-card/90 backdrop-blur-md border-b border-border shadow-sm transition-theme">
      <div className="overflow-hidden py-2">
        <div className="flex gap-8 animate-[scroll_40s_linear_infinite] hover:[animation-play-state:paused]">
          {[...tickerData, ...tickerData, ...tickerData].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 whitespace-nowrap px-4"
            >
              <span className="font-semibold text-foreground text-sm">{item.name}:</span>
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
