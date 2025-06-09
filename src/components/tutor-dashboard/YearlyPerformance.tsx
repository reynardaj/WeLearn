// components/YearlyPerformance.tsx
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
  name: string;    // e.g., "2024", "2025"
  sessions: number;
}

interface YearlyPerformanceProps {
  tutorId: string;
  startDate?: string;
  endDate?: string;
}

const YearlyPerformance: React.FC<YearlyPerformanceProps> = ({ tutorId, startDate, endDate }) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tutorId) {
      setError("Tutor ID is not provided.");
      setIsLoading(false);
      return;
    }

    const fetchYearlyData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let apiUrl = `/api/tutor-dashboard/performances/years?tutorId=${tutorId}`;
        
        if (startDate && endDate) {
          apiUrl += `&startDate=${startDate}&endDate=${endDate}`;
        }
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch yearly performance: ${response.statusText}`);
        }
        const data: ChartDataItem[] = await response.json();
        
        setChartData(data);

      } catch (err) {
        console.error("Fetch yearly performance error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchYearlyData();
  }, [tutorId, startDate, endDate]);

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex justify-center items-center">
        <TextLg>Loading yearly performance...</TextLg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] flex flex-col justify-center items-center text-red-500 p-4">
        <TextLg>Error loading data:</TextLg>
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

  const chartTitle = (startDate && endDate) 
    ? "Yearly Performance for Selected Range"
    : "Yearly Performance (Last 6 Years)";

  return (
    <div className="w-full h-[100%]">
      <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">{chartTitle}</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={chartData}
          // --- FIX IS HERE: Added margin prop ---
          margin={{
            top: 5,
            right: 30, // Gives space on the right for the last label
            left: 20,  // Gives space on the left for the Y-axis label
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="name" 
            angle={0}
            textAnchor="middle" 
            height={30}
            interval={0} 
            tick={{ fontSize: 12, fill: '#666' }} 
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

export default YearlyPerformance;