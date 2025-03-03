"use client";
import React, { useEffect, useRef, useState } from "react";
import ChooseWebsiteTemplate from "./ChooseWebsiteTemplate";
import ChooseDocumentTemplate from "./ChooseDocumentTemplate";
import TuneChatbot from "./TuneChatbot";
import ChooseIndustryTemplate from "./ChooseIndustryTemplate";
import BDAQuestion from "./BDAQuestion";
import ProgressStepper from "./ProgressStepper";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { axiosInstance } from "@/utils/axiosInstance";
import { Loader } from "./Loader";
import TrainWrapper from "./TrainWrapper";

type FetchBDAQuestionListResponse = {
  message: string;
  statusCode: number;
  success: boolean;
  data: {
    questions: string[];
  };
};

const ChatbotTrainTemplate = ({ type, botId }: { type: string; botId: string }) => {
  const [step, setStep] = useState(0);
  const [websiteStep, setWebsiteStep] = useState(0);
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [scanType, setScanType] = useState<string>("SINGLEPAGE");
  const [files, setFiles] = useState<File[]>([]);
  const [questionAnswer, setQuestionAnswer] = useState<{ question: string; answer: string }[]>([]);
  const [industryValue, setIndustryValue] = useState("");
  const [subIndustryValue, setSubIndustryValue] = useState("");

  const stepHandler = (Type: string) => {
    if (Type === "up") {
      setStep(step + 1);
    } else {
      setStep(step - 1);
    }
  };
  const websiteStepHandler = (Type: string) => {
    if (Type === "up") {
      setWebsiteStep(websiteStep + 1);
    } else {
      setWebsiteStep(websiteStep - 1);
    }
  };

  const fetchBDAQuestion = async () => {
    const response: FetchBDAQuestionListResponse = await axiosInstance.post(`/bda/questions`, {
      category: industryValue,
      subcategory: subIndustryValue,
    });
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

  const {
    isLoading: loadBDAQuestionList,
    isError: errorInBDAQuestionList,
    isRefetching: fetchingBDAQuestion,
  } = useQuery({
    queryKey: ["BDAQuestion", "List", industryValue, subIndustryValue],
    queryFn: () => fetchBDAQuestion(),
    enabled: industryValue && subIndustryValue ? true : false,
  });

  useEffect(() => {
    console.log("errorInBDAQuestionList", errorInBDAQuestionList);
    if (errorInBDAQuestionList) {
      toast.error("Something went wrong");
    }
  }, [errorInBDAQuestionList]);
  const isUnloading = useRef(false);

  useEffect(() => {
    const hasUnsavedChanges = () => {
      return (
        websiteUrl !== "" ||
        files.length > 0 ||
        questionAnswer.some((qa) => qa.answer !== "") ||
        industryValue !== "" ||
        subIndustryValue !== ""
      );
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show the dialog if there are unsaved changes
      if (hasUnsavedChanges()) {
        // Custom message that explains what will happen
        const message = "You have unsaved changes. If you leave now, your chatbot training progress will be lost.";

        e.preventDefault();
        e.returnValue = message;
        isUnloading.current = true;

        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [websiteUrl, files, questionAnswer, industryValue, subIndustryValue]);

  return (
    <div className="w-full  max-w-7xl flex-1 mx-auto h-auto flex flex-col gap-4 md:gap-6">
      {(loadBDAQuestionList || fetchingBDAQuestion) && <Loader />}

      <ProgressStepper currentStep={step} />
      {/* Main Content */}
      <div className="flex-1 h-full flex flex-col w-full">
        {step === 0 ? (
          <TrainWrapper>
            <ChooseIndustryTemplate
              stepHandler={stepHandler}
              botId={botId}
              industryValue={industryValue}
              setIndustryValue={setIndustryValue}
              subIndustryValue={subIndustryValue}
              setSubIndustryValue={setSubIndustryValue}
            />
          </TrainWrapper>
        ) : step === 1 ? (
          <BDAQuestion
            stepHandler={stepHandler}
            industry={industryValue}
            subIndustry={subIndustryValue}
            chatBotId={botId}
            questionAnswer={questionAnswer}
            setQuestionAnswer={setQuestionAnswer}
            errorInBDAQuestionList={errorInBDAQuestionList}
          />
        ) : step === 2 ? (
          type === "website" ? (
            websiteStep === 0 ? (
              <ChooseWebsiteTemplate
                stepHandler={stepHandler}
                scanType={scanType}
                websiteUrl={websiteUrl}
                setWebsiteUrl={setWebsiteUrl}
                setScanType={setScanType}
                websiteStepHandler={websiteStepHandler}
              />
            ) : (
              <ChooseDocumentTemplate
                optional={true}
                stepHandler={stepHandler}
                scanType={scanType}
                websiteUrl={websiteUrl}
                botId={botId}
                type="website"
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
              type="document"
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
