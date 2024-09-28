// app/signup/page.js
"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useSignup } from "@/utils/api";
import { isEmailValid, isPasswordValid } from "@/utils/validator";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense, useCallback } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { toast } from "sonner";
import { axiosError } from "@/types/axiosTypes";
import { Loader } from "../components/Loader";

const SignupForm = () => {
  const [passwordType, setPasswordType] = useState<string>("password");
  const [emailId, setEmailId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [conditionChecker, setConditionChecker] = useState<boolean>(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams) {
      setEmailId(searchParams.get("mailId") || "");
    }
  }, [searchParams]);
  const { mutate: onSignup, isPending } = useSignup({
    onSuccess(data) {
      const params = new URLSearchParams(window.location.search);
      params.set("email", emailId);
      const newUrl = `/verify?${params.toString()}`;
      window.location.href = newUrl;
      toast.success(data?.message);
    },

    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        "Login failed";
      toast.error(errorMessage);
    },
  });
  const togglePassword = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };
  const handleSignup = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (!name) {
        toast.warning("Please fill in your name");
      } else if (!emailId) {
        toast.warning("Please fill in your email");
      } else if (!isEmailValid(emailId)) {
        toast.warning("Please enter a valid email");
      } else if (!password) {
        toast.warning("Please fill in your password");
      } else if (!isPasswordValid(password)) {
        toast.warning(
          "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character"
        );
      } else if (!conditionChecker) {
        toast.warning("Please accept the terms and conditions");
      } else {
        onSignup({ username: name, email: emailId, password });
      }
    },
    [name, emailId, password, conditionChecker, onSignup]
  );
  return (
    <div className="h-dvh w-dvw flex justify-center items-center">
      {isPending && <Loader />}

      <div className="flex flex-col gap-4 md:gap-6 w-full max-w-lg px-4">
        <div className="flex flex-col gap-1 md:gap-2 justify-center items-center">
          <Image
            src="/images/bot-icon.svg"
            alt="chatbot logo"
            width={45}
            height={45}
            priority
            quality={100}
          />
          <p className="text-black font-medium text-2xl md:text-[32px]">
            ChatBot
          </p>
        </div>
        <div className="w-full">
          <label htmlFor="fullName" className="text-black font-normal text-lg">
            Full Name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="fullName"
            className="px-4 py-3 mt-1 rounded placeholder:text-[#6F7288B2] focus-visible:ring-0 placeholder:text-sm   placeholder:font-light w-full"
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
            className="px-4 py-3 mt-1 rounded placeholder:text-[#6F7288B2] focus-visible:ring-0 placeholder:text-sm   placeholder:font-light w-full"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={passwordType}
              className="px-4 py-3 flex-1 !border-none rounded focus-visible:ring-0 placeholder:text-[#6F7288B2] placeholder:text-sm   placeholder:font-light w-full"
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
        <div className="text-center text-[#1E255EB2] ms-2 font-normal text-sm sm:text-base flex items-center">
          <Checkbox
            checked={conditionChecker}
            onCheckedChange={() => setConditionChecker(!conditionChecker)}
            id="terms"
            className="me-2 h-4 w-4"
          />
          I Agree to
          <a className="text-[#57C0DD]  mx-1">Term of Use</a>
          and
          <a className="text-[#57C0DD]  mx-1">Privacy Policy</a>
        </div>
        <Button
          type="button"
          onClick={handleSignup}
          className="w-full text-white bg-gradient-to-r from-[#58C8DD] to-[#53A7DD] py-3 rounded"
        >
          Sign up
        </Button>
        <div className="text-center text-[#1E255EB2] font-normal text-sm sm:text-lg">
          Already have an account?
          <a
            href="/login"
            className="text-[#57C0DD] ms-1 hover:text-[#45A9B8] underline-offset-2 hover:underline"
          >
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
