import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ResponseInfo } from '@/types/node';
import Image from 'next/image';

export const TextResponse = ({ info }: { info: ResponseInfo }) => {
  return (
    <Textarea
      value={info.description}
      placeholder='Entre bot response'
      rows={3}
      maxLength={1024}
      className='resize-none border border-transparent bg-white p-3 rounded-md shadow-none focus:outline-none hover:border-[#57C0DD] focus-visible:ring-0 overflow-y-auto'
    />
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

export const GalleryNodeResponse = ({ info }: { info: ResponseInfo }) => {
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
          <Input
            id='Title'
            value={info.title || ''}
            className='px-4 py-3 bg-white shadow-none rounded-none border-transparent text-black focus:outline-none focus-visible:ring-0 hover:border-[#57C0DD] focus-visible:border-[#57C0DD] placeholder:text-base w-full'
            placeholder='Type card title'
          />
        </div>
        <div>
          <Textarea
            placeholder='Type card description'
            value={info.description || ''}
            rows={2}
            maxLength={80}
            className='resize-none border-transparent bg-white p-3 rounded-md shadow-none focus:outline-none focus-visible:ring-0 hover:border-[#57C0DD] focus-visible:border-[#57C0DD] overflow-y-auto'
          />
        </div>
      </div>
      <div>
        {info?.button?.map((button, i) => (
          <div
            key={i}
            className='text-[#57C0DD] py-2 border cursor-pointer bg-white border-b-0 border-s-0 border-r-0 mx-auto text-center border-t'
          >
            {button.title}
          </div>
        ))}
      </div>
    </div>
  );
};
export const ButtonResponse = ({ info }: { info: ResponseInfo }) => {
  return (
    <div className='w-8/12'>
      <div>
        <Textarea
          value={info.description || ''}
          placeholder='Entre your message...'
          rows={4}
          maxLength={80}
          className='resize-none border border-transparent bg-white p-3 rounded-md shadow-none focus:outline-none focus-visible:ring-0 hover:border-[#57C0DD] focus-visible:border-[#57C0DD]  overflow-y-auto'
        />
      </div>
      {info?.button?.map((button, i) => (
        <div
          key={i}
          className='text-[#57C0DD] py-2 border cursor-pointer bg-white border-b-0 border-s-0 border-r-0 mx-auto text-center border-t'
        >
          {button.title}
        </div>
      ))}
    </div>
  );
};

export const QuickNodeResponse = ({ info }: { info: ResponseInfo }) => {
  return (
    <div className='flex flex-col gap-2'>
      <Textarea
        value={info.description || ''}
        placeholder='Enter Your message...'
        rows={3}
        className='resize-none border border-transparent bg-white p-3 rounded-md shadow-none focus:outline-none hover:border-[#57C0DD] focus-visible:ring-0 overflow-y-auto'
      />
      <div className='flex items-center flex-wrap gap-2'>
        {info?.button?.map((button, i) => (
          <div
            key={i}
            className='text-[#57C0DD] cursor-pointer py-1 px-4 border bg-white text-sm border-[#57C0DD] w-fit text-center rounded-[30px]'
          >
            {button.title}
          </div>
        ))}
      </div>
    </div>
  );
};
