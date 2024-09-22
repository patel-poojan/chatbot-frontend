import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp, IoMdCheckmark } from "react-icons/io";
import { TfiWorld } from "react-icons/tfi";
import AlertDialog from "./AlertDialog";

const ChooseWebsiteTemplate = ({
  websiteStepHandler,
}: {
  websiteStepHandler: (type: "up" | "down") => void;
}) => {
  const [page, setPage] = useState("Scan a full page");
  const [dropDown, setDropDown] = useState(false);

  return (
    <div
      className="h-full flex-1 flex flex-col justify-between w-full bg-white rounded-3xl p-4 sm:p-6 lg:px-12 lg:py-10 "
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
        <div
          className="h-12 border rounded-xl
         mt-4 mb-3 flex items-center bg-[#F2F2F2]"
        >
          <Input
            className="flex-1 border-none shadow-none bg-transparent placeholder:text-[#989898] focus-visible:ring-0 text-sm sm:text-base placeholder:text-sm sm:placeholder:text-base placeholder:font-light "
            placeholder="Enter a URL address"
          ></Input>
          <div className="mx-2 sm:mx-3 md:mx-5">
            <DropdownMenu onOpenChange={() => setDropDown(!dropDown)}>
              <DropdownMenuTrigger className="focus-visible:!outline-none w-full md:w-auto text-sm sm:text-base md:text-lg font-normal text-black flex items-center justify-between gap-2">
                {page}
                {dropDown ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-2 md:p-3 rounded-xl mt-3  me-12 sm:me-20 md:me-28 w-auto">
                <DropdownMenuItem
                  className="p-2  hover:bg-[#EEEEEE] flex flex-col justify-start items-start cursor-pointer"
                  onClick={() => setPage("Scan a full page")}
                >
                  <div className="text-sm sm:text-base md:text-lg font-medium flex items-center justify-between w-full">
                    Scan a full page
                    {page === "Scan a full page" && <IoMdCheckmark />}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base font-light">
                    Entire content from the provided page
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="p-2  hover:bg-[#EEEEEE] flex flex-col justify-start items-start cursor-pointer"
                  onClick={() => setPage("Scan a single page")}
                >
                  <div className="text-sm sm:text-base md:text-lg font-medium flex items-center justify-between w-full">
                    Scan a single page
                    {page === "Scan a single page" && <IoMdCheckmark />}
                  </div>
                  <div className="text-xs sm:text-sm md:text-base font-light">
                    Only single URL you provided
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="font-light text-[#999999] text-xs">
          By sharing your URL, you confirm you have the necessary rights to
          share its content.
        </p>
      </div>

      <div className="mt-6 sm:mt-0  sm:ms-auto flex  items-center gap-4">
        <AlertDialog
          trigger={
            <Button
              className="w-full sm:w-auto px-8 py-2 sm:px-11 border border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent"
              // onClick={() => router.back()}
            >
              Go Back
            </Button>
          }
        />

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
