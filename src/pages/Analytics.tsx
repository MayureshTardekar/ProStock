import { PnLChart } from "@/components/analytics/PnLChart";
import { StatCard } from "@/components/analytics/StatCard";
import { TradePerformanceTable } from "@/components/analytics/TradePerformanceTable";
import { WinRatePieChart } from "@/components/analytics/WinRatePieChart";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/utils/format";
import { BarChart2, DollarSign, Percent, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function Analytics() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [pnlHistory, setPnlHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("prostock_token");
        if (!token) {
          toast({ title: "Please login to view analytics", variant: "destructive" });
          navigate("/");
          return;
        }

        const headers = { Authorization: `Bearer ${token}` };

        const [statsRes, pnlRes] = await Promise.all([
          fetch(`${API_URL}/api/analytics/stats`, { headers }),
          fetch(`${API_URL}/api/analytics/pnl-history`, { headers })
        ]);

        if (!statsRes.ok || !pnlRes.ok) throw new Error("Failed to fetch analytics data");

        const statsData = await statsRes.json();
        const pnlData = await pnlRes.json();

        setStats(statsData);
        setPnlHistory(pnlData);
      } catch (error) {
        console.error("Analytics fetch error:", error);
        toast({ title: "Error loading analytics", description: "Could not fetch performance data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [navigate, toast]);

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10 rounded-full" />
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 pb-24">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Performance Analytics
        </h1>
        <p className="text-muted-foreground">
          Track your trading performance and metrics
        </p>
      </div>

      {/* WIP Alert */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3">
        <div className="p-1 bg-yellow-500/20 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        </div>
        <div>
          <h3 className="font-semibold text-yellow-500">Work in Progress</h3>
          <p className="text-sm text-yellow-500/90 mt-1">
            This feature is currently under development. Some metrics may be inaccurate or incomplete.
          </p>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Net P&L" 
          value={formatCurrency(stats?.overview?.netPnL || 0)} 
          icon={DollarSign}
          trend={stats?.overview?.netPnL >= 0 ? 'up' : 'down'}
          trendValue={stats?.overview?.netPnL >= 0 ? 'Profit' : 'Loss'}
        />
        <StatCard 
          title="Win Rate" 
          value={`${stats?.overview?.winRate?.toFixed(1) || '0.0'}%`} 
          icon={Percent}
          description={`${stats?.overview?.winningTrades || 0} wins / ${stats?.overview?.totalTrades || 0} trades`}
        />
        <StatCard 
          title="Total Profit" 
          value={formatCurrency(stats?.overview?.totalProfit || 0)} 
          icon={TrendingUp}
          trend="up"
        />
        <StatCard 
          title="Total Loss" 
          value={formatCurrency(stats?.overview?.totalLoss || 0)} 
          icon={BarChart2}
          trend="down"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <PnLChart data={pnlHistory || []} />
        <WinRatePieChart 
          winningTrades={stats?.overview?.winningTrades || 0} 
          losingTrades={stats?.overview?.losingTrades || 0} 
        />
      </div>

      {/* Trade Performance */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Trade Highlights</h2>
        <TradePerformanceTable 
          bestTrade={stats?.bestTrade || null} 
          worstTrade={stats?.worstTrade || null} 
        />
      </div>
    </div>
  );
}
