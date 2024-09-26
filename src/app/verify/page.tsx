"use client";
import { useResendEmail, useVerifyEmail } from "@/utils/api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { LuBadgeAlert } from "react-icons/lu";
import { toast } from "sonner";
import { axiosError } from "@/types/axiosTypes";
import { Loader } from "../components/Loader";

const Verify = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const emailId = searchParams.get("email") || "";
  const router = useRouter();
  const { mutate: verify, isPending: isPendingVerifyEmail } = useVerifyEmail({
    onSuccess(data) {
      toast.success(data?.message);
      router.push("/login");
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        "Login failed";
      toast.error(errorMessage);
    },
  });
  useEffect(() => {
    if (token) {
      verify(token);
    }
  }, [token, verify]);

  const { mutate: resend, isPending: isPendingResendEmail } = useResendEmail({
    onSuccess(data) {
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
  const resendEmailHandler = () => {
    if (emailId) {
      resend({ email: emailId });
    } else {
      toast.error("something went wrong");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      {isPendingResendEmail || (isPendingVerifyEmail && <Loader />)}
      {token ? (
        <div
          className="flex flex-col items-center justify-center gap-4 sm:gap-6 p-6 sm:p-8 max-w-2xl w-full bg-white  rounded-3xl text-center"
          style={{ boxShadow: "0px 0px 12px 4px #00000014" }}
        >
          <LuBadgeAlert className="text-[#57C0DD] text-6xl md:text-8xl" />
          <div className="text-black text-2xl md:text-3xl font-medium">
            Your link has expired
          </div>
          <div className="text-black text-base md:text-xl font-normal">
            The link you clicked on has expired due to inactivity. To complete
            the action, please request a new link.
          </div>
          <button
            className="text-[#57C0DD] text-lg md:text-xl font-semibold hover:underline underline-offset-2 hover:text-[#45A9B8] transition duration-300"
            onClick={resendEmailHandler}
          >
            Resend link
          </button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-4 sm:gap-6 p-6 sm:p-8 max-w-2xl w-full bg-white  rounded-3xl text-center"
          style={{ boxShadow: "0px 0px 12px 4px #00000014" }}
        >
          <FaRegCircleCheck className="text-[#57C0DD] text-6xl md:text-8xl" />
          <div className="text-black text-2xl md:text-3xl font-normal">
            A verification link has been sent to your registered mail
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg md:text-xl font-normal text-[#1E255EB2]">
              Didn’t received link ?
            </span>
            <button
              className="text-[#57C0DD] underline underline-offset-2 cursor-pointer text-lg md:text-xl font-semibold  hover:text-[#45A9B8] transition duration-300"
              onClick={resendEmailHandler}
            >
              Resend link
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Verify />
    </Suspense>
  );
};

export default Page;
