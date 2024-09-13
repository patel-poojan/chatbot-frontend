"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { BsPersonFill } from "react-icons/bs";
import { IoGrid } from "react-icons/io5";
import {
  MdAdd,
  MdKeyboardArrowRight,
  MdOutlinePeopleAlt,
  MdOutlineQuickreply,
} from "react-icons/md";
import TopBar from "../components/TopBar";
import { TfiWorld } from "react-icons/tfi";
import { CgNotes } from "react-icons/cg";
import { BiArrowBack } from "react-icons/bi";
import { usePathname } from "next/navigation";

const Page = () => {
  const chatbotCards = new Array(1).fill(0);
  const [step, setStep] = useState(0);
  const pathName = usePathname();
  return (
    <div className="min-[500px]:bg-[#1B1B20] h-dvh  flex  p-0 min-[500px]:p-3">
      <div className="pr-3 hidden min-[500px]:flex flex-col justify-between py-3  lg:items-center">
        <div className="flex flex-col gap-3 items-center">
          <Link href={"/"}>
            <Image
              className="bg-white rounded-full cursor-pointer"
              src="/images/bot-icon.svg"
              alt="chatbot logo"
              width={45}
              height={45}
              priority
              quality={100}
            />
          </Link>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-[#3D3D4A] hover:bg-[#3D3D4A] h-11 w-11 flex items-center justify-center rounded-md cursor-pointer">
                  <IoGrid className="text-white text-2xl" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" align="center" sideOffset={14}>
                <p>ChatBots</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-transparent hover:bg-[#3D3D4A] h-11 w-11 flex items-center justify-center rounded-md cursor-pointer">
                  <MdOutlinePeopleAlt className="text-2xl text-white cursor-pointer" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" align="center" sideOffset={14}>
                <p>users</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-transparent hover:bg-[#3D3D4A] h-11 w-11 flex items-center justify-center rounded-md cursor-pointer">
                  <MdOutlineQuickreply className="text-2xl text-white cursor-pointer" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" align="center" sideOffset={14}>
                <p>training</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <BsPersonFill className="text-black text-4xl cursor-pointer p-1 rounded-full bg-white" />
      </div>

      <div className="flex-1 w-full flex flex-col bg-white max-[500px]:p-0 p-6 lg:p-8 xl:px-16 xl:py-12  min-[500px]:rounded-3xl overflow-hidden h-full">
        <div className="block min-[500px]:hidden">
          <TopBar
            content={
              <div className="h-full flex flex-col w-full bg-white pt-3">
                <div className="w-full  flex-1">
                  <div
                    className={`flex gap-3 items-center  rounded-lg py-3 ${
                      pathName === "/chatbotlist" ? "px-3" : ""
                    }`}
                    style={{
                      background:
                        pathName === "/chatbotlist"
                          ? "linear-gradient(90deg, #58C8DD 0%, #53A7DD 100%)"
                          : undefined,
                    }}
                  >
                    <div
                      className={
                        pathName === "/chatbotlist"
                          ? "p-2 rounded-md bg-[#3D3D4A33]"
                          : ""
                      }
                    >
                      <IoGrid
                        className={
                          pathName === "/chatbotlist"
                            ? "text-white text-lg"
                            : "text-lg text-[#1e255eb2]"
                        }
                      />
                    </div>
                    <p
                      className={`text-base  ${
                        pathName === "/chatbotlist"
                          ? "text-white"
                          : "text-[#1e255eb2]"
                      } text-white font-medium`}
                    >
                      Dashboard
                    </p>
                  </div>
                  <div className="flex gap-3 items-center py-3  bg-transparent">
                    <div>
                      <MdOutlinePeopleAlt className="text-2xl text-[#1e255eb2]" />
                    </div>
                    <p className="text-base text-white font-medium text-[#1e255eb2]">
                      User
                    </p>
                  </div>
                  <div className="flex gap-3 items-center py-3  bg-transparent">
                    <div>
                      <MdOutlineQuickreply className="text-2xl text-[#1e255eb2] cursor-pointer" />
                    </div>
                    <p className="text-base text-white font-medium text-[#1e255eb2]">
                      Training
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center border-2 bg-[#e9e9e933] rounded-xl border-[#F3F3F3] p-2">
                  <div className="flex items-center gap-3">
                    <BsPersonFill className="text-white text-4xl cursor-pointer p-2 rounded-full bg-black" />
                    <div>
                      <p className="text-[#1e255eb2] font-medium text-base">
                        User Name
                      </p>
                      <p className="text-[#1e255eb2] font-light text-base">
                        useremail123@gmail.com
                      </p>
                    </div>
                  </div>
                  <MdKeyboardArrowRight className="text-xl text-[#1E255E]" />
                </div>
              </div>
            }
          />
        </div>
        {step === 0 ? (
          <div className="flex-1 flex flex-col max-[500px]:p-6 overflow-auto">
            <div className="max-[500px]:text-xl text-2xl font-semibold text-black mb-6 max-[500px]:mb-4  ">
              ChatBots
            </div>
            <div className="flex-1 overflow-y-auto ">
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {chatbotCards.map((_, index) => (
                  <div
                    key={index}
                    className="h-32 sm:h-40 flex flex-col items-center justify-center rounded-3xl p-3 sm:p-4 cursor-pointer"
                    onClick={() => setStep(1)}
                    style={{
                      background:
                        "linear-gradient(90deg, #58C8DD 0%, #53A7DD 100%)",
                    }}
                  >
                    <div className="bg-white rounded-full p-1 sm:p-2">
                      <MdAdd className="text-xl sm:text-2xl text-[#58C8DD]" />
                    </div>
                    <div className="text-white font-medium text-sm sm:text-base">
                      Add chatbot
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col  max-[500px]:p-6 overflow-auto">
            <div className="flex   gap-3">
              <BiArrowBack
                onClick={() => setStep(0)}
                className="text-4xl md:text-2xl md:mt-1 cursor-pointer  font-semibold  text-black"
              />
              <div className="max-[768px]:mt-1">
                <div className="text-xl sm:text-2xl font-semibold  text-black mb-2 sm:mb-4">
                  Set up your chatbot
                </div>
                <div className="mb-4 sm:mb-6 font-normal text-base sm:text-xl text-black">
                  Train your chatbot with data, use our ready-to-use templates
                  or start from scratch.
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                <div
                  className="border flex flex-col bg-white justify-center rounded-3xl p-4 sm:p-6 cursor-pointer"
                  onClick={() => setStep(1)}
                  style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
                >
                  <TfiWorld className="text-3xl sm:text-4xl font-bold text-[#57C0DD] mb-3 sm:mb-4" />
                  <p className="font-semibold text-black text-lg sm:text-2xl">
                    Website
                  </p>
                  <p className="mt-2 sm:mt-3 font-normal text-black text-xs sm:text-sm">
                    Crawl your website’s content to get answers to popular user
                    questions.
                  </p>
                </div>

                <div
                  className="border flex flex-col bg-white justify-center rounded-3xl p-4 sm:p-6 cursor-pointer"
                  onClick={() => setStep(1)}
                  style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
                >
                  <CgNotes className="text-3xl sm:text-4xl font-bold text-[#CE51DA] mb-3 sm:mb-4" />
                  <p className="font-semibold text-black text-lg sm:text-2xl">
                    Document
                  </p>
                  <p className="mt-2 sm:mt-3 font-normal text-black text-xs sm:text-sm">
                    Lorem ipsum dolor sit amet consectetur. Nibh condimentum vel
                    ligula sagittis.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
