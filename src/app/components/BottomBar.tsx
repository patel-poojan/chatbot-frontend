import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiOutlineInstagram } from "react-icons/ai";
import { BiLogoLinkedin } from "react-icons/bi";

const BottomBar = () => {
  return (
    <div className="bg-white px-6 py-8 md:px-12 md:py-12 flex flex-col md:flex-row items-center justify-between mt-12">
      <div className="text-center md:text-left mb-6 md:mb-0">
        <div className="flex items-center justify-center md:justify-start gap-2">
          <Image
            src="/images/bot-icon.svg"
            alt="chatbot logo"
            width={30}
            height={30}
            priority
          />
          <p className="text-lg md:text-2xl font-medium text-[#1E255E]">
            ChatBot
          </p>
        </div>
        <p className="text-[#8987A1] text-sm md:text-base font-light mt-4 max-w-md">
          Lorem ipsum dolor sit amet consectetur. Quis sagittis facilisi platea
          aliquam enim lectus odio scelerisque. Suscipit pharetra imperdiet
          nulla malesuada.
        </p>
      </div>
      <div className="flex flex-col items-center md:items-end gap-6">
        <div className="flex flex-wrap justify-center md:justify-end text-[#8987A1] font-normal gap-4">
          <Link href="/" className="hover:underline">
            Product
          </Link>
          <Link href="/" className="hover:underline">
            Pricing
          </Link>
          <Link href="/" className="hover:underline">
            Integration
          </Link>
          <Link href="/" className="hover:underline">
            Resources
          </Link>
        </div>
        <div className="flex items-center justify-center gap-3">
          <div className="bg-[#F5F8FF] p-3 rounded-full">
            <AiOutlineInstagram className="text-lg" />
          </div>
          <div className="bg-[#F5F8FF] p-3 rounded-full">
            <BiLogoLinkedin className="text-lg" />
          </div>
          <div className="bg-[#F5F8FF] p-3 rounded-full">
            <AiOutlineInstagram className="text-lg" />
          </div>
          <div className="bg-[#F5F8FF] p-3 rounded-full">
            <BiLogoLinkedin className="text-lg" />
          </div>
        </div>
        <div className="text-[#8987A1] text-xs md:text-sm font-normal text-center md:text-right">
          All copy rights are reserved by ChatBot.Copyrights@2024
        </div>
      </div>
    </div>
  );
};

export default BottomBar;
