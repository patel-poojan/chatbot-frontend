"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isEmailValid, isPasswordValid } from "@/utils/validator";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useCallback, useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { toast } from "sonner";
import { axiosError } from "@/types/axiosTypes";
import { Loader } from "../components/Loader";
import { useRouter } from "next/navigation";
import { useForgetPassword, useForgetPasswordReset } from "@/utils/auth-api";

const ForgetPassword = () => {
  const router = useRouter();
  const [confirmPasswordType, setConfirmPasswordType] =
    useState<string>("password");
  const [newPasswordType, setNewPasswordType] = useState<string>("password");
  const [email, setEmail] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const { mutate: onForgetPassword, isPending: isForgetPasswordPending } =
    useForgetPassword({
      onSuccess(data) {
        toast.success(data?.message);
      },
      onError(error: axiosError) {
        const errorMessage =
          error?.response?.data?.errors?.message ||
          error?.response?.data?.message ||
          "Reset password failed";
        toast.error(errorMessage);
      },
    });
  const {
    mutate: onForgetPasswordReset,
    isPending: isForgetPasswordResetPending,
  } = useForgetPasswordReset({
    onSuccess(data) {
      router.push("/login");
      toast.success(data?.message);
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        "Reset password failed";
      toast.error(errorMessage);
    },
  });
  const validateEmail = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();

      if (!email) {
        toast.warning("Please fill in your email");
      } else if (!isEmailValid(email)) {
        toast.warning("Please enter a valid email");
      } else {
        onForgetPassword({ email });
      }
    },
    [email, onForgetPassword]
  );

  const validatePasswords = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!newPassword) {
        toast.warning("Please fill in your new password");
      } else if (!isPasswordValid(newPassword)) {
        toast.warning(
          "new Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character",
          { duration: 5000 }
        );
      } else if (!confirmPassword) {
        toast.warning("Please fill in your confirm password");
      } else if (!isPasswordValid(confirmPassword)) {
        toast.warning(
          "confirm password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character",
          { duration: 5000 }
        );
      } else if (newPassword !== confirmPassword) {
        toast.warning("Passwords do not match");
      } else {
        onForgetPasswordReset({ token, newPassword });
      }
    },
    [confirmPassword, newPassword, onForgetPasswordReset, token]
  );

  const toggleConfirmPassword = () => {
    setConfirmPasswordType((prev) =>
      prev === "password" ? "text" : "password"
    );
  };
  const toggleNewPassword = () => {
    setNewPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };
  return (
    <div className="min-h-dvh flex items-center justify-center p-4 ">
      {isForgetPasswordPending || isForgetPasswordResetPending ? (
        <Loader />
      ) : (
        <></>
      )}
      {token ? (
        <div
          className="flex flex-col items-center  gap-4 sm:gap-6 p-6 sm:p-8 max-w-lg w-full bg-white  rounded-3xl"
          style={{ boxShadow: "0px 0px 12px 4px #00000014" }}
        >
          <h1 className="text-black font-medium text-2xl md:text-[32px]  text-center">
            Forgot Your Password
          </h1>
          <div className="w-full">
            <label
              htmlFor="newPassword"
              className="text-black font-normal text-lg"
            >
              New Password
            </label>
            <div className="flex items-center pe-4 border w-full rounded mt-1">
              <Input
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                type={newPasswordType}
                className="px-4 py-3 flex-1 !border-none rounded focus-visible:ring-0 placeholder:text-sm placeholder:font-light w-full"
                placeholder="Enter New Password"
              />
              <div className="cursor-pointer" onClick={toggleNewPassword}>
                {newPasswordType === "password" ? (
                  <IoEyeOffOutline />
                ) : (
                  <IoEyeOutline />
                )}
              </div>
            </div>
          </div>
          <div className="w-full">
            <label
              htmlFor="confirmPassword"
              className="text-black font-normal text-lg"
            >
              Current Password
            </label>
            <div className="flex items-center pe-4 border w-full rounded mt-1">
              <Input
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={confirmPasswordType}
                className="px-4 py-3 flex-1 !border-none rounded focus-visible:ring-0 placeholder:text-sm placeholder:font-light w-full"
                placeholder="Re-Enter New Password"
              />
              <div className="cursor-pointer" onClick={toggleConfirmPassword}>
                {confirmPasswordType === "password" ? (
                  <IoEyeOffOutline />
                ) : (
                  <IoEyeOutline />
                )}
              </div>
            </div>
          </div>
          <Button
            type="button"
            className="w-full text-white bg-gradient-to-r hover:from-[#53A7DD] hover:to-[#58C8DD] from-[#58C8DD] to-[#53A7DD] py-3 rounded"
            onClick={validatePasswords}
          >
            Continue
          </Button>
        </div>
      ) : (
        <div
          className="flex flex-col items-center justify-center gap-4 sm:gap-6 p-6 sm:p-8 max-w-lg w-full bg-white rounded-3xl text-center "
          style={{ boxShadow: "0px 0px 12px 4px #00000014" }}
        >
          <h1 className="text-black font-medium text-2xl md:text-[32px]">
            Forgot Your Password ?
          </h1>
          <p className="text-gray-600 text-base md:text-lg">
            Don’t worry! Just enter your email address below, and we’ll send you
            a link to reset your password.
          </p>
          <div className="w-full">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              className="px-4 py-3 mt-1 rounded  focus-visible:ring-0 placeholder:text-sm   placeholder:font-light w-full"
              placeholder="Enter Your Email"
            />
          </div>
          <Button
            type="button"
            className="w-full py-3 mt-1 rounded-md text-white bg-gradient-to-r from-[#58C8DD] to-[#53A7DD] hover:from-[#53A7DD] hover:to-[#58C8DD] transition-colors"
            onClick={validateEmail}
          >
            Send Reset Link
          </Button>
        </div>
      )}
    </div>
  );
};

const Page = () => {
  return (
    <Suspense>
      <ForgetPassword />
    </Suspense>
  );
};

export default Page;
