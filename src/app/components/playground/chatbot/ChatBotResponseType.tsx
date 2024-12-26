import { ResponseInfo, TypeBotResponse } from '@/types/node';
import Image from 'next/image';

export const TextResponse = ({ info }: { info: ResponseInfo }) => {
  return (
    <div className='resize-none border border-transparent bg-white p-3 rounded-md shadow-none focus:outline-none  focus-visible:ring-0 overflow-y-auto'>
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
  onButtonSearch: (buttonId: string, message: string) => void;
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
          <div className='px-4 py-3 bg-white shadow-none rounded-none border-transparent text-black focus:outline-none focus-visible:ring-0    w-full'>
            {info.title}
          </div>
        </div>
        <div>
          <div className='resize-none border-transparent bg-white p-3 rounded-md shadow-none focus:outline-none focus-visible:ring-0   overflow-y-auto'>
            {info.description}
          </div>
        </div>
      </div>
      <div>
        {info?.button?.map((button, i) => (
          <div
            key={i}
            onClick={() => onButtonSearch(button.id, button.title)}
            className='text-[#57C0DD] py-2 border cursor-pointer bg-white border-b-0 border-s-0 border-r-0 mx-auto text-center border-t'
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
  onButtonSearch: (buttonId: string, message: string) => void;
}) => {
  return (
    <div className='w-8/12'>
      <div>
        <div className='resize-none border border-transparent bg-white p-3 rounded-md shadow-none focus:outline-none focus-visible:ring-0    overflow-y-auto'>
          {info.description}
        </div>
      </div>
      {info?.button?.map((button, i) => (
        <div
          key={i}
          onClick={() => onButtonSearch(button.id, button.title)}
          className='text-[#57C0DD] py-2 border cursor-pointer bg-white border-b-0 border-s-0 border-r-0 mx-auto text-center border-t'
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
  onButtonSearch: (buttonId: string, message: string) => void;
}) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='resize-none border border-transparent bg-white p-3 rounded-md shadow-none focus:outline-none  focus-visible:ring-0 overflow-y-auto'>
        {info.description}
      </div>
      <div className='flex items-center flex-wrap gap-2'>
        {info?.button?.map((button, i) => (
          <div
            key={i}
            onClick={() => onButtonSearch(button.id, button.title)}
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
    <div className='flex flex-col gap-[10px] w-fit ms-auto'>
      <div className='text-[#1E255E] font-medium text-xs ms-auto me-1'>You</div>
      <div className='bg-[#57C0DD] p-3 rounded-lg text-white font-light  text-sm w-fit'>
        {data?.userInput ?? ''}
      </div>
    </div>
  );
};
