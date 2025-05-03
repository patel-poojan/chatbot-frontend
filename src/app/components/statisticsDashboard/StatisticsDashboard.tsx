'use client';
import React, { useState, useMemo } from 'react';
import { Loader } from '@/app/components/Loader';
import useWindowDimensions from '@/utils/windowSize';
import { StatisticsDataItem } from './Components/types';
import { processStatisticsData } from './Components/dataProcessing';
import StatCards from './Components/StateCards';
import DistributionChart from './Components/DistributionChart';
import RequestsVsUsageChart from './Components/RequestsVsUsageChart';
import ChatbotPerformance from './Components/ChatbotPerformance';
import RecentSessions from './Components/RecentSessions';
import { IoSearchSharp } from 'react-icons/io5';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const StatisticsDashboard = ({
  rawStatisticsData,
  isLoading,
  type,
}: {
  rawStatisticsData: StatisticsDataItem[];
  isLoading: boolean;
  type: 'user' | 'admin';
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const [viewMode, setViewMode] = useState<'top5' | 'all'>('top5');
  const [searchTerms, setSearchTerms] = useState('');
  const [dateFilter, setDateFilter] = useState('30days');

  // Use the mock data for development or the fetched data in production
  const dataSource = rawStatisticsData as StatisticsDataItem[];

  // Filter data based on search terms (chatbot name)
  const filteredData = useMemo(() => {
    if (!searchTerms.trim()) return dataSource;

    return dataSource.filter((item) =>
      item.chatbot?.name.toLowerCase().includes(searchTerms.toLowerCase())
    );
  }, [dataSource, searchTerms]);

  // Date filtering logic (static for now as requested)
  // In a real implementation, this would filter based on actual dates
  // But for now, we're just passing through the filtered data

  // Process the filtered statistics data
  const stats = processStatisticsData(filteredData);
  console.log('kp:', stats);

  return (
    <div className='flex flex-col h-full overflow-y-auto p-4 md:p-6 bg-gray-50'>
      {isLoading && <Loader />}
      <div className='flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6'>
        <div>
          <h1 className='text-xl md:text-2xl font-bold text-indigo-900'>
            {type === 'user' ? 'User Dashboard' : 'Admin Dashboard'}
          </h1>
          <p className='text-sm md:text-base text-indigo-700/70'>
            Overview of your ChatAgent performance
          </p>
        </div>

        <div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-3 md:mt-0'>
          {/* Search Bar - Matching the design in Image 1 & 2 */}
          <div className='flex items-center h-12 px-4 rounded-lg bg-white shadow-sm border border-gray-100 w-full sm:w-auto'>
            <IoSearchSharp className='text-primary-600 mr-2' />
            <Input
              onChange={(e) => setSearchTerms(e.target.value)}
              className='w-full sm:w-44 border-none shadow-none text-gray-600 placeholder:text-gray-400 bg-transparent focus-visible:ring-0 placeholder:font-normal text-base'
              type='text'
              placeholder='Search chatbots'
            />
          </div>

          {/* Date Filter Dropdown - Matching the design in Image 1 & 2 */}
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className='h-12 w-full sm:w-[180px] bg-white shadow-sm border border-gray-100 text-gray-600 rounded-lg px-4 justify-between'>
              <SelectValue placeholder='Select period' />
            </SelectTrigger>
            <SelectContent className='bg-white border border-gray-100 shadow-md rounded-lg'>
              <SelectItem value='30days'>Last 30 days</SelectItem>
              <SelectItem value='1year'>Last 1 year</SelectItem>
              <SelectItem value='all'>All time</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
      <RecentSessions
        data={
          searchTerms.trim()
            ? stats.sessionsData.filter((session) =>
                // Get all chatbot names from filtered data
                filteredData
                  .map((item) => item.chatbot?.name)
                  .includes(session.chatbotName)
              )
            : stats.sessionsData
        }
      />
    </div>
  );
};

export default StatisticsDashboard;
