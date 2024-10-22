import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useWindowDimensions from "@/utils/windowSize";
import Image from "next/image";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp, IoMdCheckmark } from "react-icons/io";
import {
  IoChevronBackOutline,
  IoCloseOutline,
  IoSearchSharp,
} from "react-icons/io5";
import { MdPublic } from "react-icons/md";

const AIKnowledge = ({
  setAiSection,
}: {
  setAiSection: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { width: screenWidth } = useWindowDimensions();
  const [tab, setTab] = useState("websites");
  const [dropDown, setDropDown] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState<string>("");
  const [scanType, setScanType] = useState<string>("SINGLEPAGE");
  const [initialIndex, setInitialIndex] = useState(0);
  const dummy = [
    {
      url: "https://www.chatbot.com",
      lastEdited: "Today 12:00 pm",
      state: "Used by AI",
    },
    {
      url: "https://www.chatbot.com",
      lastEdited: "Today 12:00 pm",
      state: "Not Used by AI",
    },
  ];
  const [files, setFiles] = useState<File[]>([]);
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files!);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]); // Append new files to the existing ones
  };
  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };
  return (
    <div
      className="flex flex-col gap-4 sm:gap-6 rounded-xl "
      style={{
        height:
          screenWidth > 500 ? "calc(100dvh - 72px)" : "calc(100dvh - 96px)",
      }}
    >
      <div className="flex  justify-between items-center">
        <div className="text-xs text-black hidden sm:block">
          www.chatbot.com
        </div>
        <div
          className="flex items-center py-0 px-3 rounded-xl bg-white "
          style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
        >
          <IoSearchSharp className="text-lg text-[#1E255E]" />
          <Input
            className="md:w-96 w-40 sm:w-60  border-none shadow-none text-[#1E255E] placeholder:text-[#1E255E] bg-transparent focus-visible:ring-0 placeholder:font-light text-base"
            type="text"
            placeholder="Search"
          />
        </div>
        <div
          className="p-2 bg-white rounded-xl cursor-pointer mt-2 sm:mt-0"
          onClick={() => setAiSection(false)}
          style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
        >
          <IoCloseOutline className="text-lg" />
        </div>
      </div>

      <div
        className="flex-1 border bg-white flex flex-col md:flex-row overflow-hidden"
        style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
      >
        <div
          className="w-full md:w-[30%] lg:w-[25%] xl:w-[18%] py-2 px-6 md:p-6 overflow-hidden"
          style={{ boxShadow: "1px 0px 8px 2px #00000014" }}
        >
          <div className="text-[#1E255E] text-xl font-medium text-center mb-2 md:mb-4">
            AI Knowledge
          </div>
          <div className="flex justify-center md:justify-normal gap-5 md:gap-0 md:flex-col ">
            {["websites", "documents"].map((item) => (
              <div className="flex justify-between items-center" key={item}>
                <div
                  className={`text-base sm:text-lg font-normal cursor-pointer ${
                    tab === item ? "text-[#57C0DD]" : "text-black"
                  }`}
                  onClick={() => setTab(item)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </div>
                <div className="text-[#7A7A7A] text-base font-medium hidden md:block">
                  0
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full  md:w-[70%] lg:w-[75%] xl:w-[82%] overflow-hidden px-4 sm:px-6 pt-4 sm:pt-6 mb-4 sm:mb-6 flex flex-1 gap-4 flex-col">
          {initialIndex === 0 ? (
            <>
              <div className="flex items-center justify-between">
                <div className="text-[#1E255E] capitalize text-lg sm:text-xl font-medium text-center ">
                  {tab}
                </div>
                <div className="flex items-center gap-3">
                  <Popover>
                    <PopoverTrigger>
                      <div className="bg-white border rounded-lg border-[#EFEFEF] py-1 sm:py-2 px-2 sm:px-3 flex items-center gap-1">
                        <MdPublic className="text-[#7A7A7A] text-sm" />
                        <div className="text-xs text-[#7A7A7A]">Status</div>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MdPublic className="text-[#57C0DD]  text-base" />
                          <div className="text-lg text-[#1E255E]">Status</div>
                        </div>
                        {/* <IoCloseOutline className="text-lg" /> */}
                      </div>
                      <RadioGroup className="gap-1 mt-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="Used by AI"
                            id="r1"
                            // className="focus:text-[#57C0DD] flex items-center gap-2  focus:border focus:border-[#57C0DD] "
                          />
                          <label
                            htmlFor="r1"
                            className="text-[#1E255E] text-sm"
                          >
                            Used by AI
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="Not used by AI"
                            id="r2"
                            itemType="radio"
                            // className="focus:text-[#57C0DD] flex items-center gap-2  focus:border focus:border-[#57C0DD] "
                          />
                          <label
                            htmlFor="r2"
                            className="text-[#1E255E] text-sm"
                          >
                            Not used by AI
                          </label>
                        </div>
                      </RadioGroup>
                    </PopoverContent>
                  </Popover>
                  <div
                    className="bg-[#232323] rounded-lg flex items-center cursor-pointer gap-1 px-2 py-1 sm:py-2"
                    style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
                    onClick={() => setInitialIndex(1)}
                  >
                    <FaPlus className="text-[#EFEFEF] text-base" />
                    <div className="text-xs text-[#EFEFEF]">Add Content</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col flex-1 h-full">
                <Table className="min-w-full md:table-fixed ">
                  <TableHeader className="bg-[#57C0DD1A] backdrop-blur-3xl sticky top-0 z-10">
                    <TableRow>
                      <TableHead className="py-2 text-start">
                        <div className="flex items-center flex-wrap justify-start gap-1">
                          <span className="break-all text-[#1E255E] font-medium ">
                            Website URL
                          </span>
                        </div>
                      </TableHead>
                      <TableHead className="py-2 text-center">
                        <div className="flex items-center flex-wrap justify-center gap-1">
                          <span className="break-all text-[#1E255E] font-medium ">
                            Last Edited
                          </span>
                        </div>
                      </TableHead>
                      <TableHead className="py-2 text-center">
                        <div className="flex items-center flex-wrap justify-center">
                          <span className="break-all text-[#1E255E] font-medium ">
                            State
                          </span>
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="overflow-y-auto ">
                    {Array.isArray(dummy) && dummy.length > 0 ? (
                      dummy.map((detail, index) => (
                        <TableRow key={index}>
                          <TableCell className="text-left">
                            <div className="flex break-all text-[#1E255E] font-normal  items-center justify-start">
                              {detail.url ?? ""}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex break-all text-[#1E255E] font-normal  items-center justify-center">
                              {detail.lastEdited ?? ""}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div
                              className={`flex font-normal  ${
                                detail.state === "Used by AI"
                                  ? "text-[#008000]"
                                  : "text-[#FF0000]"
                              } break-all items-center justify-center`}
                            >
                              {detail.state ?? ""}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell className="text-center" colSpan={3}>
                          No data
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center gap-3">
                <IoChevronBackOutline
                  className="text-[#1E255E] cursor-pointer"
                  onClick={() => setInitialIndex(0)}
                />
                <span className="text-[#1E255E] capitalize text-lg sm:text-xl font-medium text-center ">
                  {tab}
                </span>
              </div>
              <div className="my-1 sm:my-2 ms-2 text-black font-normal ">
                {`  Crawl your ${
                  tab === "websites" ? "website’s" : "document’s"
                } content to get answers to popular user
                questions.`}
              </div>
              <div className="flex-1 flex flex-col mx-2 relative overflow-hidden">
                {tab === "websites" ? (
                  <div className="flex-1">
                    <div
                      className="h-12 w-full  border rounded-xl
         mt-4 mb-3 flex items-center bg-[#F2F2F2]"
                    >
                      <Input
                        value={websiteUrl}
                        onChange={(e) => setWebsiteUrl(e.target.value)}
                        className="flex-1 border-none shadow-none pe-[2px] sm:pe-1 bg-transparent focus-visible:ring-0 text-sm sm:text-base placeholder:text-sm sm:placeholder:text-base placeholder:font-light "
                        placeholder="Enter a URL address"
                      ></Input>
                      <div className="mx-2 sm:mx-3 md:mx-5">
                        <DropdownMenu
                          onOpenChange={() => setDropDown(!dropDown)}
                        >
                          <DropdownMenuTrigger className="focus-visible:!outline-none w-full md:w-auto text-sm sm:text-base md:text-lg font-normal text-black flex items-center justify-between gap-1 sm:gap-2">
                            {scanType === "FULLPAGE"
                              ? "Scan a full page"
                              : "Scan a single page"}
                            {dropDown ? <IoIosArrowUp /> : <IoIosArrowDown />}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="p-2 md:p-3 rounded-xl mt-3  me-12 sm:me-20 md:me-28 w-auto">
                            <DropdownMenuItem
                              className="p-2  hover:bg-[#EEEEEE] flex flex-col justify-start items-start cursor-pointer"
                              onClick={() => setScanType("FULLPAGE")}
                            >
                              <div className="text-sm sm:text-base md:text-lg font-medium flex items-center justify-between w-full">
                                Scan a full page
                                {scanType === "FULLPAGE" && <IoMdCheckmark />}
                              </div>
                              <div className="text-xs sm:text-sm md:text-base font-light">
                                Entire content from the provided page
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="p-2  hover:bg-[#EEEEEE] flex flex-col justify-start items-start cursor-pointer"
                              onClick={() => setScanType("SINGLEPAGE")}
                            >
                              <div className="text-sm sm:text-base md:text-lg font-medium flex items-center justify-between w-full">
                                Scan a single page
                                {scanType === "SINGLEPAGE" && <IoMdCheckmark />}
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
                      By sharing your URL, you confirm you have the necessary
                      rights to share its content.
                    </p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto ">
                    <div className="grid overflow-y-auto gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ">
                      {files.map((file, index) => (
                        <div key={index}>
                          <div className="border-[#CCCCCC] border border-dashed  flex flex-col items-center justify-center gap-2 w-full h-36">
                            <Image
                              src="/images/file_pic.svg"
                              alt="upload"
                              width={84}
                              height={84}
                              quality={100}
                            />
                          </div>
                          <label className="flex items-center justify-between border border-[#57C0DD]  w-full  p-2">
                            <div className="flex justify-between items-center w-full gap-2">
                              <span className="text-sm truncate sm:text-base w-full text-center text-[#57C0DD]">
                                {file.name}
                              </span>
                              <IoCloseOutline
                                className="text-lg text-[#57C0DD] cursor-pointer"
                                onClick={() => handleRemoveFile(index)}
                              />
                            </div>
                          </label>
                        </div>
                      ))}
                      <div>
                        <div className="border-[#CCCCCC] border border-dashed  flex flex-col items-center justify-center gap-2 w-full h-36">
                          <Image
                            src="/images/arrow_upload.svg"
                            alt="upload"
                            width={43}
                            height={43}
                            quality={100}
                          />
                          <div className="text-[#7E7E7E] font-normal text-sm">
                            upload file
                          </div>
                        </div>
                        <label className="flex items-center justify-between border border-[#57C0DD]  w-full  p-2 cursor-pointer">
                          <input
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <span className="text-sm sm:text-base w-full text-center text-[#57C0DD]">
                            Choose file
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}
                <Button
                  type="button"
                  className="mt-2 h-fit relative ms-auto w-max bottom-0 right-0 text-white bg-gradient-to-r hover:from-[#53A7DD] hover:to-[#58C8DD]  from-[#58C8DD] to-[#53A7DD] py-3 rounded-xl"
                >
                  Train Chatbot
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIKnowledge;
