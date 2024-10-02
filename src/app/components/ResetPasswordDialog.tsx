import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { isPasswordValid } from "@/utils/validator";
import React, { useCallback, useState } from "react";
import { IoCloseOutline, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { toast } from "sonner";
import { axiosError } from "@/types/axiosTypes";
import { useResetPassword } from "@/utils/auth-api";
import { Loader } from "./Loader";

const ResetPasswordDialog = ({ trigger }: { trigger: React.ReactNode }) => {
  const [currentPasswordType, setCurrentPasswordType] =
    useState<string>("password");
  const [newPasswordType, setNewPasswordType] = useState<string>("password");
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>("");
  const toggleCurrentPassword = () => {
    setCurrentPasswordType((prev) =>
      prev === "password" ? "text" : "password"
    );
  };
  const toggleNewPassword = () => {
    setNewPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };
  const { mutate: onResetPassword, isPending } = useResetPassword({
    onSuccess(data) {
      toast.success(data?.message);
      setIsOpen(false);
    },

    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        "Reset password failed";
      toast.error(errorMessage);
    },
  });
  const handleResetPassword = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!currentPassword) {
        toast.warning("Please fill in your current password");
      } else if (!isPasswordValid(currentPassword)) {
        toast.warning(
          "current Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character",
          { duration: 5000 }
        );
      } else if (!newPassword) {
        toast.warning("Please fill in your new password");
      } else if (!isPasswordValid(newPassword)) {
        toast.warning(
          "new Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character",
          { duration: 5000 }
        );
      } else {
        onResetPassword({ currentPassword, newPassword });
      }
    },
    [currentPassword, newPassword, onResetPassword]
  );
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="max-w-[87vw] sm:max-w-[480px] gap-0 py-6 md:py-10 px-6 md:px-11 rounded-lg"
        aria-describedby="dialog-description"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        {isPending && <Loader />}
        <DialogHeader>
          <DialogTitle className="sr-only">Reset Password</DialogTitle>
          <DialogDescription id="dialog-description" className="sr-only">
            Please enter your current password and a new password to reset it.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex justify-between items-center">
            <div></div>
            <p className="text-black text-center font-medium text-2xl ">
              Reset Password
            </p>
            <DialogClose>
              <IoCloseOutline className="text-xl" />
            </DialogClose>
          </div>

          <div className="w-full">
            <label
              htmlFor="currentPassword"
              className="text-black font-normal text-lg"
            >
              Current Password
            </label>
            <div className="flex items-center pe-4 border w-full rounded mt-1">
              <Input
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                type={currentPasswordType}
                className="px-4 py-3 flex-1 !border-none rounded focus-visible:ring-0 placeholder:text-sm placeholder:font-light w-full"
                placeholder="Enter Current Password"
              />
              <div className="cursor-pointer" onClick={toggleCurrentPassword}>
                {currentPasswordType === "password" ? (
                  <IoEyeOffOutline />
                ) : (
                  <IoEyeOutline />
                )}
              </div>
            </div>
          </div>

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

          <Button
            type="button"
            onClick={handleResetPassword}
            className="w-full text-white bg-gradient-to-r hover:from-[#53A7DD] hover:to-[#58C8DD] from-[#58C8DD] to-[#53A7DD] py-3 rounded"
          >
            Reset Password
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResetPasswordDialog;
