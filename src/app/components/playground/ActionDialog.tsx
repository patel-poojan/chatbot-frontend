import React from "react";
import { IoCloseOutline } from "react-icons/io5";
import { usePlayground } from "./PlaygroundContext";
import { IoIosSend } from "react-icons/io";
import Image from "next/image";
import { MdOutlineQuestionMark } from "react-icons/md";

const ActionDialog = ({ actionHandler }: { actionHandler: () => void }) => {
  const { setType, setLabel } = usePlayground();

  const onDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    nodeType: string,
    label: string
  ) => {
    setType(nodeType);
    setLabel(label);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}
      className="absolute z-10 bg-white px-5 min-[500px]:px-8 py-5 shadow-lg right-6 top-20 h-auto min-[500px]:w-[360px] rounded-lg flex flex-col gap-2"
      aria-modal="true"
      role="dialog"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-primary font-semibold text-xl">Interactions</h2>
        <IoCloseOutline
          className="text-2xl cursor-pointer "
          onClick={() => actionHandler()}
          aria-label="Close dialog"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 items-center">
        <div
          className="w-full cursor-pointer hover:bg-gray-100 h-full px-2 py-3 rounded-lg transition  flex flex-col items-center justify-center"
          onDragStart={(event) =>
            onDragStart(event, "userInputNode", "User Input")
          }
          draggable
        >
          <Image
            src="/images/user_input.svg"
            alt="User Input Icon"
            width={28}
            height={28}
            quality={100}
          />
          <span className="text-black text-sm font-medium mt-1">
            User Input
          </span>
        </div>

        <div
          className="w-full cursor-pointer hover:bg-gray-100 px-2 py-3 h-full rounded-lg transition  flex flex-col items-center justify-center"
          onDragStart={(event) =>
            onDragStart(event, "botResponseNode", "Bot Response")
          }
          draggable
        >
          <IoIosSend className="text-black text-3xl" />
          <span className="text-black text-sm font-medium mt-1">
            Bot Response
          </span>
        </div>
      </div>

      <h3 className="text-primary font-semibold text-xl">Action</h3>
      <div className="grid grid-cols-2 gap-4 items-center">
        <div
          className="w-full cursor-pointer hover:bg-gray-100 px-2 py-3 h-full rounded-lg transition  flex flex-col items-center justify-center"
          onDragStart={(event) =>
            onDragStart(event, "goToStepNode", "Go to step")
          }
          draggable
        >
          <Image
            src="/images/go_to_step.svg"
            alt="go to step logo"
            width={30}
            height={30}
            quality={100}
          />
          <span className="text-black text-sm font-medium mt-2">
            Go To Step
          </span>
        </div>
        <div
          className="w-full cursor-pointer hover:bg-gray-100 px-2 py-3 rounded-lg transition  flex flex-col items-center justify-center"
          onDragStart={(event) => onDragStart(event, "faqNode", "FaQ")}
          draggable
        >
          <Image
            src="/images/faq.svg"
            alt="faq logo"
            width={30}
            height={30}
            quality={100}
          />
          <span className="text-black text-sm font-medium mt-1">FAQ</span>
        </div>
        <div
          className="w-full cursor-pointer hover:bg-gray-100 px-2 py-3 rounded-lg transition  flex flex-col items-center justify-center"
          onDragStart={(event) =>
            onDragStart(event, "questionNode", "Question")
          }
          draggable
        >
          <MdOutlineQuestionMark className="text-black text-3xl" />
          <span className="text-black text-sm font-medium mt-1">Question</span>
        </div>
        <div
          className="w-full cursor-pointer hover:bg-gray-100 px-2 py-3 h-full rounded-lg transition  flex flex-col items-center justify-center"
          onDragStart={(event) =>
            onDragStart(event, "closeChatNode", "Close Chat")
          }
          draggable
        >
          <Image
            src="/images/close_chat.svg"
            alt="close chat logo"
            width={28}
            height={28}
            quality={100}
          />
          <span className="text-black text-sm font-medium mt-1">
            Close Chat
          </span>
        </div>
      </div>
    </div>
  );
};

export default ActionDialog;
