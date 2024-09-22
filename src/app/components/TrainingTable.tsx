import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export default TrainingTable;
