// components/RecentSessions.tsx
import React, { useMemo, useState } from 'react';
import { SessionDisplayData, PageVisitDialogData } from './types';
import {
  hasDetailedPageVisits,
  getDetailedPageVisitsData,
} from './dataProcessing';
import PageVisitsDialog from './PageVisitsDialog';
import { Eye } from 'lucide-react';

interface RecentSessionsProps {
  data: SessionDisplayData[];
}

const RecentSessions: React.FC<RecentSessionsProps> = ({ data }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<PageVisitDialogData[]>([]);
  const [dialogTitle, setDialogTitle] = useState('');

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

  const handleViewPageVisits = (session: SessionDisplayData) => {
    const detailedData = getDetailedPageVisitsData(session.pageVisits);
    setDialogData(detailedData);
    setDialogTitle(`Page Visits - ${session.chatbotName}`);
    setDialogOpen(true);
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
                PAGES VISITED
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
                    {/* Only show the View button if we have detailed page visit data */}
                    {hasDetailedPageVisits(session.pageVisits) ? (
                      <button
                        onClick={() => handleViewPageVisits(session)}
                        className='flex items-center px-2 py-1 text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-md'
                      >
                        <Eye className='h-3 w-3 mr-1' />
                        View
                      </button>
                    ) : (
                      <div className='text-gray-400'>No Data</div>
                    )}
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

      {/* Page Visits Dialog */}
      <PageVisitsDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        data={dialogData}
        title={dialogTitle}
      />
    </div>
  );
};

export default RecentSessions;
