'use client';
import React, { useState } from 'react';
import ChooseWebsiteTemplate from './ChooseWebsiteTemplate';
import ChooseDocumentTemplate from './ChooseDocumentTemplate';
import TuneChatbot from './TuneChatbot';

// import { useRouter } from "next/navigation";

const ChatbotTrainTemplate = ({
  type,
  botId,
}: {
  type: string;
  botId: string;
}) => {
  const [step, setStep] = useState(0);
  const [websiteStep, setWebsiteStep] = useState(0);
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [scanType, setScanType] = useState<string>('SINGLEPAGE');
  const [files, setFiles] = useState<File[]>([]);
  const stepHandler = () => {
    setStep(step + 1);
  };
  const websiteStepHandler = (type: string) => {
    if (type === 'up') {
      setWebsiteStep(websiteStep + 1);
    } else {
      if (websiteStep === 0) {
      } else {
        setWebsiteStep(websiteStep - 1);
      }
    }
  };

  // const router = useRouter();

  // useEffect(() => {
  //   const handleUnload = (event: BeforeUnloadEvent) => {
  //     event.preventDefault();
  //     // Displaying a default message (custom messages are not allowed)
  //     event.returnValue = "Are you sure you want to leave?";
  //   };

  //   window.addEventListener("beforeunload", handleUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleUnload);
  //   };
  // }, []);

  return (
    <div className='w-full  max-w-7xl flex-1 mx-auto h-auto flex flex-col gap-4 md:gap-6'>
      <div className='w-fit md:mx-5 mx-auto'>
        <div className='flex items-center gap-1 px-9'>
          <div className='rounded-full p-2 w-8 h-8 flex items-center justify-center blue-gradient text-white'>
            1
          </div>
          <div
            className={`w-24 sm:w-64 h-px border ${
              step === 1 ? 'border-[#57C0DD]' : 'border-[#CCCCCC]'
            }  border-dashed `}
          ></div>
          <div
            className={`rounded-full p-2 w-8 h-8 flex items-center justify-center ${
              step === 1 ? 'blue-gradient' : 'bg-[#CCCCCC]'
            } text-white`}
          >
            2
          </div>
        </div>
        <div className='flex justify-between mt-2 text-sm sm:text-base'>
          <div className='text-black font-semibold'>Set up ChatAgent</div>
          <div className='text-black font-semibold'>Train ChatAgent</div>
        </div>
      </div>
      {/* Main Content */}
      <div className='flex-1 h-full flex flex-col w-full'>
        {step === 0 ? (
          type === 'website' ? (
            websiteStep === 0 ? (
              <ChooseWebsiteTemplate
                websiteStepHandler={websiteStepHandler}
                scanType={scanType}
                websiteUrl={websiteUrl}
                setWebsiteUrl={setWebsiteUrl}
                setScanType={setScanType}
              />
            ) : (
              <ChooseDocumentTemplate
                optional={true}
                stepHandler={stepHandler}
                scanType={scanType}
                websiteUrl={websiteUrl}
                botId={botId}
                type='website'
                websiteStepHandler={websiteStepHandler}
                files={files}
                setFiles={setFiles}
              />
            )
          ) : (
            <ChooseDocumentTemplate
              optional={false}
              stepHandler={stepHandler}
              botId={botId}
              type='document'
              websiteStepHandler={websiteStepHandler}
              files={files}
              setFiles={setFiles}
            />
          )
        ) : (
          <TuneChatbot botId={botId} />
        )}
      </div>
    </div>
  );
};

export default ChatbotTrainTemplate;
// 'use client';
// import React, { useState, useEffect, useRef } from 'react';
// import ChooseWebsiteTemplate from './ChooseWebsiteTemplate';
// import ChooseDocumentTemplate from './ChooseDocumentTemplate';
// import TuneChatbot from './TuneChatbot';
// import { useDeleteBot } from '@/utils/botCreation-api';
// import { useRouter } from 'next/navigation';
// import { toast } from 'sonner';

// const ChatbotTrainTemplate = ({
//   type,
//   botId,
// }: {
//   type: string;
//   botId: string;
// }) => {
//   const [step, setStep] = useState(0);
//   const [websiteStep, setWebsiteStep] = useState(0);
//   const [websiteUrl, setWebsiteUrl] = useState<string>('');
//   const [scanType, setScanType] = useState<string>('SINGLEPAGE');
//   const [files, setFiles] = useState<File[]>([]);

//   const router = useRouter();

//   // Keep track of unload state
//   const isUnloading = useRef(false);

//   // Use the delete bot API directly in this component
//   const { mutate: deleteBot } = useDeleteBot({
//     onSuccess(data) {
//       // Set localStorage flag to indicate successful deletion
//       localStorage.setItem('botDeleted', 'true');
//       localStorage.setItem(
//         'deleteMessage',
//         data?.message || 'Bot deleted successfully'
//       );

