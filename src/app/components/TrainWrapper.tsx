import React, { useEffect, useState } from 'react';
import useWindowDimensions from '@/utils/windowSize';

const TrainWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  // Get dimensions from hook
  const { width: screenWidth } = useWindowDimensions();

  // Create a state to track container height
  const [containerHeight, setContainerHeight] = useState('100dvh');

  // Update container height whenever screenWidth changes
  useEffect(() => {
    if (screenWidth > 768) {
      setContainerHeight('calc(100dvh - 248px)');
    } else if (screenWidth > 640) {
      setContainerHeight('calc(100dvh - 206px)');
    } else {
      setContainerHeight('calc(100dvh - 170px)');
    }
  }, [screenWidth]);

  return (
    <div
      className='flex flex-col justify-between w-full overflow-hidden bg-white rounded-3xl p-4 sm:p-6 md:p-8 lg:px-12 lg:py-10'
      style={{
        boxShadow: '0px 0px 12px 4px #00000014',
        height: containerHeight,
      }}
    >
      <div className='w-full flex-1 mx-auto h-auto flex flex-col overflow-hidden'>
        {children}
      </div>
    </div>
  );
};

export default TrainWrapper;
