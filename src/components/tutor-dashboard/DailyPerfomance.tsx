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

interface DailyPerformanceProps  {
  tutorId: string;
  startDate: string;
  endDate: string;
}

const DailyPerformance: React.FC<DailyPerformanceProps > = ({ tutorId, startDate, endDate }) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [effectiveStartDate, setEffectiveStartDate] = useState<string | undefined>(startDate);
  const [effectiveEndDate, setEffectiveEndDate] = useState<string | undefined>(endDate);

  useEffect(() => {
    if (!tutorId) {
      setError("Tutor ID is not provided.");
      setIsLoading(false);
      return;
    }

    const fetchDailyData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let apiUrl = `/api/tutor-dashboard/performances/days?tutorId=${tutorId}`;
        if (effectiveStartDate && effectiveEndDate) {
         apiUrl += `&startDate=${effectiveStartDate}&endDate=${effectiveEndDate}`;
        } else if (effectiveStartDate) {
           apiUrl += `&startDate=${effectiveStartDate}`;
        }
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch daily performance: ${response.statusText}`);
        }
        const data: ChartDataItem[] = await response.json();
        
        setChartData(data);

      } catch (err) {
        console.error("Fetch daily performance error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyData();
  }, [tutorId, effectiveStartDate, effectiveEndDate]); // Re-fetch if dates change

  // Update effective dates when props change
  useEffect(() => {
    setEffectiveStartDate(startDate);
  }, [startDate]);

  useEffect(() => {
    setEffectiveEndDate(endDate);
  }, [endDate]);

  if (isLoading) {
    return (
      <div className="w-full h-[300px] flex justify-center items-center">
        <TextLg>Loading Daily performance...</TextLg>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[300px] flex flex-col justify-center items-center text-red-500 p-4">
        <TextMd>{error}</TextMd>
      </div>
    );
  }

  if (chartData.length === 0 && !isLoading) { 
    return (
      <div className="w-full h-[300px] flex justify-center items-center text-gray-500">
        <TextLg>No session data available to display for this week.</TextLg>
      </div>
    );
  }

  let chartTitle = "Daily Earnings";
  const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });


  if (startDate && endDate) {
    chartTitle = `Daily Session: ${formatDate(new Date(startDate + 'T00:00:00'))} - ${formatDate(new Date(endDate + 'T00:00:00'))}`;
  } else {
    const currentWeekDate = new Date();
    const firstDayOfWeek = new Date(new Date().setDate(currentWeekDate.getDate() - currentWeekDate.getDay() + (currentWeekDate.getDay() === 0 ? -6 : 1)));
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
    chartTitle = `Daily Session: ${formatDate(firstDayOfWeek)} - ${formatDate(lastDayOfWeek)}, ${firstDayOfWeek.getFullYear()}`;
  }

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

export default DailyPerformance;