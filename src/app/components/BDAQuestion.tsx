import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const BDAQuestion = ({ down, type }: { down: () => void; type: string }) => {
  return (
    <div className="w-full  max-w-7xl flex-1 mx-auto h-auto flex flex-col">
      <div className="flex flex-col min-[830px]:flex-row justify-between items-start min-[830px]:items-center gap-3">
        <div className="text-lg flex-wrap sm:text-2xl font-semibold text-black flex items-center gap-2">
          Your selected industry is
          <span className="text-[#57C0DD] ">Real Estate</span>
        </div>

        <Button className="text-xs blue-gradient max-[500px]:h-8 md:text-lg text-white flex gap-2 items-center py-2 px-4 md:py-4 md:px-9 rounded my-1 md:my-3">
          Continue
          <FaArrowRightLong className="text-base md:text-lg text-white" />
        </Button>
      </div>
      <div className="text-black text-lg md:text-xl font-normal my-4">
        Answer the following questions
      </div>
      <div className="flex flex-col gap-4 md:gap-6 max-h-[329px]  sm:max-h-[441px] overflow-scroll">
        {Array(5)
          .fill("")
          .map((_, index) => (
            <Accordion type="single" collapsible key={index}>
              <AccordionItem
                value={`item-${index}`}
                className="px-4 py-0 sm:py-2  bg-white"
                style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
              >
                <AccordionTrigger>
                  <div>Question - {index + 1}</div>
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
      </div>
      <div className="flex justify-between items-center mt-4 md:mt-6">
        <div className="flex items-center gap-2 cursor-pointer" onClick={down}>
          <FaArrowLeftLong className="text-[#57C0DD] text-base md:text-lg" />
          <span className="text-[#57C0DD] text-base md:text-lg">Back</span>
        </div>
        <Link href={`${type}/train`}>
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {}}
          >
            <span className="text-[#57C0DD] text-base md:text-lg">Skip</span>
            <FaArrowRightLong className="text-[#57C0DD] text-base md:text-lg" />
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BDAQuestion;
