import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useWindowDimensions from "@/utils/windowSize";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const ButtonInteractionDialog = ({
  trigger,
  buttonList,
  index,
  setButtonList,
}: {
  trigger: React.ReactNode;
  buttonList: { title: string; type: string }[];
  setButtonList: React.Dispatch<
    React.SetStateAction<{ title: string; type: string }[]>
  >;
  index: number;
}) => {
  const { width: screenWidth } = useWindowDimensions();
  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        side={screenWidth > 890 ? "left" : "bottom"}
        align={screenWidth > 890 ? "center" : "center"}
        sideOffset={screenWidth > 890 ? 12 : 12}
        className="relative  bg-white rounded-xl w-fit p-2 shadow-[0px_0px_12px_4px_rgba(0,0,0,0.08)]"
      >
        {screenWidth > 890 ? (
          <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-4 h-3 bg-white rotate-45 shadow-[0px_0px_12px_rgba(0,0,0,0.08)]"></div>
        ) : (
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rotate-45 shadow-[0px_0px_12px_rgba(0,0,0,0.08)]"></div>
        )}
        <div className="p-3 bg-white flex flex-col gap-2">
          <div className="w-full">
            <label htmlFor="title" className="text-black font-normal text-sm">
              Button title
            </label>
            <Input
              value={buttonList?.[index]?.title}
              onChange={(e) =>
                setButtonList &&
                setButtonList((prev) =>
                  prev.map((item, i) =>
                    i === index ? { ...item, title: e.target.value } : item
                  )
                )
              }
              id="title"
              className="p-2 mt-1  placeholder:text-xs border border-gray-200 bg-white hover:ring-1 hover:ring-[#57C0DD] rounded-md focus:outline-none focus-visible:border-[#57C0DD] focus-visible:ring-1 focus-visible:ring-[#57C0DD] shadow-sm transition duration-200"
              placeholder="Enter button title"
            />
          </div>
          <div className="w-full">
            <label htmlFor="type" className="text-black font-normal text-sm">
              Button type
            </label>
            <div className="w-full !mt-1">
              <Select
                defaultValue={buttonList?.[index]?.type}
                onValueChange={(e) =>
                  setButtonList &&
                  setButtonList((prev) =>
                    prev.map((item, i) =>
                      i === index ? { ...item, type: e } : item
                    )
                  )
                }
              >
                <SelectTrigger className="p-2  border bg-white placeholder:!text-[#6F7288B2] rounded-md hover:border-[#57C0DD] focus:outline-none focus:ring-1 focus:ring-[#57C0DD]">
                  <SelectValue
                    className="placeholder:text-xs !placeholder:!text-[#6F7288B2]"
                    placeholder="Select button type"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="message">Send message</SelectItem>
                  <SelectItem value="goto">Go to block</SelectItem>
                  <SelectItem value="url">Open url</SelectItem>
                  {/* <SelectItem value="phone">Phone call</SelectItem> */}
                </SelectContent>
              </Select>
            </div>
          </div>
          {buttonList?.[index]?.type === "message" ? (
            <div className="w-full">
              <label
                htmlFor="message"
                className="text-black font-normal text-sm"
              >
                Button message
              </label>
              <Input
                // value={buttonList?.[index ]?.title}
                // onChange={(e) =>
                //   setButtonList &&
                //   setButtonList((prev) =>
                //     prev.map((item, i) =>
                //       i === index ? { ...item, title: e.target.value } : item
                //     )
                //   )
                // }
                id="message"
                className="p-2 mt-1  placeholder:text-xs border border-gray-200 bg-white hover:ring-1 hover:ring-[#57C0DD] rounded-md focus:outline-none focus-visible:border-[#57C0DD] focus-visible:ring-1 focus-visible:ring-[#57C0DD] shadow-sm transition duration-200"
                placeholder="Enter message "
              />
            </div>
          ) : buttonList?.[index]?.type === "url" ? (
            <div className="w-full">
              <label htmlFor="url" className="text-black font-normal text-sm">
                Website address
              </label>
              <Input
                // value={buttonList?.[index ]?.title}
                // onChange={(e) =>
                //   setButtonList &&
                //   setButtonList((prev) =>
                //     prev.map((item, i) =>
                //       i === index ? { ...item, title: e.target.value } : item
                //     )
                //   )
                // }
                id="url"
                className="p-2 mt-1  placeholder:text-xs border border-gray-200 bg-white hover:ring-1 hover:ring-[#57C0DD] rounded-md focus:outline-none focus-visible:border-[#57C0DD] focus-visible:ring-1 focus-visible:ring-[#57C0DD] shadow-sm transition duration-200"
                placeholder="Enter URL"
              />
            </div>
          ) : buttonList?.[index]?.type === "goto" ? (
            <div className="w-full">
              <label htmlFor="goto" className="text-black font-normal text-sm">
                Go to
              </label>
              <div className="w-full !mt-1">
                <Select
                // onValueChange={(e) =>
                //   setButtonList &&
                //   setButtonList((prev) =>
                //     prev.map((item, i) =>
                //       i === index ? { ...item, type: e } : item
                //     )
                //   )
                // }
                >
                  <SelectTrigger className="p-2  border bg-white placeholder:!text-[#6F7288B2] rounded-md hover:border-[#57C0DD] focus:outline-none focus:ring-1 focus:ring-[#57C0DD]">
                    <SelectValue
                      className="placeholder:text-xs placeholder:!text-[#6F7288B2]"
                      placeholder="Select value"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="message">Send message</SelectItem>
                    <SelectItem value="goto">Go to block</SelectItem>
                    <SelectItem value="url">Open url</SelectItem>
                    {/* <SelectItem value="phone">Phone call</SelectItem> */}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <></>
          )}
          <Button className="text-xs bg-gradient-to-r mt-2 !h-fit !p-1 md:!p-[1px] hover:from-[#53A7DD] hover:to-[#58C8DD]  from-[#58C8DD] to-[#53A7DD]  max-[500px]:h-8 md:text-lg text-white flex gap-2 items-center  rounded ">
            save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ButtonInteractionDialog;
