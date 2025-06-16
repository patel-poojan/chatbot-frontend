// components/RecentSessions.tsx
import React, { useMemo, useState } from 'react';
import { SessionDisplayData, PageVisitDialogData } from './types';
import {
  hasDetailedPageVisits,
  getDetailedPageVisitsData,
} from './dataProcessing';
import PageVisitsDialog from './PageVisitsDialog';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';

interface RecentSessionsProps {
  data: SessionDisplayData[];
}

const RecentSessions: React.FC<RecentSessionsProps> = ({ data }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogData, setDialogData] = useState<PageVisitDialogData[]>([]);
  const [dialogTitle, setDialogTitle] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

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

  // Pagination calculations
  const totalItems = uniqueSessionData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = uniqueSessionData.slice(startIndex, endIndex);

  // Reset to first page when items per page changes
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Page navigation
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

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

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className='p-3 md:p-4 border border-gray-100 rounded-xl shadow-sm bg-white'>
      <div className='flex justify-between items-center mb-2 md:mb-4'>
        <h2 className='text-base md:text-lg font-semibold text-indigo-900'>
          Recent Sessions
        </h2>
        {totalItems > 0 && (
          <div className='flex items-center gap-2 text-sm text-indigo-900/70'>
            <span>Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className='border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>per page</span>
          </div>
        )}
      </div>

      <div className='overflow-x-auto -mx-3 md:mx-0'>
        <table className='min-w-full'>
          <thead>
            <tr className='bg-gray-50 border-b border-gray-100'>
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
            {currentData.length > 0 ? (
              currentData.map((session, index) => (
                <tr
                  key={`${session.id}-${index}`}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                  }`}
                >
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
                  colSpan={6}
                  className='px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-indigo-900/70 text-center'
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalItems > 0 && totalPages > 1 && (
        <div className='flex flex-col sm:flex-row items-center justify-between mt-4 gap-3'>
          <div className='text-sm text-gray-500'>
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{' '}
            {totalItems} entries
          </div>

          <div className='flex items-center gap-2'>
            {/* Previous button */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className='flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
            >
              <ChevronLeft className='h-4 w-4 text-gray-600' />
            </button>

            {/* Page numbers */}
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className='w-8 h-8 flex items-center justify-center text-gray-400'>
                    ...
                  </span>
                ) : (
                  <button
                    onClick={() => goToPage(page as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md border text-sm ${
                      currentPage === page
                        ? 'bg-indigo-50 text-indigo-600 font-medium border border-indigo-200'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}

            {/* Next button */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='flex items-center justify-center w-8 h-8 rounded-md border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50'
            >
              <ChevronRight className='h-4 w-4' />
            </button>
          </div>
        </div>
      )}

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
