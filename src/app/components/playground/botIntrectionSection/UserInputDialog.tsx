import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IoMdCheckmark, IoMdClose } from "react-icons/io";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { GoQuestion } from "react-icons/go";
import { Textarea } from "@/components/ui/textarea";
import { RiDeleteBinLine } from "react-icons/ri";

const UserInputDialog = ({ trigger }: { trigger: React.ReactNode }) => {
  const [messageList, setMessageList] = useState<{ message: string }[]>([
    { message: "" },
  ]);

  const handleMessageChange = (index: number, value: string) => {
    const newMessageList = [...messageList];
    newMessageList[index].message = value;
    setMessageList(newMessageList);

    if (value.trim() !== "" && index === messageList.length - 1) {
      setMessageList([...newMessageList, { message: "" }]);
    }

    if (value.trim() === "" && messageList.length > 1) {
      const filteredList = newMessageList.filter(
        (item, i) =>
          i === newMessageList.length - 1 || item.message.trim() !== ""
      );
      setMessageList(filteredList);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:-right-[10rem] shadow-none !bg-transparent fixed translate-y-0 !top-[4.9dvh] sm:left-[unset] gap-0 rounded-lg transform w-[90vw] max-w-[25.5rem] border-none p-0">
        <DialogHeader>
          <DialogTitle className="sr-only text-lg font-semibold text-gray-800">
            User Input Node
          </DialogTitle>
          <DialogDescription
            id="dialog-description"
            className="text-sm sr-only text-gray-600"
          >
            Information related to the user input node.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 rounded-t-lg bg-white">
          <div className="flex items-center justify-between mb-4 mt-2">
            <div className="flex items-center gap-2">
              <Image
                src="/images/user_input.svg"
                alt="User Input Icon"
                width={20}
                height={20}
                quality={100}
              />
              <span className="text-[#7A7A7A] text-lg">USER INPUT</span>
            </div>
            <div className="flex items-center gap-2">
              <DialogClose>
                <div className="p-1 bg-[#7A7A7A] rounded-sm">
                  <IoMdClose className="text-white" />
                </div>
              </DialogClose>
              <div className="p-1 bg-[#7A7A7A] rounded-sm">
                <IoMdCheckmark className="text-white" />
              </div>
            </div>
          </div>
          <Input
            id="Message"
            className="p-3 mt-1 mb-2 border border-gray-200 bg-white hover:ring-1 hover:ring-[#57C0DD] rounded-md focus:outline-none focus-visible:border-[#57C0DD] focus-visible:ring-1 focus-visible:ring-[#57C0DD] shadow-sm transition duration-200"
            placeholder="Enter Your Message"
          />
        </div>
        <div className="bg-[#F1F1F1] p-4 rounded-b-lg max-h-[74.63dvh] sm:max-h-[70dvh] overflow-y-auto">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button>
                    <GoQuestion className="text-lg cursor-pointer" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  align="center"
                  className="p-2 w-72 text-xs text-gray-700 bg-white rounded shadow-md"
                  style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
                >
                  Keywords is a matching system in ChatBot. It works great when
                  you want a unique phrase or a word to trigger a bot response.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <span>User Says</span>
          </div>
          <div className="flex flex-col gap-2 mt-2">
            {messageList.map((item, index) => (
              <div className="flex items-center gap-2" key={index}>
                <Textarea
                  placeholder="Enter user message..."
                  value={item.message}
                  onChange={(e) => handleMessageChange(index, e.target.value)}
                  rows={2}
                  maxLength={256}
                  className="resize-none border border-gray-200 bg-white p-3 rounded-md focus:outline-none focus-visible:border-[#57C0DD] hover:ring-1 hover:ring-[#57C0DD] focus-visible:ring-1 focus-visible:ring-[#57C0DD] shadow-sm transition duration-200"
                />
                <div
                  className={`${
                    index === messageList.length - 1
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer hover:bg-red-100"
                  } flex items-center justify-center bg-white rounded-full w-10 h-10 p-2 transition-all duration-200`}
                  onClick={() =>
                    index !== messageList.length - 1 &&
                    setMessageList(messageList.filter((_, i) => i !== index))
                  }
                  title={
                    index !== messageList.length - 1
                      ? "Delete"
                      : "Cannot delete"
                  }
                >
                  <RiDeleteBinLine className="text-red-500 text-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserInputDialog;
