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
import React from "react";
import { IoCloseOutline } from "react-icons/io5";

const PermissionDialog = ({ trigger }: { trigger: React.ReactNode }) => {
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
            <span className="font-medium text-black">Name:</span>
            <span className="text-sm md:text-base text-black">Poojan</span>
          </div>

          {/* Divider */}
          <div className="border-b-2 border-[#EFEFEF]"></div>

          {/* Permissions Section */}
          <div className="flex flex-col gap-2">
            <span className="text-base text-black font-medium">
              Permission:
            </span>

            <div className="flex justify-between items-center">
              <span className="text-sm md:text-base">Permission 1</span>
              <Switch
                // checked={field.value}
                // onCheckedChange={field.onChange}
                aria-readonly
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm md:text-base">Permission 2</span>
              <Switch
                // checked={field.value}
                // onCheckedChange={field.onChange}
                aria-readonly
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionDialog;
