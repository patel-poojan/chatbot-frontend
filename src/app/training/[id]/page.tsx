'use client';
import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { IoSearchSharp } from 'react-icons/io5';
import { FaQuoteLeft } from 'react-icons/fa';
import DashboardLayout from '@/app/components/DashboardLayout';
import { axiosInstance } from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { Loader } from '@/app/components/Loader';
import { StringToDateFormatter } from '@/utils/formatter';
import { useTrainDeleteData } from '@/utils/training-api';
import { toast } from 'sonner';
import { axiosError } from '@/types/axiosTypes';
import TrainingDialog from '@/app/components/TrainingDialog';
import { TypeResponseList } from '@/types/node';
import { ReactFlowProvider } from '@xyflow/react';
import { PlaygroundProvider } from '@/app/components/playground/playgroundArea/PlaygroundContext';

interface TrainingTableProps {
  _id: string;
  chatbotId: string;
  type: string;
  phrase: string;
  response: [];
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface TrainingTableResponse {
  statusCode: number;
  data: TrainingTableProps[] | [];
  message: string;
  success: boolean;
}
const TrainingTable = ({ type }: { type: string }) => {
  const params = useParams();
  const chatbotId = params.id;

  const fetchTrainingData = async () => {
    const response: TrainingTableResponse = await axiosInstance.get(
      `/chatbot/${chatbotId}/unmatchedPhrases?type=${type}`
    );
    return response.data;
  };
  const {
    data: trainingDetails,
    isLoading: loadTrainingDetails,
    isError: errorInTrainingDetails,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: ['training', 'unmatchedPhrases'],
    queryFn: fetchTrainingData,
    enabled: chatbotId && type ? true : false,
  });

  useEffect(() => {
    if (type) {
      refetchUsers();
    }
  }, [refetchUsers, type]);
  const { mutate: onTrainDelete, isPending: isPendingTrainDelete } =
    useTrainDeleteData({
      onSuccess() {
        refetchUsers();
      },
      onError(error: axiosError) {
        const errorMessage =
          error?.response?.data?.errors?.message ||
          error?.response?.data?.message ||
          'operation failed';
        toast.error(errorMessage);
      },
    });
  const ignoreHandler = (id: string) => {
    onTrainDelete({
      chatbotId: chatbotId as string,
      phareseId: id,
      details: {
        type: 'ignored',
        response: [],
      },
    });
  };
  const deleteHandler = (id: string) => {
    onTrainDelete({
      chatbotId: chatbotId as string,
      phareseId: id,
      details: {
        type: 'delete',
        response: [],
      },
    });
  };
  const trainHandler = async (
    id: string,
    response: TypeResponseList[]
  ): Promise<boolean> => {
    try {
      await onTrainDelete({
        chatbotId: chatbotId as string,
        phareseId: id,
        details: {
          type: 'trained',
          response: response,
        },
      });
      await refetchUsers();
      return true;
    } catch (ERR) {
      return false;
    }
  };
  return (
    <>
      {loadTrainingDetails || isPendingTrainDelete ? <Loader /> : null}
      <Table className='min-w-full table-fixed'>
        <TableHeader className='bg-[#57C0DD1A] backdrop-blur-3xl sticky top-0'>
          <TableRow>
            <TableHead>
              <div className='flex items-center justify-start gap-2'>
                User Query
              </div>
            </TableHead>
            <TableHead>
              <div className='flex items-center justify-center gap-2'>Date</div>
            </TableHead>
            <TableHead>
              <div className='flex items-center justify-center gap-2'>
                Action
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {trainingDetails &&
          trainingDetails.length > 0 &&
          !errorInTrainingDetails ? (
            trainingDetails.map((data, index: number) => (
              <TableRow key={index} className='hover:bg-gray-50'>
                <TableCell>
                  <div className='flex items-start gap-2'>
                    <FaQuoteLeft className='text-[#bbbbbb] text-lg sm:text-xl' />
                    <span className='break-all'>{data?.phrase}</span>
                  </div>
                </TableCell>
                <TableCell className='text-center'>
                  {StringToDateFormatter(data?.updatedAt || '')}
                </TableCell>
                <TableCell>
                  <div className='flex flex-wrap items-center justify-center gap-2'>
                    {(type === 'untrained' || type === 'ignored') && (
                      <TrainingDialog
                        trainHandler={trainHandler}
                        pharaseId={data?._id}
                        trigger={
                          <button>
                            <div className='py-1 px-5 rounded-md bg-[#57C0DD1A] cursor-pointer'>
                              Train
                            </div>
                          </button>
                        }
                      />
                    )}
                    {type === 'untrained' && (
                      <div
                        className='py-1 px-5 rounded-md bg-[#F59B521A] cursor-pointer'
                        onClick={() => ignoreHandler(data?._id)}
                      >
                        Ignore
                      </div>
                    )}
                    <div
                      className='py-1 px-5 rounded-md bg-[#FF02021A] cursor-pointer'
                      onClick={() => deleteHandler(data?._id)}
                    >
                      Delete
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell className='text-center' colSpan={3}>
                No data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
};
const Page = () => {
  const [tab, setTab] = useState(0);

  return (
    <ReactFlowProvider>
      <PlaygroundProvider>
        <DashboardLayout>
          <div className='flex flex-1 overflow-hidden flex-col max-[500px]:p-4 gap-4 sm:gap-6'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3'>
              <p className='text-xl sm:text-2xl font-semibold text-black'>
                Training
              </p>
              <div className='flex items-center py-0 md:py-1 px-3 gap-2 rounded-xl bg-[#F8F8F8] w-full sm:w-auto'>
                <IoSearchSharp className='text-lg' />
                <Input
                  className='w-full sm:w-32 border-none placeholder:text-[#1E255E] p-0 shadow-none focus-visible:ring-0'
                  placeholder='Search'
                />
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <div
                onClick={() => setTab(0)}
                className={`cursor-pointer ${
                  tab === 0
                    ? 'text-base sm:text-lg text-[#1E255E] font-medium underline underline-offset-8 decoration-2 decoration-[#57C0DD]'
                    : 'text-sm sm:text-base text-black font-light'
                }`}
              >
                Unmatched Phrases
              </div>
              <div
                onClick={() => setTab(1)}
                className={`cursor-pointer ${
                  tab === 1
                    ? 'text-base sm:text-lg text-[#1E255E] font-medium underline underline-offset-8 decoration-2 decoration-[#57C0DD]'
                    : 'text-sm sm:text-base text-black font-light'
                }`}
              >
                Ignored
              </div>
              <div
                onClick={() => setTab(2)}
                className={`cursor-pointer ${
                  tab === 2
                    ? 'text-base sm:text-lg text-[#1E255E] font-medium underline underline-offset-8 decoration-2 decoration-[#57C0DD]'
                    : 'text-sm sm:text-base text-black font-light'
                }`}
              >
                Trained Phrases
              </div>
            </div>

            <div className='flex-1 flex flex-col overflow-auto'>
              {tab === 0 ? (
                <TrainingTable type='untrained' />
              ) : tab === 1 ? (
                <TrainingTable type='ignored' />
              ) : (
                <TrainingTable type='trained' />
              )}
            </div>
          </div>
        </DashboardLayout>
      </PlaygroundProvider>
    </ReactFlowProvider>
  );
};

export default Page;
