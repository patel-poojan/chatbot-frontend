import Image from "next/image";
import Link from "next/link";
import React from "react";

const OuterTemplate = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-dvh flex flex-col ">
      <div className="flex sticky top-0  py-4 justify-center bg-[#ffffff7a] shadow-lg">
        <Link href="/chatbotlist" className="flex gap-2 items-center">
          <Image
            src="/images/bot-icon.svg"
            alt="chatbot logo"
            width={30}
            height={30}
            priority
            quality={100}
          />
          <div className="text-lg font-medium text-[#1E255E] md:text-xl lg:text-2xl">
            ChatBot
          </div>
        </Link>
      </div>
      <div className="p-6 flex-1 flex flex-col sm:p-8 md:p-12 lg:px-24 lg:py-12">
        {children}
      </div>
    </div>
  );
};

export default OuterTemplate;
