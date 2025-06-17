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

type PlatformType = 'nextjs' | 'html';

const PublishDialog = ({
  chatbotId,
  trigger,
}: {
  chatbotId: string;
  trigger: React.ReactNode;
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] =
    useState<PlatformType>('nextjs');

  // Script code for Next.js/React.js
  const nextjsScriptCode = `<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js" />
<script src="${process.env.NEXT_PUBLIC_LOCAL_SERVER_END_POINT}/script/chatbot-embed.js"/>
<script
  id="chatbot-init"
  dangerouslySetInnerHTML={{
    __html: \`
      (function(botId) {
        function init() {
          if (window.initializeChatbot) {
            window.initializeChatbot(botId);
            return;
          }
          var check = setInterval(function() {
            if (window.initializeChatbot) {
              window.initializeChatbot(botId);
              clearInterval(check);
            }
          }, 100);
          setTimeout(function() { clearInterval(check); }, 10000);
        }
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          init();
        } else {
          document.addEventListener('DOMContentLoaded', init);
        }
      })('${chatbotId}');
    \`,
  }}
/>`;

  // Script code for PHP/HTML
  const htmlScriptCode = `<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
<script src="${process.env.NEXT_PUBLIC_LOCAL_SERVER_END_POINT}/script/chatbot-embed.js"></script>
<script>
  (function(botId) {
    function init() {
      if (window.initializeChatbot) {
        window.initializeChatbot(botId);
        return;
      }
      var check = setInterval(function() {
        if (window.initializeChatbot) {
          window.initializeChatbot(botId);
          clearInterval(check);
        }
      }, 100);
      setTimeout(function() {
        clearInterval(check);
      }, 10000);
    }
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      init();
    } else {
      document.addEventListener('DOMContentLoaded', init);
    }
  })('${chatbotId}');
</script>`;

  const currentScriptCode =
    selectedPlatform === 'nextjs' ? nextjsScriptCode : htmlScriptCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentScriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const platforms = [
    {
      id: 'nextjs' as PlatformType,
      name: 'Next.js / React.js',
      description: 'For React-based applications and Next.js projects',
      icon: '⚛️',
    },
    {
      id: 'html' as PlatformType,
      name: 'PHP / HTML',
      description: 'For traditional websites, PHP projects, and static HTML',
      icon: '🌐',
    },
  ];

  const getInstructions = () => {
    if (selectedPlatform === 'nextjs') {
      return (
        <ol className='list-decimal pl-4 sm:pl-5 space-y-1.5 sm:space-y-2 text-gray-600 text-sm sm:text-base'>
          <li>Copy the code snippet below</li>
          <li>
            Paste the script into your application as if you were placing it
            just before the closing{' '}
            <code className='bg-gray-100 px-1.5 py-0.5 mx-1 rounded text-sm'>
              &lt;/body&gt;
            </code>{' '}
            tag
          </li>
          <li>
            Add the script inside a specific page or component where you want
            the ChatAgent to appear
          </li>
          <li>
            Alternatively, add the script globally by placing it in your{' '}
            <code className='bg-gray-100 px-1.5 py-0.5 mx-1 rounded text-sm'>
              layout.js
            </code>{' '}
            (App Router) or{' '}
            <code className='bg-gray-100 px-1.5 py-0.5 mx-1 rounded text-sm'>
              _app.js
            </code>{' '}
            (Pages Router) to make the ChatAgent available across all pages
          </li>
        </ol>
      );
    } else {
      return (
        <ol className='list-decimal pl-4 sm:pl-5 space-y-1.5 sm:space-y-2 text-gray-600 text-sm sm:text-base'>
          <li>Copy the code snippet below</li>
          <li>
            {`Paste it into your website's HTML, just before the closing`}
            <code className='bg-gray-100 px-1.5 py-0.5 mx-1.5 rounded text-sm'>
              &lt;/body&gt;
            </code>{' '}
            tag
          </li>
        </ol>
      );
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className='max-w-[87vw] sm:max-w-[700px] w-[95vw] rounded-lg p-0 max-h-[90vh] overflow-hidden flex flex-col'>
        <DialogHeader className='sr-only'>
          <DialogTitle>Publish ChatAgent</DialogTitle>
          <DialogDescription id='dialog-description'>
            Publish ChatAgent
          </DialogDescription>
        </DialogHeader>

        {/* Sticky Header */}
        <div className='sticky top-0 z-10 bg-white border-b border-gray-200 px-4 sm:px-6 py-4'>
          <div className='flex items-center justify-between'>
            <div className='w-8' />
            <h2 className='text-primary text-lg sm:text-xl font-medium'>
              Publish ChatAgent
            </h2>
            <DialogClose className='p-1 hover:bg-gray-100 rounded-full'>
              <IoCloseOutline className='text-xl sm:text-2xl text-gray-500 hover:text-gray-700' />
            </DialogClose>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className='flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6'>
          <div className='flex flex-col gap-4 sm:gap-6 '>
            {/* Platform Selection */}
            <div className='space-y-3'>
              <h3 className='font-medium text-gray-800 text-sm sm:text-base'>
                Select your platform:
              </h3>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className={`
                    relative p-4 border-2 rounded-lg cursor-pointer transition-all
                    ${
                      selectedPlatform === platform.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }
                  `}
                    onClick={() => setSelectedPlatform(platform.id)}
                  >
                    <div className='flex items-start gap-3'>
                      <span className='text-xl'>{platform.icon}</span>
                      <div className='flex-1'>
                        <div className='flex items-center gap-2'>
                          <input
                            type='radio'
                            name='platform'
                            value={platform.id}
                            checked={selectedPlatform === platform.id}
                            onChange={() => setSelectedPlatform(platform.id)}
                            className='w-4 h-4 text-blue-600'
                          />
                          <h4 className='font-medium text-gray-800 text-sm sm:text-base'>
                            {platform.name}
                          </h4>
                        </div>
                        <p className='text-xs sm:text-sm text-gray-600 mt-1'>
                          {platform.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className='space-y-3 sm:space-y-4'>
              <p className='text-gray-600 text-sm sm:text-base'>
                Follow these steps to add the ChatAgent to your{' '}
                {selectedPlatform === 'nextjs'
                  ? 'React/Next.js application'
                  : 'website'}
                :
              </p>
              {getInstructions()}
            </div>

            {/* Code Snippet */}
            <div className='border border-gray-200 rounded-lg overflow-hidden'>
              <div className='flex items-center justify-between bg-gray-50 px-3 sm:px-4 py-2'>
                <div className='flex items-center gap-2'>
                  <span className='text-xs sm:text-sm font-medium text-gray-600'>
                    Code Snippet
                  </span>
                  <span className='text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded'>
                    {platforms.find((p) => p.id === selectedPlatform)?.name}
                  </span>
                </div>
                <button
                  onClick={handleCopy}
                  className='flex items-center gap-1.5 px-2 py-1 rounded hover:bg-gray-100 text-xs sm:text-sm text-gray-500 hover:text-gray-700 transition-colors'
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
                  <code>{currentScriptCode}</code>
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
                  The ChatAgent is compatible with all modern browsers and
                  devices
                </li>
                <li>
                  After adding the script tags, please refresh your website
                  (press Ctrl + Shift + R on Windows/Linux or Cmd + Shift + R on
                  Mac)
                </li>
                <li>
                  The ChatAgent will appear as a floating button on your website
                </li>
                {selectedPlatform === 'nextjs' && (
                  <li>
                    For Next.js projects, make sure to place the script in a
                    component that renders on the client side
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PublishDialog;
