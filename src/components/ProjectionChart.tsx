"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ProjectionPoint } from "@/engine/projectionEngine";

type ProjectionChartProps = {
  points: ProjectionPoint[];
};

type ChartPoint = {
  label: string;
  totalBalance: number;
  retirement401kBalance: number;
  rothIRABalance: number;
  taxableBalance: number;
  emergencyFundBalance: number;
};

export function ProjectionChart({ points }: ProjectionChartProps) {
  const chartData: ChartPoint[] = points.map((point) => ({
    label: point.month === 0 ? "Now" : `${point.month}m`,
    totalBalance: point.totalBalance,
    retirement401kBalance:
      point.employee401kBalance + point.employerMatchBalance,
    rothIRABalance: point.rothIRABalance,
    taxableBalance: point.taxableBalance,
    emergencyFundBalance: point.emergencyFundBalance,
  }));

  return (
    <div className="h-[320px] w-full">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <LineChart data={chartData} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid
            vertical={false}
            stroke="#e2e8f0"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#64748b", fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            width={72}
            tick={{ fill: "#64748b", fontSize: 12 }}
            tickFormatter={(value) => formatCompactCurrency(Number(value))}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              borderColor: "#e2e8f0",
              boxShadow: "0 18px 50px rgba(15,23,42,0.08)",
            }}
            formatter={(value) => formatCurrency(Number(value ?? 0))}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", color: "#475569" }}
            iconType="circle"
          />
          <Line
            type="monotone"
            dataKey="totalBalance"
            name="Total Balance"
            stroke="#0f172a"
            strokeWidth={2.6}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="retirement401kBalance"
            name="401(k) Balance"
            stroke="#2563eb"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="rothIRABalance"
            name="Roth IRA Balance"
            stroke="#0f766e"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="taxableBalance"
            name="Taxable Balance"
            stroke="#ca8a04"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="emergencyFundBalance"
            name="Emergency Fund Balance"
            stroke="#64748b"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatCompactCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}
