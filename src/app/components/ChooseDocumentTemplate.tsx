"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import React, { useState } from "react";
import { CgNotes } from "react-icons/cg";
import { FaArrowRightLong } from "react-icons/fa6";
import AlertDialog from "./AlertDialog";
import useWindowDimensions from "@/utils/windowSize";
import { IoCloseOutline } from "react-icons/io5";
import { useTrainBot } from "@/utils/botCreation-api";
import { toast } from "sonner";
import { axiosError } from "../../types/axiosTypes";
import { Loader } from "./Loader";

const ChooseDocumentTemplate = ({
  optional,
  stepHandler,
  type,
  botId,
  scanType,
  websiteUrl,
}: {
  optional: boolean;
  stepHandler: () => void;
  botId: string;
  type: string;
  scanType?: string;
  websiteUrl?: string;
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const [files, setFiles] = useState<File[]>([]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files!);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Append new files to the existing ones
  };
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  const { mutate: onTrainBot, isPending } = useTrainBot({
    onSuccess(data) {
      toast.success(data?.message);
      stepHandler();
    },

    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        "chatbot training failed";
      toast.error(errorMessage);
    },
  });
  const continueHandler = () => {
    console.log("botId", botId);
    if (type === "document" && botId) {
      if (files.length === 0) {
        toast.warning("Please select document");
      } else {
        onTrainBot({
          chatbotId: botId,
          details: {
            document: files,
            type: "document",
          },
        });
      }
    } else if (type === "website" && botId) {
      if (scanType && websiteUrl) {
        if (files.length === 0) {
          onTrainBot({
            chatbotId: botId,
            details: {
              websiteUrl: websiteUrl,
              scanType: scanType,
              type: "website",
            },
          });
        } else {
          onTrainBot({
            chatbotId: botId,
            details: {
              websiteUrl: websiteUrl,
              document: files,
              scanType: scanType,
              type: "website",
            },
          });
        }
      } else {
        toast.error("please select scan type and website url");
      }
    }
  };
  return (
    <div
      className=" flex flex-col justify-between w-full overflow-hidden bg-white rounded-3xl p-4 sm:p-6 md:p-8 lg:px-12 lg:py-10 "
      style={{
        boxShadow: "0px 0px 12px 4px #00000014",
        height: `${
          screenWidth > 768
            ? "calc(100dvh - 248px)"
            : screenWidth > 640
            ? "calc(100dvh - 206px)"
            : "calc(100dvh - 170px)"
        } `,
      }}
    >
      {isPending && <Loader />}
      <div className="flex overflow-hidden gap-6 flex-col flex-1">
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
            onClick={() => {
              continueHandler();
            }}
          >
            <span className="text-[#57C0DD] text-base md:text-lg">Skip</span>
            <FaArrowRightLong className="text-[#57C0DD] text-base md:text-lg" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto ">
          <div className="grid overflow-y-auto gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
            {files.map((file, index) => (
              <div key={index}>
                <div className="border-[#CCCCCC] border border-dashed  flex flex-col items-center justify-center gap-2 w-full h-36">
                  <Image
                    src="/images/file_pic.svg"
                    alt="upload"
                    width={84}
                    height={84}
                    quality={100}
                  />
                </div>
                <label className="flex items-center justify-between border border-[#57C0DD]  w-full  p-2">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm truncate sm:text-base w-full text-center text-[#57C0DD]">
                      {file.name}
                    </span>
                    <IoCloseOutline
                      className="text-lg text-[#57C0DD] cursor-pointer"
                      onClick={() => handleRemoveFile(index)}
                    />
                  </div>
                </label>
              </div>
            ))}
            <div>
              <div className="border-[#CCCCCC] border border-dashed  flex flex-col items-center justify-center gap-2 w-full h-36">
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
              </div>
              <label className="flex items-center justify-between border border-[#57C0DD]  w-full  p-2 cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <span className="text-sm sm:text-base w-full text-center text-[#57C0DD]">
                  Choose file
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-6   sm:ms-auto flex  items-center gap-4">
        {/* <Button
          className="w-full sm:w-auto px-8 py-2 sm:px-11 border border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent"
          onClick={() => {
            optional ? websiteStepHandler("down") : router.back();
          }}
        >
          Go Back
        </Button> */}
        <AlertDialog
          botId={botId}
          trigger={
            <Button className="w-full sm:w-auto px-8 py-2 sm:px-11 border border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent">
              Go Back
            </Button>
          }
        />
        <Button
          className="w-full sm:w-auto px-8 py-2 sm:px-11 border blue-gradient hover:bg-transparent"
          onClick={() => continueHandler()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default ChooseDocumentTemplate;
