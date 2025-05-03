// components/ChatbotPerformance.tsx
import React from 'react';
import { ChatbotStat } from './types';
import { CHART_COLORS } from './dataProcessing';

interface ChatbotPerformanceProps {
  data: ChatbotStat[];
}

const ChatbotPerformance: React.FC<ChatbotPerformanceProps> = ({ data }) => {
  console.log('Chatbot Performance Data:', data);
  return (
    <div className='p-3 md:p-4 border border-gray-100 rounded-xl shadow-sm mb-4 md:mb-6 bg-white'>
      <h2 className='text-base md:text-lg font-semibold text-indigo-900 mb-2 md:mb-4'>
        ChatAgent Performance
      </h2>
      <div className='overflow-x-auto -mx-3 md:mx-0'>
        <table className='min-w-full'>
          <thead>
            <tr className='bg-gray-50 border-b border-gray-100'>
              <th className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider'>
                Creator
              </th>
              <th className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider'>
                ChatAgent
              </th>
              <th className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider'>
                VISITORS
              </th>
              <th className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider'>
                Requests
              </th>
              <th className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider'>
                Status
              </th>
              <th className='px-3 md:px-6 py-2 md:py-3 text-left text-xs font-medium text-indigo-900/70 uppercase tracking-wider'>
                Websites Visited
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((chatbot, index) => (
                <tr
                  key={chatbot.id}
                  className='border-b border-gray-100 hover:bg-gray-50'
                >
                  <td className='px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm font-medium text-indigo-900'>
                    <div className='flex items-center gap-1 md:gap-2'>
                      <div
                        className='rounded-full p-1 w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-white text-xs'
                        style={{
                          backgroundColor:
                            CHART_COLORS[index % CHART_COLORS.length],
                        }}
                      >
                        {chatbot.creator.charAt(0).toUpperCase()}
                      </div>
                      {chatbot.creator}
                    </div>
                  </td>
                  <td className='px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-indigo-900/70'>
                    {chatbot.name}
                  </td>
                  <td className='px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-indigo-900/70'>
                    {chatbot.sessions}
                  </td>
                  <td className='px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-indigo-900/70'>
                    {chatbot.requests}
                  </td>
                  <td className='px-3 md:px-6 py-2 md:py-4 whitespace-nowrap'>
                    <span
                      className={`px-2 py-0.5 md:py-1 text-xs font-medium rounded-full ${
                        chatbot.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {chatbot.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className='px-3 md:px-6 py-2 md:py-4 whitespace-nowrap text-xs md:text-sm text-indigo-900/70'>
                    {chatbot.visitedWebsiteCount || 0}
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

export default ChatbotPerformance;
