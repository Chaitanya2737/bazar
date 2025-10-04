"use client";

import { TrendingUp } from "lucide-react";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function ChartBarDefault({ data }) {
  const parseDate = (str) => {
    const year = Number(str.slice(0, 4));
    const month = Number(str.slice(4, 6)) - 1;
    const day = Number(str.slice(6, 8));
    return new Date(year, month, day);
  };

  const chartData = useMemo(
    () =>
      data?.views?.daily?.map((item) => ({
        day: parseDate(item.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        }),
        desktop: item.views,
      })) || [],
    [data?.views?.daily]
  );

  if (!chartData.length) {
    return (
      <Card className="p-4">
        <CardHeader>
          <CardTitle>Daily Visitors</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const chartConfig = {
    desktop: {
      label: "Daily Visitors",
      color: "var(--chart-1)",
    },
  };

  return (
    <Card className="w-full">
      <CardHeader className="px-6 pt-6 pb-0 space-y-1">
        <CardTitle>Daily Visitors</CardTitle>
        <CardDescription>Showing views per day</CardDescription>
      </CardHeader>
      <CardContent className="px-6 space-y-4">
        {/* Scrollable container for wide charts */}
        <div className="overflow-x-auto">
          <div
            className="w-max h-[300px] lg:h-[50vh]"
            style={{ minWidth: chartData.length * 50 }} // 60px per bar, adjust if needed
          >
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="desktop" fill="var(--color-desktop)" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
