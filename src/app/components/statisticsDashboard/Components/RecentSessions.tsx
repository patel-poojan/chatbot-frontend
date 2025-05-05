// components/RecentSessions.tsx
import React, { useMemo } from 'react';
import { SessionDisplayData } from './types';
import { formatPageVisits } from './dataProcessing';

const RecentSessions = ({ data }: { data: SessionDisplayData[] }) => {
  // Use a memo to ensure we're not processing the same data multiple times
  const uniqueSessionData = useMemo(() => {
    // Create a Map using the ID as the key to ensure uniqueness
    const uniqueMap = new Map();

    // Only add each session once to the map, keyed by ID
    data.forEach((session) => {
      if (!uniqueMap.has(session.id)) {
        uniqueMap.set(session.id, session);
      }
    });

    // Convert the map values back to an array
    return Array.from(uniqueMap.values());
  }, [data]);
  const formatTime = (minutes: number) => {
    if (minutes === null || minutes === undefined) return '0m';
    return `${minutes}m`;
  };
  return (
    <div className='p-3 md:p-4 border border-gray-100 rounded-xl shadow-sm bg-white'>
      <h2 className='text-base md:text-lg font-semibold text-indigo-900 mb-2 md:mb-4'>
        Recent Sessions
      </h2>
      <div className='overflow-x-auto -mx-3 md:mx-0'>
        <table className='min-w-full'>
          <thead>
            <tr className='bg-gray-50 border-b border-gray-100'>
              <th className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider'>
                User ID
              </th>
              <th className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider'>
                ChatAgent
              </th>
              <th className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider'>
                Creator
              </th>
              <th className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider'>
                Requests
              </th>
              <th className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider'>
                Used Time
              </th>
              <th className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider'>
                Websites Visited
              </th>
              <th className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider'>
                POPULAR PAGES
              </th>
            </tr>
          </thead>
          <tbody>
            {uniqueSessionData.length > 0 ? (
              uniqueSessionData.map((session, index) => (
                <tr
                  key={`${session.id}-${index}`}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                  }`}
                >
                  <td className='px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-indigo-900'>
                    {session.id.substring(0, 8)}...
                  </td>
                  <td className='px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-indigo-900/70'>
                    {session.chatbotName}
                  </td>
                  <td className='px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-indigo-900/70'>
                    {session.creator}
                  </td>
                  <td className='px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-indigo-900/70'>
                    {session.requests}
                  </td>
                  <td className='px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-indigo-900/70'>
                    {formatTime(session.usageTime)}
                  </td>
                  <td className='px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-indigo-900/70'>
                    {session.visitedWebsiteCount || 0}
                  </td>
                  <td className='px-3 md:px-6 py-2 md:py-4 text-xs md:text-sm text-indigo-900/70'>
                    <div className='text-left'>
                      {formatPageVisits(session.pageVisits)
                        .split('\n')
                        .map((line, i) => (
                          <div key={i} className='mb-1 font-medium'>
                            {line}
                          </div>
                        ))}
                      {session.pageVisits &&
                        Object.keys(session.pageVisits).length > 3 && (
                          <div className='text-xs text-indigo-900/50'>
                            + {Object.keys(session.pageVisits).length - 3} more
                          </div>
                        )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className='border-b border-gray-100'>
                <td
                  colSpan={7}
                  className='px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-indigo-900/70 text-center'
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentSessions;
