import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import { Loader } from '../Loader';
import { axiosInstance } from '@/utils/axiosInstance';

const DomainChangeDialog = ({
  isOpen,
  onOpenChange,
  chatbotId,
  initialDomain,
  onSuccess,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  chatbotId: string;
  initialDomain: string;
  onSuccess: () => void;
}) => {
  const [newDomain, setNewDomain] = useState(initialDomain || '');
  const [loading, setLoading] = useState(false);

  const handleChangeWebsite = async () => {
    if (!newDomain.trim()) {
      toast.warning('Please enter a valid website URL');
      return;
    }

    setLoading(true);
    try {
      const dataObject = {
        domainName: newDomain,
      };
      await axiosInstance.put(
        `/chatbot/${chatbotId}/updateWebsite`,
        dataObject
      );
      toast.success('Website domain updated successfully');
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      toast.error('Error updating domain');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[87vw] gap-0 sm:max-w-[425px] rounded-lg'>
        {loading && <Loader />}
        <DialogHeader>
          <DialogTitle className='sr-only'>Change Website Domain</DialogTitle>
          <DialogDescription id='dialog-description' className='sr-only'>
            Update the website domain associated with your chatbot
          </DialogDescription>
        </DialogHeader>

        <div className='gap-6 flex flex-col'>
          <div className='flex items-center justify-between'>
            <div></div>
            <div className='text-primary text-xl font-medium'>
              Change Website Domain
            </div>
            <IoCloseOutline
              className='text-lg cursor-pointer'
              onClick={() => onOpenChange(false)}
            />
          </div>

          <div className='space-y-2'>
            <label htmlFor='website' className='text-sm text-gray-600'>
              Website URL
            </label>
            <Input
              id='website'
              type='text'
              placeholder='https://yourwebsite.com'
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className='px-4 py-3 rounded border border-[#E0E0E0] focus-visible:ring-0 placeholder:text-sm placeholder:font-light w-full'
            />
            <p className='text-xs text-gray-500'>
              Updating the domain will replace the current website linked to
              your chatbot.
            </p>
          </div>

          <div className='grid grid-cols-2 gap-2 sm:gap-3 items-center w-full'>
            <DialogClose>
              <Button
                className='border border-[#57C0DD] text-xs w-full text-[#57C0DD] py-2 bg-transparent rounded-full hover:bg-[#f0faff]'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className='bg-[#57C0DD] text-white text-xs py-2 w-full rounded-full hover:bg-[#4cb9d1]'
              onClick={handleChangeWebsite}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Domain'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DomainChangeDialog;
