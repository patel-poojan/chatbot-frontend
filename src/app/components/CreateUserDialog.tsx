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
import { Switch } from "@/components/ui/switch";
import { axiosError } from "@/types/axiosTypes";
import { useAddUser } from "@/utils/user-api";
import { isEmailValid, isPasswordValid } from "@/utils/validator";
import React, { useCallback, useState } from "react";
import { IoCloseOutline, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { toast } from "sonner";
import { Loader } from "./Loader";

const CreateUserDialog = ({
  trigger,
  type,
  refetch,
}: {
  trigger: React.ReactNode;
  type: string;
  refetch: () => void;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [passwordType, setPasswordType] = useState<string>("password");
  const [emailId, setEmailId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const togglePassword = () => {
    setPasswordType((prev) => (prev === "password" ? "text" : "password"));
  };
  const permissionList = [
    {
      _id: "66f976fda5b821f637e6e5de",
      name: "Create users",
      resource: "CREATE_USER",
    },
    {
      _id: "66fc0285fe41bcac253e598f",
      name: "Access to user data",
      resource: "ACCESS_TO_USER_DATA",
    },
    {
      _id: "66fc086bfe41bcac253e59a2",
      name: "Subscription management",
      resource: "SUBSCRIPTION_MANAGEMENT",
    },
  ];
  const { mutate: onAdd, isPending } = useAddUser({
    onSuccess(data) {
      toast.success(data?.message);
      refetch();
      setIsOpen(false);
      setName("");
      setEmailId("");
      setPassword("");
      setPermissions([]);
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        "Failed to add user";
      toast.error(errorMessage);
    },
  });
  const handleAdd = useCallback(
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
          "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, one number, and one special character",
          { duration: 5000 }
        );
      } else {
        if (type === "user") {
          onAdd({
            username: name,
            email: emailId,
            password: password,
            role: "user",
            permissionIds: [],
          });
        } else {
          onAdd({
            username: name,
            email: emailId,
            password: password,
            role: "subadmin",
            permissionIds: permissions,
          });
        }
      }
    },
    [name, emailId, password, type, onAdd, permissions]
  );
  const onChangePermission = (id: string) => {
    if (permissions && permissions.includes(id)) {
      setPermissions(permissions.filter((permission) => permission !== id));
    } else {
      setPermissions([...permissions, id]);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="max-w-[87vw] sm:max-w-[500px] gap-0 p-6 md:p-8  rounded-lg"
        aria-describedby="dialog-description"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        {isPending && <Loader />}
        <DialogHeader>
          <DialogTitle className="sr-only">Create user</DialogTitle>
          <DialogDescription id="dialog-description" className="sr-only">
            please create user
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 ">
          <div className="flex justify-between items-center">
            <p className="text-black text-center font-medium text-xl ">
              {type === "user" ? "Add User" : "Add Sub-Admin"}
            </p>
            <DialogClose>
              <IoCloseOutline
                className="text-xl"
                onClick={() => {
                  setName("");
                  setEmailId("");
                  setPassword("");
                  setPermissions([]);
                }}
              />
            </DialogClose>
          </div>
          <div className="w-full">
            <label htmlFor="fullName" className="text-black font-normal ">
              Name
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="fullName"
              className="px-4 py-3 mt-1 rounded  focus-visible:ring-0 placeholder:text-sm   placeholder:font-light w-full"
              placeholder="Enter Your Name"
            />
          </div>
          <div className="w-full">
            <label htmlFor="email" className="text-black font-normal ">
              Business Email
            </label>
            <Input
              id="email"
              value={emailId}
              onChange={(e) => setEmailId(e.target.value)}
              className="px-4 py-3 mt-1 rounded  focus-visible:ring-0 placeholder:text-sm   placeholder:font-light w-full"
              placeholder="Enter Your Business Email"
            />
          </div>
          <div className="w-full">
            <label htmlFor="password" className="text-black font-normal ">
              Password
            </label>
            <div className="flex items-center pe-4 border w-full rounded mt-1">
              <Input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={passwordType}
                className="px-4 py-3 flex-1 !border-none rounded focus-visible:ring-0  placeholder:text-sm   placeholder:font-light w-full"
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
          {type === "subAdmin" && (
            <div className="flex flex-col gap-2">
              <span className="text-base font-semibold text-black ">
                Permission :
              </span>
              {permissionList?.map((per, index: number) => (
                <div className="flex justify-between items-center" key={index}>
                  <span className="text-sm font-medium text-black">
                    {per.name}
                  </span>
                  <Switch
                    checked={
                      permissions.find((p: string) => p === per._id)
                        ? true
                        : false
                    }
                    onCheckedChange={() => onChangePermission(per._id)}
                    aria-readonly
                  />
                </div>
              ))}
            </div>
          )}

          <Button
            type="button"
            onClick={handleAdd}
            className="w-full text-white bg-gradient-to-r hover:from-[#53A7DD] hover:to-[#58C8DD] from-[#58C8DD] to-[#53A7DD] py-3 rounded"
          >
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserDialog;
