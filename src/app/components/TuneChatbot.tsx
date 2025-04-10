import React, { useEffect, useRef, useState } from 'react';
import CustomAlertDialog from './CustomAlertDialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Cross2Icon } from '@radix-ui/react-icons';
import useWindowDimensions from '@/utils/windowSize';
import { Textarea } from '@/components/ui/textarea';

import { Input } from '@/components/ui/input';
import { useSetupPlayground, useUpdateChatbot } from '@/utils/botCreation-api';
import { toast } from 'sonner';
import { axiosError } from '../../types/axiosTypes';
import { Loader } from './Loader';
import { useRouter } from 'next/navigation';
import { ToSnakeCase } from '@/utils/text-conveter';
import { useAddAttributes } from '@/utils/attributes-api';
import { BiSolidEditAlt } from 'react-icons/bi';
import { isValidUrl } from '@/utils/validator';
import { ChatBotState } from './constant';
import { FiUploadCloud } from 'react-icons/fi';

const TuneChatbot = ({ botId }: { botId: string }) => {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const [FAQ, setFAQ] = useState(true);
  const [attributes, setAttributes] = useState([
    { title: 'ChatAgent Name', value: 'ChatAgent' },
    { title: 'Company Name', value: '' },
    { title: 'Company Address', value: '' },
    { title: 'About Us', value: '' },
    { title: 'Domain Name', value: '' },
  ]);
  const [botIcon, setBotIcon] = useState('');
  const [AboutUs, setAboutUs] = useState(true);
  const [welcomeMessage, setWelcomeMessage] = useState(
    `👋 Welcome to ChatAgent! I'm ChatAgent, your AI assistant 🤖. What can I do for you?`
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file format (Only PNG and JPEG allowed)
      const fileType = file.type;
      const validFormats = ['image/png', 'image/jpeg', 'image/jpg'];

      if (!validFormats.includes(fileType)) {
        toast.warning('Please upload PNG or JPEG files only');
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validate file size (max 15MB)
      const maxSize = 15 * 1024 * 1024; // 15MB in bytes

      if (file.size > maxSize) {
        toast.warning('File size exceeds 15MB limit');
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // If validation passes, read and set the file
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setBotIcon(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Add this function to trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };
  const {
    mutate: onUpdateBot,
    isPending,
    isSuccess: isUpdateSuccess,
  } = useUpdateChatbot({
    onSuccess() {
      // toast.success(data?.message);
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'ChatAgent training failed';
      toast.error(errorMessage);
    },
  });
  const {
    mutate: onAddAttributes,
    isPending: isPendingAddProcess,
    isSuccess: isAddSuccess,
  } = useAddAttributes({
    onSuccess() {
      // toast.success(data?.message);
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'ChatAgent training failed';
      toast.error(errorMessage);
    },
  });
  const {
    mutate: onSetupPlayground,
    isPending: isPendingSetupPlayground,
    isSuccess: isSetupPlaygroundSuccess,
  } = useSetupPlayground({
    onSuccess() {
      // toast.success(data?.message);
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'playground setup failed';
      toast.error(errorMessage);
    },
  });
  useEffect(() => {
    if (isUpdateSuccess && isAddSuccess && isSetupPlaygroundSuccess) {
      toast.success('ChatAgent configured successfully');
      router.replace(`/dashboard/${botId}`);
    }
  }, [botId, isAddSuccess, isSetupPlaygroundSuccess, isUpdateSuccess, router]);

  const continueHandler = async () => {
    const isValidUrlData = await isValidUrl(attributes[4].value);
    if (!attributes[0].value) {
      toast.warning('Please enter ChatAgent name');
    } else if (!attributes[1].value) {
      toast.warning('Please enter company name');
    } else if (!attributes[2].value) {
      toast.warning('Please enter company address');
    } else if (!attributes[3].value) {
      toast.warning('Please enter about us');
    } else if (!attributes[4].value) {
      toast.warning('Please enter domain name');
    } else if (!isValidUrlData) {
      toast.warning('Please enter a valid website url');
    } else if (!welcomeMessage) {
      toast.warning('Please enter welcome message');
    } else if (!botId) {
      toast.warning('something went wrong');
    } else {
      const formData = new FormData();
      const dataObject = {
        name: attributes[0].value ?? 'ChatAgent',
        aboutAs: attributes[3].value,
        domainName: attributes[4].value,
        welcomeMessage: welcomeMessage,
        state: ChatBotState.active,
        configuredButtons: [
          {
            type: 'faq',
            isEnabled: FAQ,
          },
          {
            type: 'aboutUs',
            isEnabled: AboutUs,
          },
        ],
      };
      formData.append('data', JSON.stringify(dataObject));
      if (botIcon && botIcon.startsWith('data:image')) {
        // Extract mime type and base64 data
        const matches = botIcon.match(/^data:(.+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          const mimeType = matches[1];
          const base64Data = matches[2];

          // Convert base64 to binary
          const binaryData = atob(base64Data);

          // Create array buffer from binary
          const arrayBuffer = new ArrayBuffer(binaryData.length);
          const uint8Array = new Uint8Array(arrayBuffer);

          for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
          }

          // Create blob with correct mime type
          const blob = new Blob([arrayBuffer], { type: mimeType });

          // Create File from blob
          const iconFile = new File(
            [blob],
            `chat_icon_${Date.now()}.${mimeType.split('/')[1]}`,
            { type: mimeType }
          );

          // Add the file to FormData with key 'icon'
          formData.append('icon', iconFile);
        }
      }
      onUpdateBot({
        chatbotId: botId,
        details: formData,
      });

      onAddAttributes({
        chatbotId: botId,
        details: {
          attributes: attributes.map((item) => ({
            name: item.title,
            alias: ToSnakeCase(item.title),
            value: item.value,
          })),
        },
      });
      onSetupPlayground({
        chatbotId: botId,
        details: {
          welcome: welcomeMessage,
          replies: [
            {
              name: 'FAQ',
              enabled: FAQ,
              position: { x: 530, y: AboutUs ? -150 : -57 },
            },
            {
              name: 'About Us',
              enabled: AboutUs,
              position: { x: 530, y: FAQ ? 50 : -57 },
            },
          ],
        },
      });
    }
  };
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleDivClick = (index: number) => {
    setActiveIndex(index);
    if (inputRefs.current[index]) {
      inputRefs.current[index]!.focus();
    }
  };

  // useEffect(() => {
  //   const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  //     router.push("/create"); // Navigate to the /create page before the page is refreshed
  //     event.preventDefault(); // Prevent the default reload
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //   };
  // }, [router]);

  return (
    <div
      className='relative flex flex-col justify-between w-full bg-white rounded-3xl p-4 sm:p-6 md:p-8 lg:px-12 lg:py-10 max-w-full overflow-x-hidden'
      style={{
        boxShadow: '0px 0px 12px 4px #00000014',
        height:
          screenWidth > 768
            ? 'calc(100dvh - 248px)'
            : screenWidth > 640
            ? 'calc(100dvh - 206px)'
            : 'calc(100dvh - 170px)',
      }}
    >
      {(isPending || isPendingAddProcess || isPendingSetupPlayground) && (
        <Loader />
      )}

      <div className='flex-1 flex flex-col lg:flex-row gap-6 w-full overflow-hidden'>
        <div className='w-full lg:w-3/5 flex-1 flex flex-col h-full overflow-y-auto overflow-x-hidden'>
          <div className='mb-4 sm:mb-6'>
            <h2 className='text-black font-semibold text-2xl'>
              Tune your ChatAgent
            </h2>
            <p className='text-[#1E255EB2] font-normal mt-2 text-base'>
              Add final tweaks to achieve better results.
            </p>
          </div>

          <div className='mb-4 sm:mb-6 w-full'>
            <p className='text-black font-normal text-lg'>
              Customise your welcome message
            </p>
            <Textarea
              value={welcomeMessage}
              onChange={(e) => setWelcomeMessage(e.target.value)}
              className='my-3 bg-[#FAFAFA] text-black font-light border border-transparent hover:border-[#57C0DD] focus-visible:border-[#57C0DD] text-base w-full p-3 sm:p-4 md:p-6'
              style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
            />
            <div className='flex flex-wrap gap-2'>
              <Button
                className={`${
                  FAQ
                    ? 'opacity-100 hover:opacity-50'
                    : 'opacity-50 hover:opacity-100'
                } border bg-transparent hover:bg-transparent border-[#57C0DD] py-2 px-4 md:px-8 rounded-xl text-[#57C0DD] text-sm md:text-base`}
                onClick={() => setFAQ(!FAQ)}
              >
                FAQ
              </Button>
              <Button
                className={`${
                  AboutUs
                    ? 'opacity-100 hover:opacity-50'
                    : 'opacity-50 hover:opacity-100'
                } border bg-transparent hover:bg-transparent border-[#57C0DD] py-2 px-4 md:px-8 rounded-xl text-[#57C0DD] text-sm md:text-base`}
                onClick={() => setAboutUs(!AboutUs)}
              >
                About ChatAgent
              </Button>
            </div>
          </div>

          <div className='mb-4 sm:mb-6 w-full'>
            <p className='text-black font-normal text-lg mb-3'>
              Upload Bot Icon
            </p>
            <div
              className='flex items-center justify-center border border-dashed border-[#57C0DD] rounded-xl p-3 cursor-pointer bg-[#FAFAFA] hover:bg-[#F5F5F5] h-20'
              onClick={triggerFileUpload}
            >
              <input
                type='file'
                ref={fileInputRef}
                className='hidden'
                accept='image/*'
                onChange={handleFileUpload}
              />
              {botIcon ? (
                <div className='flex items-center gap-3'>
                  <div className='relative w-12 h-12 rounded-full overflow-hidden'>
                    <Image
                      src={botIcon}
                      alt='Bot Icon'
                      className='w-full h-full object-cover'
                      width={48} // Adjust width as needed
                      height={48} // Adjust height as needed
                      quality={100} // Optional: Adjust quality as needed
                    />
                  </div>
                  <p className='text-[#1E255EB2] text-sm'>
                    Click to change icon
                  </p>
                </div>
              ) : (
                <div className='flex items-center gap-3'>
                  <div className='w-12 h-12 flex items-center justify-center rounded-full bg-[#57C0DD] bg-opacity-10'>
                    <FiUploadCloud className='w-6 h-6 text-[#57C0DD]' />
                  </div>
                  <p className='text-[#1E255EB2] text-sm'>
                    Click to upload bot icon
                  </p>
                </div>
              )}
            </div>
          </div>

          <p className='text-black font-normal text-lg mb-3'>
            Set up attributes
          </p>
          <div className='flex flex-col gap-3 flex-1'>
            {attributes.map((item, index) => (
              <div
                key={index}
                className={`p-3 rounded-xl flex justify-between gap-3 items-center border border-transparent hover:border-[#57C0DD] cursor-pointer bg-[#FAFAFA] shadow-sm ${
                  activeIndex === index ? 'border-[#57C0DD]' : ''
                }`}
                style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
                onClick={() => handleDivClick(index)}
              >
                <span className='text-[#1E255EB2] text-sm sm:text-base'>
                  {item.title}
                </span>
                <div className='flex items-center gap-2 min-w-0'>
                  <Input
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    value={item.value}
                    className='border-none rounded-none text-sm sm:text-base shadow-none bg-transparent p-0 focus-visible:ring-0 w-full text-right'
                    onChange={(e) =>
                      setAttributes((prev) =>
                        prev.map((attr, idx) =>
                          idx === index
                            ? { ...attr, value: e.target.value }
                            : attr
                        )
                      )
                    }
                  />
                  <BiSolidEditAlt className='text-xl flex-shrink-0' />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='hidden lg:w-2/5 lg:flex flex-col gap-3 border-t-[40px] rounded-[30px] border-r-[40px] border-b-0 border-l-[40px] border-[#57C0DD] p-4'>
          <div className='flex gap-3'>
            <Image
              src={botIcon || '/images/online_bot.svg'}
              alt='bot'
              width={50}
              height={50}
              className='flex-shrink-0 rounded-full'
              quality={100}
            />
            <div className='flex flex-col my-1 justify-between min-w-0'>
              <p className='text-[#1E255E] font-medium text-sm truncate'>
                {attributes[0].value}
              </p>
              <p className='text-[#1E255EB2] font-light text-sm'>Online</p>
            </div>
          </div>

          <div className='text-white text-base font-medium p-4 md:p-6 rounded-xl bg-[#57C0DD] shadow-sm'>
            {welcomeMessage}
          </div>

          <div className='flex flex-col gap-2'>
            {FAQ && (
              <div className='text-center px-6 py-2 border rounded-xl border-[#57C0DD] text-[#57C0DD]'>
                FAQ
              </div>
            )}
            {AboutUs && (
              <div className='text-center px-6 py-2 border rounded-xl border-[#57C0DD] text-[#57C0DD]'>
                About ChatAgent
              </div>
            )}
          </div>
        </div>
      </div>

      <div className='mt-6 flex flex-col sm:flex-row sm:justify-end gap-4'>
        <CustomAlertDialog
          botId={botId}
          trigger={
            <Button className='w-full sm:w-auto px-8 py-2 border border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent'>
              Go Back
            </Button>
          }
        />
        <Button
          className='w-full sm:w-auto px-8 py-2 border bg-gradient-to-r from-[#58C8DD] to-[#53A7DD] hover:from-[#53A7DD] hover:to-[#58C8DD]'
          onClick={continueHandler}
        >
          Continue
        </Button>
      </div>

      <div className='fixed lg:hidden bottom-16 right-4'>
        <Sheet>
          <SheetTrigger>
            <Image
              src='/images/bot-icon.svg'
              alt='bot'
              className='rounded-full bg-white'
              width={40}
              height={40}
              quality={100}
            />
          </SheetTrigger>
          <SheetContent side='bottom' className='rounded-t-[30px] max-h-[80vh]'>
            <SheetHeader>
              <SheetTitle className='w-full flex justify-between items-center'>
                <div className='flex gap-3'>
                  <Image
                    src={botIcon || '/images/online_bot.svg'}
                    alt='bot'
                    width={40}
                    height={40}
                    className='rounded-full'
                    quality={100}
                  />

                  <div className='flex flex-col my-1 justify-between'>
                    <p className='text-[#1E255E] font-medium text-sm'>
                      {attributes[0].value}
                    </p>
                    <p className='text-[#1E255EB2] font-light text-sm'>
                      Online
                    </p>
                  </div>
                </div>
                <SheetClose>
                  <Cross2Icon className='h-4 w-4' />
                </SheetClose>
              </SheetTitle>
              <SheetDescription className='flex pt-2 flex-col gap-4 overflow-y-auto'>
                <div className='text-white text-base font-medium p-4 rounded-xl bg-[#57C0DD] shadow-sm'>
                  {welcomeMessage}
                </div>
                <div className='flex flex-col gap-2 pb-4'>
                  {FAQ && (
                    <div className='text-center px-6 py-2 border rounded-xl border-[#57C0DD] text-[#57C0DD]'>
                      FAQ
                    </div>
                  )}
                  {AboutUs && (
                    <div className='text-center px-6 py-2 border rounded-xl border-[#57C0DD] text-[#57C0DD]'>
                      About ChatAgent
                    </div>
                  )}
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default TuneChatbot;
