"use client";
import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";

import { Input } from "@/components/ui/input";
import { IoSearchSharp } from "react-icons/io5";
import TrainingTable from "../components/TrainingTable";

const Page = () => {
  const [tab, setTab] = useState(0);

  return (
    <DashboardLayout>
      <div className="flex flex-1 overflow-hidden flex-col p-4 gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xl sm:text-2xl font-semibold text-black">
            Training
          </p>
          <div className="flex items-center py-1 px-3 gap-2 rounded-xl bg-[#F8F8F8] w-full sm:w-auto">
            <IoSearchSharp className="text-lg" />
            <Input
              className="w-full sm:w-32 border-none placeholder:text-[#1E255E] p-0 shadow-none focus-visible:ring-0"
              placeholder="Search"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div
            onClick={() => setTab(0)}
            className={`cursor-pointer ${
              tab === 0
                ? "text-lg text-[#1E255E] font-medium underline underline-offset-8 decoration-2 decoration-[#57C0DD]"
                : "text-base text-black font-light"
            }`}
          >
            Unmatched Phrases
          </div>
          <div
            onClick={() => setTab(1)}
            className={`cursor-pointer ${
              tab === 1
                ? "text-lg text-[#1E255E] font-medium underline underline-offset-8 decoration-2 decoration-[#57C0DD]"
                : "text-base text-black font-light"
            }`}
          >
            Ignored
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-auto">
          {tab === 0 ? (
            <TrainingTable type="unmatched" />
          ) : (
            <TrainingTable type="ignored" />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;
