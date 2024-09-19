"use client";
import React, { useState } from "react";
import ChooseWebsiteTemplate from "./ChooseWebsiteTemplate";
import ChooseDocumentTemplate from "./ChooseDocumentTemplate";

const ChatbotTrainTemplate = ({ type }: { type: string }) => {
  const [step, setStep] = useState(0);
  const [websiteStep, setWebsiteStep] = useState(0);
  const stepHandler = () => {
    setStep(step + 1);
  };
  const websiteStepHandler = (type: string) => {
    if (type === "up") {
      setWebsiteStep(websiteStep + 1);
    } else {
      setWebsiteStep(websiteStep - 1);
    }
  };
  return (
    <div className="w-full  max-w-7xl flex-1 mx-auto h-auto flex flex-col gap-4 md:gap-6 lg:gap-8 sm:gap-11 ">
      <div className="w-fit md:mx-5 mx-auto">
        <div className="flex items-center gap-1 px-9">
          <div className="rounded-full p-2 w-8 h-8 flex items-center justify-center blue-gradient text-white">
            1
          </div>
          <div
            className={`w-24 sm:w-64 h-px border ${
              step === 1 ? "border-[#57C0DD]" : "border-[#CCCCCC]"
            }  border-dashed `}
          ></div>
          <div
            className={`rounded-full p-2 w-8 h-8 flex items-center justify-center ${
              step === 1 ? "blue-gradient" : "bg-[#CCCCCC]"
            } text-white`}
          >
            2
          </div>
        </div>
        <div className="flex justify-between mt-2 text-sm sm:text-base">
          <div className="text-black font-semibold">Set up chatbot</div>
          <div className="text-black font-semibold">Train chatbot</div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 h-full flex flex-col w-full">
        {step === 0 ? (
          type === "website" ? (
            websiteStep === 0 ? (
              <ChooseWebsiteTemplate websiteStepHandler={websiteStepHandler} />
            ) : (
              <ChooseDocumentTemplate
                optional={true}
                stepHandler={stepHandler}
                // websiteStepHandler={websiteStepHandler}
              />
            )
          ) : (
            <ChooseDocumentTemplate
              optional={false}
              stepHandler={stepHandler}
              // websiteStepHandler={websiteStepHandler}
            />
          )
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default ChatbotTrainTemplate;
