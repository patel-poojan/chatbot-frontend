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

  const handleSave = useCallback(() => {
    const closeChat = showContactPopup
      ? contactPopupTiming === 'before'
        ? 'START'
        : 'END'
      : 'OFF';

    onUpdateBot({
      chatbotId: chatbotId,
      details: {
        customizations: {
          closeChat,
        },
      },
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
        {(isPending || isUpdatePending) && <Loader />}
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

        <div className='flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-4'>
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
      </DialogContent>
    </Dialog>
  );
};

export default ContactGatheringDialog;
