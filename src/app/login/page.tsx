"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const Page = () => {
  const [passwordType, setPasswordType] = useState<string>("password");
  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };
  return (
    <div className="h-dvh w-dvw flex justify-center items-center ">
      <div className="flex flex-col gap-5 sm:gap-6 w-full max-w-lg px-4 sm:px-8">
        <div className="flex flex-col gap-2 justify-center items-center">
          <Image
            src="/images/bot-icon.svg"
            alt="chatbot logo"
            width={45}
            height={45}
            priority
            quality={100}
          />
          <p className="text-black font-semibold text-3xl sm:text-4xl">
            Welcome back
          </p>
        </div>
        <div className="w-full">
          <label htmlFor="fullName" className="text-black font-normal text-lg ">
            Full Name
          </label>
          <Input
            id="fullName"
            className="px-4 py-3 rounded mt-1 placeholder:text-[#6F7288B2] focus-visible:ring-0 placeholder:text-sm  placeholder:sm:text-lg placeholder:font-light w-full"
            placeholder="Enter Your Full Name"
          />
        </div>
        <div className="w-full">
          <label htmlFor="password" className="text-black font-normal text-lg">
            Password
          </label>
          <div className="flex items-center pe-4 border w-full rounded mt-1">
            <Input
              id="password"
              type={passwordType}
              className="px-4 py-3 flex-1 !border-none rounded  focus-visible:ring-0 placeholder:text-[#6F7288B2] placeholder:text-sm  placeholder:sm:text-lg placeholder:font-light w-full"
              placeholder="Enter Your Password"
            />
            <div className="cursor-pointer" onClick={togglePassword}>
              {passwordType === "password" ? (
                <IoEyeOffOutline />
              ) : (
                <IoEyeOutline />
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end w-full text-sm sm:text-lg font-normal text-[#57C0DD]">
          <a href="#" className="hover:underline">
            Forgot Password?
          </a>
        </div>
        <Button className="w-full text-white bg-gradient-to-r from-[#58C8DD] to-[#53A7DD] py-3 rounded">
          Log in
        </Button>
        <div className="text-center text-[#1E255EB2] font-normal text-sm sm:text-lg">
          Don’t have an account?{" "}
          <a href="signup" className="text-[#57C0DD] hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Page;
