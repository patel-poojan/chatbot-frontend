'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MdAdd, MdMoreVert } from 'react-icons/md';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/utils/axiosInstance';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { LuPencil } from 'react-icons/lu';
import { RiDeleteBinLine } from 'react-icons/ri';
import { toast } from 'sonner';
import { useDeleteBot, useUpdateChatbot } from '@/utils/botCreation-api';
import { axiosError } from '@/types/axiosTypes';
import { PopoverClose } from '@radix-ui/react-popover';
import { Input } from '@/components/ui/input';
import { Loader } from '@/app/components/Loader';

type FetchChatbotListResponse = {
  statusCode: number;
  data: {
    _id: string;
    type: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    name: string;
  }[];
  message: string;
  success: boolean;
};

const Page = () => {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatedName, setUpdatedName] = useState<string>('');
  const [currentName, setCurrentName] = useState<string>('');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUserName(localStorage.getItem('username'));
    }
  }, []);
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('username');
      setUserName(storedUsername);
    }
  }, []);
  const handleEditClick = (chatbotId: string, name: string) => {
    setEditingId(chatbotId);
    setUpdatedName(name);
    setCurrentName(name);
    // setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const handleRenameSubmit = (chatbotId: string) => {
    if (updatedName.trim() && currentName !== updatedName) {
      onUpdateBot({
        chatbotId,
        details: { name: updatedName },
      });
    } else if (!updatedName.trim()) {
      toast.error('Name cannot be empty.');
    }
    setEditingId(null); // Close the input field after renaming
  };

  const fetchChatbotList = async () => {
    const response: FetchChatbotListResponse = await axiosInstance.get(
      `/chatbot`
    );
    if (response.success) {
      return response.data;
    } else {
      return [];
    }
  };

  const {
    data: chatbotList,
    isLoading: loadChatbotList,
    isError: errorInChatbotList,
    refetch: refetchChatbotList,
  } = useQuery({
    queryKey: ['chatbot', 'list'],
    queryFn: fetchChatbotList,
  });

  useEffect(() => {
    if (errorInChatbotList) {
      toast.error('Failed to fetch ChatAgent list, something went wrong');
    }
  }, [errorInChatbotList]);

  const { mutate: onDelete, isPending: deletePending } = useDeleteBot({
    onSuccess(data) {
      toast.success(data?.message);
      refetchChatbotList();
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'Delete bot failed';
      toast.error(errorMessage);
    },
  });

  const { mutate: onUpdateBot, isPending: updatePending } = useUpdateChatbot({
    onSuccess(data) {
      toast.success(data?.message);
      refetchChatbotList();
      setEditingId(null);
      setUpdatedName('');
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'Rename failed';
      toast.error(errorMessage);
    },
  });

  return (
    <div className='flex-1 flex flex-col max-[500px]:p-4 overflow-auto'>
      {loadChatbotList || updatePending || deletePending ? <Loader /> : <></>}
      <div className='mb-8'>
        <h1 className='text-2xl font-medium text-gray-700'>
          {greeting},
          <span className='capitalize'>
            {userName ? ` ${userName}! 👋` : ''}
          </span>
        </h1>
        <p className='text-gray-500 mt-1'>Here are your ChatAgents</p>
      </div>
      <div className='max-[500px]:text-xl text-2xl font-semibold text-black mb-6 max-[500px]:mb-4'>
        ChatAgents
      </div>
      <div className='flex-1 overflow-y-auto'>
        <div className='grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
          <div
            className='h-32 blue-gradient sm:h-40 flex flex-col items-center justify-center rounded-3xl p-3 sm:p-4 cursor-pointer'
            onClick={() => router.push('/create')}
            style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
          >
            <div className='bg-white rounded-full p-1 sm:p-2'>
              <MdAdd className='text-xl sm:text-2xl text-[#58C8DD]' />
            </div>
            <div className='text-white mt-1 font-medium text-sm sm:text-base'>
              Add ChatAgent
            </div>
          </div>
          {!errorInChatbotList &&
            chatbotList &&
            chatbotList.map((data) => (
              <div
                key={data._id}
                onClick={(e) => {
                  if (editingId) {
                    e.stopPropagation();
                  }
                  if (!editingId) {
                    router.push(`/dashboard/${data._id}`);
                  }
                }}
                style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
                className="h-32 bg-[url('/images/chatbot_bgtemplate.svg')] bg-cover bg-center bg-no-repeat  sm:h-40 rounded-3xl p-4 sm:p-6 cursor-pointer"
              >
                <div className='flex justify-between gap-5 items-center'>
                  {editingId === data._id ? (
                    <Input
                      ref={titleInputRef}
                      value={updatedName}
                      onChange={(e) => setUpdatedName(e.target.value)}
                      onBlur={() => handleRenameSubmit(data._id)}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && handleRenameSubmit(data._id)
                      }
                      onClick={(e) => e.stopPropagation()}
                      className='p-0 m-0 h-fit text-black !shadow-none font-medium text-lg bg-transparent border-none rounded focus-visible:ring-0'
                      autoFocus
                    />
                  ) : (
                    <span className='text-lg truncate font-medium text-black'>
                      {data.name}
                    </span>
                  )}
                  <Popover>
                    <PopoverTrigger
                      asChild
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button>
                        <MdMoreVert
                          className='text-black opacity-50 hover:opacity-100 text-xl bg-transparent hover:bg-[#F5F5F5]'
                          // onClick={(e) => e.stopPropagation()}
                        />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      className='mb-1 me-3 bg-white rounded-xl w-fit p-2 shadow-[0px_0px_12px_4px_rgba(0,0,0,0.08)]'
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className='space-y-1'>
                        <PopoverClose asChild>
                          <div
                            className='p-1 cursor-pointer hover:bg-[#F5F5F5] text-gray-500 hover:text-primary flex items-center gap-2'
                            onClick={() => handleEditClick(data._id, data.name)}
                          >
                            <LuPencil className='text-lg' />
                            <span className='text-sm'>Rename</span>
                          </div>
                        </PopoverClose>
                        <PopoverClose asChild>
                          <div
                            className='p-1 cursor-pointer hover:bg-[#F5F5F5] text-red-500 flex items-center gap-2'
                            onClick={() => onDelete({ chatbotId: data._id })}
                          >
                            <RiDeleteBinLine className='text-lg' />
                            <span className='text-sm'>Delete</span>
                          </div>
                        </PopoverClose>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
