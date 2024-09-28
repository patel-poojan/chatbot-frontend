"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/utils/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useCallback } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { toast } from "sonner";
import { Loader } from "../components/Loader";
import { axiosError } from "../../types/axiosTypes";
import Cookies from "js-cookie";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordType, setPasswordType] = useState<string>("password");

  const togglePassword = useCallback(() => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  }, []);

  const { mutate: onLogin, isPending } = useLogin({
    onSuccess(data) {
      const token = data.data.accessToken;
      if (token) {
        Cookies.set("authToken", token, {
          path: "/",
          sameSite: "Lax",
          secure: true,
        });
        setTimeout(() => {
          router.push("/chatbotlist");
        }, 10);
      }
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

  const handleLogin = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (!email) {
        toast.warning("Please fill in your email");
      } else if (!password) {
        toast.warning("Please fill in your password");
      } else {
        onLogin({ email, password });
      }
    },
    [email, onLogin, password]
  );

  // useEffect(() => {
  //   const authToken = Cookies.get("authToken");
  //   if (authToken) {
  //     router.push("/chatbotlist");
  //   }
  // }, [router]);

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
            Welcome back
          </p>
        </div>
        <div className="w-full">
          <label htmlFor="email" className="text-black font-normal text-lg">
            Email
          </label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            className="px-4 py-3 mt-1 rounded placeholder:text-[#6F7288B2] focus-visible:ring-0 placeholder:text-sm   placeholder:font-light w-full"
            placeholder="Enter Your Email"
          />
        </div>
        <div className="w-full">
          <label htmlFor="password" className="text-black font-normal text-lg">
            Password
          </label>
          <div className="flex items-center border w-full rounded mt-1">
            <Input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={passwordType}
              className="px-4 py-3 flex-1 !border-none rounded focus-visible:ring-0 placeholder:text-[#6F7288B2] placeholder:text-sm w-full"
              placeholder="Enter Your Password"
            />
            <div className="cursor-pointer me-3" onClick={togglePassword}>
              {passwordType === "password" ? (
                <IoEyeOffOutline />
              ) : (
                <IoEyeOutline />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end font-normal text-sm sm:text-base ">
          <a
            href="#"
            className="hover:underline underline-offset-1 text-[#57C0DD] hover:text-[#45A9B8]"
          >
            Forgot Password?
          </a>
        </div>
        <Button
          type="button"
          className="w-full text-white bg-gradient-to-r  from-[#58C8DD] to-[#53A7DD] py-3 rounded"
          onClick={handleLogin}
        >
          Log in
        </Button>
        <div className="text-center text-[#1E255EB2] font-normal text-sm sm:text-lg">
          Don’t have an account?{" "}
          <a
            href="signup"
            className="text-[#57C0DD] ms-1 hover:text-[#45A9B8] underline-offset-2 hover:underline"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Page;
