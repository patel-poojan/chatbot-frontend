import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import React, { useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import { IoCopyOutline, IoCheckmarkOutline } from 'react-icons/io5';

const PublishDialog = ({
  chatbotId,
  trigger,
}: {
  chatbotId: string;
  trigger: React.ReactNode;
}) => {
  const [copied, setCopied] = useState(false);
  {
    /* <script defer src='https://cdn.tailwindcss.com'></script> */
  }
  // Properly format the script code with escaped characters
  const scriptCode = `
<script defer src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
  <script defer src='${process.env.NEXT_PUBLIC_LOCAL_SERVER_END_POINT}/script/chatbot-embed.js'></script>
  <script
    defer
    dangerouslySetInnerHTML={{
      __html: \`
        document.addEventListener('DOMContentLoaded', function() {
          if (window.initializeChatbot) {
            window.initializeChatbot("${chatbotId}");
            return;
          }
          const checkInitialize = setInterval(function() {
            if (window.initializeChatbot) {
              window.initializeChatbot("${chatbotId}");
              clearInterval(checkInitialize);
            }
          }, 100);
          setTimeout(() => clearInterval(checkInitialize), 10000);
        });
      \`,
    }}
  />`;
  const handleCopy = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='max-w-[87vw] sm:max-w-[600px] w-[95vw]  rounded-lg p-4 sm:p-6 max-h-[90vh] overflow-y-auto'>
        <DialogHeader className='sr-only'>
          <DialogTitle>Publish ChatAgent</DialogTitle>
          <DialogDescription id='dialog-description'>
            Publish ChatAgent
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-4 sm:gap-6'>
          {/* Header */}
          <div className='flex items-center justify-between'>
            <div className='w-8' /> {/* Spacer for balance */}
            <h2 className='text-primary text-lg sm:text-xl font-medium'>
              Publish ChatAgent
            </h2>
            <DialogClose className='p-1 hover:bg-gray-100 rounded-full'>
              <IoCloseOutline className='text-xl sm:text-2xl text-gray-500 hover:text-gray-700' />
            </DialogClose>
          </div>

          {/* Instructions */}
          <div className='space-y-3 sm:space-y-4'>
            <p className='text-gray-600 text-sm sm:text-base'>
              Follow these steps to add the ChatAgent to your website:
            </p>
            <ol className='list-decimal pl-4 sm:pl-5 space-y-1.5 sm:space-y-2 text-gray-600 text-sm sm:text-base'>
              <li>Copy the code snippet below</li>
              <li>
                {` Paste it into your website's HTML, just before the closing`}
                <code className='bg-gray-100 px-1.5 py-0.5 mx-1.5 rounded text-sm'>
                  &lt;/body&gt;
                </code>
                tag
              </li>
            </ol>
          </div>

          {/* Code Snippet */}
          <div className='border border-gray-200 rounded-lg overflow-hidden'>
            <div className='flex items-center justify-between bg-gray-50 px-3 sm:px-4 py-2'>
              <span className='text-xs sm:text-sm font-medium text-gray-600'>
                Code Snippet
              </span>
              <button
                onClick={handleCopy}
                className='flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-100 text-xs sm:text-sm text-gray-500 hover:text-gray-700'
              >
                {copied ? (
                  <IoCheckmarkOutline className='text-green-500' />
                ) : (
                  <IoCopyOutline />
                )}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <div className='relative w-full'>
              <pre className='bg-gray-900 text-gray-100 p-3 sm:p-4 overflow-x-auto whitespace-pre-wrap break-all text-xs sm:text-sm max-h-48 sm:max-h-64'>
                <code>{scriptCode}</code>
              </pre>
            </div>
          </div>

          {/* Additional Info */}
          <div className='bg-[#57C0DD2A] p-3 sm:p-4 rounded-lg'>
            <h3 className='font-medium text-[#353B6B] mb-1.5 sm:mb-2 text-sm sm:text-base'>
              Important Notes:
            </h3>
            <ul className='list-disc pl-4 sm:pl-5 space-y-1 text-gray-600 text-xs sm:text-sm'>
              <li>
                The ChatAgent is compatible with all modern browsers and devices
              </li>
              <li>
                After adding the script tags, please refresh your website (press
                Ctrl + Shift + R on Windows/Linux or Cmd + Shift + R on Mac)
              </li>
              <li>
                The ChatAgent will appear as a floating button on your website
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishDialog;
