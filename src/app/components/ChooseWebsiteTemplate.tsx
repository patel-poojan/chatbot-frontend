import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { TfiWorld } from "react-icons/tfi";

const ChooseWebsiteTemplate = ({
  websiteStepHandler,
}: {
  websiteStepHandler: (type: "up" | "down") => void;
}) => {
  const router = useRouter();
  return (
    <div
      className="h-full flex-1 flex flex-col justify-between w-full bg-white rounded-3xl p-4 sm:p-10"
      style={{ boxShadow: "0px 0px 12px 4px #00000014" }}
    >
      <div>
        <div className="flex gap-3 items-center mb-2">
          <TfiWorld className="text-xl sm:text-2xl font-bold text-[#57C0DD]" />
          <p className="font-semibold text-black text-lg sm:text-2xl">
            Website
          </p>
        </div>
        <p className="font-normal text-black text-sm sm:text-base">
          Scan your website content to generate answers to your customer
          questions.
        </p>
        <div className="h-12 border mt-4 mb-3"></div>
        <p className="font-light text-[#999999] text-xs">
          By sharing your URL, you confirm you have the necessary rights to
          share its content.
        </p>
      </div>
      <div className="mt-6 sm:mt-0 ms-auto flex flex-col sm:flex-row items-center gap-4">
        <Button
          className="w-full sm:w-auto px-8 py-2 sm:px-11 border border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent"
          onClick={() => router.back()}
        >
          Go Back
        </Button>
        <Button
          className="w-full sm:w-auto px-8 py-2 sm:px-11 border blue-gradient hover:bg-transparent"
          onClick={() => websiteStepHandler("up")}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ChooseWebsiteTemplate;
