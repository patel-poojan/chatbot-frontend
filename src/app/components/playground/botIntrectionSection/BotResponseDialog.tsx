import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdAutorenew, MdOutlineFormatSize } from "react-icons/md";
import { IoIosSend, IoMdCheckmark, IoMdClose } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { PiClockCounterClockwise } from "react-icons/pi";
import { RiDeleteBinLine } from "react-icons/ri";
import {
  ButtonNodeResponse,
  GalleryNodeResponse,
  ImageNodeResponse,
  QuickNodeResponse,
  TextNodeResponse,
} from "./NodeResponseList";
import { CiImageOn } from "react-icons/ci";
import Image from "next/image";
import { IoChevronDownOutline, IoChevronUpOutline } from "react-icons/io5";
const BotResponseDialog = ({ trigger }: { trigger: React.ReactNode }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [responseList, setResponseList] = useState<
    { type: "text" | "image" | "button" | "quick" | "gallery" }[]
  >([{ type: "text" }]);

  const renderNodeResponse = (type: string) => {
    switch (type) {
      case "text":
        return <TextNodeResponse />;
      case "image":
        return <ImageNodeResponse />;
      case "gallery":
        return <GalleryNodeResponse />;
      case "quick":
        return <QuickNodeResponse />;
      case "button":
        return <ButtonNodeResponse />;
      default:
        return null;
    }
  };
  const removeResponse = (index: number) => {
    setResponseList((prev) => prev.filter((_, i) => i !== index));
  };
  const scroll = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };
  useEffect(() => {
    scroll();
  }, [responseList]);
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:-right-[17rem] shadow-none !bg-transparent fixed translate-y-0 !top-[4.9vh] sm:left-[unset] gap-0 rounded-lg transform w-[90vw] max-w-[40rem] border-none p-0">
        <DialogHeader>
          <DialogTitle className="sr-only text-lg font-semibold text-gray-800">
            Bot Response Node
          </DialogTitle>
          <DialogDescription
            id="dialog-description"
            className="text-sm sr-only text-gray-600"
          >
            Information related to the bot response node.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col-reverse md:flex-row gap-6">
          <div className="hidden md:block">
            <NodeResponseList setResponseList={setResponseList} />
          </div>

          <div className="flex-1">
            <div className="p-4 rounded-t-lg bg-white">
              <div className="flex items-center justify-between mb-4 mt-2">
                <div className="flex items-center gap-2">
                  <IoIosSend className="text-[#7A7A7A] text-lg" />
                  <span className="text-[#7A7A7A] text-lg">BOT RESPONSE</span>
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
                className="px-4 py-3 mt-1 mb-2 rounded text-black  hover:border-[#57C0DD] focus-visible:ring-0 focus-visible:border-[#57C0DD] placeholder:text-sm placeholder:font-light w-full"
                placeholder="Enter Your Message"
              />
            </div>
            {responseList.length > 0 && (
              <div
                ref={scrollRef}
                className="rounded-b-lg max-h-[74.5dvh] sm:max-h-[70dvh] overflow-y-auto"
              >
                <div className="flex flex-col gap-4 bg-[#F1F1F1] p-4">
                  {responseList.map((item, index) => (
                    <div className="flex flex-col gap-4" key={index}>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2 items-center">
                          <div className="flex items-center rounded-3xl gap-1 w-fit py-2 px-3 bg-[#424D50]">
                            <PiClockCounterClockwise className="text-white text-lg" />
                            <span className="text-white text-sm">
                              1 sec delay
                            </span>
                          </div>
                          <div>
                            <IoChevronUpOutline className="cursor-pointer hover:text-[#57C0DD]" />
                            <IoChevronDownOutline className="cursor-pointer hover:text-[#57C0DD]" />
                          </div>
                        </div>
                        <div
                          className={`${
                            index === 0 && "hidden"
                          } bg-white rounded-lg cursor-pointer w-fit p-2`}
                          onClick={() => {
                            index !== 0 && removeResponse(index);
                          }}
                        >
                          <RiDeleteBinLine className="text-red-500" />
                        </div>
                      </div>
                      {renderNodeResponse(item.type)}
                    </div>
                  ))}
                </div>
                <div className="bg-white block md:hidden">
                  <NodeResponseList setResponseList={setResponseList} />
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BotResponseDialog;

export const NodeResponseList = ({
  setResponseList,
}: {
  setResponseList: React.Dispatch<
    React.SetStateAction<
      { type: "text" | "image" | "button" | "quick" | "gallery" }[]
    >
  >;
}) => {
  const responseTypes: {
    type: "text" | "image" | "button" | "quick" | "gallery";
    icon: JSX.Element;
    label: string;
  }[] = [
    {
      type: "text",
      icon: <MdOutlineFormatSize className="text-[#7A7A7A] text-xl" />,
      label: "Text",
    },
    {
      type: "image",
      icon: <CiImageOn className="text-[#7A7A7A] text-xl" />,
      label: "Image",
    },
    {
      type: "gallery",
      icon: (
        <Image
          src="/images/gallery_thumbnail.svg"
          alt="Gallery Icon"
          width={22}
          height={22}
          quality={100}
        />
      ),
      label: "Gallery",
    },
    {
      type: "button",
      icon: (
        <Image
          src="/images/buttons.svg"
          alt="Button Icon"
          width={18}
          height={18}
          quality={100}
        />
      ),
      label: "Button",
    },
    {
      type: "quick",
      icon: <MdAutorenew className="text-[#7A7A7A] text-xl" />,
      label: "Quick reply",
    },
  ];

  return (
    <div className="p-4 h-fit bg-white rounded-lg">
      <div className="text-black text-lg font-semibold mb-2">Response</div>
      <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-3">
        {responseTypes.map(({ type, icon, label }) => (
          <div
            key={type}
            className="flex flex-col items-center gap-[1px] cursor-pointer"
            onClick={() =>
              setResponseList((prev) => [...prev, { type } as const])
            }
          >
            <div className="border border-[#7A7A7A] py-3 px-7 h-[46px] flex items-center justify-center">
              {icon}
            </div>
            <span className="text-[#7A7A7A] font-normal text-center text-xs">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
