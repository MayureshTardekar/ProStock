import { TrendingUp, Bell, Wifi, User, Moon, Sun, CheckCheck, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const DashboardHeader = () => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();

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
          <TrendingUp className="w-7 h-7 text-primary" />
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
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative p-2 hover:bg-accent rounded-full transition-colors">
                <Bell className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-white text-[10px] rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
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

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span className="text-sm font-medium">Hi Mayuresh</span>
                <Avatar className="w-8 h-8 ring-2 ring-primary/20 cursor-pointer">
                  <AvatarImage src="" />
                  <AvatarFallback className="gradient-primary text-primary-foreground">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                <User className="mr-2 h-4 w-4" />
                My Profile on ProStock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/login")}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
