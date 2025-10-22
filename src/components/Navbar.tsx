import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon, TrendingUp, User, Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NavbarProps {
  activeLink?: string;
}

const Navbar = ({ activeLink }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

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
            {/* Notifications */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full relative transition-theme hover:bg-accent"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 text-primary" />
                  {notifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-2">
                  <h3 className="font-semibold">Notifications</h3>
                  {notifications.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-4 text-center">
                      No new notifications
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notif, index) => (
                        <div key={index} className="text-sm p-2 bg-muted rounded">
                          {notif}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* Theme Toggle */}
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

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full transition-theme hover:bg-accent"
                  aria-label="Profile menu"
                >
                  <User className="h-5 w-5 text-primary" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  My Profile on ProStock
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/login")}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
