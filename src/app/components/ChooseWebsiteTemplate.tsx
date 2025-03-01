import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import React, { useState } from 'react';
import { IoIosArrowDown, IoIosArrowUp, IoMdCheckmark } from 'react-icons/io';
import { TfiWorld } from 'react-icons/tfi';
import { toast } from 'sonner';
import { isValidUrl } from '@/utils/validator';

const ChooseWebsiteTemplate = ({
  websiteStepHandler,
  scanType,
  websiteUrl,
  setWebsiteUrl,
  setScanType,
}: {
  websiteStepHandler: (type: 'up' | 'down') => void;
  scanType: string;
  websiteUrl: string;
  setWebsiteUrl: React.Dispatch<React.SetStateAction<string>>;
  setScanType: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [dropDown, setDropDown] = useState(false);
  const continueHandler = () => {
    if (websiteUrl.length === 0) {
      toast.warning('Please enter website url');
    } else if (!isValidUrl(websiteUrl)) {
      toast.warning('Please enter a valid website url');
    } else if (scanType.length === 0) {
      toast.warning('Please select scan type');
    } else {
      websiteStepHandler('up');
    }
  };
  return (
    <div
      className='h-full flex-1 flex flex-col justify-between w-full bg-white rounded-3xl p-4 sm:p-6 lg:px-12 lg:py-10 '
      style={{ boxShadow: '0px 0px 12px 4px #00000014' }}
    >
      <div>
        <div className='flex gap-3 items-center mb-2'>
          <TfiWorld className='text-xl sm:text-2xl font-bold text-[#57C0DD]' />
          <p className='font-semibold text-black text-lg sm:text-2xl'>
            Website
          </p>
        </div>
        <p className='font-normal text-black text-sm sm:text-base'>
          Scan your website content to generate answers to your customer
          questions.
        </p>
        <div
          className='h-12 border rounded-xl
         mt-4 mb-3 flex items-center bg-[#F2F2F2]'
        >
          <Input
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            className='flex-1 border-none shadow-none pe-[2px] sm:pe-1 bg-transparent focus-visible:ring-0 text-sm sm:text-base placeholder:text-sm sm:placeholder:text-base placeholder:font-light '
            placeholder='Enter a URL address'
          ></Input>
          <div className='mx-2 sm:mx-3 md:mx-5'>
            <DropdownMenu onOpenChange={() => setDropDown(!dropDown)}>
              <DropdownMenuTrigger className='focus-visible:!outline-none w-full md:w-auto text-sm sm:text-base md:text-lg font-normal text-black flex items-center justify-between gap-1 sm:gap-2'>
                {scanType === 'FULLPAGE'
                  ? 'Scan all pages'
                  : 'Scan the current page '}
                {dropDown ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </DropdownMenuTrigger>
              <DropdownMenuContent className='p-2 md:p-3 rounded-xl mt-3  me-12 sm:me-20 md:me-28 w-auto'>
                <DropdownMenuItem
                  className='p-2  hover:bg-[#EEEEEE] flex flex-col justify-start items-start cursor-pointer'
                  onClick={() => setScanType('FULLPAGE')}
                >
                  <div className='text-sm sm:text-base md:text-lg font-medium flex items-center justify-between w-full'>
                    Scan all pages
                    {scanType === 'FULLPAGE' && <IoMdCheckmark />}
                  </div>
                  <div className='text-xs sm:text-sm md:text-base font-light'>
                    Scans the page and all linked pages.
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='p-2  hover:bg-[#EEEEEE] flex flex-col justify-start items-start cursor-pointer'
                  onClick={() => setScanType('SINGLEPAGE')}
                >
                  <div className='text-sm sm:text-base md:text-lg font-medium flex items-center justify-between w-full'>
                    Scan the current page
                    {scanType === 'SINGLEPAGE' && <IoMdCheckmark />}
                  </div>
                  <div className='text-xs sm:text-sm md:text-base font-light'>
                    Scans only the given page.
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className='font-light text-[#999999] text-xs'>
          By sharing your URL, you confirm you have the necessary rights to
          share its content.
        </p>
      </div>

      <div className='mt-6 sm:mt-0  sm:ms-auto flex  items-center gap-4'>
        {/* <AlertDialog
          botId={botId}
          trigger={
            <Button
              className='w-full sm:w-auto px-8 py-2 sm:px-11 border border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent'
              // onClick={() => router.back()}
            >
              Go Back
            </Button>
          }
        /> */}
        <Button
          className='w-full sm:w-auto px-8 py-2 sm:px-11 border border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent'
          onClick={() => websiteStepHandler('down')}
        >
          Go Back
        </Button>
        <Button
          className='w-full sm:w-auto px-8 py-2 sm:px-11 border bg-gradient-to-r hover:from-[#53A7DD] hover:to-[#58C8DD]  from-[#58C8DD] to-[#53A7DD] hover:bg-transparent'
          onClick={() => continueHandler()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ChooseWebsiteTemplate;
