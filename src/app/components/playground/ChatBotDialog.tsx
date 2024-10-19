import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { IoSend } from "react-icons/io5";
import ChatLoader from "./ChatLoader";

const BotResponse = ({
  data,
  buttonSearch,
}: {
  data: { message: string; buttons?: string[] };
  buttonSearch: (value: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center gap-1">
        <Image
          src="/images/bot-icon.svg"
          alt="User Input Icon"
          width={18}
          height={18}
          quality={100}
        />
        <p className="text-[#1E255E] font-medium text-xs">Chatbot</p>
      </div>
      <div className="bg-[white] p-3 rounded-lg text-black font-light w-full text-sm">
        {data?.message ?? ""}
      </div>
      {data?.buttons?.length && (
        <div className="flex items-center w-full flex-wrap gap-2">
          {data?.buttons?.map((name, index) => (
            <div
              key={index}
              onClick={() => buttonSearch(name)}
              className=" border border-[#57C0DD] text-sm rounded-lg py-1 px-6 text-[#57C0DD] font-medium cursor-pointer bg-white"
            >
              {name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
const UserInput = ({
  data,
}: {
  data: { message: string; buttons?: string[] };
}) => {
  return (
    <div className="flex flex-col gap-[10px] w-fit ms-auto">
      <div className="text-[#1E255E] font-medium text-xs ms-auto me-1">You</div>
      <div className="bg-[#57C0DD] p-3 rounded-lg text-white font-light  text-sm w-fit">
        {data?.message ?? ""}
      </div>
    </div>
  );
};
const ChatBotDialog = ({ chatBotHandler }: { chatBotHandler: () => void }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputText, setInputText] = useState<string>("");
  const [ChatArray, setChatArray] = useState<
    | {
        type: "user" | "bot";
        data: { message: string; buttons?: string[] };
      }[]
    | []
  >([
    {
      type: "bot",
      data: {
        message:
          "Hey 👋, good to see you! I’m ChatBot, and I can answer your questions regarding ChatBot.",
        buttons: ["Faq", "About us"],
      },
    },
  ]);
  const scroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const buttonSearch = (text: string) => {
    if (text) {
      setChatArray([
        ...ChatArray,
        {
          type: "user",
          data: {
            message: text,
          },
        },
      ]);
    }
  };
  useEffect(() => {
    scroll();
  }, [ChatArray]);
  return (
    <div
      className="absolute  min-[425px]:right-6 top-20 flex flex-col  min-[425px]:w-[375px] h-[65vh] max-[425px]:mx-6 min-[500px]:h-[60vh] rounded-lg overflow-hidden"
      style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}
    >
      <div className="w-full p-6 bg-white justify-between flex items-center">
        <div className="flex gap-3">
          <Image
            src="/images/online_bot.svg"
            alt="bot"
            width={40}
            height={40}
            quality={100}
          />
          <div className="flex flex-col my-1 justify-between ">
            <p className="text-[#1E255E] font-medium text-sm">Chatbot</p>
            <p className="text-[#1E255EB2] font-light text-sm">Online</p>
          </div>
        </div>
        <Cross2Icon
          className="h-4 w-4 cursor-pointer"
          onClick={chatBotHandler}
        />
      </div>
      <div
        className="flex-1 bg-[#F1F1F1] p-4 overflow-y-auto show-scrollbar flex flex-col gap-3"
        ref={scrollRef}
      >
        {ChatArray &&
          ChatArray?.map((item, index) => (
            <div key={index}>
              {item.type === "bot" ? (
                <BotResponse data={item.data} buttonSearch={buttonSearch} />
              ) : (
                <UserInput data={item.data} />
              )}
            </div>
          ))}
        <ChatLoader />
      </div>
      <div className="p-4 bg-white flex gap-4 items-center">
        <Input
          onChange={(e) => setInputText(e.target.value)}
          value={inputText}
          onKeyDown={(e) => {
            if (e.key === "Enter" && inputText.length > 0) {
              setChatArray((prev) => [
                ...prev,
                {
                  type: "user",
                  data: {
                    message: inputText,
                  },
                },
              ]);
              setInputText("");
            }
          }}
          className="!border-none placeholder:text-[#7A7A7A] shadow-none p-0 focus-visible:ring-0"
          placeholder="Send message ..."
        />
        <IoSend
          className="text-[#7A7A7A] text-xl"
          onClick={() => {
            setChatArray((prev) => [
              ...prev,
              {
                type: "user",
                data: {
                  message: inputText,
                },
              },
            ]);
          }}
        />
      </div>
    </div>
  );
};

export default ChatBotDialog;
