import React, { useEffect, useState } from "react";
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
import useWindowDimensions from "@/utils/windowSize";
import { Textarea } from "@/components/ui/textarea";

import { Input } from "@/components/ui/input";
import { BiSolidEditAlt } from "react-icons/bi";
import { useAddAttributes, useUpdateChatbot } from "@/utils/botCreation-api";
import { toast } from "sonner";
import { axiosError } from "../../types/axiosTypes";
import { Loader } from "./Loader";
import { useRouter } from "next/navigation";

const TuneChatbot = ({ botId }: { botId: string }) => {
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const [FAQ, setFAQ] = useState(true);
  const [attributes, setAttributes] = useState([
    { title: "Company Name", value: "Chatbot" },
    { title: "Company Address", value: "" },
    { title: "About Us", value: "" },
  ]);
  const [AboutUs, setAboutUs] = useState(true);
  const [welcomeMessage, setwelcomeMessage] = useState(
    `👋 Welcome to Chatbot! I’m ChatBot, your AI assistant 🤖. What can I do for you?`
  );
  const {
    mutate: onUpdateBot,
    isPending,
    isSuccess: isUpdateSuccess,
  } = useUpdateChatbot({
    onSuccess(data) {
      toast.success(data?.message);
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        "chatbot training failed";
      toast.error(errorMessage);
    },
  });
  const {
    mutate: onAddAttributes,
    isPending: isPendingAddProcess,
    isSuccess: isAddSuccess,
  } = useAddAttributes({
    onSuccess(data) {
      toast.success(data?.message);
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        "chatbot training failed";
      toast.error(errorMessage);
    },
  });
  useEffect(() => {
    if (isUpdateSuccess && isAddSuccess) {
      router.push("/dashboard");
    }
  }, [isAddSuccess, isUpdateSuccess, router]);
  const toSnakeCase = (text: string) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\w_]/g, "");
  };
  const continueHandler = () => {
    if (!attributes[0].value) {
      toast.warning("Please enter company name");
    } else if (!attributes[1].value) {
      toast.warning("Please enter company address");
    } else if (!attributes[2].value) {
      toast.warning("Please enter about us");
    } else if (!welcomeMessage) {
      toast.warning("Please enter welcome message");
    } else if (!botId) {
      toast.warning("something went wrong");
    } else {
      onUpdateBot({
        chatbotId: botId,
        details: {
          name: attributes[0].value ?? "chatbot",
          aboutAs: attributes[2].value,
          welcomeMessage: welcomeMessage,
          configuredButtons: [
            {
              type: "faq",
              isEnabled: FAQ,
            },
            {
              type: "aboutUs",
              isEnabled: AboutUs,
            },
          ],
        },
      });
      onAddAttributes({
        chatbotId: botId,
        details: {
          attributes: attributes.map((item) => ({
            name: item.title,
            alias: toSnakeCase(item.title),
            value: item.value,
          })),
        },
      });
    }
  };

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
            : "calc(100dvh - 170px)"
        } `,
      }}
    >
      {(isPending || isPendingAddProcess) && <Loader />}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 w-full overflow-hidden">
        <div className="w-full lg:w-3/5 flex-1 flex flex-col overflow-hidden ">
          <div className="mb-4 sm:mb-6">
            <p className="text-black font-semibold text-2xl">
              Tune your chatbot
            </p>
            <p className="text-[#1E255EB2] font-normal mt-2 text-base">
              Add final tweaks to achieve better results.
            </p>
          </div>

          <div className="mb-4 sm:mb-6">
            <p className="text-black font-normal text-lg">
              Customise your welcome message
            </p>
            <Textarea
              value={welcomeMessage}
              onChange={(e) => setwelcomeMessage(e.target.value)}
              className="my-3 bg-[#FAFAFA] text-black font-light !focus-visible:ring-0 text-base w-full p-3 !border-none sm:p-4 md:p-6"
              style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
            ></Textarea>
            <div className="flex items-center gap-2">
              <Button
                className={`${
                  FAQ ? "opacity-100" : "opacity-50"
                } border bg-transparent hover:bg-transparent border-[#57C0DD] py-3 px-6 md:px-11 rounded-xl text-[#57C0DD]`}
                onClick={() => setFAQ(!FAQ)}
              >
                FAQ
              </Button>
              <Button
                className={`${
                  AboutUs ? "opacity-100" : "opacity-50"
                } border bg-transparent hover:bg-transparent border-[#57C0DD] py-3 px-6 md:px-11 rounded-xl text-[#57C0DD]`}
                onClick={() => setAboutUs(!AboutUs)}
              >
                About Chatbot
              </Button>
            </div>
          </div>

          <p className="text-black font-normal text-lg mb-3">
            Set up attributes
          </p>
          <div className="flex flex-col !overflow-y-auto gap-3 flex-1">
            {attributes.map((item, index) => (
              <div
                key={index}
                className="p-3 rounded-xl flex justify-between gap-3 items-center bg-[#FAFAFA] shadow-sm"
                style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
              >
                <span className="text-[#1E255EB2]">{item.title}</span>
                <div className="flex items-center !w-fit gap-2">
                  <Input
                    value={item.value}
                    className="!border-none !rounded-none shadow-none !bg-transparent !p-0 focus-visible:ring-0 !w-fit text-right"
                    onChange={(e) =>
                      setAttributes((prev) =>
                        prev.map((attr, idx) =>
                          idx === index
                            ? { ...attr, value: e.target.value }
                            : attr
                        )
                      )
                    }
                  />
                  <BiSolidEditAlt className="text-xl" />
                </div>
              </div>
            ))}
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
              <p className="text-[#1E255E] font-medium text-sm">
                {attributes[0].value}
              </p>
              <p className="text-[#1E255EB2] font-light text-sm">Online</p>
            </div>
          </div>

          <div
            style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
            className="text-white text-base font-medium p-4 md:p-6  rounded-xl bg-[#57C0DD]"
          >
            {welcomeMessage}
          </div>
          {FAQ && (
            <div className="w-full sm:w-auto px-8 py-2 sm:px-11 border rounded-xl mx-auto border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent">
              FAQ
            </div>
          )}
          {AboutUs && (
            <div className="w-full sm:w-auto px-8 py-2 sm:px-11 border rounded-xl mx-auto border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent">
              About Chatbot
            </div>
          )}
        </div>
      </div>

      <div className="mt-6   sm:ms-auto flex items-center gap-4">
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
          onClick={continueHandler}
        >
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
                      {attributes[0].value}
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
                  {welcomeMessage}
                </div>

                {FAQ && (
                  <div className="w-auto px-8 py-2  border rounded-xl mx-auto border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent">
                    FAQ
                  </div>
                )}
                {AboutUs && (
                  <div className="w-auto px-8 py-2  border rounded-xl mx-auto border-[#57C0DD] bg-transparent text-[#57C0DD] hover:bg-transparent">
                    About Chatbot
                  </div>
                )}
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default TuneChatbot;
