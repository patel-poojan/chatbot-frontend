import { ResponseInfo, TypeBotResponse, TypeButton } from '@/types/node';
import { ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export const TextResponse = ({ info }: { info: ResponseInfo }) => {
  return (
    <div className='resize-none w-10/12 border border-transparent text-sm bg-white p-3 rounded-md shadow-none focus:outline-none focus-visible:ring-0 overflow-y-auto'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => (
            <a
              {...props}
              className='text-blue-600 underline hover:text-blue-800'
              target='_blank'
              rel='noopener noreferrer'
            />
          ),
        }}
      >
        {info.description}
      </ReactMarkdown>
    </div>
  );
};
export const ErrorResponse = ({ info }: { info: ResponseInfo }) => {
  return (
    <div className='resize-none border w-10/12 border-transparent text-sm bg-white p-3 text-[red] rounded-md shadow-none focus:outline-none  focus-visible:ring-0 overflow-y-auto'>
      {info.description}
    </div>
  );
};

export const LlmResponse = ({ info }: { info: ResponseInfo }) => {
  const preservePhoneNumbers = (text: string) => {
    // First preserve any existing markdown phone links by simplifying their format
    const preserveMarkdownLinks = text.replace(
      /\[(\+?\d[\d\s-]+)\]\(tel:[^)]+(?:\s+"[^"]+")?\)/g,
      (match, number) => `[${number}](tel:${number.replace(/\s|-/g, '')})`
    );

    // Then wrap all remaining phone numbers with backticks
    return preserveMarkdownLinks.replace(/(\+?\d[\d\s-]+)/g, '`$1`');
  };

  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/[^\d+]/g, '');
  };

  return (
    <pre
      className='resize-none border border-transparent w-10/12 text-sm bg-white p-3 rounded-md shadow-none focus:outline-none focus-visible:ring-0 overflow-y-auto whitespace-break-spaces'
      style={{
        fontFamily: 'var(--font-poppins)',
      }}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: (props) => (
            <a
              {...props}
              className='text-blue-600 underline hover:text-blue-800 inline-block'
              target='_blank'
              rel='noopener noreferrer'
            />
          ),
          code: (props) => {
            let phoneContent = '';
            if (typeof props.children === 'string') {
              phoneContent = props.children.trim();
            } else if (
              Array.isArray(props.children) &&
              typeof props.children[0] === 'string'
            ) {
              phoneContent = props.children[0].trim();
            }

            const isPhoneNumber = /^\+?\d[\d\s-]+$/.test(phoneContent);

            if (isPhoneNumber) {
              const formattedNumber = formatPhoneNumber(phoneContent);
              return (
                <a
                  href={`tel:${formattedNumber}`}
                  className='text-blue-600 hover:text-blue-800 underline cursor-pointer whitespace-nowrap font-normal inline-block mr-2'
                >
                  {phoneContent}
                </a>
              );
            }

            return <code {...props} className='inline-block' />;
          },
          p: ({ children }) => <p className='mb-3'>{children}</p>,
          li: ({ children }) => <li className='mb-2'>{children}</li>,
        }}
      >
        {preservePhoneNumbers(info.description ?? '')}
      </ReactMarkdown>
    </pre>
  );
};

export const ImageResponse = ({ info }: { info: ResponseInfo }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className='w-8/12 rounded-md'>
      <div className='relative aspect-square w-full bg-gray-100'>
        {isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md'>
            <div className='w-8 h-8 border-4 border-[#57C0DD] border-t-transparent rounded-full animate-spin' />
          </div>
        )}
        {hasError ? (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-100 rounded-md'>
            <div className='text-sm text-gray-500'>Unable to load image</div>
          </div>
        ) : (
          <Image
            src={info.file || '/api/placeholder/300/300'}
            alt={'Chat image'}
            fill
            sizes='(max-width: 300px) 100vw, 300px'
            className={`rounded-md object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            priority={true}
            quality={100}
            onLoadingComplete={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        )}
      </div>
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
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  return (
    <div className='w-8/12'>
      <div className='relative aspect-square w-full bg-gray-100 rounded-t-md overflow-hidden'>
        {!isLoading && (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
            <div className='w-8 h-8 border-4 border-[#57C0DD] border-t-transparent rounded-full animate-spin' />
          </div>
        )}
        {hasError ? (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-100'>
            <div className='text-sm text-gray-500'>Unable to load image</div>
          </div>
        ) : (
          <Image
            src={info.file || '/api/placeholder/300/300'}
            alt={'Gallery image'}
            fill
            sizes='(max-width: 300px) 100vw, 300px'
            className={`object-cover transition-opacity duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            }`}
            priority={true}
            quality={100}
            onLoadingComplete={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
        )}
      </div>

      <div>
        <div>
          <div className='px-4 py-3 bg-white shadow-none rounded-none text-sm border-transparent text-black focus:outline-none focus-visible:ring-0    w-full'>
            {info.title}
          </div>
        </div>
        <div>
          <div className='resize-none border-transparent bg-white text-sm p-3 rounded-b-md shadow-none focus:outline-none focus-visible:ring-0   overflow-y-auto'>
            {info.description}
          </div>
        </div>
      </div>
      <div>
        {info?.button?.map((button, i) => (
          <div
            key={i}
            onClick={() => onButtonSearch(button)}
            className='text-[#57C0DD] py-2 border text-sm cursor-pointer rounded-md bg-white border-b-0 border-s-0 border-r-0 mx-auto text-center border-t'
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
          className='text-[#57C0DD] py-2 border cursor-pointer text-sm bg-white rounded-md border-b-0 border-s-0 border-r-0 mx-auto text-center border-t'
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
    <div className='flex flex-col w-10/12 gap-2'>
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
    <div className='w-full'>
      <div className='w-10/12 ms-auto'>
        <div className='flex flex-col gap-[5px] w-fit  ms-auto '>
          {/* <div className='text-[#1E255E] font-medium text-xs ms-auto me-1'>You</div> */}
          <div className='bg-[#57C0DD] p-3 rounded-md text-white font-light  text-sm'>
            {data?.userInput ?? ''}
          </div>
        </div>
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
