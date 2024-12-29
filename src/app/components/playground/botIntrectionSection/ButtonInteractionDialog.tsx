import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import useWindowDimensions from '@/utils/windowSize';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TypeResponseList, TypeSimpleNode } from '@/types/node';
import { usePlayground } from '../playgroundArea/PlaygroundContext';
import { toast } from 'sonner';

const ButtonInteractionDialog = ({
  trigger,
  buttonList,
  index,
  setResponseList,
  responseIndex,
}: {
  trigger: React.ReactNode;
  buttonList: {
    title: string;
    type: string;
    id: string;
    message?: string;
    url?: string;
    phoneNumber?: string;
    goto?: string;
  }[];
  setResponseList: React.Dispatch<React.SetStateAction<TypeResponseList[]>>;
  index: number;
  responseIndex: number;
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const [open, setOpen] = useState(false);
  const { listOfPlayGroundNode } = usePlayground();
  const [tempButton, setTempButton] = useState({
    id: buttonList[index]?.id || '',
    title: buttonList[index]?.title || '',
    type: buttonList[index]?.type || 'message',
    navigationInfo:
      buttonList[index].url ||
      buttonList[index].phoneNumber ||
      buttonList[index].goto ||
      buttonList[index].message ||
      '',
  });

  const handleSave = () => {
    if (tempButton.id === '') {
      return;
    }
    if (tempButton.title === '') {
      toast.warning('Please enter title');
      return;
    }
    if (tempButton.type === '') {
      toast.warning('Please select type');
      return;
    }
    if (tempButton.type === 'goto' && tempButton.navigationInfo === '') {
      toast.warning('Please select node');
      return;
    }
    if (tempButton.type === 'message' && tempButton.navigationInfo === '') {
      toast.warning('Please enter message');
      return;
    }
    if (tempButton.type === 'url' && tempButton.navigationInfo === '') {
      toast.warning('Please enter url');
      return;
    }
    const updatedData = {
      id: tempButton.id,
      title: tempButton.title,
      type: tempButton.type,
      message: tempButton.type === 'message' ? tempButton.navigationInfo : '',
      url: tempButton.type === 'url' ? tempButton.navigationInfo : '',
      phoneNumber:
        tempButton.type === 'phoneNumber' ? tempButton.navigationInfo : '',
      goto: tempButton.type === 'goto' ? tempButton.navigationInfo : '',
    };
    setResponseList((prev) => {
      const newList = [...prev];
      if (newList[responseIndex]?.info?.button?.[index]) {
        newList[responseIndex].info.button[index] = updatedData;
      }
      return newList;
    });
    setOpen(false);
  };
  const goToOptions: TypeSimpleNode[] =
    listOfPlayGroundNode && listOfPlayGroundNode.length > 0
      ? listOfPlayGroundNode.map((node) => ({
          id: node.id,
          label: node.data.label,
        }))
      : [];
  const handleTempUpdate = (field: string, value: string) => {
    if (field === 'type') {
      setTempButton((prev) => ({
        ...prev,
        [field]: value,
        navigationInfo: value === 'goto' ? goToOptions[0].id || '' : '',
      }));
      if (value === 'goto') {
        localStorage.setItem('nodeId', goToOptions[0].id || '');
      }
    } else {
      setTempButton((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        side={screenWidth > 890 ? 'left' : 'bottom'}
        align={screenWidth > 890 ? 'center' : 'center'}
        sideOffset={screenWidth > 890 ? 12 : 12}
        className='relative bg-white rounded-xl w-fit p-2 shadow-[0px_0px_12px_4px_rgba(0,0,0,0.08)]'
      >
        {screenWidth > 890 ? (
          <div className='absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-3 bg-white rotate-45 shadow-[0px_0px_12px_rgba(0,0,0,0.08)]'></div>
        ) : (
          <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rotate-45 shadow-[0px_0px_12px_rgba(0,0,0,0.08)]'></div>
        )}
        <div className='p-3 bg-white flex flex-col gap-2'>
          <div className='w-full'>
            <label htmlFor='title' className='text-black font-normal text-sm'>
              Button title
            </label>
            <Input
              value={tempButton.title}
              onChange={(e) => handleTempUpdate('title', e.target.value)}
              id='title'
              className='p-2 mt-1 placeholder:text-xs border border-gray-200 bg-white hover:ring-1 hover:ring-[#57C0DD] rounded-md focus:outline-none focus-visible:border-[#57C0DD] focus-visible:ring-1 focus-visible:ring-[#57C0DD] shadow-sm transition duration-200'
              placeholder='Enter button title'
            />
          </div>
          <div className='w-full'>
            <label htmlFor='type' className='text-black font-normal text-sm'>
              Button type
            </label>
            <div className='w-full !mt-1'>
              <Select
                value={tempButton.type}
                onValueChange={(value) => handleTempUpdate('type', value)}
              >
                <SelectTrigger className='p-2 border bg-white placeholder:!text-[#6F7288B2] rounded-md hover:border-[#57C0DD] focus:outline-none focus:ring-1 focus:ring-[#57C0DD]'>
                  <SelectValue
                    className='placeholder:text-xs !placeholder:!text-[#6F7288B2]'
                    placeholder='Select button type'
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='message'>Send message</SelectItem>
                  <SelectItem value='goto'>Go to block</SelectItem>
                  <SelectItem value='url'>Open url</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          {tempButton.type === 'message' ? (
            <div className='w-full'>
              <label
                htmlFor='message'
                className='text-black font-normal text-sm'
              >
                Button message
              </label>
              <Input
                value={tempButton.navigationInfo}
                onChange={(e) =>
                  handleTempUpdate('navigationInfo', e.target.value)
                }
                id='message'
                className='p-2 mt-1 placeholder:text-xs border border-gray-200 bg-white hover:ring-1 hover:ring-[#57C0DD] rounded-md focus:outline-none focus-visible:border-[#57C0DD] focus-visible:ring-1 focus-visible:ring-[#57C0DD] shadow-sm transition duration-200'
                placeholder='Enter message'
              />
            </div>
          ) : tempButton.type === 'url' ? (
            <div className='w-full'>
              <label htmlFor='url' className='text-black font-normal text-sm'>
                Website address
              </label>
              <Input
                value={tempButton.navigationInfo}
                onChange={(e) =>
                  handleTempUpdate('navigationInfo', e.target.value)
                }
                id='url'
                className='p-2 mt-1 placeholder:text-xs border border-gray-200 bg-white hover:ring-1 hover:ring-[#57C0DD] rounded-md focus:outline-none focus-visible:border-[#57C0DD] focus-visible:ring-1 focus-visible:ring-[#57C0DD] shadow-sm transition duration-200'
                placeholder='Enter URL'
              />
            </div>
          ) : tempButton.type === 'goto' ? (
            <div className='w-full'>
              <label htmlFor='goto' className='text-black font-normal text-sm'>
                Go to
              </label>
              <div className='w-full !mt-1'>
                <Select
                  value={tempButton.navigationInfo}
                  onValueChange={(value) => {
                    localStorage.setItem('nodeId', value || '');
                    handleTempUpdate('navigationInfo', value);
                  }}
                >
                  <SelectTrigger className='p-2 border bg-white placeholder:!text-[#6F7288B2] rounded-md hover:border-[#57C0DD] focus:outline-none focus:ring-1 focus:ring-[#57C0DD]'>
                    <SelectValue
                      className='placeholder:text-xs placeholder:!text-[#6F7288B2]'
                      placeholder='Select value'
                    />
                  </SelectTrigger>
                  <SelectContent className='max-h-[200px] overflow-y-scroll'>
                    {goToOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : null}
          <Button
            onClick={handleSave}
            className='text-xs bg-gradient-to-r mt-2 !h-fit !p-1 md:!p-[1px] hover:from-[#53A7DD] hover:to-[#58C8DD] from-[#58C8DD] to-[#53A7DD] max-[500px]:h-8 md:text-lg text-white flex gap-2 items-center rounded'
          >
            save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ButtonInteractionDialog;
