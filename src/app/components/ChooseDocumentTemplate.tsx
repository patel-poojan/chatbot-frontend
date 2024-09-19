import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { CgNotes } from "react-icons/cg";
import { FaArrowRightLong } from "react-icons/fa6";

const ChooseDocumentTemplate = ({
  optional,
  stepHandler,
  websiteStepHandler,
}: {
  optional: boolean;
  stepHandler: () => void;
  websiteStepHandler: (type: "up" | "down") => void;
}) => {
  const router = useRouter();
  return (
    <div
      className="h-full flex-1 flex flex-col justify-between w-full bg-white rounded-3xl p-4 sm:p-10"
      style={{ boxShadow: "0px 0px 12px 4px #00000014" }}
    >
      <div>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex gap-3 items-center mb-2">
              <CgNotes className="text-xl sm:text-2xl font-bold text-[#57C0DD]" />
              <p className="font-semibold text-black text-lg sm:text-2xl">
                Document {optional ? "(Optional)" : ""}
              </p>
            </div>
            <p className="font-normal text-black text-sm sm:text-base">
              Upload document to start further process of creating chatbot
            </p>
          </div>
          <div
            className={`${
              !optional ? "hidden" : "block"
            } flex items-center gap-2 cursor-pointer`}
            onClick={() => {}}
          >
            <span className="text-[#57C0DD] text-base md:text-lg">Skip</span>
            <FaArrowRightLong className="text-[#57C0DD] text-base md:text-lg" />
          </div>
        </div>
      </div>
      <div className="mt-6 sm:mt-0 ms-auto flex flex-col sm:flex-row items-center gap-4">
        <Button
          className="w-full sm:w-auto px-8 py-2 sm:px-11 border border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent"
          onClick={() => {
            optional ? websiteStepHandler("down") : router.back();
          }}
        >
          Go Back
        </Button>
        <Button
          className="w-full sm:w-auto px-8 py-2 sm:px-11 border blue-gradient hover:bg-transparent"
          onClick={() => stepHandler()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ChooseDocumentTemplate;
