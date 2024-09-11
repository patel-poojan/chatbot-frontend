import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { RiArrowDropDownLine } from "react-icons/ri";

const TopBar = () => {
  const router = useRouter();
  return (
    <div className="flex sticky backdrop-blur-xl z-10 top-0 items-center justify-between px-6 py-4 bg-[#ffffff7a] shadow-lg md:px-10 lg:px-20">
      <div className="flex items-center gap-2">
        <Image
          src="/images/bot-icon.svg"
          alt="chatbot logo"
          width={30}
          height={30}
          priority
          quality={100}
        />
        <div className="text-xl font-medium md:text-2xl text-[#1E255E]">
          ChatBot
        </div>
      </div>
      <div className="hidden min-[850px]:flex gap-6 items-center text-base text-[#1E255E] ">
        <Link href="/" className="hover:underline flex  items-center ">
          Product <RiArrowDropDownLine className="text-lg" />
        </Link>
        <Link href="/" className="hover:underline flex  items-center">
          Pricing
        </Link>
        <Link href="/" className="hover:underline flex  items-center">
          Integration <RiArrowDropDownLine className="text-lg" />
        </Link>
        <Link href="/" className="hover:underline flex  items-center">
          Resources <RiArrowDropDownLine className="text-lg" />
        </Link>
      </div>

      <div className="flex gap-4 items-center">
        <Button
          className="border border-[#57C0DD] text-sm text-[#57C0DD] py-2 px-6 lg:px-8 bg-transparent rounded-full hover:bg-[#f0faff]"
          onClick={() => {
            router.push("/login");
          }}
        >
          Log in
        </Button>
        <Button
          className="bg-[#57C0DD] text-white text-sm py-2 px-6 lg:px-8 rounded-full hover:bg-[#4cb9d1]"
          onClick={() => {
            router.push("/signup");
          }}
        >
          Sign up
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
