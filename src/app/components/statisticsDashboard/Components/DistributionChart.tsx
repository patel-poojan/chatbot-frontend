import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { BiBarChart } from 'react-icons/bi';
import { ChartData } from './types';
import { CHART_COLORS } from './dataProcessing';

interface DistributionChartProps {
  data: ChartData[];
  totalRequests: number;
  screenWidth: number;
}

const DistributionChart: React.FC<DistributionChartProps> = ({
  data,
  totalRequests,
  screenWidth,
}) => {
  console.log('DistributionChart data:', data);
  return (
    <div className='p-4 md:p-5 border border-gray-100 rounded-xl shadow-sm bg-white '>
      <h2 className='text-base md:text-lg font-semibold text-indigo-900 mb-3 md:mb-4 flex items-center'>
        <span className='w-2 h-6 bg-indigo-500 rounded-full mr-2'></span>
        ChatAgent Distribution
      </h2>
      <div className='h-60 md:h-72 flex justify-center items-center'>
        {data.length === 0 ? (
          <div className='flex flex-col items-center justify-center text-gray-400'>
            <BiBarChart className='h-12 w-12 mb-2' />
            <p>No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart>
              {(() => {
                // Make a copy of distribution data and sort by value
                const sortedData = [...data].sort((a, b) => b.value - a.value);

                // If we have too many items, only show top 5 plus "Others"
                const maxDirectDisplayItems = 5;
                let processedData = sortedData;

                if (sortedData.length > maxDirectDisplayItems) {
                  const topItems = sortedData.slice(0, maxDirectDisplayItems);
                  const otherItems = sortedData.slice(maxDirectDisplayItems);

                  if (otherItems.length > 0) {
                    const othersTotal = otherItems.reduce(
                      (sum, item) => sum + item.value,
                      0
                    );
                    const othersPercentage =
                      Math.round((othersTotal / totalRequests) * 10000) / 100;

                    processedData = [
                      ...topItems,
                      {
                        name: `Others (${otherItems.length} bots)`,
                        value: othersTotal,
                        percentage: othersPercentage,
                        isOthers: true,
                        items: otherItems,
                      },
                    ];
                  }
                }

                // Enhance visual representation for better visibility
                const visualData = processedData.map((item, index) => {
                  const percentage = (item.value / totalRequests) * 100;

                  // For very small segments, ensure minimum visual representation
                  if (percentage < 2 && percentage > 0) {
                    return {
                      ...item,
                      visualValue: Math.max(item.value, totalRequests * 0.02),
                      actualValue: item.value,
                    };
                  }

                  // For dominant segments, slightly reduce to show others better
                  if (index === 0 && percentage > 90) {
                    return {
                      ...item,
                      visualValue: totalRequests * 0.88,
                      actualValue: item.value,
                    };
                  }

                  return {
                    ...item,
                    visualValue: item.value,
                    actualValue: item.value,
                  };
                });

                return (
                  <Pie
                    data={visualData}
                    cx='50%'
                    cy='50%'
                    labelLine={false}
                    outerRadius={screenWidth < 768 ? 70 : 90}
                    innerRadius={screenWidth < 768 ? 40 : 60}
                    paddingAngle={3}
                    fill='#8884d8'
                    dataKey='visualValue'
                    nameKey='name'
                    label={({ payload }) => {
                      const percent =
                        ((payload.actualValue || payload.value) /
                          totalRequests) *
                        100;
                      return `${percent.toFixed(2)}%`;
                    }}
                  >
                    {visualData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.isOthers
                            ? '#9CA3AF'
                            : CHART_COLORS[index % CHART_COLORS.length]
                        }
                        stroke='transparent'
                        className='hover:opacity-80 transition-opacity'
                      />
                    ))}
                  </Pie>
                );
              })()}
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;

                    return (
                      <div className='bg-white p-3 rounded-lg shadow-lg border border-gray-100 max-w-xs'>
                        <p className='font-semibold text-gray-800 mb-1 text-sm'>
                          {data.name}
                        </p>

                        <p className='text-gray-600 text-sm '>
                          <span>
                            Requests: <b>{data.actualValue || data.value}</b>
                          </span>
                        </p>
                        <p className='text-gray-600 text-sm mt-1'>
                          <span>
                            Share:{' '}
                            <b>
                              {(
                                ((data.actualValue || data.value) /
                                  totalRequests) *
                                100
                              ).toFixed(2)}
                              %
                            </b>
                          </span>
                        </p>

                        {/* Show details for "Others" category */}
                        {data.isOthers && data.items && (
                          <div className='mt-2 pt-2 border-t border-gray-200'>
                            <p className='text-xs text-gray-500 font-medium mb-1'>
                              Included chatbots:
                            </p>
                            <div className='max-h-24 overflow-y-auto'>
                              {data.items
                                .slice(0, 10)
                                .map(
                                  (
                                    item: { name: string; value: number },
                                    idx: number
                                  ) => (
                                    <div
                                      key={idx}
                                      className='text-xs text-gray-600 flex justify-between mb-1'
                                    >
                                      <span
                                        className='truncate mr-2'
                                        style={{ maxWidth: '120px' }}
                                      >
                                        {item.name}
                                      </span>
                                      <span className='font-medium'>
                                        {item.value}
                                      </span>
                                    </div>
                                  )
                                )}
                              {data.items.length > 10 && (
                                <p className='text-xs text-gray-500 italic'>
                                  +{data.items.length - 10} more
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend
                layout='horizontal'
                verticalAlign='bottom'
                align='center'
                iconType='circle'
                iconSize={8}
                formatter={(value) => {
                  // Truncate long names for legend
                  return (
                    <span className='text-gray-700 text-xs'>
                      {value.length > 15
                        ? `${value.substring(0, 12)}...`
                        : value}
                    </span>
                  );
                }}
                wrapperStyle={{ paddingTop: 15 }}
                // Limit number of legends to prevent overflow
                payload={
                  data.length > 10
                    ? data
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 10)
                        .map((entry, index) => ({
                          value: entry.name,
                          color: CHART_COLORS[index % CHART_COLORS.length],
                          type: 'circle',
                          payload: { ...entry, strokeDasharray: '' },
                        }))
                    : undefined
                }
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default DistributionChart;
