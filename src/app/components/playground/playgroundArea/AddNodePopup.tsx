import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Image from 'next/image';
import { IoIosSend } from 'react-icons/io';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { useAddNode } from '@/utils/playground-api';
import { axiosError } from '@/types/axiosTypes';
import { usePlayground } from './PlaygroundContext';
const AddNodePopup = ({
  isPopupVisible,
  setIsPopupVisible,
  parentId,
  position,
  parentType,
}: {
  isPopupVisible: boolean;
  setIsPopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
  parentId: string;
  position: { x: number; y: number };
  parentType: string;
}) => {
  const pathname = usePathname();
  const { refetchHandler, notConnectableNode, setIsPageLoader } =
    usePlayground();
  const chatbotId = pathname?.split('/').pop();

  const { mutate: onAddNode } = useAddNode({
    onSuccess() {
      setIsPageLoader(false);

      toast.success('Node updated successfully', {
        duration: 2000,
      });
      refetchHandler();
      setIsPopupVisible(false);
    },

    onError(error: axiosError) {
      setIsPageLoader(false);

      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'failed to add';
      toast.error(errorMessage);
    },
  });

  const onClickHandler = (type: string) => {
    if (
      chatbotId &&
      parentId &&
      position &&
      position.x &&
      position.y &&
      type &&
      parentType
    ) {
      const hasSourceHandle = !notConnectableNode.includes(parentType || '');

      if (
        parentType &&
        hasSourceHandle &&
        !(
          ((type === 'goToStepNode' ||
            type === 'faqNode' ||
            type === 'closeChatNode' ||
            type === 'userInputNode') &&
            parentType !== 'botResponseNode') ||
          (type === 'questionNode' &&
            parentType !== 'botResponseNode' &&
            parentType !== 'userInputNode')
        )
      ) {
        setIsPageLoader(true);
        onAddNode({
          chatbotId: chatbotId,
          parentNodeId: parentId,
          details: {
            type,
            nodeData: {
              message: '',
              position: {
                x: position.x + 300,
                y:
                  type === 'userInputNode' || type === 'faqNode'
                    ? position?.y - 7
                    : parentType === 'userInputNode' || parentType === 'faqNode'
                    ? position?.y + 7
                    : position?.y,
              },
            },
          },
        });
      } else {
        toast.warning('node type not matched');
      }
    } else {
      toast.error('something went wrong');
    }
  };
  return (
    <Popover
      open={isPopupVisible}
      onOpenChange={() => setIsPopupVisible(false)}
    >
      <PopoverTrigger
        asChild
        onClick={(e) => {
          e.stopPropagation();
          setIsPopupVisible((prev) => !prev);
        }}
      >
        <button className='bg-transparent border-none cursor-pointer p-0 m-0'>
          {/* Button content (icon or plus sign) goes here */}
        </button>
      </PopoverTrigger>

      <PopoverContent
        onClick={(e) => e.stopPropagation()}
        className='p-3 ms-2 mt-1 w-fit bg-white flex flex-col gap-1 rounded-lg shadow-md'
      >
        <div
          className='flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer'
          onClick={() => onClickHandler('userInputNode')}
        >
          <Image
            src='/images/user_input.svg'
            alt='User Input Icon'
            width={16}
            height={16}
            quality={100}
          />
          <span className='text-black text-sm font-medium'>User Input</span>
        </div>
        <div
          className='flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer'
          onClick={() => onClickHandler('botResponseNode')}
        >
          <IoIosSend className='text-black text-lg' />
          <span className='text-black text-sm font-medium'>Bot Response</span>
        </div>
        <div
          className='flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer'
          onClick={() => onClickHandler('goToStepNode')}
        >
          <Image
            src='/images/go_to_step.svg'
            alt='Go to Step Icon'
            width={18}
            height={16}
            quality={100}
          />
          <span className='text-black text-sm font-medium'>Go To Step</span>
        </div>
        <div
          className='flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer'
          onClick={() => onClickHandler('faqNode')}
        >
          <Image
            src='/images/faq.svg'
            alt='FAQ Icon'
            width={18}
            height={16}
            quality={100}
          />
          <span className='text-black text-sm font-medium'>FAQ</span>
        </div>
        {/* <div
          className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer"
          onClick={() => onClickHandler("questionNode")}
        >
          <MdOutlineQuestionMark className="text-black text-lg" />
          <span className="text-black text-sm font-medium">Question</span>
        </div> */}
        <div
          className='flex items-center gap-2 hover:bg-gray-100 p-2 rounded-md cursor-pointer'
          onClick={() => onClickHandler('closeChatNode')}
        >
          <Image
            src='/images/close_chat.svg'
            alt='Close Chat Icon'
            width={18}
            height={16}
            quality={100}
          />
          <span className='text-black text-sm font-medium'>Close Chat</span>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddNodePopup;
