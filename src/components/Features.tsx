import { TrendingUp, PieChart, Wallet, DollarSign } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: TrendingUp,
      title: "Real-time Stock Tracking",
      description: "Track your investments in real-time with up-to-the-minute data.",
    },
    {
      icon: PieChart,
      title: "F&O Analysis",
      description: "Analyze futures and options with our advanced tools.",
    },
    {
      icon: Wallet,
      title: "Mutual Fund Management",
      description: "Manage your mutual fund portfolio with ease.",
    },
    {
      icon: DollarSign,
      title: "Competitive Pricing",
      description: "Get the best pricing in the market.",
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage your investments effectively
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
