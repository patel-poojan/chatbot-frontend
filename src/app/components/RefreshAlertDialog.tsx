'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useDeleteBot } from '@/utils/botCreation-api';
import { DialogClose } from '@radix-ui/react-dialog';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import { axiosError } from '@/types/axiosTypes';
import { Loader } from './Loader';

const RefreshAlertDialog = ({
  open,
  onOpenChange,
  botId,
  confirmNavigation, // New prop
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  botId?: string;
  confirmNavigation?: () => void; // Function to confirm navigation
}) => {
  const router = useRouter();
  const { mutate: onDelete, isPending } = useDeleteBot({
    onSuccess(data) {
      // Call the confirmNavigation function if provided
      if (confirmNavigation) {
        confirmNavigation();
      }

      // Set localStorage flag as backup
      localStorage.setItem('allowNavigation', 'true');

      // Close dialog and navigate
      onOpenChange(false);
      router.push('/create');
      toast.success(data?.message);
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'Delete bot failed';
      toast.error(errorMessage);
    },
  });

  // Handle navigation when dialog closes with "Go back"
  const handleGoBack = () => {
    if (botId) {
      onDelete({ chatbotId: botId });
      // Dialog will close and navigation will happen in onSuccess
    } else {
      // If no botId, just close the dialog
      onOpenChange(false);
    }
  };

  // Handle "Finish training" - just close the dialog and stay on page
  const handleStayOnPage = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[87vw] gap-0 sm:max-w-[425px] rounded-lg'>
        <DialogHeader>
          <DialogTitle className='sr-only'>Alert</DialogTitle>
          <DialogDescription id='dialog-description' className='sr-only'>
            Data loss alert
          </DialogDescription>
        </DialogHeader>
        {isPending && <Loader />}
        <div className='gap-4 flex flex-col'>
          <div className='flex items-center justify-between'>
            <div className='text-primary text-base'>
              Training {`isn't`} finished yet
            </div>
            <DialogClose onClick={handleStayOnPage}>
              <IoCloseOutline className='text-lg' />
            </DialogClose>
          </div>
          <div className='text-primary text-sm text-black'>{`Are you sure you want to go back? You'll lose the generated content.`}</div>
          <div className='flex gap-2 sm:gap-3 items-center justify-end'>
            <Button
              className='border border-[#57C0DD] text-xs text-[#57C0DD] py-2 w-[105px] sm:w-[116px] bg-transparent rounded-full hover:bg-[#f0faff]'
              onClick={handleGoBack}
            >
              Go back
            </Button>
            <DialogClose>
              <Button
                className='bg-[#57C0DD] text-white text-xs py-2 w-[105px] sm:w-[116px] rounded-full hover:bg-[#4cb9d1]'
                onClick={handleStayOnPage}
              >
                Finish training
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RefreshAlertDialog;
