import { Input } from '@/components/ui/input';
import { Cross2Icon } from '@radix-ui/react-icons';
// import Image from 'next/image';
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
  ErrorResponse,
  FAQResponse,
  GalleryResponse,
  ImageResponse,
  LlmResponse,
  QuickResponse,
  TextResponse,
  UserInput,
} from './ChatBotResponseType';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const ChatBotDialog = ({ chatBotHandler }: { chatBotHandler: () => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState('deepseek-v2:16b');
  const [isLoading, setIsLoading] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const [inputText, setInputText] = useState<string>('');
  const params = useParams();
  const chatbotId = params.id;
  const [pendingMessages, setPendingMessages] = useState<TypeBotResponse[]>([]);
  const [visibleMessages, setVisibleMessages] = useState<TypeBotResponse[]>([]);
  const [showCloseDialog, setShowCloseDialog] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const handleCloseChat = () => {
    // chatBotHandler();
    setShowCloseDialog(false);
  };
  const processingRef = useRef(false);

  const scroll = () => {
    if (scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, 100);
    }
  };
  useEffect(() => {
    scroll();
  }, [visibleMessages]);

  const processNextMessage = async () => {
    if (processingRef.current || pendingMessages.length === 0) return;

    processingRef.current = true;
    setIsLoading(true);

    const currentMessage = pendingMessages[0];

    await new Promise((resolve) =>
      setTimeout(resolve, currentMessage.delay || 0)
    );

    setVisibleMessages((prev) => [...prev, currentMessage]);
    setPendingMessages((prev) => prev.slice(1));

    processingRef.current = false;
    setIsLoading(false);
  };

  useEffect(() => {
    if (pendingMessages.length > 0 && !processingRef.current) {
      processNextMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMessages, visibleMessages]);

  const { mutate: fetchBotResponse } = useGetChatbotResponse({
    onSuccess(data) {
      // if (data?.message) {
      //   toast.success(data.message);
      // }
      setApiLoading(false);
      if (data?.response) {
        setPendingMessages((prev) => [...prev, ...data.response]);
      }
    },
    onError(error: axiosError) {
      setPendingMessages((prev) => [
        ...prev,
        {
          info: { description: 'something went wrong' },
          delay: 0,
          type: 'error',
        },
      ]);
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'Failed to fetch bot response';
      toast.error(errorMessage);
      setApiLoading(false);
      processingRef.current = false;
    },
  });

  const initialCallMade = useRef(false);
  useEffect(() => {
    if (!initialCallMade.current && chatbotId) {
      setApiLoading(true);
      fetchBotResponse({
        chatbotId: chatbotId as string,
        type: 'welcome-action',
        model: selectedModel,
      });
      initialCallMade.current = true;
    }
  }, [chatbotId, fetchBotResponse]);

  const onTextSearch = () => {
    if (!inputText.trim()) return;

    setPendingMessages((prev) => [
      ...prev,
      { userInput: inputText, delay: 0, type: 'user' },
    ]);
    setApiLoading(true);
    fetchBotResponse({
      chatbotId: chatbotId as string,
      userMessage: inputText,
      type: 'text-action',
      model: selectedModel,
    });

    setInputText('');
  };

  const onButtonSearch = (info: TypeButton) => {
    if (info.type === 'url' && info.url) {
      window.open(info.url, '_blank');
    } else if (info.id) {
      setPendingMessages((prev) => [
        ...prev,
        { userInput: info.title, delay: 0, type: 'user' },
      ]);
      setApiLoading(true);
      fetchBotResponse({
        chatbotId: chatbotId as string,
        type: 'button-action',
        buttonId: info.id,
        model: selectedModel,
      });
    }
  };
  return (
    <div
      className=' min-[425px]:right-6 top-32 min-[699px]:top-20 flex flex-col min-[425px]:w-[375px] h-[65vh] max-[425px]:mx-6 min-[500px]:h-[60vh] rounded-lg overflow-hidden absolute '
      style={{ boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}
    >
      <div className='flex flex-col h-full relative'>
        <div className='w-full p-4 bg-white justify-between flex items-center'>
          <div className='flex gap-3'>
            {/* <Image
              src='/images/online_bot.svg'
              alt='bot'
              width={40}
              height={40}
              quality={100}
            />
            <div className='flex flex-col my-1 justify-between'>
              <p className='text-[#1E255E] font-medium text-sm'>Chatbot</p>
              <p className='text-[#1E255EB2] font-light text-sm'>Online</p>
            </div> */}
            <Select value={selectedModel} onValueChange={setSelectedModel}>
              <SelectTrigger className='w-[180px]'>
                <SelectValue placeholder='Select a Model' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Model</SelectLabel>
                  <SelectItem value='deepseek-v2:16b'>
                    deepseek-v2:16b
                  </SelectItem>
                  <SelectItem value='llama3.1:8b'>llama3.1:8b</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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
          {visibleMessages.map((item, index) => (
            <div key={index}>
              {item.type === 'user' ? (
                <UserInput data={item} />
              ) : item.type === 'llm' && item.info ? (
                <LlmResponse info={item.info} />
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
              ) : item.type === 'faq' && item.info ? (
                <FAQResponse info={item.info} />
              ) : item.type === 'error' && item.info ? (
                <ErrorResponse info={item.info} />
              ) : null}
            </div>
          ))}
          {isLoading || apiLoading ? <ChatLoader /> : <></>}
        </div>
        <div className='p-4 bg-white flex gap-4 items-center'>
          <Input
            onChange={(e) => setInputText(e.target.value)}
            value={inputText}
            disabled={isLoading || apiLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputText.trim().length > 0) {
                onTextSearch();
              }
            }}
            className='!border-none placeholder:text-[#7A7A7A] shadow-none p-0 focus-visible:ring-0'
            placeholder='Send message ...'
          />
          <IoSend
            className='text-[#7A7A7A] text-xl cursor-pointer'
            onClick={onTextSearch}
          />
        </div>
        {showCloseDialog && (
          <div className='absolute inset-0 bg-[#a6dae41a] flex items-center justify-center backdrop-blur-[1.3px]'>
            <div className='bg-white rounded-xl p-4 w-[90%] max-w-[340px] mx-auto border border-[#53A7DD]/20 shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(83,167,221,0.12)] transition-shadow duration-300'>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-semibold text-[#1E255E]'>
                  Before you go
                </h3>
              </div>
              <div className='space-y-4'>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Name'
                  className='w-full border-gray-200 focus:border-[#53A7DD] transition-colors duration-200'
                />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type='email'
                  placeholder='Email'
                  className='w-full border-gray-200 focus:border-[#53A7DD] transition-colors duration-200'
                />
                <Button
                  type='button'
                  className='w-full text-white bg-gradient-to-r from-[#58C8DD] to-[#53A7DD] hover:from-[#53A7DD] hover:to-[#58C8DD] py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg'
                  onClick={handleCloseChat}
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBotDialog;
