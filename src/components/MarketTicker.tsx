const MarketTicker = () => {
  const tickerData = [
    { name: "NIFTY 50", price: "24,180.80", change: "+0.65%", isPositive: true },
    { name: "Reliance", price: "1,416.80", change: "+1.32%", isPositive: true },
    { name: "HDFC Bank", price: "1,002.55", change: "+0.82%", isPositive: true },
    { name: "Bharti Airtel", price: "2,012.00", change: "+2.27%", isPositive: true },
    { name: "TCS", price: "3,456.20", change: "-0.45%", isPositive: false },
    { name: "Infosys", price: "1,789.30", change: "+1.15%", isPositive: true },
  ];

  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-b border-border shadow-sm transition-theme">
      <div className="overflow-hidden py-2">
        <div className="flex gap-8 animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused]">
          {[...tickerData, ...tickerData].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2 whitespace-nowrap px-4"
            >
              <span className="font-semibold text-foreground">{item.name}:</span>
              <span className="text-foreground/90">{item.price}</span>
              <span
                className={`font-medium ${
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
