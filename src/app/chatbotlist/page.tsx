"use client";
import React from "react";
import { MdAdd } from "react-icons/md";
import DashboardLayout from "../components/DashboardLayout";
import { useRouter } from "next/navigation";
const Page = () => {
  const chatbotCards = new Array(1).fill(0);
  const router = useRouter();
  return (
    <>
      <DashboardLayout>
        <div className="flex-1 flex flex-col max-[500px]:p-6 overflow-auto">
          <div className="max-[500px]:text-xl text-2xl font-semibold text-black mb-6 max-[500px]:mb-4  ">
            ChatBots
          </div>
          <div className="flex-1 overflow-y-auto ">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {chatbotCards.map((_, index) => (
                <div
                  key={index}
                  className="h-32 sm:h-40 flex flex-col items-center justify-center rounded-3xl p-3 sm:p-4 cursor-pointer "
                  onClick={() => router.push("/create")}
                  style={{
                    background:
                      "linear-gradient(90deg, #58C8DD 0%, #53A7DD 100%)",
                  }}
                >
                  <div className="bg-white rounded-full p-1 sm:p-2">
                    <MdAdd className="text-xl sm:text-2xl text-[#58C8DD]" />
                  </div>
                  <div className="text-white mt-1 font-medium text-sm sm:text-base">
                    Add chatbot
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Page;
