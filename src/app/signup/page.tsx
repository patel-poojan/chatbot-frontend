// app/signup/page.js
"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const SignupForm = () => {
  const [passwordType, setPasswordType] = useState<string>("password");
  const [emailId, setEmailId] = useState<string>("");

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      setEmailId(searchParams.get("mailId") || "");
    }
  }, [searchParams]);

  const togglePassword = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };

  return (
    <div className="h-dvh w-dvw flex justify-center items-center bg-gray-50">
      <div className="flex flex-col gap-5 sm:gap-6 w-full max-w-lg px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row gap-2 justify-center items-center">
          <Image
            src="/images/bot-icon.svg"
            alt="chatbot logo"
            width={45}
            height={45}
            priority
            quality={100}
          />
          <div className="text-[#1E255E] font-medium text-3xl sm:text-4xl">
            ChatBot
          </div>
        </div>

        <div className="w-full">
          <label htmlFor="fullName" className="text-black font-normal text-lg">
            Full Name
          </label>
          <Input
            id="fullName"
            className="px-4 py-3 mt-1 rounded placeholder:text-[#6F7288B2] focus-visible:ring-0 placeholder:text-sm  placeholder:sm:text-lg placeholder:font-light w-full"
            placeholder="Enter Your Full Name"
          />
        </div>

        <div className="w-full">
          <label htmlFor="email" className="text-black font-normal text-lg">
            Business Email
          </label>
          <Input
            id="email"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            className="px-4 py-3 mt-1 rounded placeholder:text-[#6F7288B2] focus-visible:ring-0 placeholder:text-sm  placeholder:sm:text-lg placeholder:font-light w-full"
            placeholder="Enter Your Business Email"
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
              className="px-4 py-3 flex-1 !border-none rounded focus-visible:ring-0 placeholder:text-[#6F7288B2] placeholder:text-sm  placeholder:sm:text-lg placeholder:font-light w-full"
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

        <div className="text-center text-[#1E255EB2] ms-2 font-normal text-sm sm:text-lg flex items-center">
          <Checkbox id="terms" className="me-2 h-4 w-4" /> I Agree to
          <a className="text-[#57C0DD]  mx-1">Term of Use</a>
          and
          <a className="text-[#57C0DD]  mx-1">Privacy Policy</a>
        </div>

        <Button className="w-full text-white bg-gradient-to-r from-[#58C8DD] to-[#53A7DD] py-3 rounded">
          Sign up
        </Button>

        <div className="text-center text-[#1E255EB2] font-normal text-sm sm:text-lg">
          Already have an account?
          <a href="/login" className="text-[#57C0DD] hover:underline ms-1">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
};

export default Page;
