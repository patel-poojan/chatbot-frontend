"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { CgNotes } from "react-icons/cg";
import { FaArrowRightLong } from "react-icons/fa6";
import AlertDialog from "./AlertDialog";

const ChooseDocumentTemplate = ({
  optional,
  stepHandler,
}: // websiteStepHandler,
{
  optional: boolean;
  stepHandler: () => void;
  // websiteStepHandler: (type: "up" | "down") => void;
}) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };
  return (
    <div
      className="h-full flex-1 flex flex-col justify-between w-full bg-white rounded-3xl p-4 sm:p-6 md:p-8 lg:px-12 lg:py-10 "
      style={{ boxShadow: "0px 0px 12px 4px #00000014" }}
    >
      <div>
        <div className="flex items-center gap-4 justify-between">
          <div>
            <div className="flex gap-2 md:gap-3 items-center mb-2">
              <CgNotes className="text-xl sm:text-2xl font-bold text-[#57C0DD]" />
              <p className="font-semibold text-black text-lg sm:text-2xl">
                Document{" "}
                <span className="text-sm sm:text-2xl">
                  {optional ? "(Optional)" : ""}
                </span>
              </p>
            </div>
            <p className="font-normal text-black text-sm sm:text-base">
              Upload document to start further process of creating chatbot
            </p>
          </div>
          <div
            className={`${
              !optional ? "hidden" : "block"
            } flex items-center gap-1 md:gap-2 cursor-pointer`}
            onClick={() => {}}
          >
            <span className="text-[#57C0DD] text-base md:text-lg">Skip</span>
            <FaArrowRightLong className="text-[#57C0DD] text-base md:text-lg" />
          </div>
        </div>
        <div className="flex flex-col mx-auto sm:mx-0 gap-2 mt-6 w-fit">
          <div className="border-[#CCCCCC] border border-dashed  flex flex-col items-center justify-center gap-2 w-60 h-36">
            {fileName ? (
              <Image
                src="/images/file_pic.svg"
                alt="upload"
                width={84}
                height={84}
                quality={100}
              />
            ) : (
              <>
                <Image
                  src="/images/arrow_upload.svg"
                  alt="upload"
                  width={43}
                  height={43}
                  quality={100}
                />
                <div className="text-[#7E7E7E] font-normal text-sm">
                  upload file
                </div>
              </>
            )}
          </div>
          <label className="flex items-center justify-between border border-[#57C0DD]  w-full  p-2 cursor-pointer">
            <input type="file" className="hidden" onChange={handleFileChange} />
            <span className="text-sm sm:text-base w-full text-center text-[#57C0DD]">
              {fileName ? fileName : "Choose file"}
            </span>
          </label>
        </div>
      </div>
      <div className="mt-6 sm:mt-0  sm:ms-auto flex  items-center gap-4">
        {/* <Button
          className="w-full sm:w-auto px-8 py-2 sm:px-11 border border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent"
          onClick={() => {
            optional ? websiteStepHandler("down") : router.back();
          }}
        >
          Go Back
        </Button> */}
        <AlertDialog
          trigger={
            <Button className="w-full sm:w-auto px-8 py-2 sm:px-11 border border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent">
              Go Back
            </Button>
          }
        />
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
