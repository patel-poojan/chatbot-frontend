// components/RequestsVsUsageChart.tsx
import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { BiBarChart, BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { ChatbotStat } from './types';

interface RequestsVsUsageChartProps {
  data: ChatbotStat[];
  screenWidth: number;
}

const RequestsVsUsageChart: React.FC<RequestsVsUsageChartProps> = ({
  data,
  screenWidth,
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage =
    (screenWidth >= 1024 && screenWidth <= 1500) || screenWidth < 768 ? 3 : 4;

  // Calculate pagination values
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.length);

  // Get current page data
  const paginatedData = data.slice(startIndex, endIndex);

  // Transform data for better mobile display - improves axis readability
  const transformedData = React.useMemo(() => {
    return paginatedData.map((item) => ({
      ...item,
      // For mobile, truncate the name to make it more compact
      displayName:
        screenWidth < 768
          ? item.name.length > 10
            ? `${item.name.substring(0, 9)}...`
            : item.name
          : item.name.length > 15
          ? `${item.name.substring(0, 12)}...`
          : item.name,
    }));
  }, [paginatedData, screenWidth]);

  // Calculate max values for better y-axis scaling
  const maxRequests = Math.max(
    ...paginatedData.map((item) => item.requests),
    1
  );
  const maxUsageTime = Math.max(
    ...paginatedData.map((item) => item.usageTime),
    1
  );

  // Calculate proper Y-axis values with nice rounded numbers for better display
  const calculateYAxisDomain = (maxValue: number): [number, number] => {
    if (maxValue <= 5) return [0, 5];
    if (maxValue <= 10) return [0, 10];
    if (maxValue <= 20) return [0, 20];

    // For larger values, round up to a nice number
    const roundUpTo = Math.pow(10, Math.floor(Math.log10(maxValue)));
    const roundedMax = Math.ceil(maxValue / roundUpTo) * roundUpTo;

    return [0, roundedMax];
  };

  // Generate tick values for a cleaner Y-axis
  const generateYAxisTicks = (domain: [number, number]): number[] => {
    const [min, max] = domain;
    const result: number[] = [];
    const tickCount = 5; // Can be adjusted based on height
    const step = (max - min) / (tickCount - 1);

    for (let i = 0; i < tickCount; i++) {
      result.push(Math.round(min + step * i));
    }

    return result;
  };

  // Calculate domains for both Y axes
  const requestsDomain: [number, number] = calculateYAxisDomain(maxRequests);
  const usageTimeDomain: [number, number] = calculateYAxisDomain(maxUsageTime);

  // Generate ticks
  const requestsTicks = generateYAxisTicks(requestsDomain);
  const usageTimeTicks = generateYAxisTicks(usageTimeDomain);

  // Pagination handlers
  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className='py-4 md:py-5 border border-gray-100 rounded-xl shadow-sm bg-white'>
      <div className='flex justify-between items-center mb-3 md:mb-4 px-4 md:px-5'>
        <h2 className='text-base md:text-lg font-semibold text-indigo-900 flex items-center'>
          <span className='w-2 h-6 bg-cyan-500 rounded-full mr-2'></span>
          Requests vs Usage Time
        </h2>

        {/* Pagination controls */}
        {data.length > itemsPerPage && (
          <div className='flex items-center space-x-2 '>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className='p-1 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
            >
              <BiChevronLeft className='h-4 w-4 text-gray-600' />
            </button>

            <div className='flex space-x-1'>
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                if (totalPages <= 3) {
                  return i + 1;
                }

                // Determine page numbers to display
                let startPage = Math.max(1, currentPage - 1);
                const endPage = Math.min(totalPages, startPage + 2);

                // Adjust if we're near the end
                if (endPage === totalPages && totalPages > 3) {
                  startPage = Math.max(1, endPage - 2);
                }

                return startPage + i;
              }).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  className={`px-2 py-1 text-xs rounded-md ${
                    currentPage === page
                      ? 'bg-indigo-50 text-indigo-600 font-medium border border-indigo-200'
                      : 'border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className='p-1 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
            >
              <BiChevronRight className='h-4 w-4 text-gray-600' />
            </button>
          </div>
        )}
      </div>

      {/* Page info for larger datasets */}
      {data.length > itemsPerPage && (
        <div className='text-xs text-gray-500 mb-3 px-4 md:px-5 '>
          Showing {startIndex + 1}-{endIndex} of {data.length} chatbots
        </div>
      )}

      <div className='h-60 md:h-72'>
        {data.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-gray-400'>
            <BiBarChart className='h-12 w-12 mb-2' />
            <p>No data available</p>
          </div>
        ) : (
          // Standard desktop visualization
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={transformedData}
              margin={{
                top: 20,
                right: 10,
                left: 0,
                bottom: 20,
              }}
              barSize={24}
              barGap={8}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#f0f0f0'
                vertical={true}
                horizontal={true}
              />

              <XAxis
                dataKey='displayName'
                angle={0}
                textAnchor='middle'
                height={30}
                tick={{
                  fontSize: 12,
                  fill: '#6b7280',
                }}
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                interval={0} // Show all labels
              />

              <YAxis
                yAxisId='left'
                orientation='left'
                stroke='#58C8DD'
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                domain={requestsDomain}
                ticks={requestsTicks}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                allowDecimals={false}
              />

              <YAxis
                yAxisId='right'
                orientation='right'
                stroke='#6366F1'
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
                domain={usageTimeDomain}
                ticks={usageTimeTicks}
                tick={{ fontSize: 11, fill: '#6b7280' }}
                allowDecimals={false}
              />

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const originalItem = data.find(
                      (item) =>
                        item.name === label ||
                        transformedData.find((c) => c.displayName === label)
                          ?.name === item.name
                    );

                    return (
                      <div className='bg-white p-3 rounded-lg shadow-lg border border-gray-100'>
                        <p className='font-semibold text-gray-800 mb-2'>
                          {originalItem?.name || label}
                        </p>
                        {payload.map((entry, index) => (
                          <div
                            key={`tooltip-${index}`}
                            className='flex items-center gap-2 mb-1'
                          >
                            <div
                              className='w-3 h-3'
                              style={{ backgroundColor: entry.color }}
                            ></div>
                            <span className='text-sm text-gray-600'>
                              {entry.name}: <b>{entry.value}</b>
                              {entry.name === 'Usage Time (min)' ? 'm' : ''}
                            </span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend
                wrapperStyle={{
                  paddingTop: 15,
                  fontSize: 12,
                }}
                iconType='circle'
                iconSize={8}
              />

              <Bar
                yAxisId='left'
                dataKey='requests'
                name='Requests'
                fill='#58C8DD'
                radius={[4, 4, 0, 0] as [number, number, number, number]}
                animationDuration={1500}
                isAnimationActive={true}
              >
                <LabelList
                  dataKey='requests'
                  position='top'
                  style={
                    {
                      fontSize: '11px',
                      fill: '#374151',
                    } as React.CSSProperties
                  }
                  formatter={(value: number) => (value > 0 ? value : '')}
                />
              </Bar>

              <Bar
                yAxisId='right'
                dataKey='usageTime'
                name='Usage Time (min)'
                fill='#6366F1'
                radius={[4, 4, 0, 0] as [number, number, number, number]}
                animationDuration={1500}
                animationBegin={300}
                isAnimationActive={true}
              >
                <LabelList
                  dataKey='usageTime'
                  position='top'
                  style={
                    {
                      fontSize: '11px',
                      fill: '#374151',
                    } as React.CSSProperties
                  }
                  formatter={(value: number) => (value > 0 ? `${value}m` : '')}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RequestsVsUsageChart;
