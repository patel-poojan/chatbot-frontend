"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
const ChooseIndustryTemplate = ({ up }: { up: () => void }) => {
  const [openIndustryPopup, setOpenIndustryPopup] = useState(false);
  const [industryValue, setIndustryValue] = useState("");
  const [openSubIndustryPopup, setOpenSubIndustryPopup] = useState(false);
  const [subIndustryValue, setSubIndustryValue] = useState("");
  const router = useRouter();
  const frameworks = [
    {
      value: "next.js",
      label: "Next.js",
    },
    {
      value: "sveltekit",
      label: "SvelteKit",
    },
    {
      value: "nuxt.js",
      label: "Nuxt.js",
    },
  ];
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center gap-3">
        <div className="flex justify-between flex-col">
          <div className="text-lg md:text-2xl font-semibold text-black">
            Select your industry
          </div>
          <div className="text-base hidden sm:block md:text-xl mt-1 font-normal text-black">
            Knowing your industry will help us
          </div>
        </div>
        <Button
          onClick={up}
          style={{
            background: "linear-gradient(90deg, #58C8DD 0%, #53A7DD 100%)",
          }}
          className=" text-white flex gap-2 items-center py-0 md:py-4 px-4 md:px-9 text-sm md:text-lg rounded md:my-3"
        >
          Continue
          <FaArrowRightLong className="text-base md:text-lg text-white" />
        </Button>
      </div>
      <Popover open={openIndustryPopup} onOpenChange={setOpenIndustryPopup}>
        <PopoverTrigger asChild className="mt-4 md:mt-2">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openIndustryPopup}
            className="w-full justify-between !bg-transparent"
          >
            {industryValue ? (
              frameworks.find((framework) => framework.value === industryValue)
                ?.label
            ) : (
              <span className="text-[#6F7288B2] text-sm opacity-90">
                Select your industry
              </span>
            )}
            {openIndustryPopup ? (
              <IoIosArrowUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            ) : (
              <IoIosArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className=" me-7 w-[180px] md:w-[250px] p-0 "
        >
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList className="max-h-[120px] md:max-h-[150px] overflow-scroll">
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setIndustryValue(
                        currentValue === industryValue ? "" : currentValue
                      );
                      setOpenIndustryPopup(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        industryValue === framework.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div className="text-lg md:text-2xl font-semibold text-black mt-4 md:mt-6 ">
        Select sub industry
      </div>
      <Popover
        open={openSubIndustryPopup}
        onOpenChange={setOpenSubIndustryPopup}
      >
        <PopoverTrigger asChild className=" mt-3 md:mt-2">
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openSubIndustryPopup}
            className="w-full justify-between !bg-transparent"
          >
            {subIndustryValue ? (
              frameworks.find(
                (framework) => framework.value === subIndustryValue
              )?.label
            ) : (
              <span className="text-[#6F7288B2] text-sm opacity-90">
                Select your sub industry
              </span>
            )}
            {openSubIndustryPopup ? (
              <IoIosArrowUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            ) : (
              <IoIosArrowDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className=" me-7 w-[180px] md:w-[250px] p-0 "
        >
          <Command>
            <CommandInput placeholder="Search framework..." />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {frameworks.map((framework) => (
                  <CommandItem
                    key={framework.value}
                    value={framework.value}
                    onSelect={(currentValue) => {
                      setSubIndustryValue(
                        currentValue === subIndustryValue ? "" : currentValue
                      );
                      setOpenSubIndustryPopup(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        subIndustryValue === framework.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {framework.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <div
        className="flex items-center gap-2 cursor-pointer mt-4 md:mt-6"
        onClick={() => router.back()}
      >
        <FaArrowLeftLong className="text-[#57C0DD] text-lg" />
        <span className="text-[#57C0DD] text-base md:text-lg">Back</span>
      </div>
    </div>
  );
};

export default ChooseIndustryTemplate;
