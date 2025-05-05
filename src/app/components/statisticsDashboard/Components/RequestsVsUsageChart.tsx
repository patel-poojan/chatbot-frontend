// components/RequestsVsUsageChart.tsx
import React from 'react';
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
import { BiBarChart } from 'react-icons/bi';
import { ChatbotStat } from './types';
import { CHART_COLORS } from './dataProcessing';

interface RequestsVsUsageChartProps {
  data: ChatbotStat[];
  screenWidth: number;
  viewMode: 'top5' | 'all';
  setViewMode: (mode: 'top5' | 'all') => void;
}

const RequestsVsUsageChart: React.FC<RequestsVsUsageChartProps> = ({
  data,
  screenWidth,
  viewMode,
  setViewMode,
}) => {
  // Transform data for better mobile display - improves axis readability
  const transformedData = React.useMemo(() => {
    return data.map((item) => ({
      ...item,
      // For mobile, truncate the name to make it more compact
      displayName:
        screenWidth < 768
          ? item.name.length > 8
            ? `${item.name.substring(0, 6)}...`
            : item.name
          : item.name.length > 15
          ? `${item.name.substring(0, 12)}...`
          : item.name,
    }));
  }, [data, screenWidth]);

  // For mobile, we'll use a custom rendering that's more compact
  const isMobile = screenWidth < 768;

  // Calculate max values for better y-axis scaling
  const maxRequests = Math.max(...data.map((item) => item.requests), 1);
  const maxUsageTime = Math.max(...data.map((item) => item.usageTime), 1);

  // Select data based on viewMode
  const chartData =
    viewMode === 'top5' || data.length > 20
      ? [...transformedData].sort((a, b) => b.requests - a.requests).slice(0, 5)
      : transformedData;

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

  return (
    <div className='p-4 md:p-5 border border-gray-100 rounded-xl shadow-sm bg-white'>
      <div className='flex justify-between items-center mb-3 md:mb-4'>
        <h2 className='text-base md:text-lg font-semibold text-indigo-900 flex items-center'>
          <span className='w-2 h-6 bg-cyan-500 rounded-full mr-2'></span>
          Requests vs Usage Time
        </h2>

        {/* Data view toggle for large datasets */}
        {data.length > 5 && (
          <div className='flex text-xs'>
            <button
              className={`px-2 py-1 rounded-l-md border border-gray-200 ${
                viewMode === 'top5'
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'bg-white text-gray-600'
              }`}
              onClick={() => setViewMode('top5')}
            >
              Top 5
            </button>
            <button
              className={`px-2 py-1 rounded-r-md border border-gray-200 border-l-0 ${
                viewMode === 'all'
                  ? 'bg-indigo-50 text-indigo-600 font-medium'
                  : 'bg-white text-gray-600'
              }`}
              onClick={() => setViewMode('all')}
            >
              All
            </button>
          </div>
        )}
      </div>

      <div className='h-60 md:h-72'>
        {data.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-gray-400'>
            <BiBarChart className='h-12 w-12 mb-2' />
            <p>No data available</p>
          </div>
        ) : data.length > 20 && viewMode === 'all' ? (
          // Special case for very large datasets in "all" mode - use a table instead
          <div className='h-full flex flex-col'>
            <div className='text-sm text-gray-500 mb-2 italic'>
              Displaying all {data.length} chatbots - consider using Top 5 view
              for better visualization
            </div>
            <div className='flex-1 overflow-y-auto pr-1 custom-scrollbar'>
              <table className='min-w-full text-sm'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Chatbot
                    </th>
                    <th className='px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Requests
                    </th>
                    <th className='px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Usage (min)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data
                    .sort((a, b) => b.requests - a.requests)
                    .map((bot, index) => (
                      <tr
                        key={bot.id}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className='px-3 py-2 whitespace-nowrap text-xs font-medium text-gray-700 flex items-center'>
                          <div
                            className='w-2 h-2 rounded-full mr-2'
                            style={{
                              backgroundColor:
                                CHART_COLORS[index % CHART_COLORS.length],
                            }}
                          ></div>
                          {bot.name.length > 20
                            ? bot.name.substring(0, 18) + '...'
                            : bot.name}
                        </td>
                        <td className='px-3 py-2 whitespace-nowrap text-xs text-right font-medium text-cyan-600'>
                          {bot.requests}
                        </td>
                        <td className='px-3 py-2 whitespace-nowrap text-xs text-right font-medium text-indigo-600'>
                          {bot.usageTime}m
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : isMobile ? (
          // Mobile-optimized visualization - more compact and readable
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={chartData}
              layout='vertical'
              margin={{ top: 10, right: 50, left: 10, bottom: 5 }}
              barGap={6}
              barSize={14}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                horizontal={true}
                vertical={false}
              />

              <XAxis
                type='number'
                axisLine={{ stroke: '#e5e7eb' }}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#6b7280' }}
                domain={[0, 'dataMax + 5']}
                tickCount={5}
                allowDecimals={false}
                padding={{ left: 0, right: 10 }}
              />

              <YAxis
                dataKey='displayName'
                type='category'
                width={60}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#6b7280' }}
              />

              <Tooltip
                contentStyle={{ fontSize: '11px', padding: '8px' }}
                formatter={(value: number, name: string) => [
                  value + (name === 'Usage Time (min)' ? 'm' : ''),
                  name,
                ]}
                labelStyle={{ fontSize: '11px', fontWeight: 600 }}
              />

              <Legend
                verticalAlign='bottom'
                align='center'
                iconSize={8}
                iconType='circle'
                wrapperStyle={{ fontSize: 10, paddingTop: 15 }}
              />

              <Bar
                dataKey='requests'
                name='Requests'
                fill='#58C8DD'
                radius={[0, 4, 4, 0] as [number, number, number, number]}
                layout='vertical'
                animationDuration={1000}
                isAnimationActive={true}
                label={
                  {
                    position: 'right',
                    fontSize: 9,
                    fill: '#374151',
                    formatter: (value: number) => (value > 0 ? value : ''),
                  } as {
                    position: 'right';
                    fontSize: number;
                    fill: string;
                    formatter: (value: number) => string | number;
                  }
                }
              />

              <Bar
                dataKey='usageTime'
                name='Usage Time (min)'
                fill='#6366F1'
                radius={[0, 4, 4, 0] as [number, number, number, number]}
                layout='vertical'
                animationDuration={1000}
                animationBegin={200}
                isAnimationActive={true}
                label={
                  {
                    position: 'right',
                    fontSize: 9,
                    fill: '#374151',
                    formatter: (value: number) =>
                      value > 0 ? `${value}m` : '',
                  } as {
                    position: 'right';
                    fontSize: number;
                    fill: string;
                    formatter: (value: number) => string | number;
                  }
                }
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          // Standard desktop visualization - FIXED Y-AXIS
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart
              data={chartData}
              layout={data.length > 10 ? 'vertical' : 'horizontal'}
              margin={{
                top: 20,
                right: 30,
                left: data.length > 10 ? 100 : 0,
                bottom: 20,
              }}
              barSize={data.length > 10 ? 12 : 24}
              barGap={8}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                stroke='#f0f0f0'
                vertical={data.length <= 10}
                horizontal={true}
              />

              {data.length > 10 ? (
                // Vertical layout for many chatbots
                <XAxis
                  type='number'
                  tickLine={false}
                  axisLine={{ stroke: '#e5e7eb' }}
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  domain={[0, Math.max(maxRequests, maxUsageTime) * 1.1]}
                  allowDecimals={false}
                  tickCount={5}
                />
              ) : (
                // Horizontal layout for fewer chatbots
                <XAxis
                  dataKey='displayName'
                  angle={0} // Improved for readability
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
              )}

              {data.length > 10 ? (
                // Vertical layout
                <YAxis
                  dataKey='displayName'
                  type='category'
                  tickLine={false}
                  axisLine={false}
                  width={90}
                  tick={{
                    fontSize: 11,
                    fill: '#6b7280',
                  }}
                />
              ) : (
                // Horizontal layout - FIXED Y-AXIS CONFIG
                <>
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
                    // label={{
                    //   value: 'Requests',
                    //   angle: -90,
                    //   position: 'insideLeft',
                    //   style: {
                    //     textAnchor: 'middle',
                    //     fill: '#58C8DD',
                    //     fontSize: 12,
                    //   },
                    // }}
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
                    // label={{
                    //   value: 'Usage Time (min)',
                    //   angle: 90,
                    //   position: 'insideRight',
                    //   style: {
                    //     textAnchor: 'middle',
                    //     fill: '#6366F1',
                    //     fontSize: 12,
                    //   },
                    // }}
                  />
                </>
              )}

              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const originalItem = data.find(
                      (item) =>
                        item.name === label ||
                        chartData.find((c) => c.displayName === label)?.name ===
                          item.name
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

              {data.length > 10 ? (
                // Vertical bars for many chatbots
                <>
                  <Bar
                    dataKey='requests'
                    name='Requests'
                    fill='#58C8DD'
                    radius={[0, 4, 4, 0]}
                    animationDuration={1500}
                    isAnimationActive={true}
                    layout='vertical'
                  />
                  <Bar
                    dataKey='usageTime'
                    name='Usage Time (min)'
                    fill='#6366F1'
                    radius={[0, 4, 4, 0]}
                    animationDuration={1500}
                    animationBegin={300}
                    isAnimationActive={true}
                    layout='vertical'
                  />
                </>
              ) : (
                // Horizontal bars for fewer chatbots
                <>
                  <Bar
                    yAxisId='left'
                    dataKey='requests'
                    name='Requests'
                    fill='#58C8DD'
                    radius={[4, 4, 0, 0] as [number, number, number, number]}
                    animationDuration={1500}
                    isAnimationActive={true}
                  >
                    {/* Add value labels on top of bars for better readability */}
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
                    {/* Add value labels on top of bars for better readability */}
                    <LabelList
                      dataKey='usageTime'
                      position='top'
                      style={
                        {
                          fontSize: '11px',
                          fill: '#374151',
                        } as React.CSSProperties
                      }
                      formatter={(value: number) =>
                        value > 0 ? `${value}m` : ''
                      }
                    />
                  </Bar>
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default RequestsVsUsageChart;
