// components/WeeklyPerformance.tsx
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
  sessions: number;
}

// Corrected interface name
interface WeeklyPerformanceProps  {
  tutorId: string;
  startDate?: string;
  endDate?: string;
}

const WeeklyPerformance: React.FC<WeeklyPerformanceProps> = ({ tutorId, startDate, endDate }) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tutorId) {
      setError("Tutor ID is not provided.");
      setIsLoading(false);
      return;
    }

    const fetchWeeklyData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let apiUrl = `/api/tutor-dashboard/performances/weeks?tutorId=${tutorId}`;
        
        // If start and end dates are provided, add them to the API query
        if (startDate && endDate) {
          apiUrl += `&startDate=${startDate}&endDate=${endDate}`;
        }
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch weekly performance: ${response.statusText}`);
        }
        const data: ChartDataItem[] = await response.json();
        
        setChartData(data);

      } catch (err) {
        console.error("Fetch weekly performance error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyData();
  }, [tutorId, startDate, endDate]); // Re-fetch when props change

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex justify-center items-center">
        <TextLg>Loading Weekly performance...</TextLg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] flex flex-col justify-center items-center text-red-500 p-4">
        {/* Simplified error display */}
        <TextLg>Error loading data</TextLg>
        <TextMd>{error}</TextMd>
      </div>
    );
  }

  if (chartData.length === 0 && !isLoading) {
    return (
      <div className="w-full h-[300px] flex justify-center items-center text-gray-500">
        <TextLg>No session data available for this period.</TextLg>
      </div>
    );
  }

  // Dynamic title based on whether a custom date range is used
  const chartTitle = (startDate && endDate) 
    ? "Weekly Performance for Selected Range"
    : `Weekly Performance for ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;


  return (
    <div className="w-full h-[100%]">
      <TextLg className="text-xl font-semibold text-gray-700 mb-2 text-center">{chartTitle}</TextLg>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={chartData}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="name" 
            angle={-30}
            textAnchor="end" 
            height={60}
            interval={0} 
            tick={{ fontSize: 10, fill: '#666' }}
          />
          <YAxis 
            allowDecimals={false} 
            tick={{ fontSize: 12, fill: '#666' }}
            label={{ value: 'Number of Sessions', angle: -90, position: 'insideLeft', fill: '#555', style: {fontSize: '14px', textAnchor: 'middle'} }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '8px', borderColor: '#ccc' }}
            labelStyle={{ fontWeight: 'bold', color: '#333' }}
            itemStyle={{ color: '#1F65A6' }}
            formatter={(value: number) => [`${value} sessions`, "Sessions"]}
          />
          {/* <Legend />  <-- REMOVED as requested */ }
          <Line
            type="monotone"
            dataKey="sessions" 
            name="Sessions"
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

// Corrected the export to match the component name
export default WeeklyPerformance;