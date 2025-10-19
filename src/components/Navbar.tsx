import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon, TrendingUp } from "lucide-react";

interface NavbarProps {
  activeLink?: string;
}

const Navbar = ({ activeLink }: NavbarProps) => {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (theme === "dark" || (!theme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-nav transition-theme">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <TrendingUp className="w-7 h-7 text-primary" />
            <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              ProStock
            </span>
          </Link>

          {/* Center Navigation - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/stocks" 
              className={`transition-colors font-medium ${
                activeLink === 'stocks' || location.pathname === '/stocks'
                  ? 'text-primary font-semibold' 
                  : 'text-foreground/80 hover:text-primary'
              }`}
            >
              Stocks
            </Link>
            <a href="#fno" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              FnO
            </a>
            <a href="#mutual-funds" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Mutual Funds
            </a>
            <a href="#pricing" className="text-foreground/80 hover:text-primary transition-colors font-medium">
              Pricing
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full transition-theme hover:bg-accent"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-primary" />
              ) : (
                <Moon className="h-5 w-5 text-primary" />
              )}
            </Button>
            
            <Link to="/login">
              <Button className="gradient-primary text-white font-semibold px-4 sm:px-6 rounded-full shadow-elegant transition-theme hover:shadow-lg">
                Login / Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
