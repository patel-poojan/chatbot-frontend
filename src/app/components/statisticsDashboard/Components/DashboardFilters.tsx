'use client';
import React, { useState, useEffect } from 'react';
import { IoSearchSharp, IoFilterOutline, IoClose } from 'react-icons/io5';
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
  selectedCreator: string;
  setSelectedCreator: (value: string) => void;
  uniqueCreators: string[];
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  searchTerms,
  setSearchTerms,
  dateFilter,
  setDateFilter,
  selectedCreator,
  setSelectedCreator,
  uniqueCreators,
}) => {
  // State to store temporary filter values in mobile view
  const [tempSearch, setTempSearch] = useState<string>(searchTerms);
  const [tempDate, setTempDate] = useState<string>(dateFilter);
  const [tempCreator, setTempCreator] = useState<string>(selectedCreator);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Update temporary values when props change
  useEffect(() => {
    setTempSearch(searchTerms);
    setTempDate(dateFilter);
    setTempCreator(selectedCreator);
  }, [searchTerms, dateFilter, selectedCreator]);

  // Function to apply filters from sheet
  const applyFilters = (): void => {
    setSearchTerms(tempSearch);
    setDateFilter(tempDate);
    setSelectedCreator(tempCreator);
    setIsOpen(false);
  };

  // Function to reset filters
  const resetFilters = (): void => {
    setTempSearch('');
    setTempDate('30days');
    setTempCreator('all');
  };

  // Handle search input in the sheet
  const handleSheetSearchInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setTempSearch(e.target.value);
  };

  return (
    <div className='flex flex-col w-full lg:w-fit'>
      {/* Desktop view - show all filters in row */}
      <div className='hidden md:flex flex-row gap-3 w-full justify-start lg:justify-end'>
        {/* Search Bar */}
        <div className='flex items-center h-12 px-4 rounded-lg bg-white shadow-sm border border-gray-100 w-auto'>
          <IoSearchSharp className='text-primary-600 mr-2' />
          <Input
            value={searchTerms}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerms(e.target.value)
            }
            className='w-44 border-none shadow-none text-gray-600 placeholder:text-gray-400 bg-transparent focus-visible:ring-0 placeholder:font-normal placeholder:text-sm text-base'
            type='text'
            placeholder='Search ChatAgents'
          />
        </div>

        {/* Creator Filter Dropdown */}
        <Select value={selectedCreator} onValueChange={setSelectedCreator}>
          <SelectTrigger className='h-12 w-[180px] bg-white shadow-sm border border-gray-100 text-gray-600 rounded-lg px-4 justify-between'>
            <SelectValue placeholder='Select creator' />
          </SelectTrigger>
          <SelectContent className='bg-white border border-gray-100 shadow-md rounded-lg max-h-[200px] overflow-y-auto'>
            <SelectItem value='all'>All creators</SelectItem>
            {uniqueCreators.map((creator: string) => (
              <SelectItem key={creator} value={creator}>
                {creator}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Date Filter Dropdown */}
        <Select value={dateFilter} onValueChange={setDateFilter}>
          <SelectTrigger className='h-12 w-[180px] bg-white shadow-sm border border-gray-100 text-gray-600 rounded-lg px-4 justify-between'>
            <SelectValue placeholder='Select period' />
          </SelectTrigger>
          <SelectContent className='bg-white border border-gray-100 shadow-md rounded-lg'>
            <SelectItem value='30days'>Last 30 days</SelectItem>
            <SelectItem value='1year'>Last 1 year</SelectItem>
            <SelectItem value='all'>All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Mobile view - search + filter button */}
      <div className='flex md:hidden flex-row items-center gap-2 w-full'>
        <div className='flex-1 flex items-center h-12 px-4 rounded-lg bg-white shadow-sm border border-gray-100'>
          <IoSearchSharp className='text-primary-600 mr-2' />
          <Input
            value={searchTerms}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerms(e.target.value)
            }
            className='border-none shadow-none text-gray-600 placeholder:text-gray-400 bg-transparent focus-visible:ring-0 placeholder:font-normal placeholder:text-sm text-base'
            type='text'
            placeholder='Search ChatAgents'
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
              className='h-12 w-12 rounded-lg bg-white shadow-sm border border-gray-100'
            >
              <IoFilterOutline className='h-5 w-5 text-primary-600' />
            </Button>
          </SheetTrigger>
          <SheetContent side='bottom' className='rounded-t-xl pb-6'>
            <div className='flex items-center justify-between pb-4'>
              <SheetTitle className='text-indigo-900'>Filters</SheetTitle>
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

            <div className='flex flex-col gap-5 py-2'>
              {/* Mobile Search in Sheet */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-600'>
                  Search ChatAgents
                </label>
                <div className='relative'>
                  <div className='flex items-center h-12 px-4 rounded-lg bg-white shadow-sm border border-gray-100'>
                    <IoSearchSharp className='text-primary-600 mr-2' />
                    <Input
                      value={tempSearch}
                      onChange={handleSheetSearchInput}
                      className='border-none shadow-none text-gray-600 placeholder:text-gray-400 bg-transparent focus-visible:ring-0 placeholder:font-normal placeholder:text-sm text-base'
                      type='text'
                      placeholder='Search ChatAgents'
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
                <label className='text-sm font-medium text-gray-600'>
                  Creator
                </label>
                <Select value={tempCreator} onValueChange={setTempCreator}>
                  <SelectTrigger className='h-12 w-full bg-white shadow-sm border border-gray-100 text-gray-600 rounded-lg px-4 justify-between'>
                    <SelectValue placeholder='Select creator' />
                  </SelectTrigger>
                  <SelectContent className='bg-white border border-gray-100 shadow-md rounded-lg max-h-[200px] overflow-y-auto'>
                    <SelectItem value='all'>All creators</SelectItem>
                    {uniqueCreators.map((creator: string) => (
                      <SelectItem key={creator} value={creator}>
                        {creator}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filter */}
              <div className='space-y-2'>
                <label className='text-sm font-medium text-gray-600'>
                  Time Period
                </label>
                <Select value={tempDate} onValueChange={setTempDate}>
                  <SelectTrigger className='h-12 w-full bg-white shadow-sm border border-gray-100 text-gray-600 rounded-lg px-4 justify-between'>
                    <SelectValue placeholder='Select period' />
                  </SelectTrigger>
                  <SelectContent className='bg-white border border-gray-100 shadow-md rounded-lg'>
                    <SelectItem value='30days'>Last 30 days</SelectItem>
                    <SelectItem value='1year'>Last 1 year</SelectItem>
                    <SelectItem value='all'>All time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className='flex justify-between mt-6 pt-4 border-t border-gray-100'>
              <Button
                variant='outline'
                onClick={resetFilters}
                className='text-gray-500 h-12 px-5'
              >
                Reset
              </Button>
              <SheetClose asChild>
                <Button
                  onClick={applyFilters}
                  className='bg-indigo-600 hover:bg-indigo-700 text-white h-12 px-5'
                >
                  Apply Filters
                </Button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default DashboardFilters;
