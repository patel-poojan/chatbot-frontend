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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

const GoToStepDialog = ({
  trigger,
  nodeId,
}: {
  trigger: React.ReactNode;
  nodeId: string;
}) => {
  const [isDialog, setIsDialog] = useState(false);
  const [nodeInfo, setNodeInfo] = useState<TypeNodeInfo | null>(null);
  const params = useParams();
  const playgroundId = params.id;
  const { refetchHandler } = usePlayground();
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
    if (nodeId && playgroundId && isDialog) {
      fetchNodeInformation({
        nodeId,
        playgroundId: playgroundId as string,
      });
    }
  }, [fetchNodeInformation, isDialog, nodeId, playgroundId]);
  const updateHandler = () => {
    if (nodeInfo && nodeId && playgroundId && isDialog) {
      updateNodeInformation({
        nodeId,
        playgroundId: playgroundId as string,
        data: nodeInfo,
      });
    }
  };
  return (
    <Dialog open={isDialog} onOpenChange={setIsDialog}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='sm:-right-[10rem] shadow-none !bg-transparent fixed translate-y-0 !top-[4.9dvh] sm:left-[unset] gap-0 rounded-lg transform w-[90vw] max-w-[25.5rem] border-none p-0'>
        <DialogHeader>
          <DialogTitle className='sr-only text-lg font-semibold text-gray-800'>
            Go to step Node
          </DialogTitle>
          <DialogDescription
            id='dialog-description'
            className='text-sm sr-only text-gray-600'
          >
            Information related to the go to step node.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col max-h-[90.2dvh] sm:max-h-[84dvh] w-full'>
          {(fetchPending || updatePending) && <Loader />}
          <div className='p-4 rounded-t-lg bg-white'>
            <div className='flex items-center justify-between mb-4 mt-2'>
              <div className='flex items-center gap-2'>
                <Image
                  src='/images/go_to_step.svg'
                  alt='go to step logo'
                  width={20}
                  height={20}
                  quality={100}
                />
                <span className='text-[#7A7A7A] text-lg'>GO TO STEP</span>
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
              placeholder='Enter Your Message'
            />
          </div>
          <div className='bg-[#F1F1F1] p-4 rounded-b-lg  overflow-y-auto'>
            <div className='w-full'>
              <label htmlFor='type' className='text-black font-normal text-sm '>
                Block
              </label>
              <Select>
                <SelectTrigger className='p-2 mt-2 border bg-white placeholder:!text-[#6F7288B2] rounded-md hover:border-[#57C0DD] focus:outline-none focus:ring-1 focus:ring-[#57C0DD]'>
                  <SelectValue
                    className='placeholder:text-xs placeholder:!text-[#6F7288B2]'
                    placeholder='Choose target block'
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='message'>Send message</SelectItem>
                  <SelectItem value='goto'>Go to block</SelectItem>
                  <SelectItem value='url'>Open url</SelectItem>
                  <SelectItem value='phone'>Phone call</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GoToStepDialog;
