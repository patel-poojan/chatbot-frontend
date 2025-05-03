import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUpdateChatbot } from '@/utils/botCreation-api';
import React, { useRef } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { axiosError } from '@/types/axiosTypes';
import { Loader } from '../Loader';
import Image from 'next/image';

const UpdateChatbotDialog = ({
  updateHandler,
  isOpen,
  chatbotName,
  botIcon,
  chatbotId,
  refetchPlayground,
}: {
  updateHandler: () => void;
  isOpen: boolean;
  chatbotName: string;
  botIcon: string;
  chatbotId: string;
  refetchPlayground: () => void;
}) => {
  const [name, setName] = React.useState<string>(chatbotName ?? '');
  const [icon, setIcon] = React.useState<string | null>(null);
  const [imgError, setImgError] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: onUpdateBot, isPending: updatePending } = useUpdateChatbot({
    onSuccess(data) {
      toast.success(data?.message);
      updateHandler();
      refetchPlayground();
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'Rename failed';
      toast.error(errorMessage);
    },
  });

  // Function to handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      // Validate file format (Only PNG and JPEG allowed)
      const fileType = file.type;
      const validFormats = ['image/png', 'image/jpeg', 'image/jpg'];

      if (!validFormats.includes(fileType)) {
        toast.error('Please upload PNG or JPEG files only');
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        return;
      }

      // Validate file size (max 15MB)
      const maxSize = 15 * 1024 * 1024; // 15MB in bytes

      if (file.size > maxSize) {
        toast.error('File size exceeds 15MB limit');
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
          setIcon(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = () => {
    if (!chatbotId) {
      toast.error('Chatbot ID is missing, something went wrong');
      return;
    }
    if (name.trim() === '') {
      toast.error('Please enter a name for the ChatAgent');
      return;
    }

    const formData = new FormData();
    const dataObject = {
      name: name ?? chatbotName,
    };

    formData.append('data', JSON.stringify(dataObject));
    if (icon) {
      if (icon.startsWith('data:image')) {
        // Extract mime type and base64 data
        const matches = icon.match(/^data:(.+);base64,(.+)$/);
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
    }

    onUpdateBot({
      chatbotId: chatbotId,
      details: formData,
    });
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className='max-w-[87vw] gap-0 sm:max-w-[425px] rounded-lg'>
        {updatePending ? <Loader /> : null}
        <DialogHeader>
          <DialogTitle className='sr-only'>Edit ChatAgent</DialogTitle>
          <DialogDescription id='dialog-description' className='sr-only'>
            Edit ChatAgent name and icon
          </DialogDescription>
        </DialogHeader>

        <div className='gap-6 flex flex-col'>
          <div className='flex items-center justify-between'>
            <div></div>
            <div className='text-primary text-xl font-medium'>
              Edit ChatAgent
            </div>

            <IoCloseOutline
              className='text-lg cursor-pointer'
              onClick={() => updateHandler()}
            />
          </div>

          {/* Bot name input */}
          <div className='space-y-2'>
            <label htmlFor='name' className='text-sm text-gray-600'>
              ChatAgent Name
            </label>
            <Input
              id='name'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='px-4 py-3 rounded border border-[#E0E0E0] focus-visible:ring-0 placeholder:text-sm placeholder:font-light w-full'
              placeholder='Enter ChatAgent name'
            />
          </div>

          {/* Bot icon upload */}
          <div className='space-y-2'>
            <label className='text-sm text-gray-600'>ChatAgent Icon</label>
            <div
              className='flex items-center gap-3 border border-dashed border-[#57C0DD] rounded-lg p-3 cursor-pointer hover:bg-[#F5F5F5]'
              onClick={triggerFileUpload}
            >
              <input
                type='file'
                ref={fileInputRef}
                className='hidden'
                accept='image/png,image/jpeg,image/jpg'
                onChange={handleFileUpload}
              />

              {icon || (botIcon && !imgError) ? (
                <div className='flex items-center gap-3 w-full'>
                  <div className='w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-[#E0E0E0]'>
                    <Image
                      src={icon || botIcon}
                      alt='Bot Icon'
                      width={48}
                      height={48}
                      className='w-full h-full object-cover'
                      unoptimized={true}
                      onError={() => setImgError(true)}
                      loader={({ src }) => src} // Custom loader to handle external URLs
                    />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-gray-600 truncate'>
                      Click to change icon
                    </p>
                    <p className='text-xs text-gray-400'>
                      PNG or JPEG (max 15MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className='flex items-center gap-3 w-full'>
                  <div className='w-12 h-12 rounded-full flex items-center justify-center bg-[#57C0DD] bg-opacity-10 flex-shrink-0'>
                    <UploadCloud className='w-6 h-6 text-[#57C0DD]' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm text-gray-600'>
                      Click to upload icon
                    </p>
                    <p className='text-xs text-gray-400'>
                      PNG or JPEG (max 15MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2 sm:gap-3 items-center w-full'>
            <DialogClose>
              <Button
                className='border border-[#57C0DD] text-xs w-full text-[#57C0DD] py-2 bg-transparent rounded-full hover:bg-[#f0faff]'
                onClick={() => updateHandler()}
              >
                Cancel
              </Button>
            </DialogClose>
            <DialogClose>
              <Button
                className='bg-[#57C0DD] text-white text-xs py-2 w-full rounded-full hover:bg-[#4cb9d1]'
                onClick={handleSubmit}
              >
                Save
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateChatbotDialog;
