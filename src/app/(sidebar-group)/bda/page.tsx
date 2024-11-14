"use client";
import ChooseIndustryTemplate from "@/app/components/ChooseIndustryTemplate";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import React, { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import Papa from "papaparse";
import { axiosInstance } from "@/utils/axiosInstance";
import { toast } from "sonner";

const BDA = () => {
  const [industry, setIndustry] = useState<string>("");
  const [subIndustry, setSubIndustry] = useState<string>("");
  const [openBulkUpdate, setOpenBulkUpdate] = useState(false);
  const [csvData, setCsvData] = useState<unknown[]>([]);

  console.log(industry, subIndustry);

  // Sample data for the CSV file
  const sampleData = [
    { category: "Healthcare", subcategory: "Primary Care", questions: "Question1?,Question2?,Question3?,Question4?" },
    { category: "Finance", subcategory: "Investment", questions: "Question1?,Question2?,Question3?,Question4?" },
  ];

  // Function to download sample CSV file
  const downloadSampleCsv = () => {
    const csv = Papa.unparse(sampleData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      complete: (result: any) => {
        setCsvData(result.data);
        toast.success("CSV file parsed successfully.");
      },
      error: () => {
        toast.error("Failed to parse CSV file.");
      },
    });
  };

  // Send bulk update to the server
  const handleBulkUpdate = async () => {
    if (csvData.length === 0) {
      toast.warning("No data to update.");
      return;
    }

    try {
      const response = await axiosInstance.put("/bda/bulk-update", { data: csvData });
      if (response.data.success) {
        toast.success("Bulk update successful!");
      } else {
        toast.error("Bulk update failed.");
      }
    } catch (error) {
      console.error("Bulk update error:", error);
      toast.error("An error occurred during bulk update.");
    }
  };

  return (
    <>
      <div className="flex flex-1 overflow-hidden flex-col max-[500px]:p-4 gap-4 sm:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xl sm:text-2xl font-semibold text-black">BDA Questions</p>
          <div className="flex gap-4 items-center">
            <Button
              className="hover:bg-primary"
              onClick={() => {
                setOpenBulkUpdate((pre) => !pre);
              }}
            >
              Bulk Update
            </Button>
            <div className="flex items-center py-0 md:py-1 px-3 gap-2 rounded-xl bg-[#F8F8F8] w-full sm:w-auto">
              <IoSearchSharp className="text-lg" />
              <Input
                className="w-full sm:w-32 border-none placeholder:text-[#1E255E] p-0 shadow-none focus-visible:ring-0"
                placeholder="Search"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-auto">
          <ChooseIndustryTemplate
            up={() => {}}
            setIndustry={setIndustry}
            setSubIndustry={setSubIndustry}
            adminAction={true}
          />
        </div>
      </div>

      {/* Bulk update modal */}
      <Dialog open={openBulkUpdate}>
        <DialogContent overlayOnClick={() => setOpenBulkUpdate(false)}>
          <DialogHeader>
            <DialogTitle>Add Sub Industry</DialogTitle>
            <DialogClose
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              onClick={() => {
                setOpenBulkUpdate(false);
              }}
            >
              <Cross2Icon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="flex items-center gap-4">
            <Input type="file" accept=".csv" onChange={handleFileUpload} />
            <Button
              className="hover:bg-primary"
              onClick={() => {
                downloadSampleCsv();
              }}
            >
              Sample CSV
            </Button>
          </div>
          <Button
            className="hover:bg-primary"
            onClick={() => {
              handleBulkUpdate();
            }}
          >
            Submit
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BDA;
