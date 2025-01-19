import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import React from 'react';
import { IoCloseOutline } from 'react-icons/io5';

const UpdateChatbotNameDialog = ({ trigger }: { trigger: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='max-w-[87vw] gap-0  sm:max-w-[425px] rounded-lg'>
        <DialogHeader>
          <DialogTitle className='sr-only'>Rename Chatbot</DialogTitle>
          <DialogDescription id='dialog-description' className='sr-only'>
            Rename Chatbot
          </DialogDescription>
        </DialogHeader>
        {/* {isPending && <Loader />} */}
        <div className='gap-6 flex flex-col'>
          <div className='flex items-center justify-between'>
            <div></div>
            <div className='text-primary  text-xl font-medium'>
              Edit Chatbot name
            </div>
            <DialogClose>
              <IoCloseOutline className='text-lg' />
            </DialogClose>
          </div>
          <Input
            id='name'
            className='px-4 py-3 rounded border border-[#E0E0E0] focus-visible:ring-0 placeholder:text-sm placeholder:font-light w-full'
            placeholder='www.chatbot.com'
          />
          <div className='grid grid-cols-2 gap-2 sm:gap-3 items-center w-full '>
            <Button className='border border-[#57C0DD] text-xs w-full text-[#57C0DD] py-2 bg-transparent rounded-full hover:bg-[#f0faff]'>
              Cancel
            </Button>
            <DialogClose>
              <Button className='bg-[#57C0DD] text-white text-xs py-2 w-full    rounded-full hover:bg-[#4cb9d1]'>
                Save
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateChatbotNameDialog;
