import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const BotResponseDialog = ({ trigger }: { trigger: React.ReactNode }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="right-0 top-[11vh] left-[unset]  rounded-lg transform">
        <DialogHeader>
          <DialogTitle className="sr-only">Bot response node</DialogTitle>
          <DialogDescription id="dialog-description" className="sr-only">
            Bot response description
          </DialogDescription>
        </DialogHeader>
        <div>Bot Response Node</div>
      </DialogContent>
    </Dialog>
  );
};

export default BotResponseDialog;
