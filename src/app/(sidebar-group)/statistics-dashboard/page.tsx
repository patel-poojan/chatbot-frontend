'use client';
import React, { useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { IoStatsChart } from 'react-icons/io5';
import { LuUsers } from 'react-icons/lu';
import { MdOutlineQueryStats } from 'react-icons/md';
import { BsClock } from 'react-icons/bs';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/utils/axiosInstance';
import { Loader } from '@/app/components/Loader';
import { toast } from 'sonner';

// Define TypeScript interfaces for the data structure
interface SessionData {
  chatbotAPIRequests: number[];
  totalChatbotAPIRequests: number;
  averageChatbotAPIRequests: number;
  chatbotUsedTime: number[];
  totalChatbotUsedTime: number;
}

interface Chatbot {
  _id: string;
  name: string;
  type: string;
  isActive: boolean;
  analyticsEnabled: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface StatisticsData {
  _id: string;
  chatbotId: string;
  userId: string;
  data: {
    [sessionId: string]: SessionData;
  };
  createdAt: string;
  updatedAt: string;
  chatbot: Chatbot;
  user: User;
}

interface ChatbotStat {
  id: string;
  name: string;
  type: string;
  isActive: boolean;
  creator: string;
  sessions: number;
  requests: number;
  usageTime: number;
}

interface ChartData {
  name: string;
  value: number;
}

interface ProcessedStats {
  uniqueChatbots: number;
  uniqueCreators: number;
  totalSessions: number;
  totalRequests: number;
  totalUsageTime: number;
  chatbotStats: ChatbotStat[];
  chatbotDistributionData: ChartData[];
}

interface FetchStatisticsResponse {
  statusCode: number;
  data: StatisticsData[];
  message: string;
  success: boolean;
}

const StatisticsDashboard = () => {
  const fetchStatistics = async () => {
    const response: FetchStatisticsResponse = await axiosInstance.get(
      `/metrics`
    );
    return response.data;
  };
  const {
    data: statisticsData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['fetch', 'statistics'],
    queryFn: fetchStatistics,
  });
  useEffect(() => {
    if (isError) {
      toast.error('Failed to fetch statistics data. Please try again later.');
    }
  }, [isError]);

  // Process data for statistics
  const processData = (): ProcessedStats | null => {
    if (statisticsData?.length === 0) return null;

    // Count unique chatbots
    const uniqueChatbots = new Set<string>();
    statisticsData?.forEach((item) => uniqueChatbots.add(item.chatbot._id));

    // Count unique creators
    const uniqueCreators = new Set<string>();
    statisticsData?.forEach((item) => uniqueCreators.add(item.user._id));

    // Count total sessions
    let totalSessions = 0;
    let totalRequests = 0;
    let totalUsageTime = 0;

    statisticsData?.forEach((item) => {
      const sessionIds = Object.keys(item.data);
      totalSessions += sessionIds.length;

      // Sum up requests and usage time
      sessionIds.forEach((sessionId) => {
        const session = item.data[sessionId];
        totalRequests += session.totalChatbotAPIRequests || 0;
        totalUsageTime += session.totalChatbotUsedTime || 0;
      });
    });

    // Create per chatbot data
    const chatbotStats: ChatbotStat[] = [];
    const chatbotMap = new Map<string, ChatbotStat>();

    statisticsData?.forEach((item) => {
      const chatbotId = item.chatbot._id;

      if (!chatbotMap.has(chatbotId)) {
        chatbotMap.set(chatbotId, {
          id: chatbotId,
          name: item.chatbot.name,
          type: item.chatbot.type,
          isActive: item.chatbot.isActive,
          creator: item.user.username,
          sessions: 0,
          requests: 0,
          usageTime: 0,
        });
      }

      const chatbot = chatbotMap.get(chatbotId);
      if (!chatbot) return; // TypeScript safety

      const sessionIds = Object.keys(item.data);

      chatbot.sessions += sessionIds.length;

      sessionIds.forEach((sessionId) => {
        const session = item.data[sessionId];
        chatbot.requests += session.totalChatbotAPIRequests || 0;
        chatbot.usageTime += session.totalChatbotUsedTime || 0;
      });
    });

    chatbotMap.forEach((chatbot) => {
      chatbotStats.push(chatbot);
    });

    // Create data for charts from the processed data
    const chatbotDistributionData: ChartData[] = [];

    // Prepare chatbot distribution data for pie chart
    chatbotStats.forEach((chatbot) => {
      chatbotDistributionData.push({
        name: chatbot.name,
        value: chatbot.requests,
      });
    });

    return {
      uniqueChatbots: uniqueChatbots.size,
      uniqueCreators: uniqueCreators.size,
      totalSessions,
      totalRequests,
      totalUsageTime,
      chatbotStats,
      chatbotDistributionData,
    };
  };

  const stats = processData();

  if (!stats) {
    return (
      <div className='flex justify-center items-center h-full'>
        No data available
      </div>
    );
  }

  // Colors for pie chart
  const COLORS = [
    '#58C8DD',
    '#6366F1',
    '#10B981',
    '#F59E0B',
    '#EF4444',
    '#8B5CF6',
  ];

  return (
    <div className='flex flex-col h-full overflow-y-auto p-4 sm:p-6'>
      {isLoading ? <Loader /> : null}
      <div className='mb-4 sm:mb-6'>
        <h1 className='text-xl sm:text-2xl font-bold text-[#1e255e]'>
          Statistics Dashboard
        </h1>
        <p className='text-sm sm:text-base text-[#1e255eb2]'>
          Overview of your ChatAgent performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6'>
        <div className='p-3 sm:p-4 border border-[#F3F3F3] rounded-xl shadow-sm bg-white'>
          <div className='flex items-center gap-2 sm:gap-3'>
            <div className='p-2 sm:p-3 rounded-full bg-[#58C8DD]/20'>
              <IoStatsChart className='text-lg sm:text-xl text-[#58C8DD]' />
            </div>
            <div>
              <p className='text-xs sm:text-sm text-[#1e255eb2]'>
                Total Requests
              </p>
              <p className='text-lg sm:text-xl font-bold text-[#1e255e]'>
                {stats.totalRequests}
              </p>
            </div>
          </div>
        </div>

        <div className='p-3 sm:p-4 border border-[#F3F3F3] rounded-xl shadow-sm bg-white'>
          <div className='flex items-center gap-2 sm:gap-3'>
            <div className='p-2 sm:p-3 rounded-full bg-[#6366F1]/20'>
              <LuUsers className='text-lg sm:text-xl text-[#6366F1]' />
            </div>
            <div>
              <p className='text-xs sm:text-sm text-[#1e255eb2]'>
                Total Sessions
              </p>
              <p className='text-lg sm:text-xl font-bold text-[#1e255e]'>
                {stats.totalSessions}
              </p>
            </div>
          </div>
        </div>

        <div className='p-3 sm:p-4 border border-[#F3F3F3] rounded-xl shadow-sm bg-white'>
          <div className='flex items-center gap-2 sm:gap-3'>
            <div className='p-2 sm:p-3 rounded-full bg-[#10B981]/20'>
              <MdOutlineQueryStats className='text-lg sm:text-xl text-[#10B981]' />
            </div>
            <div>
              <p className='text-xs sm:text-sm text-[#1e255eb2]'>ChatAgents</p>
              <p className='text-lg sm:text-xl font-bold text-[#1e255e]'>
                {stats.uniqueChatbots}
              </p>
            </div>
          </div>
        </div>

        <div className='p-3 sm:p-4 border border-[#F3F3F3] rounded-xl shadow-sm bg-white'>
          <div className='flex items-center gap-2 sm:gap-3'>
            <div className='p-2 sm:p-3 rounded-full bg-[#F59E0B]/20'>
              <BsClock className='text-lg sm:text-xl text-[#F59E0B]' />
            </div>
            <div>
              <p className='text-xs sm:text-sm text-[#1e255eb2]'>Usage Time</p>
              <p className='text-lg sm:text-xl font-bold text-[#1e255e]'>
                {stats.totalUsageTime}m
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6'>
        <div className='p-3 sm:p-4 border border-[#F3F3F3] rounded-xl shadow-sm bg-white'>
          <h2 className='text-base sm:text-lg font-semibold text-[#1e255e] mb-2 sm:mb-4'>
            ChatAgent Distribution
          </h2>
          <div className='h-56 sm:h-72 flex justify-center items-center'>
            <ResponsiveContainer width='100%' height='100%'>
              <PieChart>
                <Pie
                  data={stats.chatbotDistributionData}
                  cx='50%'
                  cy='50%'
                  labelLine={true}
                  outerRadius={window.innerWidth < 640 ? 60 : 80}
                  fill='#8884d8'
                  dataKey='value'
                  label={({ name, percent }) =>
                    window.innerWidth < 640
                      ? `${(percent * 100).toFixed(0)}%`
                      : `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {stats.chatbotDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} requests`, 'Usage']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className='p-3 sm:p-4 border border-[#F3F3F3] rounded-xl shadow-sm bg-white'>
          <h2 className='text-base sm:text-lg font-semibold text-[#1e255e] mb-2 sm:mb-4'>
            Requests vs Usage Time
          </h2>
          <div className='h-56 sm:h-72'>
            <ResponsiveContainer width='100%' height='100%'>
              <BarChart
                data={stats.chatbotStats}
                margin={{
                  top: 5,
                  right: 20,
                  left: 0,
                  bottom: window.innerWidth < 640 ? 70 : 5,
                }}
              >
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='name'
                  angle={window.innerWidth < 640 ? -45 : 0}
                  textAnchor={window.innerWidth < 640 ? 'end' : 'middle'}
                  height={window.innerWidth < 640 ? 70 : 30}
                  tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                />
                <YAxis yAxisId='left' orientation='left' stroke='#58C8DD' />
                <YAxis yAxisId='right' orientation='right' stroke='#6366F1' />
                <Tooltip />
                <Legend
                  wrapperStyle={{ fontSize: window.innerWidth < 640 ? 10 : 12 }}
                />
                <Bar
                  yAxisId='left'
                  dataKey='requests'
                  name='Requests'
                  fill='#58C8DD'
                />
                <Bar
                  yAxisId='right'
                  dataKey='usageTime'
                  name='Usage Time (min)'
                  fill='#6366F1'
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bot Performance */}
      <div className='p-3 sm:p-4 border border-[#F3F3F3] rounded-xl shadow-sm mb-4 sm:mb-6 bg-white'>
        <h2 className='text-base sm:text-lg font-semibold text-[#1e255e] mb-2 sm:mb-4'>
          ChatAgent Performance
        </h2>
        <div className='overflow-x-auto -mx-3 sm:mx-0'>
          <table className='min-w-full'>
            <thead>
              <tr className='bg-gray-50 border-b border-[#F3F3F3]'>
                <th className='px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[#1e255eb2] uppercase tracking-wider'>
                  ChatAgent
                </th>
                <th className='px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[#1e255eb2] uppercase tracking-wider'>
                  Type
                </th>
                <th className='px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[#1e255eb2] uppercase tracking-wider'>
                  Creator
                </th>
                <th className='px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[#1e255eb2] uppercase tracking-wider'>
                  Sessions
                </th>
                <th className='px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[#1e255eb2] uppercase tracking-wider'>
                  Requests
                </th>
                <th className='px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[#1e255eb2] uppercase tracking-wider'>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.chatbotStats.map((chatbot) => (
                <tr
                  key={chatbot.id}
                  className='border-b border-[#F3F3F3] hover:bg-gray-50'
                >
                  <td className='px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-[#1e255e]'>
                    <div className='flex items-center gap-1 sm:gap-2'>
                      <Image
                        src='/images/bot-icon.svg'
                        alt='bot icon'
                        width={window.innerWidth < 640 ? 20 : 24}
                        height={window.innerWidth < 640 ? 20 : 24}
                        className='bg-[#58C8DD] rounded-full p-1'
                      />
                      {chatbot.name}
                    </div>
                  </td>
                  <td className='px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-[#1e255eb2] capitalize'>
                    {chatbot.type}
                  </td>
                  <td className='px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-[#1e255eb2]'>
                    {chatbot.creator}
                  </td>
                  <td className='px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-[#1e255eb2]'>
                    {chatbot.sessions}
                  </td>
                  <td className='px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-[#1e255eb2]'>
                    {chatbot.requests}
                  </td>
                  <td className='px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full ${
                        chatbot.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {chatbot.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sessions Table */}
      <div className='p-3 sm:p-4 border border-[#F3F3F3] rounded-xl shadow-sm bg-white'>
        <h2 className='text-base sm:text-lg font-semibold text-[#1e255e] mb-2 sm:mb-4'>
          Recent Sessions
        </h2>
        <div className='overflow-x-auto -mx-3 sm:mx-0'>
          <table className='min-w-full'>
            <thead>
              <tr className='bg-gray-50 border-b border-[#F3F3F3]'>
                <th className='px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[#1e255eb2] uppercase tracking-wider'>
                  Session ID
                </th>
                <th className='px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[#1e255eb2] uppercase tracking-wider'>
                  ChatAgent
                </th>
                <th className='px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[#1e255eb2] uppercase tracking-wider'>
                  Creator
                </th>
                <th className='px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[#1e255eb2] uppercase tracking-wider'>
                  Requests
                </th>
                <th className='px-3 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-[#1e255eb2] uppercase tracking-wider'>
                  Used Time
                </th>
              </tr>
            </thead>
            <tbody>
              {statisticsData?.flatMap((item) =>
                Object.entries(item.data).map(([sessionId, sessionData]) => (
                  <tr
                    key={sessionId}
                    className='border-b border-[#F3F3F3] hover:bg-gray-50'
                  >
                    <td className='px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-[#1e255e]'>
                      {sessionId.substring(0, 8)}...
                    </td>
                    <td className='px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-[#1e255eb2]'>
                      {item.chatbot.name}
                    </td>
                    <td className='px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-[#1e255eb2]'>
                      {item.user.username}
                    </td>
                    <td className='px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-[#1e255eb2]'>
                      {sessionData.totalChatbotAPIRequests}
                    </td>
                    <td className='px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-[#1e255eb2]'>
                      {sessionData.totalChatbotUsedTime}m
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StatisticsDashboard;
