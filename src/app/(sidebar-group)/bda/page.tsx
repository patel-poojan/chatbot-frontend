import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { IoSearchSharp } from "react-icons/io5";

const BDA = () => {
  // const {
  //   // data: BDAQuestionList,
  //   isLoading: loadBDAQuestionList,
  //   isError: errorInBDAQuestionList,
  // } = useQuery({
  //   queryKey: ["BDAQuestion", "List"],
  //   queryFn: fetchBDAQuestion,
  //   enabled: industry && subIndustry ? true : false,
  // });
  return (
    <div className="flex flex-1 overflow-hidden flex-col max-[500px]:p-4 gap-4 sm:gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xl sm:text-2xl font-semibold text-black">BDA</p>
        <div className="flex items-center py-0 md:py-1 px-3 gap-2 rounded-xl bg-[#F8F8F8] w-full sm:w-auto">
          <IoSearchSharp className="text-lg" />
          <Input
            className="w-full sm:w-32 border-none placeholder:text-[#1E255E] p-0 shadow-none focus-visible:ring-0"
            placeholder="Search"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-auto"></div>
    </div>
  );
};

export default BDA;
