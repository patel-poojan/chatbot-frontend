'use client';
import React, { useState, useEffect } from 'react';
import {
  IoSearchSharp,
  IoFilterOutline,
  IoClose,
  IoCalendarOutline,
} from 'react-icons/io5';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

// Define types
interface DashboardFiltersProps {
  searchTerms: string;
  setSearchTerms: (value: string) => void;
  dateFilter: string;
  setDateFilter: (value: string) => void;
  dateRange: { start: string; end: string };
  setDateRange: (value: { start: string; end: string }) => void;
  selectedCreator: string;
  setSelectedCreator: (value: string) => void;
  uniqueCreators: string[];
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  searchTerms,
  setSearchTerms,
  dateFilter,
  setDateFilter,
  dateRange,
  setDateRange,
  selectedCreator,
  setSelectedCreator,
  uniqueCreators,
}) => {
  // State to store temporary filter values in mobile view
  const [tempSearch, setTempSearch] = useState<string>(searchTerms);
  const [tempDate, setTempDate] = useState<string>(dateFilter);
  const [tempDateRange, setTempDateRange] = useState<{
    start: string;
    end: string;
  }>(dateRange);
  const [tempCreator, setTempCreator] = useState<string>(selectedCreator);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showDateRange, setShowDateRange] = useState<boolean>(false);

  // Update temporary values when props change
  useEffect(() => {
    setTempSearch(searchTerms);
    setTempDate(dateFilter);
    setTempDateRange(dateRange);
    setTempCreator(selectedCreator);
    setShowDateRange(dateFilter === 'custom');
  }, [searchTerms, dateFilter, dateRange, selectedCreator]);

  // Function to apply filters from sheet
  const applyFilters = (): void => {
    setSearchTerms(tempSearch);
    setDateFilter(tempDate);
    if (tempDate === 'custom') {
      setDateRange(tempDateRange);
    }
    setSelectedCreator(tempCreator);
    setIsOpen(false);
  };

  // Function to reset all filters
  const resetFilters = (): void => {
    setSearchTerms('');
    setDateFilter('30days');
    setDateRange({ start: '', end: '' });
    setSelectedCreator('all');
    setTempSearch('');
    setTempDate('30days');
    setTempDateRange({ start: '', end: '' });
    setTempCreator('all');
    setShowDateRange(false);
  };

  // Handle search input in the sheet
  const handleSheetSearchInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setTempSearch(e.target.value);
  };

  // Handle date filter change
  const handleDateFilterChange = (value: string): void => {
    setTempDate(value);
    setShowDateRange(value === 'custom');
    if (value !== 'custom') {
      setTempDateRange({ start: '', end: '' });
    }
  };

  // Handle date range change
  const handleDateRangeChange = (
    type: 'start' | 'end',
    value: string
  ): void => {
    setTempDateRange({
      ...tempDateRange,
      [type]: value,
    });
  };

  // For desktop view
  const handleDesktopDateFilterChange = (value: string): void => {
    setDateFilter(value);
    if (value === 'custom') {
      setShowDateRange(true);
    } else {
      setShowDateRange(false);
      setDateRange({ start: '', end: '' });
    }
  };

  const handleDesktopDateRangeChange = (
    type: 'start' | 'end',
    value: string
  ): void => {
    setDateRange({
      ...dateRange,
      [type]: value,
    });
  };

  // Get active filters count
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerms.trim()) count++;
    if (selectedCreator !== 'all') count++;
    if (dateFilter !== '30days') count++;
    return count;
  };

  const getDateRangeDisplay = () => {
    // if (dateFilter === 'custom' && dateRange.start && dateRange.end) {
    //   return `${dateRange.start} - ${dateRange.end}`;
    // }
    switch (dateFilter) {
      case '30days':
        return 'Last 30 days';
      case '1year':
        return 'Last 1 year';
      case 'all':
        return 'All time';
      case 'custom':
        return 'Custom range';
      default:
        return 'Select period';
    }
  };

  return (
    <div className='flex flex-col w-full lg:w-fit gap-3'>
      {/* Desktop view - show all filters in row */}
      <div className='hidden md:flex flex-row gap-3 w-full justify-start lg:justify-end flex-wrap items-center relative'>
        {/* Search Bar */}
        <div className='relative flex-shrink-0'>
          <div className='flex items-center h-11 px-4 rounded-lg bg-white shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors w-[240px]'>
            <IoSearchSharp className='text-indigo-500 mr-2 text-lg flex-shrink-0' />
            <Input
              value={searchTerms}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchTerms(e.target.value)
              }
              className='border-none shadow-none text-gray-700 placeholder:text-gray-400 bg-transparent focus-visible:ring-0 focus-visible:outline-none placeholder:font-normal text-sm flex-1'
              type='text'
              placeholder='Search ChatAgents...'
            />
            {searchTerms && (
              <Button
                variant='ghost'
                size='icon'
                className='h-6 w-6 rounded-full hover:bg-gray-100 flex-shrink-0'
                onClick={() => setSearchTerms('')}
              >
                <IoClose className='h-4 w-4 text-gray-400' />
              </Button>
            )}
          </div>
        </div>

        {/* Creator Filter Dropdown */}
        <div className='relative flex-shrink-0'>
          <Select value={selectedCreator} onValueChange={setSelectedCreator}>
            <SelectTrigger className='h-11 w-[180px] bg-white shadow-sm border border-gray-200 hover:border-indigo-300 text-gray-700 rounded-lg px-4 justify-between'>
              <div className='flex items-center gap-1 overflow-hidden'>
                <span className='truncate'>
                  {selectedCreator === 'all' ? 'All creators' : selectedCreator}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className='bg-white border border-gray-200 shadow-lg rounded-lg z-50'>
              <SelectItem
                value='all'
                className='text-gray-700 hover:bg-indigo-50'
              >
                All creators
              </SelectItem>
              {uniqueCreators.map((creator: string) => (
                <SelectItem
                  key={creator}
                  value={creator}
                  className='text-gray-700 hover:bg-indigo-50'
                >
                  {creator}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Filter Dropdown */}
        <div className='relative flex-shrink-0'>
          <Select
            value={dateFilter}
            onValueChange={handleDesktopDateFilterChange}
          >
            <SelectTrigger className='h-11 w-[180px] bg-white shadow-sm border border-gray-200 hover:border-indigo-300 text-gray-700 rounded-lg px-4 justify-between'>
              <div className='flex items-center gap-2 overflow-hidden'>
                <IoCalendarOutline className='h-4 w-4 text-indigo-500 flex-shrink-0' />
                <span className='text-sm truncate flex-1'>
                  {getDateRangeDisplay()}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent className='bg-white border border-gray-200 shadow-lg rounded-lg z-50'>
              <SelectItem
                value='30days'
                className='text-gray-700 hover:bg-indigo-50'
              >
                Last 30 days
              </SelectItem>
              <SelectItem
                value='1year'
                className='text-gray-700 hover:bg-indigo-50'
              >
                Last 1 year
              </SelectItem>
              <SelectItem
                value='all'
                className='text-gray-700 hover:bg-indigo-50'
              >
                All time
              </SelectItem>
              <SelectItem
                value='custom'
                className='text-gray-700 hover:bg-indigo-50'
              >
                Custom range
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range Picker - Desktop */}
        {showDateRange && (
          <div className='flex items-center gap-2 bg-white shadow-sm border border-gray-200 hover:border-indigo-300 rounded-lg px-3 h-11 w-fit'>
            <IoCalendarOutline className='text-indigo-500 flex-shrink-0 h-4 w-4' />
            <Input
              type='date'
              value={dateRange.start}
              onChange={(e) =>
                handleDesktopDateRangeChange('start', e.target.value)
              }
              className='flex-1 border-none shadow-none text-gray-700 w-auto bg-transparent focus-visible:ring-0 focus-visible:outline-none text-sm px-0'
              placeholder='Start date'
            />
            <span className='text-gray-400 text-sm flex-shrink-0'>to</span>
            <Input
              type='date'
              value={dateRange.end}
              onChange={(e) =>
                handleDesktopDateRangeChange('end', e.target.value)
              }
              className='flex-1 border-none shadow-none text-gray-700 bg-transparent w-auto focus-visible:ring-0 focus-visible:outline-none text-sm px-0'
              placeholder='End date'
            />
          </div>
        )}
      </div>

      {/* Mobile view - search + filter button */}
      <div className='flex md:hidden flex-row items-center gap-2 w-full'>
        <div className='flex-1 flex items-center h-11 px-4 rounded-lg bg-white shadow-sm border border-gray-200'>
          <IoSearchSharp className='text-indigo-500 mr-2' />
          <Input
            value={searchTerms}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerms(e.target.value)
            }
            className='border-none shadow-none text-gray-700 placeholder:text-gray-400 bg-transparent focus-visible:ring-0 placeholder:font-normal text-sm'
            type='text'
            placeholder='Search ChatAgents...'
          />
          {searchTerms && (
            <Button
              variant='ghost'
              size='icon'
              className='h-6 w-6 rounded-full'
              onClick={() => setSearchTerms('')}
            >
              <IoClose className='h-4 w-4 text-gray-400' />
            </Button>
          )}
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              className='h-11 w-11 rounded-lg bg-white shadow-sm border border-gray-200 relative'
            >
              <IoFilterOutline className='h-5 w-5 text-indigo-500' />
              {getActiveFiltersCount() > 0 && (
                <div className='absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center'>
                  <span className='text-white text-xs font-medium'>
                    {getActiveFiltersCount()}
                  </span>
                </div>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side='bottom'
            className='rounded-t-2xl pb-6 px-4 h-fit overflow-y-auto'
          >
            <div className='flex items-center justify-between '>
              <div className='flex items-center gap-2'>
                <SheetTitle className='text-gray-900 font-semibold'>
                  Filters
                </SheetTitle>
                {getActiveFiltersCount() > 0 && (
                  <span className='text-xs px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded'>
                    {getActiveFiltersCount()} active
                  </span>
                )}
              </div>
              <SheetClose asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-8 w-8 rounded-full'
                >
                  <IoClose className='h-5 w-5 text-gray-500' />
                </Button>
              </SheetClose>
            </div>

            <div className='flex flex-col gap-6 py-4'>
              {/* Mobile Search in Sheet */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>
                  Search ChatAgents
                </label>
                <div className='relative'>
                  <div className='flex items-center h-11 px-4 rounded-lg bg-white shadow-sm border border-gray-200'>
                    <IoSearchSharp className='text-indigo-500 mr-2' />
                    <Input
                      value={tempSearch}
                      onChange={handleSheetSearchInput}
                      className='border-none shadow-none text-gray-700 placeholder:text-gray-400 bg-transparent focus-visible:ring-0 placeholder:font-normal text-sm'
                      type='text'
                      placeholder='Search ChatAgents...'
                    />
                    {tempSearch && (
                      <Button
                        variant='ghost'
                        size='icon'
                        className='h-6 w-6 rounded-full absolute right-3'
                        onClick={() => setTempSearch('')}
                      >
                        <IoClose className='h-4 w-4 text-gray-400' />
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Creator Filter */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>
                  Creator
                </label>
                <Select value={tempCreator} onValueChange={setTempCreator}>
                  <SelectTrigger className='h-11 w-full bg-white shadow-sm border border-gray-200 text-gray-700 rounded-lg px-4 justify-between'>
                    <SelectValue placeholder='Select creator' />
                  </SelectTrigger>
                  <SelectContent className='bg-white border border-gray-200 shadow-lg rounded-lg max-h-[300px] overflow-y-auto z-50'>
                    <SelectItem
                      value='all'
                      className='text-gray-700 hover:bg-indigo-50'
                    >
                      All creators
                    </SelectItem>
                    {uniqueCreators.map((creator: string) => (
                      <SelectItem
                        key={creator}
                        value={creator}
                        className='text-gray-700 hover:bg-indigo-50'
                      >
                        {creator}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filter */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-700'>
                  Time Period
                </label>
                <Select value={tempDate} onValueChange={handleDateFilterChange}>
                  <SelectTrigger className='h-11 w-full bg-white shadow-sm border border-gray-200 text-gray-700 rounded-lg px-4 justify-between'>
                    <SelectValue placeholder='Select period' />
                  </SelectTrigger>
                  <SelectContent className='bg-white border border-gray-200 shadow-lg rounded-lg z-50'>
                    <SelectItem
                      value='30days'
                      className='text-gray-700 hover:bg-indigo-50'
                    >
                      Last 30 days
                    </SelectItem>
                    <SelectItem
                      value='1year'
                      className='text-gray-700 hover:bg-indigo-50'
                    >
                      Last 1 year
                    </SelectItem>
                    <SelectItem
                      value='all'
                      className='text-gray-700 hover:bg-indigo-50'
                    >
                      All time
                    </SelectItem>
                    <SelectItem
                      value='custom'
                      className='text-gray-700 hover:bg-indigo-50'
                    >
                      Custom range
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Picker - Mobile */}
              {showDateRange && (
                <div className='space-y-3'>
                  <label className='text-sm font-medium text-gray-700'>
                    Custom Date Range
                  </label>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <span className='text-xs text-gray-500'>Start Date</span>
                      <Input
                        type='date'
                        value={tempDateRange.start}
                        onChange={(e) =>
                          handleDateRangeChange('start', e.target.value)
                        }
                        className='h-11 px-4 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-700'
                      />
                    </div>
                    <div className='space-y-2'>
                      <span className='text-xs text-gray-500'>End Date</span>
                      <Input
                        type='date'
                        value={tempDateRange.end}
                        onChange={(e) =>
                          handleDateRangeChange('end', e.target.value)
                        }
                        className='h-11 px-4 rounded-lg bg-white shadow-sm border border-gray-200 text-gray-700'
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className='flex flex-col gap-3 pt-4'>
              <div className='flex justify-between gap-3'>
                <Button
                  variant='outline'
                  onClick={resetFilters}
                  className='text-gray-600 h-11 px-5 flex-1'
                >
                  Reset all
                </Button>
                <SheetClose asChild>
                  <Button
                    onClick={applyFilters}
                    className='bg-indigo-600 hover:bg-indigo-700 text-white h-11 px-5 flex-1'
                  >
                    Apply
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default DashboardFilters;
