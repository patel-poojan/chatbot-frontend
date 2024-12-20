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
import { Loader } from '../../Loader';

const BotResponseDialog = ({
  trigger,
  nodeId,
}: {
  trigger: React.ReactNode;
  nodeId: string;
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDialog, setIsDialog] = useState(false);
  const [nodeInfo, setNodeInfo] = useState<TypeNodeInfo | null>(null);
  const params = useParams();
  const playgroundId = params.id;
  const { refetchHandler } = usePlayground();
  const [responseList, setResponseList] = useState<TypeResponseList[] | []>([]);

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
        return <ImageNodeResponse />;
      case 'gallery':
        return (
          <GalleryNodeResponse
            info={{
              description: item.info.description || '',
              title: item.info.title || '',
              button: item.info.button || [],
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
    setResponseList((prev) => prev.filter((_, i) => i !== index));
  };
  const scroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scroll();
  }, [responseList]);

  const { mutate: fetchNodeInformation, isPending: fetchPending } =
    useGetNodeInformation({
      onSuccess(data) {
        if (data.data.node) {
          setNodeInfo(data.data.node);
          if (Array.isArray(data.data.node.response)) {
            setResponseList(data.data.node.response);
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
    if (nodeId && playgroundId && isDialog) {
      fetchNodeInformation({
        nodeId,
        playgroundId: playgroundId as string,
      });
    }
  }, [fetchNodeInformation, isDialog, nodeId, playgroundId]);
  const updateHandler = () => {
    if (nodeInfo && nodeId && playgroundId && isDialog) {
      const updatedNodeInfo: TypeNodeInfo = {
        ...nodeInfo,
        response: responseList,
      };
      updateNodeInformation({
        nodeId,
        playgroundId: playgroundId as string,
        data: updatedNodeInfo,
      });
    }
  };
  const updateDelay = (index: number, increment: boolean) => {
    setResponseList((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          const newDelay = increment ? item.delay + 500 : item.delay - 500;
          if (newDelay >= 1000 && newDelay <= 60000) {
            return { ...item, delay: newDelay };
          }
        }
        return item;
      })
    );
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

          <div className='flex-1 flex flex-col max-h-[90.2dvh] sm:max-h-[84dvh]'>
            {(fetchPending || updatePending) && <Loader />}
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
            {responseList.length > 0 && (
              <div
                ref={scrollRef}
                className='rounded-b-lg flex-1  overflow-y-auto'
              >
                <div className='flex flex-col gap-4 bg-[#F1F1F1] p-4'>
                  {responseList.map((item, index) => (
                    <div className='flex flex-col gap-4' key={index}>
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
                                item?.delay > 1000
                                  ? 'hover:text-[#57C0DD]'
                                  : 'opacity-10'
                              }`}
                              onClick={() => updateDelay(index, false)}
                            />
                          </div>
                        </div>
                        <div
                          className={`${
                            index === 0
                              ? 'cursor-not-allowed opacity-50'
                              : 'cursor-pointer hover:bg-red-100'
                          } flex items-center justify-center bg-white rounded-full w-10 h-10 p-2 transition-all duration-200`}
                          title={index !== 0 ? 'Delete' : 'Cannot delete'}
                          onClick={() => {
                            index !== 0 && removeResponse(index);
                          }}
                        >
                          <RiDeleteBinLine className='text-red-500' />
                        </div>
                      </div>
                      {renderNodeResponse(item, index)}
                    </div>
                  ))}
                </div>
                <div className='bg-white block md:hidden'>
                  <NodeResponseList setResponseList={setResponseList} />
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default BotResponseDialog;

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
          button: [{ title: 'button', type: 'message', navigationInfo: '' }],
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
          button: [{ title: 'button', type: 'message', navigationInfo: '' }],
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
          button: [{ title: 'button', type: 'message', navigationInfo: '' }],
        },
      },
    },
  ];

  return (
    <div className='p-4 h-fit bg-white rounded-lg'>
      <div className='text-black text-lg font-semibold mb-2'>Response</div>
      <div className='grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3'>
        {responseTypes.map(({ type, icon, label, content }) => (
          <div
            key={type}
            className='flex flex-col items-center gap-[1px] cursor-pointer'
            onClick={() => setResponseList((prev) => [...prev, content])}
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
