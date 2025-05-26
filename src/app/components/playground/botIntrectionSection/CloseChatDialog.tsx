import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { IoMdCheckmark, IoMdClose } from 'react-icons/io';
import { Input } from '@/components/ui/input';
import { TypeNodeInfo } from '@/types/node';
import { useParams } from 'next/navigation';
import { usePlayground } from '../playgroundArea/PlaygroundContext';
import {
  useGetNodeInformation,
  useUpdateNodeInformation,
} from '@/utils/nodeIntrection-api';
import { axiosError } from '@/types/axiosTypes';
import { toast } from 'sonner';
import { Loader } from '../../Loader';

const CloseChatDialog = ({
  trigger,
  nodeId,
}: {
  trigger: React.ReactNode;
  nodeId: string;
}) => {
  const { refetchHandler, setSelectedGotoNode } = usePlayground();
  const [isDialog, setIsDialog] = useState(false);
  const [nodeInfo, setNodeInfo] = useState<TypeNodeInfo | null>(null);
  const params = useParams();
  const chatbotId = params.id;
  const { mutate: fetchNodeInformation, isPending: fetchPending } =
    useGetNodeInformation({
      onSuccess(data) {
        if (data.data.node) {
          setNodeInfo(data.data.node);
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
  const updateHandler = () => {
    if (nodeInfo && nodeId && chatbotId && isDialog) {
      const updatedNodeInfo: TypeNodeInfo = {
        ...nodeInfo,
      };
      updateNodeInformation({
        nodeId,
        chatbotId: chatbotId as string,
        data: updatedNodeInfo,
      });
    }
  };
  useEffect(() => {
    if (!isDialog) {
      setSelectedGotoNode(null);
    }
  }, [isDialog, setSelectedGotoNode]);
  return (
    <Dialog open={isDialog} onOpenChange={setIsDialog}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className='sm:-right-[10rem] shadow-none !bg-transparent fixed translate-y-0 !top-[4.9dvh] sm:left-[unset] gap-0 rounded-lg transform w-[90vw] max-w-[25.5rem] border-none p-0'
      >
        <DialogHeader>
          <DialogTitle className='sr-only text-lg font-semibold text-gray-800'>
            close chat Node
          </DialogTitle>
          <DialogDescription
            id='dialog-description'
            className='text-sm sr-only text-gray-600'
          >
            Information related to the close chat node.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col max-h-[90.2dvh] sm:max-h-[84dvh] w-full'>
          {(fetchPending || updatePending) && <Loader />}
          <div className='p-4 rounded-t-lg bg-white'>
            <div className='flex items-center justify-between mb-4 mt-2'>
              <div className='flex items-center gap-2'>
                <Image
                  src='/images/close_chat.svg'
                  alt='close chat logo'
                  width={20}
                  height={20}
                  quality={100}
                />
                <span className='text-[#7A7A7A] text-lg'>Close Chat</span>
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
              id='message'
              value={nodeInfo?.data?.message ?? ''}
              maxLength={16}
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
              className='p-3 mt-1 mb-2 border border-gray-200 bg-white hover:ring-1 hover:ring-[#57C0DD] rounded-md focus:outline-none focus-visible:border-[#57C0DD] focus-visible:ring-1 focus-visible:ring-[#57C0DD] shadow-sm transition duration-200'
              placeholder='Enter title'
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CloseChatDialog;
