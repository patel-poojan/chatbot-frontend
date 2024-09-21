"use client";
import React from "react";
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
import { MdAlternateEmail, MdSmartToy } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { IoSearchSharp } from "react-icons/io5";

const Page = () => {
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
    <DashboardLayout>
      <div className="flex flex-1 flex-col  overflow-hidden p-4 gap-4 sm:gap-6 max-w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xl sm:text-2xl font-semibold text-black">User</p>
          <div className="flex items-center py-1 px-3 gap-2 rounded-xl bg-[#F8F8F8] w-full sm:w-auto">
            <IoSearchSharp className="text-lg" />
            <Input
              className="w-full sm:w-32 border-none placeholder:text-[#1E255E] p-0 shadow-none focus-visible:ring-0"
              placeholder="Search"
            />
          </div>
        </div>
        <div className="flex-1 flex flex-col overflow-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-[#57C0DD1A] backdrop-blur-3xl sticky top-0">
              <TableRow>
                <TableHead className="py-2 text-start">
                  <div className="flex items-center justify-start gap-1">
                    <FaUser className="text-[#57C0DD] text=base hidden sm:block" />
                    Name
                  </div>
                </TableHead>
                <TableHead className="py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <MdAlternateEmail className="text-[#57C0DD] text=base hidden sm:block" />
                    Email
                  </div>
                </TableHead>
                <TableHead className="py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <FaRegCalendar className="text-[#57C0DD] text=base hidden sm:block" />
                    Last Train Bot
                  </div>
                </TableHead>
                <TableHead className="py-2 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <MdSmartToy className="text-[#57C0DD] text=base hidden sm:block" />
                    Total Bots
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {userDetails.map((detail, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="text-left">{detail.name}</TableCell>
                  <TableCell className="text-center">{detail.email}</TableCell>
                  <TableCell className="text-center">
                    {detail.lastTrainBot}
                  </TableCell>
                  <TableCell className="text-center">
                    {detail.totalBots}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;
