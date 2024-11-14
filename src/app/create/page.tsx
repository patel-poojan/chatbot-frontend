"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { CgNotes } from "react-icons/cg";
import { TfiWorld } from "react-icons/tfi";
import DashboardLayout from "../components/DashboardLayout";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useCreateChatbot } from "@/utils/botCreation-api";
import { toast } from "sonner";
import { axiosError } from "@/types/axiosTypes";
import { Loader } from "../components/Loader";
const Page = () => {
  const router = useRouter();
  const { mutate: onCreateChatbot, isPending: isCreateChatbotPending } =
    useCreateChatbot({
      onSuccess(data) {
        if (data.success) {
          router.replace(`/create/${data.data.type}/${data.data._id}`);
          toast.success(data?.message);
        }
      },
      onError(error: axiosError) {
        const errorMessage =
          error?.response?.data?.errors?.message ||
          error?.response?.data?.message ||
          "Failed to create chatbot!";
        toast.error(errorMessage);
      },
    });
  return (
    <DashboardLayout>
      {isCreateChatbotPending && <Loader />}
      <div className="flex-1 flex flex-col  max-[500px]:p-4 overflow-auto">
        <div className="flex   gap-3">
          <FaArrowLeftLong
            onClick={() => router.back()}
            className="text-4xl md:text-2xl md:mt-1 cursor-pointer text-black-500"
          />
          <div className="max-[768px]:mt-1">
            <div className="text-xl sm:text-2xl font-semibold  text-black mb-2">
              Set up your chatbot
            </div>
            <div className="mb-4 sm:mb-6 font-normal text-base sm:text-xl text-black">
              Train your chatbot with data, use our ready-to-use templates or
              start from scratch.
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
            <div
              className="border flex flex-col bg-white justify-center hover:border-primary rounded-3xl p-4 sm:p-6 cursor-pointer"
              onClick={() => onCreateChatbot({ type: "website" })}
              style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
            >
              <TfiWorld className="text-3xl sm:text-4xl font-bold text-[#57C0DD] mb-3 sm:mb-4" />
              <p className="font-semibold text-black text-lg sm:text-2xl">
                Website
              </p>
              <p className="mt-2 sm:mt-3 font-normal text-black text-xs sm:text-sm">
                Crawl your website’s content to get answers to popular user
                questions.
              </p>
            </div>

            <div
              className=" flex flex-col bg-white justify-center hover:border-primary border rounded-3xl p-4 sm:p-6 cursor-pointer "
              onClick={() => onCreateChatbot({ type: "document" })}
              style={{
                boxShadow: "0px 0px 4px 0px #0000001F",
              }}
            >
              <CgNotes className="text-3xl sm:text-4xl font-bold text-[#CE51DA] mb-3 sm:mb-4" />
              <p className="font-semibold text-black text-lg sm:text-2xl">
                Document
              </p>
              <p className="mt-2 sm:mt-3 font-normal text-black text-xs sm:text-sm">
                Lorem ipsum dolor sit amet consectetur. Nibh condimentum vel
                ligula sagittis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Page;
