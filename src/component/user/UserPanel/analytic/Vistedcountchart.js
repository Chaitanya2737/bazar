"use client";
import { useMemo } from "react";
import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export function ChartBarDefault({ data = [] }) {
  console.log("Chart Data Input:", data);

  const parseDate = (str) => {
    const year = Number(str.slice(0, 4));
    const month = Number(str.slice(4, 6)) - 1;
    const day = Number(str.slice(6, 8));
    return new Date(year, month, day);
  };

  const chartData = useMemo(
    () =>
      data.map((item) => ({
        day: parseDate(item.date).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
        }),
        views: item.views,
      })),
    [data]
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

  return (
    <Card className="w-full">
      <CardHeader className="px-6 pt-6 pb-0 space-y-1">
        <CardTitle>Daily Visitors</CardTitle>
        <CardDescription>Showing views per day</CardDescription>
      </CardHeader>
      <CardContent className="px-6 space-y-4">
        <div className="overflow-x-auto">
          <div className="min-w-full h-[300px] lg:h-[400px]">
            <ChartContainer config={{}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" tickLine={false} tickMargin={10} axisLine={false} />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="views" fill="#3b82f6" radius={8} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
