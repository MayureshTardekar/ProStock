import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { TradingProvider } from "@/contexts/TradingContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Analytics from "./pages/Analytics";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Markets from "./pages/Markets";
import Money from "./pages/Money";
import NotFound from "./pages/NotFound";
import Orders from "./pages/Orders";
import Portfolio from "./pages/Portfolio";
import Profile from "./pages/Profile";
import Register from "./pages/Register";
import Stocks from "./pages/Stocks";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <NotificationProvider>
      <TradingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/home" element={<Home />} />
              <Route path="/stocks" element={<Stocks />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/money" element={<Money />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/analytics" element={<Analytics />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </TradingProvider>
    </NotificationProvider>
  </QueryClientProvider>
);

export default App;
