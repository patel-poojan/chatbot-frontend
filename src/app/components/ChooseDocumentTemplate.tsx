'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import Image from 'next/image';
import { CgNotes } from 'react-icons/cg';
import { FaArrowRightLong } from 'react-icons/fa6';
import { IoCloseOutline } from 'react-icons/io5';
import { BiGlobe } from 'react-icons/bi';
import { toast } from 'sonner';
import AlertDialog from './AlertDialog';
import { Loader } from './Loader';
import useWindowDimensions from '@/utils/windowSize';
import { useFetchURLForTraining, useTrainBot } from '@/utils/botCreation-api';
import { axiosError } from '../../types/axiosTypes';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

// Types
interface DocumentTemplateProps {
  optional: boolean;
  stepHandler: () => void;
  botId: string;
  type: string;
  scanType?: string;
  websiteUrl?: string;
}

interface FileUploadProps {
  files: File[];
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

// Components
const FileUploadGrid: React.FC<FileUploadProps> = ({
  files,
  onFileChange,
  onRemoveFile,
}) => (
  <div className='grid overflow-y-auto gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
    {files.map((file, index) => (
      <FileCard key={index} file={file} onRemove={() => onRemoveFile(index)} />
    ))}
    <UploadCard onFileChange={onFileChange} />
  </div>
);

const FileCard: React.FC<{ file: File; onRemove: () => void }> = ({
  file,
  onRemove,
}) => (
  <div>
    <div className='border-[#CCCCCC] border border-dashed flex flex-col items-center justify-center gap-2 w-full h-36'>
      <Image
        src='/images/file_pic.svg'
        alt='upload'
        width={84}
        height={84}
        quality={100}
      />
    </div>
    <label className='flex items-center justify-between border border-[#57C0DD] w-full p-2'>
      <div className='flex justify-between items-center w-full gap-2'>
        <span className='text-sm truncate sm:text-base w-full text-center text-[#57C0DD]'>
          {file.name}
        </span>
        <IoCloseOutline
          className='text-lg text-[#57C0DD] cursor-pointer'
          onClick={onRemove}
        />
      </div>
    </label>
  </div>
);

const UploadCard: React.FC<{
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ onFileChange }) => (
  <div>
    <div className='border-[#CCCCCC] border border-dashed flex flex-col items-center justify-center gap-2 w-full h-36'>
      <Image
        src='/images/arrow_upload.svg'
        alt='upload'
        width={43}
        height={43}
        quality={100}
      />
      <div className='text-[#7E7E7E] font-normal text-sm'>upload file</div>
    </div>
    <label className='flex items-center justify-between border border-[#57C0DD] w-full p-2 cursor-pointer'>
      <input type='file' className='hidden' onChange={onFileChange} />
      <span className='text-sm sm:text-base w-full text-center text-[#57C0DD]'>
        Choose file
      </span>
    </label>
  </div>
);

const WebsiteURLGrid: React.FC<{
  urls: {
    url: string;
    label: string;
  }[];
  activeUrls: string[];
  onToggle: (url: string) => void;
}> = ({ urls, activeUrls, onToggle }) => (
  <div className='grid overflow-y-auto gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
    {urls.map((urlObj, index) => (
      <div
        key={index}
        className='bg-[#f5f5f5] rounded-lg p-4 flex items-center justify-between gap-2'
      >
        <div className='space-y-1 min-w-0 flex-1'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <h3 className='text-sm font-medium text-gray-900 truncate break-all cursor-pointer'>
                  {urlObj?.label}
                </h3>
              </TooltipTrigger>
              <TooltipContent className='text-xs max-w-[300px] break-all bg-[#57C0DD] mb-1 '>
                {urlObj?.label}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className='flex-shrink-0 ml-2'>
          <Switch
            checked={activeUrls.includes(urlObj.url)}
            onCheckedChange={() => onToggle(urlObj.url)}
            className='data-[state=checked]:bg-[#57C0DD]'
          />
        </div>
      </div>
    ))}
  </div>
);

