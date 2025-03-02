import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { axiosInstance } from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { FaArrowRightLong } from 'react-icons/fa6';
import { Loader } from './Loader';
import { toast } from 'sonner';
import { useSaveBDAQuestion } from '@/utils/botCreation-api';
import { axiosError } from '../../types/axiosTypes';
import useWindowDimensions from '@/utils/windowSize';

type FetchBDAQuestionListResponse = {
  message: string;
  statusCode: number;
  success: boolean;
  data: {
    questions: string[];
  };
};

const BDAQuestion = ({
  stepHandler,
  industry,
  subIndustry,
  chatBotId,
  questionAnswer,
  setQuestionAnswer,
}: {
  stepHandler: (type: 'up' | 'down') => void;
  industry: string;
  subIndustry: string;
  chatBotId: string;
  questionAnswer: { question: string; answer: string }[];
  setQuestionAnswer: React.Dispatch<
    React.SetStateAction<{ question: string; answer: string }[]>
  >;
}) => {
  const fetchBDAQuestion = async () => {
    const response: FetchBDAQuestionListResponse = await axiosInstance.post(
      `/bda/questions`,
      {
        category: industry,
        subcategory: subIndustry,
      }
    );
    if (response.data.questions.length >= 0) {
      setQuestionAnswer(
        response.data.questions.map((question: string) => {
          return { question: question, answer: '' };
        })
      );
      return response.data.questions;
    } else {
      setQuestionAnswer([]);
      return [];
    }
  };

  const {
    isLoading: loadBDAQuestionList,
    isError: errorInBDAQuestionList,
    isFetching: fetchingBDAQuestion,
  } = useQuery({
    queryKey: ['BDAQuestion', 'List'],
    queryFn: fetchBDAQuestion,
    enabled: industry && subIndustry ? true : false,
  });

  useEffect(() => {
    if (errorInBDAQuestionList) {
      toast.error('Something went wrong');
    }
  }, [errorInBDAQuestionList]);

  const { mutate: onSave, isPending: savePending } = useSaveBDAQuestion({
    onSuccess(data) {
      stepHandler('up');
      toast.success(data?.message);
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'failed to save';
      toast.error(errorMessage);
    },
  });

  const continueHandler = () => {
    if (questionAnswer.length > 0 && industry && subIndustry && chatBotId) {
      onSave({
        chatbotId: chatBotId,
        category: industry,
        subcategory: subIndustry,
        data: questionAnswer,
      });
    } else {
      stepHandler('up');
    }
  };
  const { width: screenWidth } = useWindowDimensions();
  const containerHeight =
    screenWidth > 768
      ? 'calc(100dvh - 248px)'
      : screenWidth > 640
      ? 'calc(100dvh - 206px)'
      : 'calc(100dvh - 170px)';
  return (
    <div
      className='flex flex-col justify-between w-full overflow-hidden bg-white rounded-3xl p-4 sm:p-6 md:p-8 lg:px-12 lg:py-10'
      style={{
        boxShadow: '0px 0px 12px 4px #00000014',
        height: containerHeight,
      }}
    >
      <div className='w-full max-w-7xl flex-1 mx-auto h-auto flex flex-col overflow-hidden'>
        {(loadBDAQuestionList || savePending || fetchingBDAQuestion) && (
          <Loader />
        )}
        <div className='flex flex-col min-[830px]:flex-row justify-between items-start min-[830px]:items-center gap-3'>
          <div className='text-lg flex-wrap sm:text-2xl font-semibold text-black flex items-center gap-2'>
            Your selected industry is
            <span className='text-[#57C0DD] capitalize'>
              {industry} - {subIndustry},
            </span>
          </div>
          <div
            className='flex items-center gap-2 cursor-pointer'
            onClick={() => {
              stepHandler('up');
            }}
          >
            <span className='text-[#57C0DD] text-base md:text-lg'>Skip</span>
            <FaArrowRightLong className='text-[#57C0DD] text-base md:text-lg' />
          </div>
        </div>
        <div className='text-black text-lg md:text-xl font-normal my-4'>
          Answer the following questions
        </div>
        <div className='flex flex-col gap-4 md:gap-6 flex-1 overflow-scroll'>
          {!errorInBDAQuestionList ? (
            questionAnswer.length > 0 ? (
              questionAnswer.map((data, index) => (
                <Accordion type='single' collapsible key={index}>
                  <AccordionItem
                    value={`item-${index}`}
                    className='px-4 py-0 sm:py-2 bg-white'
                    style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
                  >
                    <AccordionTrigger className='!text-start'>
                      <div>{data.question}</div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <Input
                        className='focus-visible:ring-0'
                        value={data.answer}
                        onChange={(e) =>
                          setQuestionAnswer((prev) => {
                            const updated = [...prev];
                            updated[index] = {
                              ...updated[index],
                              answer: e.target.value,
                            };
                            return updated;
                          })
                        }
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))
            ) : (
              <div
                className='flex flex-col items-center justify-center p-8 bg-white rounded-lg'
                style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
              >
                <p className='text-lg text-gray-600 mb-2'>No questions found</p>
                <p className='text-sm text-gray-500 text-center'>
                  There are currently no questions available for this industry
                  and sub-industry combination.
                </p>
              </div>
            )
          ) : (
            <div>something went wrong</div>
          )}
        </div>
      </div>
      <div className='pt-6 sm:ms-auto flex items-center gap-4'>
        <Button
          className='w-full sm:w-auto px-8 py-2 sm:px-11 border border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent'
          onClick={() => stepHandler('down')}
        >
          Go Back
        </Button>
        <Button
          className='w-full sm:w-auto px-8 py-2 sm:px-11 border bg-gradient-to-r hover:from-[#53A7DD] hover:to-[#58C8DD] from-[#58C8DD] to-[#53A7DD] hover:bg-transparent'
          onClick={() => continueHandler()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default BDAQuestion;
