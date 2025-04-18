// components/RecentSessions.tsx
import React from 'react';
import { SessionDisplayData } from './types';

interface RecentSessionsProps {
  data: SessionDisplayData[];
}

const RecentSessions: React.FC<RecentSessionsProps> = ({ data }) => {
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
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((session) => (
                <tr
                  key={session.id}
                  className='border-b border-gray-100 hover:bg-gray-50'
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
                    {session.usageTime}m
                  </td>
                </tr>
              ))
            ) : (
              <tr className='border-b border-gray-100'>
                <td
                  colSpan={5}
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
