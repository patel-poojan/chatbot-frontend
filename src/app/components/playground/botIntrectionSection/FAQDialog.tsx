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

const FAQDialog = ({ trigger }: { trigger: React.ReactNode }) => {
  const [messageList, setMessageList] = useState<
    { question: string; answer: string }[]
  >([{ question: "", answer: "" }]);

  const handleMessageChange = (
    index: number,
    field: "question" | "answer",
    value: string
  ) => {
    const newMessageList = [...messageList];
    newMessageList[index][field] = value;
    setMessageList(newMessageList);

    const lastItem = newMessageList[newMessageList.length - 1];
    if (
      lastItem.question.trim() !== "" &&
      lastItem.answer.trim() !== "" &&
      index === newMessageList.length - 1
    ) {
      setMessageList([...newMessageList, { question: "", answer: "" }]);
    }

    const isCurrentItemEmpty =
      newMessageList[index].question.trim() === "" &&
      newMessageList[index].answer.trim() === "";
    if (isCurrentItemEmpty && newMessageList.length > 1) {
      setMessageList(
        newMessageList.filter(
          (_, i) => i === newMessageList.length - 1 || i !== index
        )
      );
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:-right-[10rem] shadow-none !bg-transparent fixed translate-y-0 !top-[4.9vh] sm:left-[unset] gap-0 rounded-lg transform w-[90vw] max-w-[25.5rem] border-none p-0">
        <DialogHeader>
          <DialogTitle className="sr-only text-lg font-semibold text-gray-800">
            Faq Node
          </DialogTitle>
          <DialogDescription
            id="dialog-description"
            className="text-sm sr-only text-gray-600"
          >
            Information related to the Faq node.
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 rounded-t-lg bg-white">
          <div className="flex items-center justify-between mb-4 mt-2">
            <div className="flex items-center gap-2">
              <Image
                src="/images/faq.svg"
                alt="faq logo"
                width={20}
                height={20}
                quality={100}
              />
              <span className="text-[#7A7A7A] text-lg">FAQ</span>
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
            id="message"
            className="px-4 py-3 mt-1 mb-2 rounded text-black hover:border-[#57C0DD] focus-visible:ring-0 focus-visible:border-[#57C0DD] placeholder:text-sm placeholder:font-light w-full"
            placeholder="Enter your message"
          />
        </div>
        <div className="bg-[#F1F1F1] p-4 rounded-b-lg max-h-[74.5dvh] sm:max-h-[70dvh] overflow-y-auto">
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
                <div className="flex flex-col items-center gap-2 w-full">
                  <Textarea
                    placeholder="type question..."
                    value={item.question}
                    onChange={(e) =>
                      handleMessageChange(index, "question", e.target.value)
                    }
                    rows={2}
                    maxLength={256}
                    className="resize-none border-transparent bg-white p-3 rounded-md shadow-sm focus:outline-none focus-visible:ring-0 hover:border-[#57C0DD] focus-visible:border-[#57C0DD] overflow-y-auto"
                  />
                  <Textarea
                    placeholder="type answer..."
                    value={item.answer}
                    onChange={(e) =>
                      handleMessageChange(index, "answer", e.target.value)
                    }
                    rows={2}
                    maxLength={256}
                    className="resize-none border-transparent bg-white p-3 rounded-md shadow-sm focus:outline-none focus-visible:ring-0 hover:border-[#57C0DD] focus-visible:border-[#57C0DD] overflow-y-auto"
                  />
                </div>
                <div
                  className={`${
                    index === 0
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  } bg-white rounded-lg w-fit p-2`}
                  onClick={() =>
                    index !== 0 &&
                    setMessageList(messageList.filter((_, i) => i !== index))
                  }
                >
                  <RiDeleteBinLine className="text-red-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FAQDialog;