//       // The page will reload/navigate automatically since we're in beforeunload
//     },
//     onError(error: any) {
//       // Store error in localStorage to show after reload/navigation
//       const errorMessage =
//         error?.response?.data?.errors?.message ||
//         error?.response?.data?.message ||
//         'Delete bot failed';
//       localStorage.setItem('deleteError', errorMessage);
//     },
//   });

//   const stepHandler = () => {
//     setStep(step + 1);
//   };

//   const websiteStepHandler = (type: string) => {
//     if (type === 'up') {
//       setWebsiteStep(websiteStep + 1);
//     } else {
//       setWebsiteStep(websiteStep - 1);
//     }
//   };

//   useEffect(() => {
//     // Check if we're returning from a reload with delete status
//     if (localStorage.getItem('botDeleted') === 'true') {
//       const message = localStorage.getItem('deleteMessage');
//       if (message) {
//         toast.success(message);
//       }

//       // Clear localStorage flags
//       localStorage.removeItem('botDeleted');
//       localStorage.removeItem('deleteMessage');

//       // Redirect to create page
//       router.push('/create');
//       return;
//     }

//     // Check for error
//     if (localStorage.getItem('deleteError')) {
//       const errorMessage = localStorage.getItem('deleteError');
//       toast.error(errorMessage);
//       localStorage.removeItem('deleteError');
//     }

//     // Set up handler for the browser's beforeunload event
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       // This will show the browser's native dialog
//       e.preventDefault();
//       e.returnValue = 'Changes you made may not be saved.';

//       // Mark that we're potentially unloading
//       isUnloading.current = true;

//       // Return a string to show the browser dialog
//       return e.returnValue;
//     };

//     // Set up handler for the page actually unloading
//     const handleUnload = () => {
//       // Only call the delete API if we're actually unloading and have a botId
//       if (isUnloading.current && botId) {
//         // Call the delete API
//         deleteBot({ chatbotId: botId });

//         // Use navigator.sendBeacon for reliable data sending during page unload
//         // This creates a URL with data to be handled on next page load
//         const deleteData = new FormData();
//         deleteData.append('botId', botId);
//         navigator.sendBeacon('/api/delete-on-unload', deleteData);
//       }
//     };

//     // Add the event listeners
//     window.addEventListener('beforeunload', handleBeforeUnload);
//     window.addEventListener('unload', handleUnload);

//     // Clean up
//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//       window.removeEventListener('unload', handleUnload);
//     };
//   }, [botId, deleteBot, router]);

//   return (
//     <div className='w-full max-w-7xl flex-1 mx-auto h-auto flex flex-col gap-4 md:gap-6'>
//       <div className='w-fit md:mx-5 mx-auto'>
//         <div className='flex items-center gap-1 px-9'>
//           <div className='rounded-full p-2 w-8 h-8 flex items-center justify-center blue-gradient text-white'>
//             1
//           </div>
//           <div
//             className={`w-24 sm:w-64 h-px border ${
//               step === 1 ? 'border-[#57C0DD]' : 'border-[#CCCCCC]'
//             }  border-dashed `}
//           ></div>
//           <div
//             className={`rounded-full p-2 w-8 h-8 flex items-center justify-center ${
//               step === 1 ? 'blue-gradient' : 'bg-[#CCCCCC]'
//             } text-white`}
//           >
//             2
//           </div>
//         </div>
//         <div className='flex justify-between mt-2 text-sm sm:text-base'>
//           <div className='text-black font-semibold'>Set up ChatAgent</div>
//           <div className='text-black font-semibold'>Train ChatAgent</div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className='flex-1 h-full flex flex-col w-full'>
//         {step === 0 ? (
//           type === 'website' ? (
//             websiteStep === 0 ? (
//               <ChooseWebsiteTemplate
//                 botId={botId}
//                 websiteStepHandler={websiteStepHandler}
//                 scanType={scanType}
//                 websiteUrl={websiteUrl}
//                 setWebsiteUrl={setWebsiteUrl}
//                 setScanType={setScanType}
//               />
//             ) : (
//               <ChooseDocumentTemplate
//                 optional={true}
//                 stepHandler={stepHandler}
//                 scanType={scanType}
//                 websiteUrl={websiteUrl}
//                 botId={botId}
//                 type='website'
//                 websiteStepHandler={websiteStepHandler}
//                 files={files}
//                 setFiles={setFiles}
//               />
//             )
//           ) : (
//             <ChooseDocumentTemplate
//               optional={false}
//               stepHandler={stepHandler}
//               botId={botId}
//               type='document'
//               websiteStepHandler={websiteStepHandler}
//               files={files}
//               setFiles={setFiles}
//             />
//           )
//         ) : (
//           <TuneChatbot botId={botId} />
//         )}
//       </div>
//     </div>
//   );
// };

// export default ChatbotTrainTemplate;
