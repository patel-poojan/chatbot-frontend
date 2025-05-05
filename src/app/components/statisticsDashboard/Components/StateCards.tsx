// components/StatCards.tsx
import React from 'react';
import { IoStatsChart } from 'react-icons/io5';
import { LuUsers } from 'react-icons/lu';
import { MdOutlineQueryStats } from 'react-icons/md';
import { BsClock } from 'react-icons/bs';
import { ProcessedStats } from './types';

interface StatCardsProps {
  stats: ProcessedStats;
}

const StatCards: React.FC<StatCardsProps> = ({ stats }) => {
  return (
    <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6'>
      <div className='p-3 md:p-4 border border-gray-100 rounded-xl shadow-sm bg-white'>
        <div className='flex items-center gap-2 md:gap-3'>
          <div className='p-2 md:p-3 rounded-full bg-cyan-400/20'>
            <IoStatsChart className='text-base md:text-xl text-cyan-400' />
          </div>
          <div>
            <p className='text-xs md:text-sm text-indigo-900/70'>
              Total Requests
            </p>
            <p className='text-lg md:text-xl font-bold text-indigo-900'>
              {stats.totalRequests}
            </p>
          </div>
        </div>
      </div>

      <div className='p-3 md:p-4 border border-gray-100 rounded-xl shadow-sm bg-white'>
        <div className='flex items-center gap-2 md:gap-3'>
          <div className='p-2 md:p-3 rounded-full bg-indigo-500/20'>
            <LuUsers className='text-base md:text-xl text-indigo-500' />
          </div>
          <div>
            <p className='text-xs md:text-sm text-indigo-900/70'>
              Total Visitors
            </p>
            <p className='text-lg md:text-xl font-bold text-indigo-900'>
              {stats.totalSessions}
            </p>
          </div>
        </div>
      </div>

      <div className='p-3 md:p-4 border border-gray-100 rounded-xl shadow-sm bg-white'>
        <div className='flex items-center gap-2 md:gap-3'>
          <div className='p-2 md:p-3 rounded-full bg-emerald-500/20'>
            <MdOutlineQueryStats className='text-base md:text-xl text-emerald-500' />
          </div>
          <div>
            <p className='text-xs md:text-sm text-indigo-900/70'>ChatAgents</p>
            <p className='text-lg md:text-xl font-bold text-indigo-900'>
              {stats.uniqueChatbots}
            </p>
          </div>
        </div>
      </div>

      <div className='p-3 md:p-4 border border-gray-100 rounded-xl shadow-sm bg-white'>
        <div className='flex items-center gap-2 md:gap-3'>
          <div className='p-2 md:p-3 rounded-full bg-amber-500/20'>
            <BsClock className='text-base md:text-xl text-amber-500' />
          </div>
          <div>
            <p className='text-xs md:text-sm text-indigo-900/70'>Usage Time</p>
            <p className='text-lg md:text-xl font-bold text-indigo-900'>
              {stats.totalUsageTime}m
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCards;
