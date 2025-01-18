import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MdAutorenew, MdOutlineFormatSize } from 'react-icons/md';
import { IoIosSend, IoMdCheckmark, IoMdClose } from 'react-icons/io';
import { Input } from '@/components/ui/input';
import { PiClockCounterClockwise } from 'react-icons/pi';
import { RiDeleteBinLine } from 'react-icons/ri';
import {
  ButtonNodeResponse,
  GalleryNodeResponse,
  ImageNodeResponse,
  QuickNodeResponse,
  TextNodeResponse,
} from './NodeResponseList';
import { CiImageOn } from 'react-icons/ci';
import Image from 'next/image';
import { IoChevronDownOutline, IoChevronUpOutline } from 'react-icons/io5';
import {
  useGetNodeInformation,
  useUpdateNodeInformation,
} from '@/utils/nodeIntrection-api';
import { toast } from 'sonner';
import { axiosError } from '@/types/axiosTypes';
import { TypeNodeInfo, TypeResponseList } from '@/types/node';
import { usePlayground } from '../playgroundArea/PlaygroundContext';
import { useParams } from 'next/navigation';
import AWS from 'aws-sdk';
import { initializeAWS } from './S3Operation';

type ValidationError = {
  field: string;
  message: string;
};

const BotResponseDialog = ({
  trigger,
  nodeId,
}: {
  trigger: React.ReactNode;
  nodeId: string;
}) => {
  const [isAWSInitialized, setIsAWSInitialized] = useState(false);
  useEffect(() => {
    const awsInitialized = initializeAWS();
    setIsAWSInitialized(awsInitialized);
  }, []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDialog, setIsDialog] = useState(false);
  const [nodeInfo, setNodeInfo] = useState<TypeNodeInfo | null>(null);
  const params = useParams();
  const chatbotId = params.id;
  const { refetchHandler, setSelectedGotoNode } = usePlayground();
  const [responseList, setResponseList] = useState<TypeResponseList[] | []>([]);
  const [errorComponents, setErrorComponents] = useState<number[]>([]);
  const [deletingIndices, setDeletingIndices] = useState<number[]>([]);
  const [pendingDeletions, setPendingDeletions] = useState<string[]>([]);
  const [isPendingS3Delete, setIsPendingS3Delete] = useState(false);
  const renderNodeResponse = (item: TypeResponseList, index: number) => {
    const type = item.type;
    switch (type) {
      case 'text':
        return (
          <TextNodeResponse
            info={{ description: item.info.description || '' }}
            setResponseList={setResponseList}
            index={index}
          />
        );
      case 'image':
        return (
          <ImageNodeResponse
            info={{ file: item.info.file || '' }}
            setResponseList={setResponseList}
            index={index}
          />
        );
      case 'gallery':
        return (
          <GalleryNodeResponse
            info={{
              description: item.info.description || '',
              title: item.info.title || '',
              button: item.info.button || [],
              file: item.info.file || '',
            }}
            setResponseList={setResponseList}
            index={index}
          />
        );
      case 'quick':
        return (
          <QuickNodeResponse
            info={{
              description: item.info.description || '',
              button: item.info.button || [],
            }}
            setResponseList={setResponseList}
            index={index}
          />
        );
      case 'button':
        return (
          <ButtonNodeResponse
            info={{
              description: item.info.description || '',
              button: item.info.button || [],
            }}
            setResponseList={setResponseList}
            index={index}
          />
        );
      default:
        return null;
    }
  };
  const removeResponse = (index: number) => {
    // Update error components by:
    // 1. Remove the current index if it exists in errors
    // 2. Decrement all error indices that are greater than the removed index
    setErrorComponents((prev) => {
      return prev
        .filter((errorIndex) => errorIndex !== index)
        .map((errorIndex) =>
          errorIndex > index ? errorIndex - 1 : errorIndex
        );
    });

    // Remove the response at the given index
    setResponseList((prev) => prev.filter((_, i) => i !== index));
  };
  const scroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scroll();
  }, [responseList.length]);
  const { mutate: fetchNodeInformation, isPending: fetchPending } =
    useGetNodeInformation({
      onSuccess(data) {
        if (data.data.node) {
          setNodeInfo(data.data.node);
          if (
            data.data.node.response &&
            Array.isArray(data.data.node.response)
          ) {
            const response = data.data.node.response as TypeResponseList[];
            setResponseList(response);
          }
        }
        // toast.success(data?.message);
      },

      onError(error: axiosError) {
        const errorMessage =
          error?.response?.data?.errors?.message ||
          error?.response?.data?.message ||
          'failed to fetch node information';
        toast.error(errorMessage);
      },
    });
  const { mutate: updateNodeInformation, isPending: updatePending } =
    useUpdateNodeInformation({
      onSuccess(data) {
        setIsDialog(false);
        refetchHandler();
        toast.success(data?.message);
      },

      onError(error: axiosError) {
        const errorMessage =
          error?.response?.data?.errors?.message ||
          error?.response?.data?.message ||
          'failed to update node information';
        toast.error(errorMessage);
      },
    });
  useEffect(() => {
    if (nodeId && chatbotId && isDialog) {
      fetchNodeInformation({
        nodeId,
        chatbotId: chatbotId as string,
      });
    }
  }, [fetchNodeInformation, isDialog, nodeId, chatbotId]);
  const validateBeforeSave = (
    nodeInfo: TypeNodeInfo | null,
    responseList: TypeResponseList[]
  ): ValidationError[] => {
    const errors: ValidationError[] = [];
    const errorIndices: number[] = [];

    responseList.forEach((response, index) => {
      let hasError = false;

      switch (response.type) {
        case 'text':
          if (!response.info.description?.trim()) {
            hasError = true;
            errors.push({
              field: `response_${index}`,
              message: `Text response at position ${index + 1} cannot be empty`,
            });
          }
          break;

        case 'gallery':
          if (!response.info.title?.trim()) {
            hasError = true;
            errors.push({
              field: `response_${index}`,
              message: `Gallery title at position ${index + 1} cannot be empty`,
            });
          }
          if (!response.info.description?.trim()) {
            hasError = true;
            errors.push({
              field: `response_${index}`,
              message: `Gallery description at position ${
                index + 1
              } cannot be empty`,
            });
          }
          if (!response.info.button?.length) {
            hasError = true;
            errors.push({
              field: `response_${index}`,
              message: `Gallery at position ${
                index + 1
              } must have at least one button`,
            });
          }
          break;

        case 'button':
        case 'quick':
          if (!response.info.description?.trim()) {
            hasError = true;
            errors.push({
              field: `response_${index}`,
              message: `${
                response.type === 'button' ? 'Button' : 'Quick reply'
              } description at position ${index + 1} cannot be empty`,
            });
          }
          if (!response.info.button?.length) {
            hasError = true;
            errors.push({
              field: `response_${index}`,
              message: `${
                response.type === 'button' ? 'Button' : 'Quick reply'
              } at position ${index + 1} must have at least one button`,
            });
          }
          break;

        case 'image':
          if (!response.info.file) {
            hasError = true;
            errors.push({
              field: `response_${index}`,
              message: `Image at position ${index + 1} must have a file`,
            });
          }
          break;
      }

      if (hasError) {
        errorIndices.push(index);
      }
    });

    setErrorComponents(errorIndices);
    return errors;
  };

  useEffect(() => {
    if (!isDialog) {
      setErrorComponents([]);
      setSelectedGotoNode(null);
    }
  }, [isDialog, setSelectedGotoNode]);
  const updateDelay = (index: number, increment: boolean) => {
    setResponseList((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const newDelay = increment ? item.delay + 500 : item.delay - 500;
          if (newDelay >= 500 && newDelay <= 60000) {
            return { ...item, delay: newDelay };
          }
        }
        return item;
      })
    );
  };

  const handleS3Operations = async (responses: TypeResponseList[]) => {
    if (!isAWSInitialized) {
      toast.error('AWS is not properly configured');
      return responses;
    }
    const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
    const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET as string;

    // Process files marked for deletion
    const deletePromises = pendingDeletions.map(async (fileUrl) => {
      try {
        const key = fileUrl.split('/').pop() || '';
        await s3
          .deleteObject({
            Bucket: bucket,
            Key: key,
          })
          .promise();
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    });

    // Wait for all deletions to complete
    await Promise.all(deletePromises);

    // Process current responses
    const processedResponses = await Promise.all(
      responses.map(async (response) => {
        if (response.type !== 'image' && response.type !== 'gallery') {
          return response;
        }

        const { pendingFile, previousFileUrl } = response.info;

        // If there's a new file to upload
        if (pendingFile) {
          try {
            // Upload new file
            const fileName = `${Date.now()}-${pendingFile.name}`;
            const uploadResult = await s3
              .upload({
                Bucket: bucket,
                Key: fileName,
                Body: pendingFile,
                ContentType: pendingFile.type,
                ACL: 'public-read',
              })
              .promise();

            // Delete previous file if exists
            if (previousFileUrl) {
              const previousKey = previousFileUrl.split('/').pop() || '';
              await s3
                .deleteObject({
                  Bucket: bucket,
                  Key: previousKey,
                })
                .promise();
            }

            // Return updated response with new file URL
            return {
              ...response,
              info: {
                ...response.info,
                file: uploadResult.Location,
                pendingFile: undefined,
                previousFileUrl: undefined,
              },
            };
          } catch (error) {
            console.error('Error processing file:', error);
            throw new Error('Failed to process file');
          }
        }

        // If no pending file, return cleaned response
        return {
          ...response,
          info: {
            ...response.info,
            pendingFile: undefined,
            previousFileUrl: undefined,
          },
        };
      })
    );

    return processedResponses;
  };
  // Modified updateHandler
  const updateHandler = async () => {
    if (nodeInfo && nodeId && chatbotId && isDialog) {
      const validationErrors = validateBeforeSave(nodeInfo, responseList);

      if (validationErrors.length > 0) {
        validationErrors.forEach((error) => {
          toast.error(error.message);
        });
        return;
      }
      setIsPendingS3Delete(true);
      try {
        // Process all file operations
        const processedResponses = await handleS3Operations(responseList);

        // Update node info with processed responses
        const updatedNodeInfo: TypeNodeInfo = {
          ...nodeInfo,
          response: processedResponses,
        };

        // Call the update API
        updateNodeInformation({
          nodeId,
          chatbotId: chatbotId as string,
          data: updatedNodeInfo,
        });

        // Clear pending deletions after successful update
        setPendingDeletions([]);
      } catch (error) {
        console.error('Error updating node:', error);
        toast.error('Failed to update node');
      } finally {
        setIsPendingS3Delete(false);
      }
    }
  };

  useEffect(() => {
    if (!isDialog) {
      setPendingDeletions([]);
      setIsPendingS3Delete(false);
    }
  }, [isDialog]);
  const removeResponseHandler = async (
    data: TypeResponseList,
    index: number
  ) => {
    setDeletingIndices((prev) => [...prev, index]);
    try {
      if (
        (data.type === 'image' || data.type === 'gallery') &&
        data.info.file
      ) {
        setPendingDeletions((prev) =>
          data.info.file ? [...prev, data.info.file] : prev
        );
      }
      removeResponse(index);
    } catch (error) {
      console.error('Error removing response:', error);
      toast.error('Failed to remove response');
    } finally {
      setDeletingIndices((prev) => prev.filter((i) => i !== index));
    }
  };
  return (
    <Dialog open={isDialog} onOpenChange={setIsDialog}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:-right-[17rem] shadow-none !bg-transparent fixed translate-y-0 !top-[4.9dvh] sm:left-[unset] gap-0 rounded-lg transform w-[90vw] max-w-[40rem] border-none p-0'>
        <DialogHeader>
          <DialogTitle className='sr-only text-lg font-semibold text-gray-800'>
            Bot Response Node
          </DialogTitle>
          <DialogDescription
            id='dialog-description'
            className='text-sm sr-only text-gray-600'
          >
            Information related to the bot response node.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col-reverse md:flex-row gap-6'>
          <div className='hidden md:block'>
            <NodeResponseList setResponseList={setResponseList} />
          </div>

          <div className='flex-1 relative flex flex-col max-h-[90.2dvh] sm:max-h-[84dvh]'>
            {(fetchPending || updatePending || isPendingS3Delete) && (
              <div className='absolute inset-0 z-50 flex items-center justify-center bg-[#a6dae41a] backdrop-blur-[3px]'>
                <div role='status' className='flex flex-col items-center'>
                  <div className='w-10 h-10 border-4 border-gray-200 border-t-[#3bc5dd] rounded-full animate-spin'></div>
                  <span className='sr-only'>Loading...</span>
                </div>
              </div>
            )}
            <div className='p-4 rounded-t-lg bg-white'>
              <div className='flex items-center justify-between mb-4 mt-2'>
                <div className='flex items-center gap-2'>
                  <IoIosSend className='text-[#7A7A7A] text-lg' />
                  <span className='text-[#7A7A7A] text-lg'>BOT RESPONSE</span>
                </div>
                <div className='flex items-center gap-2'>
                  <DialogClose>
                    <div className='p-1 bg-[#7A7A7A] rounded-sm'>
                      <IoMdClose className='text-white' />
                    </div>
                  </DialogClose>
                  <div
                    className='p-1 bg-[#7A7A7A] rounded-sm cursor-pointer'
                    onClick={updateHandler}
                  >
                    <IoMdCheckmark className='text-white' />
                  </div>
                </div>
              </div>
              <Input
                id='Message'
                value={nodeInfo?.data?.message ?? ''}
                onChange={(e) => {
                  setNodeInfo((prev) => {
                    if (prev === null) {
                      return null;
                    }
                    return {
                      ...prev,
                      data: {
                        ...prev.data,
                        message: e.target.value,
                      },
                    };
                  });
                }}
                className='px-4 py-3 mt-1 mb-2 rounded text-black  hover:border-[#57C0DD] focus-visible:ring-0 focus-visible:border-[#57C0DD] placeholder:text-sm placeholder:font-light w-full'
                placeholder='Enter Your Message'
              />
            </div>

            <div
              ref={scrollRef}
              className='rounded-b-lg flex-1  overflow-y-auto'
            >
              <div className='flex flex-col gap-4 bg-[#F1F1F1] p-4 min-h-[153px]'>
                {responseList.length > 0 ? (
                  responseList.map((item, index) => (
                    <div
                      className={`flex flex-col gap-4 ${
                        errorComponents.includes(index)
                          ? 'border-2 border-red-500 bg-red-50'
                          : ''
                      } rounded-lg p-2 relative`}
                      key={index}
                    >
                      {deletingIndices.includes(index) && (
                        <div className='absolute inset-0 z-10 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-lg'>
                          <div className='w-10 h-10 border-4 border-gray-200 border-t-[#3bc5dd] rounded-full animate-spin'></div>
                        </div>
                      )}
                      <div className='flex justify-between items-center'>
                        <div className='flex gap-2 items-center '>
                          <div className='flex items-center rounded-3xl gap-1 w-fit py-2 px-3 bg-[#424D50] min-w-[137.5px] '>
                            <PiClockCounterClockwise className='text-white text-lg' />
                            <span className='text-white text-sm'>
                              {item?.delay / 1000} sec delay
                            </span>
                          </div>
                          <div>
                            <IoChevronUpOutline
                              className={`cursor-pointer  ${
                                item?.delay < 6000
                                  ? 'hover:text-[#57C0DD]'
                                  : 'opacity-10'
                              }`}
                              onClick={() => updateDelay(index, true)}
                            />
                            <IoChevronDownOutline
                              className={`cursor-pointer  ${
                                item?.delay > 500
                                  ? 'hover:text-[#57C0DD]'
                                  : 'opacity-10'
                              }`}
                              onClick={() => updateDelay(index, false)}
                            />
                          </div>
                        </div>
                        <div
                          className={`${
                            deletingIndices.includes(index)
                              ? 'cursor-wait'
                              : 'cursor-pointer hover:bg-red-100'
                          } flex items-center justify-center bg-white rounded-full w-10 h-10 p-2 transition-all duration-200`}
                          title={
                            deletingIndices.includes(index)
                              ? 'Deleting...'
                              : 'Delete'
                          }
                          onClick={() => {
                            if (!deletingIndices.includes(index)) {
                              removeResponseHandler(item, index);
                            }
                          }}
                        >
                          <RiDeleteBinLine className='text-red-500' />
                        </div>
                      </div>
                      {renderNodeResponse(item, index)}
                    </div>
                  ))
                ) : (
                  <div className='flex items-center justify-center mt-auto mb-auto'>
                    Not added any response
                  </div>
                )}
              </div>

              <div className='bg-white block md:hidden'>
                <NodeResponseList setResponseList={setResponseList} />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default BotResponseDialog;
const generateShortId = (title: string) => {
  const timestamp = Date.now();
  return `Chatbot${(timestamp & 0xffffff).toString(16)}${title}`;
};
export const NodeResponseList = ({
  setResponseList,
}: {
  setResponseList: React.Dispatch<React.SetStateAction<TypeResponseList[]>>;
}) => {
  const responseTypes: {
    type: 'text' | 'image' | 'button' | 'quick' | 'gallery';
    icon: JSX.Element;
    label: string;
    content: TypeResponseList;
  }[] = [
    {
      type: 'text',
      icon: <MdOutlineFormatSize className='text-[#7A7A7A] text-xl' />,
      label: 'Text',
      content: {
        type: 'text',
        delay: 2000,
        info: { description: '' },
      },
    },
    {
      type: 'image',
      icon: <CiImageOn className='text-[#7A7A7A] text-xl' />,
      label: 'Image',
      content: {
        type: 'image',
        delay: 2000,
        info: { file: '' },
      },
    },
    {
      type: 'gallery',
      icon: (
        <Image
          src='/images/gallery_thumbnail.svg'
          alt='Gallery Icon'
          width={22}
          height={22}
          quality={100}
        />
      ),
      label: 'Gallery',
      content: {
        type: 'gallery',
        delay: 2000,
        info: {
          file: '',
          title: '',
          description: '',
          button: [
            {
              id: generateShortId('gallery'),
              title: 'button',
              type: 'message',
              message: 'message',
            },
          ],
        },
      },
    },
    {
      type: 'button',
      icon: (
        <Image
          src='/images/buttons.svg'
          alt='Button Icon'
          width={18}
          height={18}
          quality={100}
        />
      ),
      label: 'Button',
      content: {
        type: 'button',
        delay: 2000,
        info: {
          description: '',
          button: [
            {
              id: generateShortId('gallery'),
              title: 'button',
              type: 'message',
              message: 'message',
            },
          ],
        },
      },
    },
    {
      type: 'quick',
      icon: <MdAutorenew className='text-[#7A7A7A] text-xl' />,
      label: 'Quick reply',
      content: {
        type: 'quick',
        delay: 2000,
        info: {
          description: '',
          button: [
            {
              id: generateShortId('gallery'),
              title: 'button',
              type: 'message',
              message: 'message',
            },
          ],
        },
      },
    },
  ];
  const addResponseWithUniqueIds = (content: TypeResponseList) => {
    const contentWithUniqueIds = {
      ...content,
      info: {
        ...content.info,
        button: content.info.button?.map((btn) => ({
          ...btn,
          id: generateShortId(`${content.type}_btn`),
        })),
      },
    };
    setResponseList((prev) => [...prev, contentWithUniqueIds]);
  };
  return (
    <div className='p-4 h-fit bg-white rounded-lg'>
      <div className='text-black text-lg font-semibold mb-2'>Response</div>
      <div className='grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3'>
        {responseTypes.map(({ type, icon, label, content }) => (
          <div
            key={type}
            className='flex flex-col items-center gap-[1px] cursor-pointer'
            onClick={() => addResponseWithUniqueIds(content)}
          >
            <div className='border border-[#7A7A7A] py-3 px-7 h-[46px] flex items-center justify-center'>
              {icon}
            </div>
            <span className='text-[#7A7A7A] font-normal text-center text-xs'>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
