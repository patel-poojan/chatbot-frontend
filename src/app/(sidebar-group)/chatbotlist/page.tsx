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
import Cookies from 'js-cookie';
import { useUserRole } from '@/app/components/UserRoleProvider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type FetchChatbotListResponse = {
  statusCode: number;
  data: {
    _id: string;
    type: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    name: string;
    published: boolean;
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
  const [listFilter, setListFilter] = useState<string>('all');

  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  });
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUsername = Cookies.get('username');
      if (storedUsername) {
        setUserName(storedUsername);
      }
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
      const dataObject = { name: updatedName };
      onUpdateBot({
        chatbotId,
        details: dataObject,
      });
    } else if (!updatedName.trim()) {
      toast.error('Name cannot be empty.');
    }
    setEditingId(null);
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
  const { userRole, permissions, isLoading } = useUserRole();

  // Logging for debugging purposes
  useEffect(() => {
    console.log('userRole in Page component dash:', userRole);
    console.log('permissions in Page component:', permissions, isLoading);
  }, [userRole, permissions, isLoading]);

  const filteredChatbotList = chatbotList?.filter((bot) => {
    if (listFilter === 'published') return bot.published;
    if (listFilter === 'not_Published') return !bot.published;
    return true; // for 'all'
  });
  console.log('filteredChatbotList:', filteredChatbotList);
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
      <div className='flex items-center justify-between mb-3'>
        <div className='max-[500px]:text-xl text-2xl font-semibold text-black mb-6 max-[500px]:mb-4'>
          ChatAgents
        </div>
        <Select value={listFilter} onValueChange={setListFilter}>
          <SelectTrigger className='h-12 w-[180px] bg-white shadow-sm border border-gray-100 text-gray-600 rounded-lg px-4 justify-between !outline-none !ring-0 !ring-opacity-0 focus:!outline-none focus:!border-gray-100 focus-visible:!outline-none focus-visible:!ring-0'>
            <SelectValue placeholder='Select creator' />
          </SelectTrigger>
          <SelectContent className='bg-white border border-gray-100 shadow-md rounded-lg max-h-[200px] overflow-y-auto'>
            <SelectItem value='all'>All</SelectItem>
            <SelectItem value='published'>Published</SelectItem>
            <SelectItem value='not_Published'>Not Published </SelectItem>
          </SelectContent>
        </Select>
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
            filteredChatbotList &&
            filteredChatbotList.map((data) => (
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
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className='text-lg truncate font-medium text-black'>
                            {data.name}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent
                          className='bg-white rounded-lg px-3 py-2 border border-[#53A7DD]/20 shadow-[0_4px_12px_rgb(0,0,0,0.1)] text-[#1E255E] text-sm font-medium transition-all duration-200'
                          side='bottom'
                          align='center'
                          sideOffset={6}
                        >
                          <div className='flex flex-col gap-1'>
                            <span className='font-semibold text-[#1E255E]'>
                              {data.name}
                            </span>
                            <div className='flex items-center gap-1.5'>
                              <div
                                className={`w-2 h-2 rounded-full ${
                                  data.published
                                    ? 'bg-green-500'
                                    : 'bg-gray-400'
                                }`}
                              />
                              <span
                                className={`text-xs ${
                                  data.published
                                    ? 'text-green-600'
                                    : 'text-gray-500'
                                }`}
                              >
                                {data.published ? 'Published' : 'Not Published'}
                              </span>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
