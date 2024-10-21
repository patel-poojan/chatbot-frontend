import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { Loader } from "./Loader";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSaveBDAQuestion } from "@/utils/botCreation-api";
import { axiosError } from "../../types/axiosTypes";
type FetchBDAQuestionListResponse = {
  message: string;
  statusCode: number;
  success: boolean;
  data: {
    questions: string[];
  };
};
const BDAQuestion = ({
  down,
  type,
  industry,
  subIndustry,
  chatBotId,
}: {
  down: () => void;
  type: string;
  industry: string;
  subIndustry: string;
  chatBotId: string;
}) => {
  const [questionAnswer, setQuestionAnswer] = useState<
    { question: string; answer: string }[]
  >([]);
  const fetchBDAQuestion = async () => {
    const response: FetchBDAQuestionListResponse = await axiosInstance.post(
      `/bot/questions`,
      {
        category: industry,
        subcategory: subIndustry,
      }
    );
    if (response.data.questions.length >= 0) {
      setQuestionAnswer(
        response.data.questions.map((question: string) => {
          return { question: question, answer: "" };
        })
      );
      return response.data.questions;
    } else {
      setQuestionAnswer([]);
      return [];
    }
  };
  const router = useRouter();
  const {
    // data: BDAQuestionList,
    isLoading: loadBDAQuestionList,
    isError: errorInBDAQuestionList,
  } = useQuery({
    queryKey: ["BDAQuestion", "List"],
    queryFn: fetchBDAQuestion,
    enabled: industry && subIndustry ? true : false,
  });
  useEffect(() => {
    if (errorInBDAQuestionList) {
      toast.error("Something went wrong");
    }
  }, [errorInBDAQuestionList]);
  const { mutate: onSave, isPending: savePending } = useSaveBDAQuestion({
    onSuccess(data) {
      const path = `/create/${type}/train/${chatBotId}`;
      router.replace(path);
      toast.success(data?.message);
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        "failed to save";
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
    }
  };
  return (
    <div className="w-full  max-w-7xl flex-1 mx-auto h-auto flex flex-col">
      {loadBDAQuestionList || (savePending && <Loader />)}
      <div className="flex flex-col min-[830px]:flex-row justify-between items-start min-[830px]:items-center gap-3">
        <div className="text-lg flex-wrap sm:text-2xl font-semibold text-black flex items-center gap-2">
          Your selected industry is
          <span className="text-[#57C0DD] ">Real Estate</span>
        </div>
        {/* <Link href={`${type}/train/${chatBotId}`}> */}
        <Button
          className="text-xs blue-gradient max-[500px]:h-8 md:text-lg text-white flex gap-2 items-center py-2 px-4 md:py-4 md:px-9 rounded my-1 md:my-3"
          onClick={() => continueHandler()}
        >
          Continue
          <FaArrowRightLong className="text-base md:text-lg text-white" />
        </Button>
        {/* </Link> */}
      </div>
      <div className="text-black text-lg md:text-xl font-normal my-4">
        Answer the following questions
      </div>
      <div className="flex flex-col gap-4 md:gap-6 max-h-[329px]  sm:max-h-[441px]  overflow-scroll">
        {!errorInBDAQuestionList && questionAnswer ? (
          questionAnswer.map((data, index) => (
            <Accordion type="single" collapsible key={index}>
              <AccordionItem
                value={`item-${index}`}
                className="px-4 py-0 sm:py-2  bg-white"
                style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
              >
                <AccordionTrigger className="!text-start">
                  <div>{data.question}</div>
                </AccordionTrigger>
                <AccordionContent>
                  <Input
                    className="focus-visible:ring-0"
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
          <div>something went wrong</div>
        )}
      </div>
      <div className="flex justify-between items-center mt-4 md:mt-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={down}>
          <FaArrowLeftLong className="text-[#57C0DD] text-base md:text-lg" />
          <span className="text-[#57C0DD] text-base md:text-lg">Back</span>
        </div>

        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            const path = `/create/${type}/train/${chatBotId}`;
            router.replace(path);
          }}
        >
          <span className="text-[#57C0DD] text-base md:text-lg">Skip</span>
          <FaArrowRightLong className="text-[#57C0DD] text-base md:text-lg" />
        </div>
      </div>
    </div>
  );
};

export default BDAQuestion;
