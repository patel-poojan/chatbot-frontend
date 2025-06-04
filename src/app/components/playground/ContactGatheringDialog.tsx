import React, { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  useGetChatbotDetails,
  useUpdateChatbot,
} from '@/utils/botCreation-api';
import { Loader } from '../Loader';
import { toast } from 'sonner';
import { axiosError } from '@/types/axiosTypes';
import { axiosInstance } from '@/utils/axiosInstance';

const ContactGatheringDialog = ({
  contactGatheringHandler,
  isOpen,
  chatbotId,
}: {
  contactGatheringHandler: () => void;
  isOpen: boolean;
  chatbotId: string;
}) => {
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [contactPopupTiming, setContactPopupTiming] = useState('before');
  const [apiCallCompleted, setApiCallCompleted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const { mutate: onGetChatbotDetails, isPending } = useGetChatbotDetails({
    onSuccess(data) {
      if (data?.data.customizations.closeChat) {
        const closeChat = data?.data.customizations.closeChat;

        if (closeChat === 'OFF') {
          setShowContactPopup(false);
        } else if (closeChat === 'END' || closeChat === 'START') {
          setShowContactPopup(true);
          setContactPopupTiming(closeChat === 'END' ? 'after' : 'before');
        } else {
          setShowContactPopup(false);
        }
      } else {
        setShowContactPopup(false);
      }

      setApiCallCompleted(true);
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'Failed to fetch chatbot details';
      toast.error(errorMessage);
      setApiCallCompleted(true);
    },
  });

  const { mutate: onUpdateBot, isPending: isUpdatePending } = useUpdateChatbot({
    onSuccess(data) {
      toast.success(data?.message || 'Successfully updated');
      contactGatheringHandler();
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'Failed to update chatbot settings';
      toast.error(errorMessage);
    },
  });
  const handleDownloadContacts = useCallback(async () => {
    try {
      setIsDownloading(true);

      // Since responseInterceptor returns response.data,
      // the 'data' here is actually the blob or error response
      const data = await axiosInstance.get(
        `/contact/generate-report/${chatbotId}`,
        {
          responseType: 'blob',
        }
      );

      // Check if the response is actually a Blob (successful file download)
      if (data instanceof Blob) {
        // For successful blob responses, check if it's actually JSON (error case)
        // Sometimes servers return JSON with blob responseType
        const contentType = data.type;

        if (contentType && contentType.includes('application/json')) {
          try {
            toast.warning('No contact details available');
            return;
          } catch (jsonError) {
            console.error('Error parsing JSON response:', jsonError);
            toast.error('Failed to process server response');
            return;
          }
        }

        let url;

        try {
          url = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = url;
          a.download = `contacts_${chatbotId}_${
            new Date().toISOString().split('T')[0]
          }.csv`;

          // Temporarily add to DOM for download
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          toast.success('Contact details downloaded successfully');
        } catch (urlError) {
          console.error('Error creating object URL:', urlError);
          toast.error('Failed to download file');
        } finally {
          // Clean up the object URL
          if (url) {
            window.URL.revokeObjectURL(url);
          }
        }
      } else {
        // If data is not a Blob, it might be a JSON error response
        toast.warning('No contact details available');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download contact details');
    } finally {
      setIsDownloading(false);
    }
  }, [chatbotId]);

  const handleSave = useCallback(() => {
    const closeChat = showContactPopup
      ? contactPopupTiming === 'before'
        ? 'START'
        : 'END'
      : 'OFF';
    const dataObject = {
      customizations: {
        closeChat,
      },
    };
    const formData = new FormData();
    formData.append('data', JSON.stringify(dataObject));
    onUpdateBot({
      chatbotId: chatbotId,
      details: formData,
    });
  }, [chatbotId, contactPopupTiming, onUpdateBot, showContactPopup]);

  // Fetch chatbot details when dialog opens
  useEffect(() => {
    if (chatbotId && isOpen && !apiCallCompleted) {
      onGetChatbotDetails({ chatbotId: chatbotId as string });
    }
  }, [chatbotId, isOpen, apiCallCompleted, onGetChatbotDetails]);

  // Reset API call flag when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setApiCallCompleted(false);
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) contactGatheringHandler();
      }}
    >
      <DialogContent className='sm:max-w-md w-full max-w-[90vw] mx-auto rounded-lg'>
        {(isPending || isUpdatePending || isDownloading) && <Loader />}
        <DialogHeader>
          <DialogTitle className='text-xl font-medium'>
            Contact Gathering
          </DialogTitle>
          <DialogDescription className='text-gray-500 mt-2'>
            Configure when and how to collect visitor contact information during
            their chat experience.
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-6 p-4 md:p-5 border border-gray-200 rounded-lg'>
          <div className='flex items-start gap-3'>
            <div className='flex-grow'>
              <div
                className='font-medium text-base cursor-pointer'
                onClick={() => setShowContactPopup(!showContactPopup)}
              >
                Show contact gathering popup
              </div>
              <p className='text-sm text-gray-500 mt-1'>
                Enable to collect visitor email or phone number through a pop-up
                form.
              </p>
            </div>
            <Switch
              checked={showContactPopup}
              onCheckedChange={setShowContactPopup}
              className='mt-1'
            />
          </div>

          {showContactPopup && (
            <div className='space-y-2 pt-2'>
              <div className='font-medium text-base mb-2'>
                When to show popup
              </div>
              <p className='text-sm text-gray-500 mb-3'>
                Choose the optimal moment to request contact information from
                your visitors.
              </p>
              <Select
                value={contactPopupTiming}
                onValueChange={setContactPopupTiming}
              >
                <SelectTrigger className='w-full bg-white'>
                  <SelectValue placeholder='Select timing' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='before'>Before conversation</SelectItem>
                  <SelectItem value='after'>After conversation</SelectItem>
                </SelectContent>
              </Select>
              <div className='mt-2'>
                {contactPopupTiming === 'before' && (
                  <p className='text-xs text-gray-500'>
                    Collect contact details before the conversation begins. Best
                    for prioritizing lead capture.
                  </p>
                )}
                {contactPopupTiming === 'after' && (
                  <p className='text-xs text-gray-500'>
                    Request contact information after the conversation ends.
                    Ideal for following up with engaged visitors.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className='flex flex-col gap-3'>
          <Button
            onClick={handleDownloadContacts}
            variant='outline'
            className='border border-gray-300 text-xs px-5 text-gray-700 rounded-full py-2 hover:bg-gray-50 hover:text-gray-700 bg-transparent w-full flex items-center justify-center gap-2'
          >
            <svg
              className='w-4 h-4'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z'
              />
            </svg>
            Download Contact Details
          </Button>
          <div className='flex flex-col-reverse sm:flex-row sm:justify-end gap-3'>
            <Button
              variant='outline'
              onClick={() => contactGatheringHandler()}
              className='border border-[#57C0DD] text-xs px-5 text-[#57C0DD] rounded-full py-2 hover:bg-[#f0faff] hover:text-[#57C0DD] bg-transparent w-full sm:w-auto'
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className='bg-[#57C0DD] text-white text-xs hover:bg-[#4cb9d1] w-full py-2 rounded-full sm:w-auto'
            >
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactGatheringDialog;
