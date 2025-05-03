'use client';
import StatisticsDashboard from '@/app/components/statisticsDashboard/StatisticsDashboard';
import { axiosInstance } from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { toast } from 'sonner';

const Page = () => {
  // Fetch statistics data
  const fetchStatistics = async () => {
    const response = await axiosInstance.get('/metrics');
    return response.data;
  };

  const {
    data: rawStatisticsData = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['fetch', 'statistics'],
    queryFn: fetchStatistics,
  });

  // Show error toast if data fetching fails
  useEffect(() => {
    if (isError) {
      toast.error('Failed to fetch statistics data. Please try again later.');
    }
  }, [isError]);
  return (
    <StatisticsDashboard
      rawStatisticsData={rawStatisticsData}
      isLoading={isLoading}
      type='admin'
    />
  );
};

export default Page;
