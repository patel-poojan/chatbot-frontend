import { Input } from '@/components/ui/input';
import { Cross2Icon } from '@radix-ui/react-icons';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import ChatLoader from './ChatLoader';
import { useGetChatbotResponse } from '@/utils/chatbot-api';
import { toast } from 'sonner';
import { axiosError } from '@/types/axiosTypes';
import { useParams } from 'next/navigation';
import { TypeBotResponse, TypeButton } from '@/types/node';
import {
  ButtonResponse,
  GalleryResponse,
  ImageResponse,
  QuickResponse,
  TextResponse,
  UserInput,
} from './ChatBotResponseType';
const ChatBotDialog = ({ chatBotHandler }: { chatBotHandler: () => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputText, setInputText] = useState<string>('');
  const params = useParams();
  const chatbotId = params.id;
  const [ChatArray, setChatArray] = useState<TypeBotResponse[] | []>([]);
  const scroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scroll();
  }, [ChatArray]);

  const { mutate: fetchBotResponse } = useGetChatbotResponse({
    onSuccess(data) {
      toast.success(data?.message);
      if (data?.response) {
        data.response.forEach((response: TypeBotResponse) => {
          setChatArray((prev) => [...prev, response]);
        });
      }
      setIsLoading(false);
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'failed to fetch bot response';
      toast.error(errorMessage);
      setIsLoading(false);
    },
  });
  const initialCallMade = useRef(false);
  useEffect(() => {
    if (!initialCallMade.current && chatbotId) {
      setIsLoading(true);
      fetchBotResponse({
        chatbotId: chatbotId as string,
        type: 'welcome-action',
      });
      initialCallMade.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatbotId]);
  const onTextSearch = () => {
    setIsLoading(true);
    fetchBotResponse({
      chatbotId: chatbotId as string,
      userMessage: inputText,
      type: 'text-action',
    });
    setChatArray((prev) => [
      ...prev,
      { userInput: inputText, delay: 1000, type: 'user' },
    ]);
    setInputText('');
  };
  const onButtonSearch = (info: TypeButton) => {
    if (info.type === 'message' && info.message) {
      setIsLoading(true);
      fetchBotResponse({
        chatbotId: chatbotId as string,
        // type: 'button-action',
        // buttonId: info.id,
        userMessage: info.message,
        type: 'text-action',
      });
    } else if (info.type === 'url' && info.url) {
      window.open(info.url, '_blank');
    }
    setChatArray((prev) => [
      ...prev,
      { userInput: info.title, delay: 1000, type: 'user' },
    ]);
  };
  console.log('chatArray', ChatArray);
  return (
    <div
      className='absolute  min-[425px]:right-6 top-32 min-[699px]:top-20 flex flex-col  min-[425px]:w-[375px] h-[65vh] max-[425px]:mx-6 min-[500px]:h-[60vh] rounded-lg overflow-hidden'
      style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}
    >
      <div className='w-full p-6 bg-white justify-between flex items-center'>
        <div className='flex gap-3'>
          <Image
            src='/images/online_bot.svg'
            alt='bot'
            width={40}
            height={40}
            quality={100}
          />
          <div className='flex flex-col my-1 justify-between '>
            <p className='text-[#1E255E] font-medium text-sm'>Chatbot</p>
            <p className='text-[#1E255EB2] font-light text-sm'>Online</p>
          </div>
        </div>
        <Cross2Icon
          className='h-4 w-4 cursor-pointer'
          onClick={chatBotHandler}
        />
      </div>
      <div
        className='flex-1 bg-[#F1F1F1] p-4 overflow-y-auto show-scrollbar flex flex-col gap-3'
        ref={scrollRef}
      >
        {ChatArray &&
          ChatArray?.map((item, index) => (
            <div key={index}>
              {item.type === 'user' ? (
                <UserInput data={item} />
              ) : item.type === 'text' && item.info ? (
                <TextResponse info={item.info} />
              ) : item.type === 'image' && item.info ? (
                <ImageResponse info={item.info} />
              ) : item.type === 'gallery' && item.info ? (
                <GalleryResponse
                  info={item.info}
                  onButtonSearch={onButtonSearch}
                />
              ) : item.type === 'quick' && item.info ? (
                <QuickResponse
                  info={item.info}
                  onButtonSearch={onButtonSearch}
                />
              ) : item.type === 'button' && item.info ? (
                <ButtonResponse
                  info={item.info}
                  onButtonSearch={onButtonSearch}
                />
              ) : null}
            </div>
          ))}
        {isLoading ? <ChatLoader /> : <></>}
      </div>
      <div className='p-4 bg-white flex gap-4 items-center'>
        <Input
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && inputText.length > 0) {
              onTextSearch();
            }
          }}
          className='!border-none placeholder:text-[#7A7A7A] shadow-none p-0 focus-visible:ring-0'
          placeholder='Send message ...'
        />
        <IoSend
          className='text-[#7A7A7A] text-xl cursor-pointer'
          onClick={() => {
            onTextSearch();
          }}
        />
      </div>
    </div>
  );
};

export default ChatBotDialog;
