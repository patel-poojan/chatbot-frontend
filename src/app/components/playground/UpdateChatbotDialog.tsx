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
import React, { useRef, useEffect, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { UploadCloud } from 'lucide-react';
import { toast } from 'sonner';
import { axiosError } from '@/types/axiosTypes';
import { Loader } from '../Loader';
import Image from 'next/image';
import { usePlayground } from './playgroundArea/PlaygroundContext';
import AWS from 'aws-sdk';
import { initializeAWS } from './botIntrectionSection/S3Operation';

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
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string>('');
  const [imgError, setImgError] = React.useState(false);
  const [isAWSInitialized, setIsAWSInitialized] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refetchAttributesHandler } = usePlayground();

  useEffect(() => {
    const awsInitialized = initializeAWS();
    setIsAWSInitialized(awsInitialized);
  }, []);

  // Cleanup preview URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (iconPreview && iconPreview.startsWith('blob:')) {
        URL.revokeObjectURL(iconPreview);
      }
    };
  }, [iconPreview]);

  const { mutate: onUpdateBot, isPending: updatePending } = useUpdateChatbot({
    onSuccess(data) {
      toast.success(data?.message);
      updateHandler();
      refetchPlayground();
      refetchAttributesHandler();
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

      // Clean up previous preview URL
      if (iconPreview && iconPreview.startsWith('blob:')) {
        URL.revokeObjectURL(iconPreview);
      }

      // Store file and create preview
      setIconFile(file);
      setIconPreview(URL.createObjectURL(file));
    }
  };

  const uploadBotIconToS3 = async (file: File): Promise<string | null> => {
    if (!isAWSInitialized) {
      toast.error('AWS is not properly configured');
      return null;
    }

    try {
      const s3 = new AWS.S3({ apiVersion: '2006-03-01' });
      const bucket = process.env.NEXT_PUBLIC_AWS_BUCKET as string;

      // Generate filename
      const fileExtension =
        file.name.split('.').pop() || file.type.split('/')[1];
      const fileName = `chat_icon_${Date.now()}.${fileExtension}`;
      const key = `chatagentAssets/${chatbotId}/icon/${fileName}`;

      // Upload to S3
      const uploadResult = await s3
        .upload({
          Bucket: bucket,
          Key: key,
          Body: file,
          ContentType: file.type,
          ACL: 'public-read',
        })
        .promise();

      return uploadResult.Location;
    } catch (error) {
      console.error('Error uploading bot icon to S3:', error);
      toast.error('Failed to upload bot icon');
      return null;
    }
  };

  // Function to trigger file input click
  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Get the appropriate icon source for display
  const getDisplayIcon = () => {
    if (iconPreview) {
      return iconPreview;
    }
    return botIcon;
  };

  const handleSubmit = async () => {
    if (!chatbotId) {
      toast.error('Chatbot ID is missing, something went wrong');
      return;
    }
    if (name.trim() === '') {
      toast.error('Please enter a name for the ChatAgent');
      return;
    }

    let iconUrl: string = '';

    // Upload bot icon to S3 first if a new file exists
    if (iconFile) {
      const uploadedUrl = await uploadBotIconToS3(iconFile);
      if (!uploadedUrl) {
        // If upload failed, stop the process
        return;
      }
      iconUrl = uploadedUrl;
    }

    const dataObject = {
      name: name ?? chatbotName,
      ...(iconUrl ? { iconUrl } : {}), // Add iconUrl to dataObject if it exists
    };

    onUpdateBot({
      chatbotId: chatbotId,
      details: dataObject,
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

              {getDisplayIcon() && !imgError ? (
                <div className='flex items-center gap-3 w-full'>
                  <div className='w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border border-[#E0E0E0]'>
                    <Image
                      src={getDisplayIcon()}
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
