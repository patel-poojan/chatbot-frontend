import { ResponseInfo, TypeBotResponse, TypeButton } from '@/types/node';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export const TextResponse = ({ info }: { info: ResponseInfo }) => {
  return (
    <div className='resize-none border border-transparent text-sm bg-white p-3  rounded-md shadow-none focus:outline-none  focus-visible:ring-0 overflow-y-auto'>
      {info.description}
    </div>
  );
};

export const ImageResponse = ({ info }: { info: ResponseInfo }) => {
  return (
    <div className='w-9/12 h-64'>
      <Image
        src={info.file || ''}
        alt='Selected'
        layout='fill'
        objectFit='cover'
        priority
        className='rounded'
      />
    </div>
  );
};

export const GalleryResponse = ({
  info,
  onButtonSearch,
}: {
  info: ResponseInfo;
  onButtonSearch: (info: TypeButton) => void;
}) => {
  return (
    <div className='w-8/12'>
      <div className='h-52'>
        <Image
          src={info.file || ''}
          alt='Selected'
          layout='fill'
          objectFit='cover'
          priority
          className='rounded'
        />
      </div>

      <div>
        <div>
          <div className='px-4 py-3 bg-white shadow-none rounded-none text-sm border-transparent text-black focus:outline-none focus-visible:ring-0    w-full'>
            {info.title}
          </div>
        </div>
        <div>
          <div className='resize-none border-transparent bg-white text-sm p-3 rounded-md shadow-none focus:outline-none focus-visible:ring-0   overflow-y-auto'>
            {info.description}
          </div>
        </div>
      </div>
      <div>
        {info?.button?.map((button, i) => (
          <div
            key={i}
            onClick={() => onButtonSearch(button)}
            className='text-[#57C0DD] py-2 border text-sm cursor-pointer bg-white border-b-0 border-s-0 border-r-0 mx-auto text-center border-t'
          >
            {button.title}
          </div>
        ))}
      </div>
    </div>
  );
};
export const ButtonResponse = ({
  info,
  onButtonSearch,
}: {
  info: ResponseInfo;
  onButtonSearch: (info: TypeButton) => void;
}) => {
  return (
    <div className='w-8/12'>
      <div>
        <div className='resize-none border border-transparent text-sm bg-white p-3 rounded-md shadow-none focus:outline-none focus-visible:ring-0    overflow-y-auto'>
          {info.description}
        </div>
      </div>
      {info?.button?.map((button, i) => (
        <div
          key={i}
          onClick={() => onButtonSearch(button)}
          className='text-[#57C0DD] py-2 border cursor-pointer text-sm bg-white border-b-0 border-s-0 border-r-0 mx-auto text-center border-t'
        >
          {button.title}
        </div>
      ))}
    </div>
  );
};

export const QuickResponse = ({
  info,
  onButtonSearch,
}: {
  info: ResponseInfo;
  onButtonSearch: (info: TypeButton) => void;
}) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='resize-none border border-transparent bg-white p-3 text-sm rounded-md shadow-none focus:outline-none  focus-visible:ring-0 overflow-y-auto'>
        {info.description}
      </div>
      <div className='flex items-center flex-wrap gap-2'>
        {info?.button?.map((button, i) => (
          <div
            key={i}
            onClick={() => onButtonSearch(button)}
            className='text-[#57C0DD] cursor-pointer py-1 px-4 border bg-white text-sm border-[#57C0DD] w-fit text-center rounded-[30px]'
          >
            {button.title}
          </div>
        ))}
      </div>
    </div>
  );
};
export const UserInput = ({ data }: { data: TypeBotResponse }) => {
  return (
    <div className='flex flex-col gap-[5px] w-fit ms-auto'>
      {/* <div className='text-[#1E255E] font-medium text-xs ms-auto me-1'>You</div> */}
      <div className='bg-[#57C0DD] p-3 rounded-lg text-white font-light  text-sm w-fit'>
        {data?.userInput ?? ''}
      </div>
    </div>
  );
};
export const FAQResponse = ({ info }: { info: ResponseInfo }) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  return (
    <div className='w-10/12'>
      <div className='bg-white rounded-md'>
        {info.questionAnswer?.map((qa, index) => (
          <div key={index} className='border-b last:border-b-0'>
            <div
              onClick={() => toggleItem(index)}
              className='flex justify-between items-center p-4 cursor-pointer hover:bg-gray-50'
            >
              <div className='flex gap-2 items-center'>
                <span className='text-[#57C0DD] font-medium text-sm'>Q:</span>
                <span className='text-[#1E255E] text-sm'>{qa.question}</span>
              </div>
              <ChevronDown
                className={`text-[#57C0DD] transition-transform duration-300 ease-in-out ${
                  openItems.has(index) ? 'transform rotate-180' : ''
                }`}
                size={20}
              />
            </div>
            <div
              className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                openItems.has(index) ? 'max-h-96' : 'max-h-0'
              }`}
            >
              <div className='px-4 pb-4'>
                <div className='flex gap-2 items-start pl-6'>
                  <span className='text-[#57C0DD] font-medium text-sm'>A:</span>
                  <span className='text-gray-600 text-sm'>{qa.answer}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
