"use client";
import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { IoSearchSharp } from "react-icons/io5";
import { FaQuoteLeft } from "react-icons/fa";

const TrainingTable = ({ type }: { type: string }) => {
  const data = [
    {
      userQuery: "This is a dummy query, just for testing",
      date: "Today 10:11 PM",
    },
    {
      userQuery: "This is a dummy query, just for testing",
      date: "Today 10:11 PM",
    },
  ];
  return (
    <Table className="min-w-full table-fixed">
      <TableHeader className="bg-[#57C0DD1A] backdrop-blur-3xl sticky top-0">
        <TableRow>
          <TableHead>
            <div className="flex items-center justify-start gap-2">
              User Query
            </div>
          </TableHead>
          <TableHead>
            <div className="flex items-center justify-center gap-2">Date</div>
          </TableHead>
          <TableHead>
            <div className="flex items-center justify-center gap-2">Action</div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((data, index) => (
          <TableRow key={index} className="hover:bg-gray-50">
            <TableCell>
              <div className="flex items-start gap-2">
                <FaQuoteLeft className="text-[#bbbbbb] text-lg sm:text-xl" />
                <span className="break-all">{data.userQuery}</span>
              </div>
            </TableCell>
            <TableCell className="text-center">{data.date}</TableCell>
            <TableCell>
              <div className="flex flex-wrap items-center justify-center gap-2">
                <div className="py-1 px-5 rounded-md bg-[#57C0DD1A]">Train</div>
                {type === "unmatched" && (
                  <div className="py-1 px-5 rounded-md bg-[#F59B521A]">
                    Ignore
                  </div>
                )}
                <div className="py-1 px-5 rounded-md bg-[#FF02021A]">
                  Delete
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
const Page = () => {
  const [tab, setTab] = useState(0);

  return (
    <DashboardLayout>
      <div className="flex flex-1 overflow-hidden flex-col p-4 gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xl sm:text-2xl font-semibold text-black">
            Training
          </p>
          <div className="flex items-center py-0 md:py-1 px-3 gap-2 rounded-xl bg-[#F8F8F8] w-full sm:w-auto">
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
                ? "text-base sm:text-lg text-[#1E255E] font-medium underline underline-offset-8 decoration-2 decoration-[#57C0DD]"
                : "text-sm sm:text-base text-black font-light"
            }`}
          >
            Unmatched Phrases
          </div>
          <div
            onClick={() => setTab(1)}
            className={`cursor-pointer ${
              tab === 1
                ? "text-base sm:text-lg text-[#1E255E] font-medium underline underline-offset-8 decoration-2 decoration-[#57C0DD]"
                : "text-sm sm:text-base text-black font-light"
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
