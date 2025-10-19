import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, BarChart3, PieChart } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center gradient-hero transition-theme pt-20 px-4">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto text-center">
          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent">
              Invest Smart.
            </span>
            <br />
            <span className="text-foreground">Manage Smarter with ProStock.</span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Track your Stocks, FnO, and Mutual Funds in one intuitive platform.
          </p>

          {/* CTA Button */}
          <Button 
            size="lg" 
            className="gradient-primary text-white font-bold px-8 py-6 rounded-full text-lg shadow-elegant hover:shadow-lg transition-all group mb-12"
          >
            Get Started
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          {/* Animation Placeholder with icons */}
          <div className="relative max-w-2xl mx-auto">
            <div 
              id="stock-animation" 
              className="h-64 w-full rounded-2xl bg-card/50 backdrop-blur-sm border border-border shadow-elegant flex items-center justify-center gap-8 transition-theme overflow-hidden"
            >
              {/* Decorative animated icons */}
              <div className="absolute inset-0 flex items-center justify-center gap-12 opacity-30">
                <TrendingUp className="h-20 w-20 text-primary animate-pulse" style={{ animationDelay: '0s' }} />
                <BarChart3 className="h-24 w-24 text-primary animate-pulse" style={{ animationDelay: '0.3s' }} />
                <PieChart className="h-20 w-20 text-primary animate-pulse" style={{ animationDelay: '0.6s' }} />
              </div>
              
              {/* Placeholder text */}
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-primary/10 border border-primary/20">
                  <div className="h-3 w-3 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-sm font-medium text-primary">Live Market Animation</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
