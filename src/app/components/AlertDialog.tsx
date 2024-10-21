import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useDeleteBot } from "@/utils/botCreation-api";
import { DialogClose } from "@radix-ui/react-dialog";
import { useRouter } from "next/navigation";
import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { toast } from "sonner";
import { axiosError } from "@/types/axiosTypes";
const AlertDialog = ({
  trigger,
  botId,
}: {
  trigger: React.ReactNode;
  botId?: string;
}) => {
  const router = useRouter();
  const { mutate: onDelete } = useDeleteBot({
    onSuccess(data) {
      router.push("/create");
      toast.success(data?.message);
    },
    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        "Delete bot failed";
      toast.error(errorMessage);
    },
  });
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-[87vw] gap-0  sm:max-w-[425px] rounded-lg">
        <DialogHeader>
          <DialogTitle className="sr-only">Alert</DialogTitle>
          <DialogDescription id="dialog-description" className="sr-only">
            Data loss alert
          </DialogDescription>
        </DialogHeader>
        {/* {isPending && <Loader />} */}
        <div className="gap-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="text-primary  text-base">
              Training {`is't`} finished yet
            </div>
            <DialogClose>
              <IoCloseOutline className="text-lg" />
            </DialogClose>
          </div>
          <div className="text-primary text-sm text-black">{`Are you sure you want to finish go back?you'll lose the genrate content`}</div>
          <div className="flex gap-2 sm:gap-3 items-center justify-end">
            <Button
              className="border border-[#57C0DD] text-xs text-[#57C0DD] py-2 w-[105px] sm:w-[116px] bg-transparent rounded-full hover:bg-[#f0faff]"
              onClick={() => {
                if (botId) {
                  onDelete({ chatbotId: botId });
                }
              }}
            >
              Go back
            </Button>
            <DialogClose>
              <Button className="bg-[#57C0DD] text-white text-xs py-2 w-[105px] sm:w-[116px]   rounded-full hover:bg-[#4cb9d1]">
                Finish training
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlertDialog;
