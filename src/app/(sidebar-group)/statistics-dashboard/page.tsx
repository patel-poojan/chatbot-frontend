'use client';
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader } from '@/app/components/Loader';
import { axiosInstance } from '@/utils/axiosInstance';
import useWindowDimensions from '@/utils/windowSize';
import { StatisticsDataItem } from './Components/types';
import { processStatisticsData } from './Components/dataProcessing';
import StatCards from './Components/StateCards';
import DistributionChart from './Components/DistributionChart';
import RequestsVsUsageChart from './Components/RequestsVsUsageChart';
import ChatbotPerformance from './Components/ChatbotPerformance';
import RecentSessions from './Components/RecentSessions';

const StatisticsDashboard: React.FC = () => {
  const { width: screenWidth } = useWindowDimensions();
  const [viewMode, setViewMode] = useState<'top5' | 'all'>('top5');

  // Fetch statistics data
  const fetchStatistics = async () => {
    const response = await axiosInstance.get('/metrics');
    return response.data;
  };

  const {
    data: rawStatisticsData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['fetch', 'statistics'],
    queryFn: fetchStatistics,
  });

  // Show error toast if data fetching fails
  useEffect(() => {
    if (isError) {
      toast.error('Failed to fetch statistics data. Please try again later.');
    }
  }, [isError]);

  // Use the mock data for development or the fetched data in production
  const dataSource = rawStatisticsData as StatisticsDataItem[];

  // Process the statistics data
  const stats = processStatisticsData(dataSource);

  return (
    <div className='flex flex-col h-full overflow-y-auto p-4 md:p-6 bg-gray-50'>
      {isLoading && <Loader />}
      <div className='mb-4 md:mb-6'>
        <h1 className='text-xl md:text-2xl font-bold text-indigo-900'>
          Statistics Dashboard
        </h1>
        <p className='text-sm md:text-base text-indigo-700/70'>
          Overview of your ChatAgent performance
        </p>
      </div>

      {/* Stats Cards */}
      <StatCards stats={stats} />

      {/* Charts Section */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6'>
        {/* ChatAgent Distribution */}
        <DistributionChart
          data={stats.chatbotDistributionData}
          totalRequests={stats.totalRequests}
          screenWidth={screenWidth}
        />

        {/* Requests vs Usage Time */}
        <RequestsVsUsageChart
          data={stats.chatbotStats}
          screenWidth={screenWidth}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      </div>

      {/* Bot Performance */}
      <ChatbotPerformance data={stats.chatbotStats} />

      {/* Sessions Table */}
      <RecentSessions data={stats.sessionsData} />
    </div>
  );
};

export default StatisticsDashboard;
