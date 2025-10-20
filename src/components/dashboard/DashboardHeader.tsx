import { TrendingUp, Bell, Wifi, User } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const DashboardHeader = () => {
  const navLinks = [
    { label: "Home", href: "/dashboard", active: true },
    { label: "Markets", href: "/markets" },
    { label: "Portfolio", href: "/portfolio" },
    { label: "Positions", href: "/positions" },
    { label: "Orders", href: "/orders" },
    { label: "Money", href: "/money" },
  ];

  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="px-6 py-3 flex items-center justify-between">
        {/* Left - Logo */}
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
        </Link>

        {/* Center - Navigation */}
        <nav className="flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className={`text-sm font-medium transition-colors relative ${
                link.active
                  ? "text-[#22c55e]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
              {link.active && (
                <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-[#22c55e]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Right - Status & Profile */}
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-xs flex items-center gap-2">
            <Wifi className="w-3 h-3" />
            Markets Closed
          </Badge>
          
          <button className="relative">
            <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Hi Mayuresh</span>
            <Avatar className="w-8 h-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                <User className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
};
