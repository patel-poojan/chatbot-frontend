import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React, { useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';

import { Loader } from './Loader';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { axiosInstance } from '@/utils/axiosInstance';
import { toast } from 'sonner';

const ChangeLlmModalDialog = ({ trigger }: { trigger: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [LLMs, setLLMs] = useState<string[]>([]);
  const [current, setCurrent] = useState('');
  const [selected, setSelected] = useState<string>('');

  const handleSelectChange = (value: string) => {
    setSelected(value);
  };

  // fetch all options
  const fetchAllLLM = async () => {
    setIsPending(true);
    try {
      const response = await axiosInstance.get('/llm');
      if (response?.data) {
        response?.data?.current && setCurrent(response?.data?.current);
        response?.data?.current && setSelected(response?.data?.current);
        response?.data?.options && setLLMs(response?.data?.options);
      } else {
        console.error('Failed to fetch LLM options');
      }
      setIsPending(false);
    } catch (error) {
      console.error('Error fetching LLM options:', error);
      setIsPending(false);
    }
  };

  useEffect(() => {
    fetchAllLLM();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    try {
      const response = await axiosInstance.post('/llm/current', {
        current: selected,
      });
      if (response?.data) {
        toast.success('LLM changed successfully');
        setCurrent(selected);
        setIsOpen(false);
      } else {
        toast.error('Failed to change LLM');
      }
      setIsPending(false);
    } catch (error) {
      console.error('Error changing LLM:', error);

      toast.error('Error changing LLM');
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className='max-w-[87vw] sm:max-w-[480px] gap-0 py-6 md:py-10 px-6 md:px-11 rounded-lg'
        aria-describedby='dialog-description'
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        {isPending && <Loader />}
        <DialogHeader>
          <DialogTitle className='sr-only'>Change LLM Model</DialogTitle>
        </DialogHeader>
        <form className='flex flex-col gap-4 md:gap-6' onSubmit={() => {}}>
          <div className='flex justify-between items-center'>
            <div></div>
            <p className='text-black text-center font-medium text-2xl '>
              Change LLM Model
            </p>
            <DialogClose>
              <IoCloseOutline className='text-xl' />
            </DialogClose>
          </div>

          <div className='w-full'>
            <div className='flex items-center border w-full rounded mt-1'>
              <Select
                value={selected}
                onValueChange={handleSelectChange}
                defaultValue={selected}
              >
                <SelectTrigger className='w-full border-none focus:outline-none focus-visible:outline-none focus:ring-0'>
                  <SelectValue placeholder='Select an LLM' />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {LLMs.map((llm) => (
                      <SelectItem key={llm} value={llm}>
                        {llm}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            {/* current saved LLM */}
            <p className='text-sm text-[#6F7288B2] mt-2'>
              Current LLM: {current}
            </p>
          </div>

          <Button
            type='submit'
            className='w-full text-white bg-gradient-to-r hover:from-[#53A7DD] hover:to-[#58C8DD] from-[#58C8DD] to-[#53A7DD] py-3 rounded'
            onClick={handleSubmit}
          >
            Save
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeLlmModalDialog;
