import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { axiosInstance } from '@/utils/axiosInstance';
import useWindowDimensions from '@/utils/windowSize';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import React, { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { IoChevronBackOutline, IoCloseOutline } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { Loader } from '../Loader';
import { toast } from 'sonner';
import { useUpdateTrainData } from '@/utils/botCreation-api';
import { axiosError } from '@/types/axiosTypes';

interface IDocumentContent {
  active: boolean;
  url: string;
  localPath: string;
  name: string;
}

interface TrainDataType {
  statusCode: number;
  data: {
    chatbotId: string;
    documentContent: IDocumentContent[];
    websiteContent: {
      active: boolean;
      url: string;
      localPath: string;
    }[];
    pdfName: string;
    websiteUrl: string;
    type: string;
  };
  message: string;
  success: boolean;
}
const AIKnowledge = ({
  chatbotName,
  setAiSection,
  chatbotId,
}: {
  chatbotName: string;
  setAiSection: React.Dispatch<React.SetStateAction<boolean>>;
  chatbotId: string;
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const [tab, setTab] = useState('websites');
  const [initialIndex, setInitialIndex] = useState(0);
  const [listOfDocument, setListOfDocument] = useState<
    {
      active: boolean;
      url: string;
      localPath: string;
      name: string;
    }[]
  >([]);
  const [listOfWebsites, setListOfWebsites] = useState<
    {
      active: boolean;
      url: string;
      localPath: string;
    }[]
  >([]);

  const [files, setFiles] = useState<File[]>([]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files!);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Append new files to the existing ones
  };
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const fetchTrainData = async () => {
    const response: TrainDataType = await axiosInstance.get(
      `/chatbot/${chatbotId}/chatbotDoc`
    );
    if (response.success) {
      if (response?.data?.documentContent) {
        setListOfDocument(response?.data?.documentContent);
      }
      if (response?.data?.websiteContent) {
        setListOfWebsites(response?.data?.websiteContent);
      }
    } else {
      toast.error('failed to fetch data');
    }
  };
  const { isLoading: loadTrainData, refetch: refetchTrainData } = useQuery({
    queryKey: ['train', 'data'],
    queryFn: fetchTrainData,
  });
  const { mutate: onUpdate, isPending: isPendingToUpdate } = useUpdateTrainData(
    {
      onSuccess(data) {
        refetchTrainData();
        setInitialIndex(0);
        setFiles([]);
        toast.success(data?.message);
      },
      onError(error: axiosError) {
        const errorMessage =
          error?.response?.data?.errors?.message ||
          error?.response?.data?.message ||
          'Failed to update';
        toast.error(errorMessage);
      },
    }
  );

  const { mutate: onRecrawl, isPending: isPendingToRecrawl } =
    useUpdateTrainData({
      onSuccess(data) {
        refetchTrainData();
        setInitialIndex(0);
        toast.success(data?.message);
      },
      onError(error: axiosError) {
        const errorMessage =
          error?.response?.data?.errors?.message ||
          error?.response?.data?.message ||
          'Failed to update';
        toast.error(errorMessage);
      },
    });

  const updateHandler = async () => {
    if (tab === 'documents' && listOfDocument.length === 0) {
      toast.warning('You cannot update with empty data');
      return;
    } else if (tab === 'websites' && listOfWebsites.length === 0) {
      toast.warning('You cannot update with empty data');
      return;
    } else {
      const data = {
        chatbotId: chatbotId,
        details:
          tab === 'documents'
            ? { documentContent: listOfDocument }
            : { websiteContent: listOfWebsites },
      };
      onUpdate(data);
    }
  };

  const recrawlWebsiteHandler = async () => {
    const data = {
      chatbotId: chatbotId,
      details: {},
    };
    onRecrawl(data);
  };

  // Handle delete functionality
  const handleDelete = (index: number) => {
    if (tab === 'documents' && listOfDocument.length <= 1) {
      toast.warning('At least one document must remain');
      return;
    } else if (tab === 'websites' && listOfWebsites.length <= 1) {
      toast.warning('At least one website must remain');
      return;
    }

    if (tab === 'documents') {
      setListOfDocument((prev) => prev.filter((_, i) => i !== index));
    } else {
      setListOfWebsites((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Handle toggle functionality
  const handleToggle = (index: number) => {
    if (tab === 'documents') {
      // Check if trying to disable the last active document
      if (
        listOfDocument[index].active && // If currently active
        listOfDocument.filter((item) => item.active).length === 1 // And it's the only active one
      ) {
        toast.warning('At least one document must remain active');
        return;
      }

      setListOfDocument((prev) =>
        prev.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              active: !item.active,
            };
          }
          return item;
        })
      );
    } else {
      // Check if trying to disable the last active website
      if (
        listOfWebsites[index].active && // If currently active
        listOfWebsites.filter((item) => item.active).length === 1 // And it's the only active one
      ) {
        toast.warning('At least one website must remain active');
        return;
      }

      setListOfWebsites((prev) =>
        prev.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              active: !item.active,
            };
          }
          return item;
        })
      );
    }
  };

  // Get current list based on selected tab
  const getCurrentList = () => {
    return tab === 'documents' ? listOfDocument : listOfWebsites;
  };
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
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.warning(`${file.name} must be less than 10MB`);
        return false;
      }
    }

    return true;
  };
  const handleTrainAgent = () => {
    if (files.length === 0) {
      toast.warning('Please select document');
    } else if (!validateFiles(files)) {
      return;
    } else {
      onUpdate({
        chatbotId: chatbotId,
        details: {
          document: files,
          type: 'document',
          documentContent: listOfDocument,
          websiteContent: listOfWebsites,
        },
      });
    }
  };
  return (
    <div
      className='flex flex-col gap-4 sm:gap-6 rounded-xl '
      style={{
        height:
          screenWidth > 500 ? 'calc(100dvh - 72px)' : 'calc(100dvh - 96px)',
      }}
    >
      {(loadTrainData || isPendingToUpdate || isPendingToRecrawl) && <Loader />}
      <div className='flex mx-2 justify-between items-center'>
        <div
          className='p-3 h-9  flex items-center cursor-pointer justify-center rounded-lg bg-white'
          style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
        >
          {chatbotName ?? ''}
        </div>

        <div
          className='p-2 bg-white rounded-xl cursor-pointer mt-2 sm:mt-0'
          onClick={() => setAiSection(false)}
          style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
        >
          <IoCloseOutline className='text-lg' />
        </div>
      </div>

      <div
        className='flex-1 border bg-white flex flex-col md:flex-row overflow-hidden !rounded-xl'
        style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
      >
        <div
          className='w-full md:w-[30%] lg:w-[25%] xl:w-[18%] py-2 px-6 md:p-6 overflow-hidden'
          style={{ boxShadow: '1px 0px 8px 2px #00000014' }}
        >
          <div className='text-[#1E255E] text-xl font-medium text-center mb-2 md:mb-4'>
            AI Knowledge
          </div>
          <div className='flex justify-center md:justify-normal gap-5 md:gap-0 md:flex-col '>
            {['websites', 'documents'].map((item) => (
              <div className='flex justify-between items-center' key={item}>
                <div
                  className={`text-base sm:text-lg font-normal cursor-pointer ${
                    tab === item ? 'text-[#57C0DD]' : 'text-black'
                  }`}
                  onClick={() => setTab(item)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </div>
                <div className='text-[#7A7A7A] text-base font-medium hidden md:block'>
                  {item === 'websites'
                    ? listOfWebsites.length
                    : listOfDocument.length}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className='w-full  md:w-[70%] lg:w-[75%] xl:w-[82%] overflow-hidden px-4 sm:px-6 pt-4 sm:pt-6 mb-4 sm:mb-6 flex flex-1 gap-4 flex-col'>
          {initialIndex === 0 ? (
            <>
              <div className='flex items-center justify-center sm:justify-between gap-2 flex-wrap'>
                <div className='text-[#1E255E] capitalize text-lg sm:text-xl font-medium text-center hidden sm:block'>
                  {tab}
                </div>
                <div className='flex items-center gap-3 '>
                  <Button
                    className='w-fit text-white bg-[#232323] hover:bg-[#232323]  px-2 py-1 sm:py-2 rounded-lg'
                    onClick={recrawlWebsiteHandler}
                  >
                    Recrawl
                  </Button>
                  <Button
                    className='bg-[#232323] w-fit rounded-lg flex items-center cursor-pointer gap-1 px-2 py-1 sm:py-2'
                    onClick={() => setInitialIndex(1)}
                  >
                    <FaPlus className='text-[#EFEFEF] text-base' />
                    <div className='text-xs text-[#EFEFEF]'>Add Document</div>
                  </Button>
                  <Button
                    className='w-fit text-white bg-gradient-to-r hover:from-[#53A7DD] hover:to-[#58C8DD]  from-[#58C8DD] to-[#53A7DD] px-2 py-1 sm:py-2 rounded-lg'
                    onClick={updateHandler}
                  >
                    Update
                  </Button>
                </div>
              </div>
              <div className='flex flex-col flex-1 h-full'>
                <Table className='min-w-full md:table-fixed'>
                  <TableHeader className='bg-[#57C0DD1A] backdrop-blur-3xl sticky top-0 z-10'>
                    <TableRow>
                      <TableHead className='py-2 text-start w-[40%] md:w-[45%]'>
                        <div className='flex items-center flex-wrap justify-start gap-1'>
                          <span className='text-[#1E255E] font-medium'>
                            {tab === 'websites'
                              ? 'Website URL'
                              : 'Document Name'}
                          </span>
                        </div>
                      </TableHead>

                      <TableHead className='py-2 text-center w-[20%] md:w-[20%]'>
                        <div className='flex items-center flex-wrap justify-center'>
                          <span className='text-[#1E255E] font-medium'>
                            State
                          </span>
                        </div>
                      </TableHead>
                      <TableHead className='py-2 text-center w-[20%] md:w-[15%]'>
                        <div className='flex items-center flex-wrap justify-center'>
                          <span className='text-[#1E255E] font-medium'>
                            Action
                          </span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className='overflow-y-auto '>
                    {Array.isArray(getCurrentList()) &&
                    getCurrentList().length > 0 ? (
                      getCurrentList().map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell className='text-left'>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div className='flex text-[#1E255E] font-normal items-center justify-start'>
                                    {tab === 'documents'
                                      ? (detail as IDocumentContent).name ?? '-'
                                      : detail?.url
                                      ? detail.url.length > 30
                                        ? detail.url.substring(0, 30) + '...'
                                        : detail.url
                                      : ''}
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent
                                  side='bottom'
                                  align='center'
                                  style={{
                                    boxShadow: '0px 0px 4px 0px #0000001F',
                                  }}
                                  className='p-1 bg-[#57C0DD] text-white !z-50 max-w-[300px]'
                                >
                                  {tab === 'documents'
                                    ? (detail as IDocumentContent)?.name ?? ''
                                    : detail?.url ?? ''}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>

                          <TableCell className='text-center'>
                            <div
                              className={`flex font-normal  ${
                                detail.active
                                  ? 'text-[#008000]'
                                  : 'text-[#FF0000]'
                              } break-all items-center justify-center`}
                            >
                              {detail.active ? '' : 'Not '}Used by AI
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className='flex  justify-center gap-2 align-baseline'>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div>
                                      <Switch
                                        checked={detail.active}
                                        onCheckedChange={() =>
                                          handleToggle(index)
                                        }
                                      />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side='bottom'
                                    align='center'
                                    style={{
                                      boxShadow: '0px 0px 4px 0px #0000001F',
                                    }}
                                    className=' p-1 bg-[#57C0DD] text-white !z-50'
                                  >
                                    {detail.active ? 'AI Enable' : 'AI Disable'}
                                  </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button onClick={() => handleDelete(index)}>
                                      <RiDeleteBin6Line className='text-lg cursor-pointer' />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side='bottom'
                                    align='center'
                                    style={{
                                      boxShadow: '0px 0px 4px 0px #0000001F',
                                    }}
                                    className='mt-1 p-1 bg-[#57C0DD] text-white !z-50'
                                  >
                                    Delete
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell className='text-center py-4' colSpan={4}>
                          <div className='text-[#1E255E] font-normal'>
                            No data
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className='flex-1 flex flex-col overflow-hidden'>
              <div className='flex items-center gap-3'>
                <IoChevronBackOutline
                  className='text-[#1E255E] cursor-pointer'
                  onClick={() => setInitialIndex(0)}
                />
                <span className='text-[#1E255E] capitalize text-lg sm:text-xl font-medium text-center '>
                  Documents
                </span>
              </div>
              <div className='my-1 sm:my-2 ms-2 text-black font-normal '>
                {`Crawl your document's content to get answers to popular user
                questions.`}
              </div>
              <div className='flex-1 flex flex-col mx-2 relative overflow-hidden'>
                <div className='flex-1 overflow-y-auto '>
                  <div className='grid overflow-y-auto gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 '>
                    {files.map((file, index) => (
                      <div key={index}>
                        <div className='border-[#CCCCCC] border border-dashed  flex flex-col items-center justify-center gap-2 w-full h-36'>
                          <Image
                            src='/images/file_pic.svg'
                            alt='upload'
                            width={84}
                            height={84}
                            quality={100}
                          />
                        </div>
                        <label className='flex items-center justify-between border border-[#57C0DD]  w-full  p-2'>
                          <div className='flex justify-between items-center w-full gap-2'>
                            <span className='text-sm truncate sm:text-base w-full text-center text-[#57C0DD]'>
                              {file.name}
                            </span>
                            <IoCloseOutline
                              className='text-lg text-[#57C0DD] cursor-pointer'
                              onClick={() => handleRemoveFile(index)}
                            />
                          </div>
                        </label>
                      </div>
                    ))}
                    <div>
                      <div className='border-[#CCCCCC] border border-dashed flex flex-col items-center justify-center gap-2 w-full h-36'>
                        <Image
                          src='/images/arrow_upload.svg'
                          alt='upload'
                          width={43}
                          height={43}
                          quality={100}
                        />
                        <div className='text-[#7E7E7E] font-normal text-sm'>
                          PDF only, max 10MB.
                        </div>
                      </div>
                      <label className='flex items-center justify-between border border-[#57C0DD]  w-full  p-2 cursor-pointer'>
                        <input
                          type='file'
                          className='hidden'
                          onChange={handleFileChange}
                        />
                        <span className='text-sm sm:text-base w-full text-center text-[#57C0DD]'>
                          Choose file
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <Button
                  type='button'
                  onClick={handleTrainAgent}
                  className='mt-2 h-fit relative ms-auto w-max bottom-0 right-0 text-white bg-gradient-to-r hover:from-[#53A7DD] hover:to-[#58C8DD]  from-[#58C8DD] to-[#53A7DD] py-3 rounded-xl'
                >
                  Train ChatAgent
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIKnowledge;
