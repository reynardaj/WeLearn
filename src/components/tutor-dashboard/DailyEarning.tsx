// components/tutor-dashboard-performance/DailyEarning.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts';
import { TextLg, TextMd } from "@/components/Text";

interface ChartDataItem {
  name: string;
  earning: number;
}

interface EarningChartProps {
  tutorId: string;
  startDate?: string;
  endDate?: string;
}

const DailyEarning: React.FC<EarningChartProps> = ({ tutorId, startDate, endDate }) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tutorId) {
      setError("Tutor ID is not provided.");
      setIsLoading(false);
      return;
    }

    const fetchDailyEarnings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let apiUrl = `/api/tutor-dashboard/earning/days?tutorId=${tutorId}`;
        
        if (startDate && endDate && (new Date(endDate) >= new Date(startDate))) {
            apiUrl += `&startDate=${startDate}&endDate=${endDate}`;
        }
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch daily earnings: ${response.statusText}`);
        }
        const data: ChartDataItem[] = await response.json();
        setChartData(data);
      } catch (err) {
        console.error("Fetch daily earnings error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyEarnings();
  }, [tutorId, startDate, endDate]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <TextLg>Loading Daily Earnings...</TextLg>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-red-500 p-4">
        <TextLg>Error loading earnings data:</TextLg>
        <TextMd>{error}</TextMd>
      </div>
    );
  }
  
  if (chartData.length === 0 && !isLoading) { 
    return (
      <div className="w-full h-full flex justify-center items-center text-gray-500">
        <TextLg>No earnings data available for this period.</TextLg>
      </div>
    );
  }
  
  let chartTitle = "Daily Earnings";
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  if (startDate && endDate) {
    chartTitle = `Daily Earnings: ${formatDate(new Date(startDate + 'T00:00:00'))} - ${formatDate(new Date(endDate + 'T00:00:00'))}`;
  } else {
    const currentWeekDate = new Date();
    const firstDayOfWeek = new Date(new Date().setDate(currentWeekDate.getDate() - currentWeekDate.getDay() + (currentWeekDate.getDay() === 0 ? -6 : 1)));
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    chartTitle = `Daily Earnings: ${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}, ${firstDayOfWeek.getFullYear()}`;
  }


  return (
    <div className="w-full h-full flex flex-col">
      <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center flex-shrink-0">
        {chartTitle}
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          // FIX: Increased left margin to give Y-axis label more space
          margin={{ top: 5, right: 30, left: 15, bottom: 5 }} 
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="name" 
            angle={-30}
            textAnchor="end" 
            height={70}
            interval={0} 
            tick={{ fontSize: 11, fill: '#555' }} 
          />
          <YAxis 
            domain={[0, 500000]}
            ticks={[0, 100000, 200000, 300000, 400000, 500000]}
            tickFormatter={(value) => `Rp${value / 1000}k`}
            tick={{ fontSize: 14, fill: '#666' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', borderColor: '#ccc' }}
            labelStyle={{ fontWeight: 'bold', color: '#333' }}
            itemStyle={{ color: '#1F65A6' }}
            formatter={(value: number) => [`Rp ${value.toLocaleString()}`, "Earning"]}
          />
          <Line
            type="monotone"
            dataKey="earning"
            name="Earning"
            stroke="#1F65A6"
            strokeWidth={2.5}
            dot={{ r: 5, stroke: '#1F65A6', strokeWidth: 1, fill: '#fff' }}
            activeDot={{ r: 7, stroke: '#1F65A6', strokeWidth: 2, fill: '#fff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailyEarning;