// Main Component
const ChooseDocumentTemplate: React.FC<DocumentTemplateProps> = ({
  optional,
  stepHandler,
  type,
  botId,
  scanType,
  websiteUrl,
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const [step, setStep] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [activeTrainingURLS, setActiveTrainingURLS] = useState<string[]>([]);

  const validateFiles = (files: File[]) => {
    if (files.length > 4) {
      toast.warning('Please upload no more than 4 files');
      return false;
    }
    for (const file of files) {
      if (!file.type.includes('pdf')) {
        toast.warning(`${file.name} must be a PDF file`);
        return false;
      }
      const maxSize = 3 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.warning(`${file.name} must be less than 3MB`);
        return false;
      }
    }

    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files!);
    setFiles((prev) => [...prev, ...selectedFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleToggleURL = (url: string) => {
    setActiveTrainingURLS((prev) =>
      prev.includes(url)
        ? prev.filter((activeUrl) => activeUrl !== url)
        : [...prev, url]
    );
  };

  const { mutate: onTrainBot, isPending } = useTrainBot({
    onSuccess(data) {
      toast.success(data?.message);
      stepHandler();
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'chatbot training failed';
      toast.error(errorMessage);
    },
  });

  const {
    mutate: fetchURLs,
    isPending: isPendingToFetchURLs,
    data: collectionOfURL,
  } = useFetchURLForTraining({
    onSuccess(data) {
      if (data.data.urls) {
        setActiveTrainingURLS(data.data.urls.map((url) => url.url));
      }
      toast.success(data?.message);
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'failed to fetch urls';
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (step === 1 && websiteUrl && scanType) {
      fetchURLs({
        websiteUrl,
        scanType,
      });
    }
  }, [fetchURLs, scanType, step, websiteUrl]);

  const continueHandler = () => {
    if (type === 'document' && botId) {
      if (files.length === 0) {
        toast.warning('Please select document');
      } else if (!validateFiles(files)) {
        return;
      } else {
        onTrainBot({
          chatbotId: botId,
          details: {
            document: files,
            type: 'document',
          },
        });
      }
    } else if (type === 'website' && botId) {
      if (scanType && websiteUrl) {
        if (files.length > 0 && !validateFiles(files)) {
          return;
        }
        const details = {
          websiteUrl,
          scanType,
          urls_to_scrape: activeTrainingURLS,
          type: 'website' as const,
          ...(files.length > 0 && { document: files }),
        };

        onTrainBot({
          chatbotId: botId,
          details,
        });
      } else {
        toast.error('please select scan type and website url');
      }
    }
  };

  const containerHeight =
    screenWidth > 768
      ? 'calc(100dvh - 248px)'
      : screenWidth > 640
      ? 'calc(100dvh - 206px)'
      : 'calc(100dvh - 170px)';

  return (
    <div
      className='flex flex-col justify-between w-full overflow-hidden bg-white rounded-3xl p-4 sm:p-6 md:p-8 lg:px-12 lg:py-10'
      style={{
        boxShadow: '0px 0px 12px 4px #00000014',
        height: containerHeight,
      }}
    >
      {(isPending || isPendingToFetchURLs) && <Loader />}

      {step === 0 ? (
        <div className='flex overflow-hidden gap-6 flex-col flex-1'>
          <div className='flex items-center gap-4 justify-between'>
            <div>
              <div className='flex gap-2 md:gap-3 items-center mb-2'>
                <CgNotes className='text-xl sm:text-2xl font-bold text-[#57C0DD]' />
                <p className='font-semibold text-black text-lg sm:text-2xl'>
                  Document{' '}
                  <span className='text-sm sm:text-2xl'>
                    {optional ? '(Optional)' : ''}
                  </span>
                </p>
              </div>
              <p className='font-normal text-black text-sm sm:text-base'>
                Upload document to start further process of creating chatbot
              </p>
            </div>
            {optional && (
              <div
                className='flex items-center gap-1 md:gap-2 cursor-pointer'
                onClick={() => {
                  if (step === 0 && type === 'website') {
                    setStep(1);
                  } else {
                    continueHandler();
                  }
                }}
              >
                <span className='text-[#57C0DD] text-base md:text-lg'>
                  Skip
                </span>
                <FaArrowRightLong className='text-[#57C0DD] text-base md:text-lg' />
              </div>
            )}
          </div>
          <div className='flex-1 overflow-y-auto'>
            <FileUploadGrid
              files={files}
              onFileChange={handleFileChange}
              onRemoveFile={handleRemoveFile}
            />
          </div>
        </div>
      ) : websiteUrl ? (
        <div className='flex overflow-hidden gap-6 flex-col flex-1'>
          <div className='flex items-center gap-4 justify-between'>
            <div>
              <div className='flex gap-2 md:gap-3 items-center mb-2'>
                <BiGlobe className='text-2xl sm:text-3xl text-[#57C0DD]' />
                <p className='font-semibold text-black flex items-center text-lg sm:text-2xl'>
                  Website
                  <span className='text-sm inline-block max-w-[200px] truncate overflow-hidden sm:text-base ml-3 border text-[#1E255E6a] rounded-lg py-1 px-2'>
                    {websiteUrl}
                  </span>
                </p>
              </div>
              <p className='font-normal text-black text-sm sm:text-base'>
                Manage your website URLs by enabling or disabling access to
                different sections
              </p>
            </div>
          </div>
          <div className='flex-1 overflow-y-auto'>
            {collectionOfURL?.data?.urls ? (
              <WebsiteURLGrid
                urls={collectionOfURL.data.urls}
                activeUrls={activeTrainingURLS}
                onToggle={handleToggleURL}
              />
            ) : isPendingToFetchURLs ? (
              <div>loading...</div>
            ) : (
              <div className='text-[red]'>something went wrong</div>
            )}
          </div>
        </div>
      ) : null}

      <div className='pt-6 sm:ms-auto flex items-center gap-4'>
        <AlertDialog
          botId={botId}
          trigger={
            <Button className='w-full sm:w-auto px-8 py-2 sm:px-11 border border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent'>
              Go Back
            </Button>
          }
        />
        <Button
          className='w-full sm:w-auto px-8 py-2 sm:px-11 border bg-gradient-to-r hover:from-[#53A7DD] hover:to-[#58C8DD] from-[#58C8DD] to-[#53A7DD] hover:bg-transparent'
          onClick={() => {
            if (step === 0 && type === 'website') {
              if (files.length === 0) {
                toast.warning('Please select document');
              } else if (!validateFiles(files)) {
                return;
              } else {
                setStep(1);
              }
            } else continueHandler();
          }}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ChooseDocumentTemplate;
