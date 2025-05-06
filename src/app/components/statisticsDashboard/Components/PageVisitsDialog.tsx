// components/PageVisitsDialog.tsx
import React from 'react';
import { PageVisitDialogData } from './types';

interface PageVisitsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  data: PageVisitDialogData[];
  title: string;
}

const PageVisitsDialog: React.FC<PageVisitsDialogProps> = ({
  isOpen,
  onClose,
  data,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4 md:p-0'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='p-4 border-b border-gray-100 flex justify-between items-center'>
          <div>
            <h3 className='text-lg font-semibold text-indigo-900'>{title}</h3>
            <p className='text-sm text-indigo-700/70'>
              Detailed information about visited pages
            </p>
          </div>
          <button
            onClick={onClose}
            className='p-1 rounded-full hover:bg-gray-100 text-gray-500'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className='overflow-y-auto p-4 flex-grow'>
          {data.length === 0 ? (
            <div className='text-center py-6 text-indigo-900/50'>
              No page visit data available
            </div>
          ) : (
            <div className='rounded-lg overflow-hidden border border-gray-100'>
              <div className='overflow-x-auto'>
                <table className='w-full divide-y divide-gray-100'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-4 py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider whitespace-nowrap'>
                        Page Name
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider whitespace-nowrap'>
                        URL
                      </th>
                      <th className='px-4 py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider whitespace-nowrap'>
                        Count
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-100'>
                    {data.map((item, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                        }
                      >
                        <td className='px-4 py-3 text-sm text-indigo-900 whitespace-nowrap'>
                          {item.title}
                        </td>
                        <td className='px-4 py-3 text-sm text-indigo-900/70'>
                          <div className='max-w-xs md:max-w-md truncate'>
                            <a
                              href={item.url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-indigo-600 hover:text-indigo-800 hover:underline'
                              title={item.url}
                            >
                              {item.url}
                            </a>
                          </div>
                        </td>
                        <td className='px-4 py-3 text-sm text-indigo-900/70 whitespace-nowrap'>
                          {item.count}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageVisitsDialog;
