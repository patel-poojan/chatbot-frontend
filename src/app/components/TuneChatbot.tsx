import React from "react";
import AlertDialog from "./AlertDialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Cross2Icon } from "@radix-ui/react-icons";
import useWindowDimensions from "@/utils/windowsize";

const TuneChatbot = () => {
  const { width: screenWidth } = useWindowDimensions();
  console.log("screenWidth", screenWidth);
  return (
    <div
      className=" relative   flex flex-col justify-between w-full bg-white rounded-3xl p-4 sm:p-6 md:p-8 lg:px-12 lg:py-10"
      style={{
        boxShadow: "0px 0px 12px 4px #00000014",
        height: `${
          screenWidth > 768
            ? "calc(100dvh - 248px)"
            : screenWidth > 640
            ? "calc(100dvh - 206px)"
            : "calc(100dvh - 186px)"
        } `,
      }}
    >
      <div className="flex-1 flex flex-col lg:flex-row gap-6 w-full overflow-hidden">
        <div className="w-full lg:w-3/5 flex-1 flex flex-col gap-6">
          <div>
            <p className="text-black font-semibold text-2xl">
              Tune your chatbot
            </p>
            <p className="text-[#1E255EB2] font-normal mt-2 text-base">
              Add final tweaks to achieve better results.
            </p>
          </div>

          <div>
            <p className="text-black font-normal text-lg">
              Customise your welcome message
            </p>
            <div
              className="my-3 bg-[#FAFAFA] text-black font-light text-base w-full p-4 md:p-6"
              style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
            >
              👋 Welcome to Chatbot! I’m ChatBot, your AI assistant 🤖. What can
              I do for you?
            </div>
            <div className="flex items-center gap-2">
              <Button className="border bg-transparent hover:bg-transparent border-[#57C0DD] py-3 px-6 md:px-11 rounded-xl text-[#57C0DD]">
                FAQ
              </Button>
              <Button className="border bg-transparent hover:bg-transparent border-[#57C0DD] py-3 px-6 md:px-11 rounded-xl text-[#57C0DD]">
                About Chatbot
              </Button>
            </div>
          </div>

          <p className="text-black font-normal text-lg mb-3">
            Set up attributes
          </p>
          <div className=" flex flex-col !overflow-y-auto gap-3 flex-1">
            {["Company Name", "Company Address", "About us", "LinkedIn"].map(
              (item, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl text-[#1E255EB2] bg-[#FAFAFA] shadow-sm"
                  style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        <div className="hidden lg:w-2/5 lg:flex flex-col gap-3 border-t-[40px] rounded-[30px] border-r-[40px] border-b-0 border-l-[40px] border-[#57C0DD] p-4">
          <div className="flex gap-3">
            <Image
              src="/images/online_bot.svg"
              alt="bot"
              width={50}
              height={50}
              quality={100}
            />
            <div className="flex flex-col my-1 justify-between">
              <p className="text-[#1E255E] font-medium text-sm">Chatbot</p>
              <p className="text-[#1E255EB2] font-light text-sm">Online</p>
            </div>
          </div>

          <div
            style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
            className="text-white text-base font-medium p-4 md:p-6  rounded-xl bg-[#57C0DD]"
          >
            👋 Welcome to Chatbot! I’m ChatBot, your AI assistant 🤖. What can I
            do for you?
          </div>

          <div className="w-full sm:w-auto px-8 py-2 sm:px-11 border rounded-xl mx-auto border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent">
            FAQ
          </div>
          <div className="w-full sm:w-auto px-8 py-2 sm:px-11 border rounded-xl mx-auto border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent">
            About Chatbot
          </div>
        </div>
      </div>

      <div className="mt-6  sm:ms-auto flex items-center gap-4">
        <AlertDialog
          trigger={
            <Button className="w-full sm:w-auto px-8 py-2 sm:px-11 border border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent">
              Go Back
            </Button>
          }
        />
        <Button className="w-full sm:w-auto px-8 py-2 sm:px-11 border blue-gradient hover:bg-transparent">
          Continue
        </Button>
      </div>

      <div className="absolute lg:hidden bottom-20 right-3">
        <Sheet>
          <SheetTrigger>
            <Image
              src="/images/bot-icon.svg"
              alt="bot"
              width={40}
              height={40}
              quality={100}
            />
          </SheetTrigger>
          <SheetContent side="bottom" className="rounded-t-[30px]">
            <SheetHeader>
              <SheetTitle className="w-full justify-between flex items-center">
                <div className="flex gap-3">
                  <Image
                    src="/images/online_bot.svg"
                    alt="bot"
                    width={40}
                    height={40}
                    quality={100}
                  />
                  <div className="flex flex-col my-1 justify-between">
                    <p className="text-[#1E255E] font-medium text-sm">
                      Chatbot
                    </p>
                    <p className="text-[#1E255EB2] font-light text-sm">
                      Online
                    </p>
                  </div>
                </div>
                <SheetClose>
                  <Cross2Icon className="h-4 w-4" />
                </SheetClose>
              </SheetTitle>
              <SheetDescription className="flex pt-2  flex-col gap-4 pb-[20vh]">
                <div
                  style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
                  className="text-white text-base font-medium p-4   rounded-xl bg-[#57C0DD]"
                >
                  👋 Welcome to Chatbot! I’m ChatBot, your AI assistant 🤖. What
                  can I do for you?
                </div>

                {/* FAQ and About buttons */}
                <div className="w-auto px-8 py-2  border rounded-xl mx-auto border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent">
                  FAQ
                </div>
                <div className="w-auto px-8 py-2  border rounded-xl mx-auto border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent">
                  About Chatbot
                </div>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default TuneChatbot;
