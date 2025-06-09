"use client";

import React, { useState, useEffect, useMemo } from 'react';
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

const YearlyEarning: React.FC<EarningChartProps> = ({ tutorId, startDate, endDate }) => {
  const [chartData, setChartData] = useState<ChartDataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tutorId) {
      setError("Tutor ID is not provided.");
      setIsLoading(false);
      return;
    }

    const fetchYearlyEarnings = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let apiUrl = `/api/tutor-dashboard/earning/years?tutorId=${tutorId}`;
        
        if (startDate && endDate && (new Date(endDate) >= new Date(startDate))) {
            apiUrl += `&startDate=${startDate}&endDate=${endDate}`;
        }
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch yearly earnings: ${response.statusText}`);
        }
        const data: ChartDataItem[] = await response.json();
        setChartData(data);
      } catch (err) {
        console.error("Fetch yearly earnings error:", err);
        setError(err instanceof Error ? err.message : "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchYearlyEarnings();
  }, [tutorId, startDate, endDate]);
  
  const yAxisConfig = useMemo(() => {
    if (chartData.length === 0) {
        return { domain: [0, 10000000], ticks: [0, 2500000, 5000000, 7500000, 10000000] };
    }
    const maxEarning = Math.max(...chartData.map(item => item.earning), 0);
    if (maxEarning === 0) {
        return { domain: [0, 1000000], ticks: [0, 250000, 500000, 750000, 1000000] };
    }
    const topDomain = Math.ceil(maxEarning / 5000000) * 5000000;
    const ticks = [0, topDomain * 0.25, topDomain * 0.5, topDomain * 0.75, topDomain];
    return { domain: [0, topDomain], ticks };
  }, [chartData]);


  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <TextLg>Loading Yearly Earnings...</TextLg>
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
  
  const chartTitle = (startDate && endDate)
    ? `Yearly Earnings for Selected Range`
    : `Yearly Earnings (Last 6 Years)`;

  return (
    <div className="w-full h-full flex flex-col">
      <TextLg className="text-xl font-semibold text-gray-700 mb-2 text-center flex-shrink-0">
        {chartTitle}
      </TextLg>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 35, bottom: 5 }} 
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis 
            dataKey="name" 
            angle={0}
            textAnchor="middle" 
            height={30}
            interval="preserveStartEnd" 
            tick={{ fontSize: 12, fill: '#666' }} 
          />
          <YAxis 
            domain={yAxisConfig.domain}
            ticks={yAxisConfig.ticks}
            tickFormatter={(value) => `Rp${value / 1000000}M`}
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

export default YearlyEarning;