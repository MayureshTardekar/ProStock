import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sun, Moon, TrendingUp, User, Bell, CheckCheck, Trash2 } from "lucide-react";
import { useNotifications } from "@/contexts/NotificationContext";
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
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

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

  // Check if on landing, login, or register page
  const isAuthPage = location.pathname === "/" || location.pathname === "/login" || location.pathname === "/register";

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

          {/* Center Navigation - Hidden on mobile and auth pages */}
          {!isAuthPage && (
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
              <span className="text-foreground/40 cursor-not-allowed transition-colors font-medium" title="Coming Soon">
                FnO
              </span>
              <span className="text-foreground/40 cursor-not-allowed transition-colors font-medium" title="Coming Soon">
                Mutual Funds
              </span>
              <a href="#pricing" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                Pricing
              </a>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center gap-3 sm:gap-4">
            {isAuthPage ? (
              /* Auth Pages (Landing/Login/Register): Show Login/Register buttons */
              <>
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
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  onClick={() => navigate("/register")}
                  className="gradient-primary"
                >
                  Register
                </Button>
              </>
            ) : (
              /* Other Pages: Show notifications, theme, and profile */
              <>
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
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-96" align="end">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Notifications</h3>
                        {notifications.length > 0 && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={markAllAsRead}
                              className="h-7 text-xs"
                            >
                              <CheckCheck className="h-3 w-3 mr-1" />
                              Mark all read
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={clearNotifications}
                              className="h-7 text-xs text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Clear
                            </Button>
                          </div>
                        )}
                      </div>
                      {notifications.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-8 text-center">
                          No notifications yet
                        </p>
                      ) : (
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                          {notifications.slice(0, 10).map((notif) => {
                            const getNotifIcon = () => {
                              switch (notif.type) {
                                case "BUY":
                                  return "📈";
                                case "SELL":
                                  return "📉";
                                case "DEPOSIT":
                                  return "💰";
                                case "WITHDRAW":
                                  return "💸";
                                default:
                                  return "ℹ️";
                              }
                            };

                            const getNotifColor = () => {
                              switch (notif.type) {
                                case "BUY":
                                  return "border-green-500/20 bg-green-500/5";
                                case "SELL":
                                  return "border-red-500/20 bg-red-500/5";
                                case "DEPOSIT":
                                  return "border-blue-500/20 bg-blue-500/5";
                                case "WITHDRAW":
                                  return "border-orange-500/20 bg-orange-500/5";
                                default:
                                  return "border-border bg-muted/30";
                              }
                            };

                            return (
                              <div
                                key={notif.id}
                                className={`text-sm p-3 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                                  getNotifColor()
                                } ${
                                  !notif.read ? "font-medium" : "opacity-70"
                                }`}
                                onClick={() => markAsRead(notif.id)}
                              >
                                <div className="flex items-start gap-2">
                                  <span className="text-lg">{getNotifIcon()}</span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm break-words">{notif.message}</p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {new Date(notif.timestamp).toLocaleString('en-IN', {
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </p>
                                  </div>
                                  {!notif.read && (
                                    <span className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                          {notifications.length > 10 && (
                            <p className="text-xs text-muted-foreground text-center py-2">
                              Showing 10 of {notifications.length} notifications
                            </p>
                          )}
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
