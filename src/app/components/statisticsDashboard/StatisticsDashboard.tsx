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
import DashboardFilters from './Components/DashboardFilters';

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
  const [searchTerms, setSearchTerms] = useState('');
  const [dateFilter, setDateFilter] = useState('30days');
  const [selectedCreator, setSelectedCreator] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  // Use the mock data for development or the fetched data in production
  const dataSource = rawStatisticsData as StatisticsDataItem[];
  // const dataSource = [
  //   {
  //     _id: '6813e1adbe8445b88f19db09',
  //     chatbotId: '6813c8b0c5c84206f2e9b3a5',
  //     userId: '680be9fffae3f02949298b92',
  //     data: {
  //       'fff679dd-c6f8-4543-9001-93ac305db88f': {
  //         chatbotAPIRequests: [1, 1, 1, 1],
  //         totalChatbotAPIRequests: 4,
  //         averageChatbotAPIRequests: 1,
  //         chatbotUsedTime: [0, 0, 0, 0],
  //         totalChatbotUsedTime: 0,
  //         visitedWebsiteCount: 4,
  //         pageVisitedCount: {
  //           'Create Next App': {
  //             title: 'Create Next App',
  //             url: 'http://localhost:3000/',
  //             count: 1,
  //           },
  //         },
  //         createdAt: '2025-05-03T15:59:11.229Z',
  //         updatedAt: '2025-05-06T12:44:15.617Z',
  //       },
  //       'e1c239ba-7bed-43c2-bc27-2d9fe38e09fc': {
  //         chatbotAPIRequests: [1],
  //         totalChatbotAPIRequests: 1,
  //         averageChatbotAPIRequests: 1,
  //         chatbotUsedTime: [0],
  //         totalChatbotUsedTime: 0,
  //         visitedWebsiteCount: 1,
  //         pageVisitedCount: {
  //           'Create Next App': {
  //             title: 'Create Next App',
  //             url: 'http://localhost:3000/',
  //             count: 1,
  //           },
  //         },
  //         createdAt: '2025-05-06T12:46:19.010Z',
  //         updatedAt: '2025-05-06T12:46:19.010Z',
  //       },
  //     },
  //     createdAt: '2025-05-01T21:03:41.518Z',
  //     updatedAt: '2025-05-01T21:20:26.624Z',
  //     chatbot: {
  //       _id: '6813c8b0c5c84206f2e9b3a5',
  //       name: 'ChatAgent 01',
  //       type: 'website',
  //       isActive: true,
  //       analyticsEnabled: true,
  //       version: 1,
  //       createdAt: '2025-05-01T19:17:04.924Z',
  //       updatedAt: '2025-05-01T19:20:44.185Z',
  //     },
  //     user: {
  //       _id: '680be9fffae3f02949298b92',
  //       username: 'vijay',
  //       email: 'vijay@evega.in',
  //       role: 'user',
  //     },
  //   },
  // ];

  // Get unique creators for the dropdown
  const uniqueCreators = useMemo(() => {
    if (!dataSource || dataSource.length === 0) return [];

    const creatorSet = new Set<string>();
    dataSource.forEach((item) => {
      if (item.user?.username) {
        creatorSet.add(item.user.username);
      }
    });

    return Array.from(creatorSet);
  }, [dataSource]);

  // Filter data based on search terms (chatbot name)
  const filteredData = useMemo(() => {
    if (!searchTerms.trim()) return dataSource;

    return dataSource.filter((item) =>
      item.chatbot?.name.toLowerCase().includes(searchTerms.toLowerCase())
    );
  }, [dataSource, searchTerms]);

  // Filter data based on selected creator
  const creatorFilteredData = useMemo(() => {
    if (!filteredData || filteredData.length === 0) return filteredData;
    if (selectedCreator === 'all') return filteredData;

    return filteredData.filter(
      (item) => item.user?.username === selectedCreator
    );
  }, [filteredData, selectedCreator]);

  // Filter data based on date
  const dateFilteredData = useMemo(() => {
    if (!creatorFilteredData || creatorFilteredData.length === 0)
      return creatorFilteredData;

    const currentDate = new Date();
    const filterDate = new Date();

    // Handle different date filter options
    if (dateFilter === 'custom') {
      // Use custom date range
      if (dateRange.start && dateRange.end) {
        const startDate = new Date(dateRange.start);
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999); // Include the end date

        return creatorFilteredData.filter((item) => {
          const itemDate = new Date(item.updatedAt);
          return itemDate >= startDate && itemDate <= endDate;
        });
      } else {
        // If custom range is selected but dates aren't provided, return all data
        return creatorFilteredData;
      }
    } else if (dateFilter === '1day') {
      filterDate.setDate(currentDate.getDate() - 1);
    } else if (dateFilter === '2days') {
      filterDate.setDate(currentDate.getDate() - 2);
    } else if (dateFilter === '30days') {
      filterDate.setDate(currentDate.getDate() - 30);
    } else if (dateFilter === '1year') {
      filterDate.setFullYear(currentDate.getFullYear() - 1);
    } else if (dateFilter === 'all') {
      // Return all data, no filtering
      return creatorFilteredData;
    }

    // Filter the data based on updatedAt date
    return creatorFilteredData.filter((item) => {
      const itemDate = new Date(item.updatedAt);
      return itemDate >= filterDate;
    });
  }, [creatorFilteredData, dateFilter, dateRange]);

  // Process the filtered statistics data
  const stats = processStatisticsData(dateFilteredData);
  return (
    <div className='flex flex-col h-full overflow-y-auto p-4 md:p-6 bg-gray-50'>
      {isLoading && <Loader />}
      <div className='flex flex-col lg:flex-row flex-wrap  items-start lg:items-center justify-between mb-4 md:mb-6 gap-2'>
        <div>
          <h1 className='text-xl md:text-2xl font-bold text-indigo-900 '>
            {type === 'user' ? 'User Dashboard' : 'Admin Dashboard'}
          </h1>
          <p className='text-sm md:text-base text-indigo-700/70'>
            Overview of your ChatAgent performance
          </p>
        </div>
        <DashboardFilters
          searchTerms={searchTerms}
          setSearchTerms={setSearchTerms}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          dateRange={dateRange}
          setDateRange={setDateRange}
          selectedCreator={selectedCreator}
          setSelectedCreator={setSelectedCreator}
          uniqueCreators={uniqueCreators}
        />
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
