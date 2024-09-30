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
import { FaRegCalendar, FaUser } from "react-icons/fa";
import { MdAlternateEmail, MdMoreVert, MdSmartToy } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { IoSearchSharp } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { VscSettings } from "react-icons/vsc";
import PermissionDialog from "../components/PermissionDialog";
const Details = ({ type }: { type: string }) => {
  const userDetails = [
    {
      name: "Prince",
      email: "Prince@123",
      lastTrainBot: "Today 10:11 PM",
      totalBots: "04",
    },
    {
      name: "Vandan",
      email: "vandan@123",
      lastTrainBot: "Today 10:11 PM",
      totalBots: "04",
    },
    {
      name: "Raj",
      email: "raj@123",
      lastTrainBot: "Today 10:11 PM",
      totalBots: "04",
    },
  ];
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <Table className="min-w-full md:table-fixed">
        <TableHeader className="bg-[#57C0DD1A] backdrop-blur-3xl sticky top-0 z-10">
          <TableRow>
            <TableHead className="py-2 text-start">
              <div className="flex items-center  flex-wrap justify-start gap-1">
                <FaUser className="text-[#57C0DD] text-base hidden lg:block" />
                <span className="break-all">Name</span>
              </div>
            </TableHead>
            <TableHead className="py-2 text-center">
              <div className="flex items-center  flex-wrap justify-center gap-1">
                <MdAlternateEmail className="text-[#57C0DD] text-base hidden lg:block" />
                <span className="break-all">Email</span>
              </div>
            </TableHead>
            <TableHead className="py-2 text-center">
              <div className="flex items-center flex-wrap justify-center gap-2 ">
                <FaRegCalendar className="text-[#57C0DD] text-base hidden lg:block" />
                <span className="break-all">Last Train Bot</span>
              </div>
            </TableHead>
            <TableHead className="py-2 text-center">
              <div className="flex items-center  flex-wrap justify-center gap-1">
                <MdSmartToy className="text-[#57C0DD] text-base hidden lg:block" />
                <span className="break-all">Total Bots</span>
              </div>
            </TableHead>
            <TableHead className="py-2 text-center">
              <div className="flex items-center flex-wrap justify-center ">
                <MdMoreVert className="text-[#57C0DD] text-base hidden lg:block" />
                <span className="break-all">Action</span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userDetails.map((detail, index) => (
            <TableRow key={index} className="hover:bg-gray-50">
              <TableCell className="text-left">
                <div className="flex  break-all items-center justify-start ">
                  {detail.name}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex  break-all items-center justify-center ">
                  {detail.email}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex  items-center break-all justify-center ">
                  {detail.lastTrainBot}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex  items-center break-all justify-center ">
                  {detail.totalBots}
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex flex-wrap items-center justify-center gap-1">
                  {type === "admin" && (
                    <PermissionDialog
                      trigger={
                        <VscSettings className="text-lg rotate-90 cursor-pointer" />
                      }
                    />
                  )}
                  <RiDeleteBin6Line className="text-lg cursor-pointer" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
const Page = () => {
  const [tab, setTab] = useState(0);

  return (
    <DashboardLayout>
      <div className="flex flex-1 flex-col  overflow-hidden p-4 gap-4 sm:gap-6 max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <div
              onClick={() => setTab(0)}
              className={`cursor-pointer ${
                tab === 0
                  ? "text-base sm:text-lg text-[#1E255E] font-medium underline underline-offset-8 decoration-2 decoration-[#57C0DD]"
                  : "text-sm sm:text-base text-black font-light"
              }`}
            >
              Admin
            </div>
            <div
              onClick={() => setTab(1)}
              className={`cursor-pointer ${
                tab === 1
                  ? "text-base sm:text-lg text-[#1E255E] font-medium underline underline-offset-8 decoration-2 decoration-[#57C0DD]"
                  : "text-sm sm:text-base text-black font-light"
              }`}
            >
              User
            </div>
          </div>
          <div className="flex items-center py-0 md:py-1 px-3 gap-2 rounded-xl bg-[#F8F8F8] w-full sm:w-auto">
            <IoSearchSharp className="text-lg" />
            <Input
              className="w-full sm:w-32 border-none placeholder:text-[#1E255E] p-0 shadow-none focus-visible:ring-0"
              placeholder="Search"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-auto">
          {tab === 0 ? <Details type="admin" /> : <Details type="user" />}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;
