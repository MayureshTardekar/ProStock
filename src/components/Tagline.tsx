import { Shield } from "lucide-react";

const Tagline = () => {
  return (
    <section className="py-16 border-t border-b border-border bg-card/30 transition-theme">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-3">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center">
            <span className="text-foreground">Trusted by Traders. </span>
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Built for Performance.
            </span>
          </h2>
          <Shield className="h-6 w-6 text-primary" />
        </div>
      </div>
    </section>
  );
};

export default Tagline;
