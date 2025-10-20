import { TrendingUp, Bell, Wifi, User, Moon, Sun } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export const DashboardHeader = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const navLinks = [
    { label: "Home", href: "/dashboard", active: true },
    { label: "Markets", href: "/markets" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Positions", href: "/positions" },
    { label: "Orders", href: "/orders" },
    { label: "Money", href: "/money" },
  ];

  return (
    <header className="bg-card border-b border-border shadow-nav sticky top-0 z-50 transition-theme">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left - Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">ProStock</h1>
        </Link>

        {/* Center - Navigation */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`text-sm font-medium transition-colors relative ${
                link.active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
              {link.active && (
                <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-primary" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right - Status & Profile */}
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-xs flex items-center gap-2 bg-destructive/10 text-destructive border-destructive/20">
            <Wifi className="w-3 h-3" />
            Markets Closed
          </Badge>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === 'light' ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </Button>
          
          <button className="relative p-2 hover:bg-accent rounded-full transition-colors">
            <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Hi Mayuresh</span>
            <Avatar className="w-8 h-8 ring-2 ring-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="gradient-primary text-primary-foreground">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};
