// components/MonthlyPerformance.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { 
  LineChart, // Changed from BarChart
  Line,      // Changed from Bar
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { TextLg, TextMd } from "@/components/Text";

interface ChartDataItem {
  name: string;    // e.g., "Jan 2024"
  sessions: number;
}

interface MonthlyPerformanceProps {
  tutorId: string;
}

const MonthlyPerformance: React.FC<MonthlyPerformanceProps> = ({ tutorId }) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tutorId) {
      setError("Tutor ID is not provided.");
      setIsLoading(false);
      return;
    }

    const fetchMonthlyData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/tutor-dashboard/performances/months?tutorId=${tutorId}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch monthly performance: ${response.statusText}`);
        }
        const data: ChartDataItem[] = await response.json();
        
        if (data.length === 0) {
          setChartData([]);
        } else {
          setChartData(data);
        }

      } catch (err) {
        console.error("Fetch monthly performance error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlyData();
  }, [tutorId]);

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex justify-center items-center">
        <TextLg>Loading monthly performance...</TextLg>
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

  if (chartData.length === 0) {
    return (
      <div className="w-full h-[300px] flex justify-center items-center text-gray-500">
        <TextLg>No session data available for this period.</TextLg>
      </div>
    );
  }

  return (
    <div className="w-full h-[100%]">
      <h2 className="text-xl font-semibold text-gray-700 mb-2 text-center">Monthly Session Performance</h2>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart // Changed from BarChart
          data={chartData}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="name" 
            angle={-30}
            textAnchor="end" 
            height={50}
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
          />
          <Line // Changed from Bar
            type="monotone" // For a smooth line, similar to your example image
            dataKey="sessions" 
            name="Sessions" // Name for the legend and tooltip
            stroke="#1F65A6" // Line color
            strokeWidth={2.5}  // Line thickness
            dot={{ r: 5, stroke: '#1F65A6', strokeWidth: 1, fill: '#fff' }} // Style for points on the line
            activeDot={{ r: 7, stroke: '#1F65A6', strokeWidth: 2, fill: '#fff' }} // Style for hovered points
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyPerformance;