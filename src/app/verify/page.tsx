"use client";
import { useResendEmail, useVerifyEmail } from "@/utils/auth-api";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import { LuBadgeAlert } from "react-icons/lu";
import { toast } from "sonner";
import { axiosError } from "@/types/axiosTypes";
import { Loader } from "../components/Loader";
import Cookies from "js-cookie";

const Verify = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const emailId = searchParams.get("email") || "";
  const router = useRouter();
  const [verificationStatus, setVerificationStatus] = useState({
    isVerified: false,
    isExpired: false,
    isVerifying: false,
  });

  const { mutate: verify, isPending: isPendingVerifyEmail } = useVerifyEmail({
    onSuccess(data) {
      const token = data.data?.accessToken;
      if (data.data?.user?.username) {
        localStorage.setItem("username", data.data.user.username);
        localStorage.setItem("email", data.data.user.email);
      }
      if (token) {
        setVerificationStatus({
          isVerified: true,
          isExpired: false,
          isVerifying: false,
        });
        Cookies.set("authToken", token, {
          path: "/",
          sameSite: "Lax",
          secure: true,
        });
        router.push("/chatbotlist");
      } else {
        router.push("/login");
      }
      toast.success(data?.message);
    },
    onError(error: axiosError) {
      setVerificationStatus({
        isVerified: false,
        isExpired: true,
        isVerifying: false,
      });
      const errorMessage =
        error?.response?.data?.errors?.message || error?.response?.data?.message || "Verify email failed";
      toast.error(errorMessage);
    },
  });

  useEffect(() => {
    if (token) {
      setVerificationStatus({
        isVerified: false,
        isExpired: false,
        isVerifying: true,
      });
      verify({ token, emailId });
    }
  }, [token, verify, emailId]);

  const { mutate: resend, isPending: isPendingResendEmail } = useResendEmail({
    onSuccess(data) {
      toast.success(data?.message);
    },
    onError(error: axiosError) {
      const errorMessage = error?.response?.data?.errors?.message || error?.response?.data?.message || "resend failed";
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
    <div className="min-h-dvh flex items-center justify-center p-4">
      {isPendingResendEmail ||
      verificationStatus.isVerifying ||
      isPendingVerifyEmail ||
      verificationStatus.isVerified ? (
        <Loader />
      ) : null}

      {!verificationStatus.isVerifying &&
      !isPendingVerifyEmail &&
      !verificationStatus.isVerified &&
      token &&
      verificationStatus.isExpired ? (
        <div
          className="flex flex-col items-center justify-center gap-4 sm:gap-6 p-6 sm:p-8 max-w-2xl w-full bg-white rounded-3xl text-center"
          style={{ boxShadow: "0px 0px 12px 4px #00000014" }}
        >
          <LuBadgeAlert className="text-[#57C0DD] text-6xl md:text-8xl" />
          <div className="text-black text-2xl md:text-3xl font-medium">Your link has expired</div>
          <div className="text-black text-base md:text-xl font-normal">
            The link you clicked on has expired due to inactivity. To complete the action, please request a new link.
          </div>
          <button
            className="text-[#57C0DD] text-lg md:text-xl font-semibold hover:underline underline-offset-2 hover:text-[#45A9B8] transition duration-300"
            onClick={resendEmailHandler}
          >
            Resend link
          </button>
        </div>
      ) : !token && !verificationStatus.isVerified ? (
        <div
          className="flex flex-col items-center justify-center gap-4 sm:gap-6 p-6 sm:p-8 max-w-2xl w-full bg-white rounded-3xl text-center"
          style={{ boxShadow: "0px 0px 12px 4px #00000014" }}
        >
          <FaRegCircleCheck className="text-[#57C0DD] text-6xl md:text-8xl" />
          <div className="text-black text-2xl md:text-3xl font-normal">
            A verification link has been sent to your registered mail
          </div>
          <div className="flex items-center gap-1">
            <span className="text-lg md:text-xl font-normal text-[#1E255EB2]">{`Didn't received link ?`}</span>
            <button
              className="text-[#57C0DD] underline underline-offset-2 cursor-pointer text-lg md:text-xl font-semibold hover:text-[#45A9B8] transition duration-300"
              onClick={resendEmailHandler}
            >
              Resend link
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

const Page = () => {
  return (
    <Suspense>
      <Verify />
    </Suspense>
  );
};

export default Page;
