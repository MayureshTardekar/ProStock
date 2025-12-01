import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface WinRatePieChartProps {
  winningTrades: number;
  losingTrades: number;
}

export const WinRatePieChart = ({ winningTrades, losingTrades }: WinRatePieChartProps) => {
  const data = [
    { name: 'Winning', value: winningTrades, color: '#10b981' },
    { name: 'Losing', value: losingTrades, color: '#ef4444' },
  ];

  const total = winningTrades + losingTrades;
  const winRate = total > 0 ? ((winningTrades / total) * 100).toFixed(1) : "0.0";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Win Rate ({winRate}%)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {total > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No trades yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
