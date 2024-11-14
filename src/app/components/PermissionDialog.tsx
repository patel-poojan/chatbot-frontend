import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { DialogClose } from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "sonner";
import { axiosError } from "../../types/axiosTypes";
import { useUpdatePermission } from "@/utils/user-api";
import { Loader } from "./Loader";

const PermissionDialog = ({
  name,
  trigger,
  adminId,
  permissions,
}: {
  name: string;
  trigger: React.ReactNode;
  adminId: string;
  permissions: {
    _id: string;
    name: string;
    resource: string;
  }[];
}) => {
  const [selectedPermission, setSelectedPermission] = useState<
    {
      _id: string;
      name: string;
      resource: string;
    }[]
  >(permissions);
  useEffect(() => {
    setSelectedPermission(permissions);
  }, [permissions]);

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
  const { mutate: onUpdatePermission, isPending: isPendingToUpdate } =
    useUpdatePermission({
      onSuccess(data) {
        setSelectedPermission(data.data.permissions);
        toast.success(data?.message);
      },

      onError(error: axiosError) {
        const errorMessage =
          error?.response?.data?.errors?.message ||
          error?.response?.data?.message ||
          "Permission update failed";
        toast.error(errorMessage);
      },
    });
  const OnChangePermission = (id: string) => {
    const find = selectedPermission.find((item) => item._id === id);
    let prevSelectedPermission = selectedPermission;
    if (find) {
      prevSelectedPermission = selectedPermission.filter(
        (item) => item._id !== id
      );
    } else {
      prevSelectedPermission = [
        ...selectedPermission,
        permissionList.find((item) => item._id === id)!,
      ];
    }
    onUpdatePermission({
      adminId: adminId,
      permissionList: {
        permissionIds: prevSelectedPermission.map((item) => item._id),
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        aria-describedby="dialog-description"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="max-w-full md:max-w-[425px] w-[90vw] gap-0 p-4 md:p-6 rounded-lg overflow-auto"
      >
        {isPendingToUpdate ? <Loader /> : null}
        <DialogHeader>
          <DialogTitle className="sr-only">Permission</DialogTitle>
          <DialogDescription id="dialog-description" className="sr-only">
            Permission details
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="text-primary font-semibold text-lg md:text-xl">
              Details
            </div>
            <DialogClose asChild>
              <button aria-label="Close">
                <IoCloseOutline className="text-xl" />
              </button>
            </DialogClose>
          </div>

          {/* User Details Section */}
          <div className="flex items-center gap-1 text-base">
            <span className="font-semibold text-black">Name :</span>
            <span className="text-sm  font-medium text-black capitalize">
              {name}
            </span>
          </div>

          {/* Divider */}
          <div className="border-b-2 border-[#EFEFEF]"></div>

          {/* Permissions Section */}
          <div className="flex flex-col gap-2">
            <span className="text-base font-semibold text-black ">
              Permission :
            </span>
            {permissionList?.map((permission, index: number) => (
              <div className="flex justify-between items-center" key={index}>
                <span className="text-sm font-medium text-black">
                  {permission.name}
                </span>
                <Switch
                  checked={
                    selectedPermission.find((p) => p._id === permission._id)
                      ? true
                      : false
                  }
                  onCheckedChange={() => OnChangePermission(permission._id)}
                  aria-readonly
                />
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionDialog;
