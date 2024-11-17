"use client";
import { Position, useReactFlow } from "@xyflow/react";
import CustomHandle from "./CustomHandle";
import { GoHomeFill } from "react-icons/go";
import { IoIosSend, IoMdAdd } from "react-icons/io";
import { useState } from "react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdCancel, MdCheckCircle, MdOutlineQuestionMark } from "react-icons/md";
import AddNodePopup from "./AddNodePopup";
import { usePlayground } from "./PlaygroundContext";
import BotResponseDialog from "../botIntrectionSection/BotResponseDialog";
import UserInputDialog from "../botIntrectionSection/UserInputDialog";
import GoToStepDialog from "../botIntrectionSection/GoToStepDialog";
import FAQDialog from "../botIntrectionSection/FAQDialog";

const NodeContainer = ({
  children,
  nodeCss,
  shadow,
  onMouseEnter,
  onMouseLeave,
}: {
  children: React.ReactNode;
  nodeCss: string;
  shadow?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}) => (
  <div
    className={`playground-node gap-1 ${nodeCss} relative`}
    style={{ boxShadow: shadow }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    {children}
  </div>
);

export const StartNode = ({
  data,
}: {
  data: { label: string; message: string; actionHandler: () => void };
}) => {
  return (
    <div className="relative flex items-center gap-2">
      {data.message && (
        <span className="text-black text-xs opacity-70 w-[145px] text-center absolute -top-5 left-0">
          {data.message}
        </span>
      )}
      <NodeContainer
        nodeCss="bg-[#424D50] w-[145px] hover:cursor-not-allowed "
        shadow="0px 0px 12px 4px #00000014 "
      >
        <GoHomeFill className="text-white text-base" />
        <span className="text-white text-sm">{data.label}</span>
        <CustomHandle type="source" position={Position.Right} />
      </NodeContainer>
    </div>
  );
};

export const DefaultNode = ({
  data,
}: {
  data: { label: string; message: string; actionHandler: () => void };
}) => {
  return (
    <div className="relative flex items-center gap-2">
      {data.message && (
        <span className="text-black text-xs opacity-70 w-[152px] text-center absolute -top-5 left-0">
          {data.message}
        </span>
      )}
      <NodeContainer
        nodeCss="bg-[#9CA3A5] text-white text-sm w-[152px] hover:cursor-not-allowed "
        shadow="0px 0px 12px 4px #00000014"
      >
        {data.label}
        <CustomHandle type="target" position={Position.Left} />
        <CustomHandle type="source" position={Position.Right} />
      </NodeContainer>
    </div>
  );
};

export const BotResponseNode = ({
  data,
  id,
}: {
  data: {
    label: string;
    message?: string;
    isDelete: boolean;
  };
  id: string;
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { getEdges, getNodes } = useReactFlow();
  const { deleteNodeHandler } = usePlayground();

  const edges = getEdges();
  const outgoingEdge = edges.find((edge) => edge.source === id);
  const incomingEdge = edges.find((edge) => edge.target === id);
  const nodes = getNodes();
  const parentNode = nodes.find((node) => node.id === incomingEdge?.source);
  const currentNode = nodes.find((node) => node.id === id);
  return (
    <div className="flex relative group items-center gap-2">
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {data.isDelete ? (
              <>
                <div className="text-red-500 text-xs hidden group-hover:block w-[145px]  text-center cursor-pointer absolute -top-4 left-0">
                  Delete
                </div>
                {data.message && (
                  <span className="text-black text-xs block group-hover:hidden opacity-70 w-[145px] text-center absolute -top-5 left-0">
                    {data.message}
                  </span>
                )}
              </>
            ) : (
              <span className="text-black text-xs  opacity-70 w-[145px] text-center absolute -top-5 left-0">
                {data.message}
              </span>
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-14  shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() =>
                deleteNodeHandler(
                  true,
                  parentNode?.id ?? "",
                  currentNode?.id ?? ""
                )
              }
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className={`${
                outgoingEdge ? "text-red-500" : "text-red-100"
              } text-center text-xs ${
                outgoingEdge ? "cursor-pointer" : "cursor-not-allowed"
              } `}
              onClick={() => {
                outgoingEdge &&
                  deleteNodeHandler(
                    false,
                    parentNode?.id ?? "",
                    currentNode?.id ?? ""
                  );
              }}
            >
              Delete with children
            </span>
          </PopoverContent>
        </Popover>

        <BotResponseDialog
          trigger={
            <button>
              <NodeContainer
                nodeCss="bg-white  w-[145px]"
                shadow="0px 0px 12px 4px #00000014"
              >
                <IoIosSend className="text-black text-base " />
                <span className="text-black text-sm">{data.label}</span>
                <CustomHandle type="target" position={Position.Left} />
                <CustomHandle type="source" position={Position.Right} />
              </NodeContainer>
            </button>
          }
        />
      </div>
      <IoMdAdd
        onClick={(e) => {
          e.stopPropagation();
          setIsPopupVisible((prev) => !prev);
        }}
        className="bg-white text-black hover:text-[#1844F0] rounded-full h-6 w-6 p-1 cursor-pointer md:hidden md:group-hover:block"
        style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
      />
      {isPopupVisible && (
        <AddNodePopup
          parentId={id}
          isPopupVisible={isPopupVisible}
          setIsPopupVisible={setIsPopupVisible}
          position={currentNode?.position || { x: 0, y: 0 }}
          parentType={currentNode?.type || ""}
        />
      )}
    </div>
  );
};
export const DefaultBotResponseNode = ({
  data,
}: {
  data: {
    label: string;
    message?: string;
    isDelete: boolean;
  };
}) => {
  return (
    <div className="flex items-center gap-2">
      {data.message && (
        <span className="text-black text-xs opacity-70 w-[145px] text-center absolute -top-5 left-0">
          {data.message}
        </span>
      )}
      <BotResponseDialog
        trigger={
          <button>
            <NodeContainer
              nodeCss="bg-white  w-[145px]"
              shadow="0px 0px 12px 4px #00000014"
            >
              <IoIosSend className="text-black text-base " />
              <span className="text-black text-sm">{data.label}</span>
              <CustomHandle type="target" position={Position.Left} />
            </NodeContainer>
          </button>
        }
      />
    </div>
  );
};
export const AiAssistNode = ({
  data,
}: {
  data: { label: string; message: string; actionHandler: () => void };
}) => {
  return (
    <div className="relative flex gap-2 items-center ">
      {data.message && (
        <span className="text-black text-xs opacity-70 w-[145px] text-center absolute -top-5 left-0">
          {data.message}
        </span>
      )}
      <NodeContainer
        nodeCss="bg-[#1844F0] w-[145px] hover:cursor-not-allowed  "
        shadow="0px 0px 12px 4px #00000014"
      >
        <Image
          src="/images/Ai_assist.svg"
          alt="ai assistant logo"
          width={16}
          height={16}
          quality={100}
        />
        <span className="text-white text-sm ">{data.label}</span>
        <CustomHandle type="target" position={Position.Left} />
      </NodeContainer>
    </div>
  );
};

export const UserInputNode = ({
  data,
  id,
}: {
  data: { label: string; message: string; isDelete: boolean };
  id: string;
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { getEdges, getNodes } = useReactFlow();
  const { deleteNodeHandler } = usePlayground();
  const edges = getEdges();
  const outgoingEdge = edges.find((edge) => edge.source === id);
  const incomingEdge = edges.find((edge) => edge.target === id);
  const nodes = getNodes();
  const parentNode = nodes.find((node) => node.id === incomingEdge?.source);
  const currentNode = nodes.find((node) => node.id === id);
  return (
    <div className="relative group  flex items-center gap-2">
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {data.isDelete ? (
              <>
                <div className="text-red-500 text-xs w-14  hidden group-hover:block  text-center cursor-pointer absolute -top-[22px] left-0">
                  Delete
                </div>
                {data.message && (
                  <span className="text-black text-xs  opacity-70 block group-hover:hidden w-14  text-center absolute -top-6 left-0">
                    {data.message}
                  </span>
                )}
              </>
            ) : (
              data.message && (
                <span className="text-black text-xs  opacity-70  w-14  text-center absolute -top-6 left-0">
                  {data.message}
                </span>
              )
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-[63px] -ms-3 shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className={`${
                !outgoingEdge ? "text-red-500" : "text-red-100"
              } text-center text-xs ${
                !outgoingEdge ? "cursor-pointer" : "cursor-not-allowed"
              } `}
              onClick={() => {
                !outgoingEdge &&
                  deleteNodeHandler(
                    true,
                    parentNode?.id ?? "",
                    currentNode?.id ?? ""
                  );
              }}
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className={`${
                outgoingEdge ? "text-red-500" : "text-red-100"
              } text-center text-xs ${
                outgoingEdge ? "cursor-pointer" : "cursor-not-allowed"
              } `}
              onClick={() => {
                outgoingEdge &&
                  deleteNodeHandler(
                    false,
                    parentNode?.id ?? "",
                    currentNode?.id ?? ""
                  );
              }}
            >
              Delete with children
            </span>
          </PopoverContent>
        </Popover>
        <UserInputDialog
          trigger={
            <div className="relative">
              <div
                className="relative flex items-center justify-center triangle_highlight w-12 h-12 bg-white border border-[#C9D3DE] rotate-45 mx-1 rounded-lg"
                style={{ boxShadow: "0px 0px 12px 4px #00000014" }}
              >
                <Image
                  src="/images/user_input.svg"
                  className="absolute  rotate-[-45deg] "
                  alt="user input logo"
                  width={20}
                  height={20}
                  quality={100}
                />
              </div>
              <CustomHandle type="target" position={Position.Left} />
              <CustomHandle type="source" position={Position.Right} />
            </div>
          }
        />
      </div>
      <IoMdAdd
        onClick={(e) => {
          e.stopPropagation();
          setIsPopupVisible((prev) => !prev);
        }}
        className="bg-[#fff] hover:text-[#1844F0] md:hidden md:group-hover:block rounded-full h-6 w-6 p-1 cursor-pointer "
        style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
      />

      {isPopupVisible && (
        <AddNodePopup
          parentId={id}
          isPopupVisible={isPopupVisible}
          setIsPopupVisible={setIsPopupVisible}
          position={currentNode?.position || { x: 0, y: 0 }}
          parentType={currentNode?.type || ""}
        />
      )}
    </div>
  );
};

export const QuestionNode = ({
  data,
  id,
}: {
  data: { label: string; message: string; isDelete: boolean };
  id: string;
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { getEdges, getNodes } = useReactFlow();
  const { deleteNodeHandler } = usePlayground();
  const edges = getEdges();
  const outgoingEdge = edges.find((edge) => edge.source === id);
  const incomingEdge = edges.find((edge) => edge.target === id);
  const nodes = getNodes();
  const parentNode = nodes.find((node) => node.id === incomingEdge?.source);
  const currentNode = nodes.find((node) => node.id === id);
  return (
    <div className="relative group flex items-center gap-2">
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {data.isDelete ? (
              <>
                <div className="text-red-500 text-xs hidden group-hover:block w-[145px] text-center cursor-pointer absolute -top-4 left-0">
                  Delete
                </div>
                {data.message && (
                  <span className="text-black text-xs block group-hover:hidden  opacity-70 w-[145px] text-center absolute -top-5 left-0">
                    {data.message}
                  </span>
                )}
              </>
            ) : (
              data.message && (
                <span className="text-black text-xs  opacity-70 w-[145px] text-center absolute -top-5 left-0">
                  {data.message}
                </span>
              )
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-14 -ms-3 shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className={`${
                !outgoingEdge ? "text-red-500" : "text-red-100"
              } text-center text-xs ${
                !outgoingEdge ? "cursor-pointer" : "cursor-not-allowed"
              } `}
              onClick={() => {
                !outgoingEdge &&
                  deleteNodeHandler(
                    true,
                    parentNode?.id ?? "",
                    currentNode?.id ?? ""
                  );
              }}
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className={`${
                outgoingEdge ? "text-red-500" : "text-red-100"
              } text-center text-xs ${
                outgoingEdge ? "cursor-pointer" : "cursor-not-allowed"
              } `}
              onClick={() => {
                outgoingEdge &&
                  deleteNodeHandler(
                    false,
                    parentNode?.id ?? "",
                    currentNode?.id ?? ""
                  );
              }}
            >
              Delete with children
            </span>
          </PopoverContent>
        </Popover>
        <NodeContainer
          nodeCss="bg-orange-400  w-[145px]"
          shadow="0px 0px 12px 4px #00000014"
        >
          <MdOutlineQuestionMark className="text-black text-base" />
          <span className="text-black text-sm">{data.label}</span>
          <CustomHandle type="target" position={Position.Left} />
          <CustomHandle type="source" position={Position.Right} />
        </NodeContainer>
      </div>

      <IoMdAdd
        onClick={(e) => {
          e.stopPropagation();
          setIsPopupVisible((prev) => !prev);
        }}
        className="bg-[#fff] hover:text-[#1844F0] md:hidden md:group-hover:block rounded-full h-6 w-6 p-1 cursor-pointer"
        style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
      />

      {isPopupVisible && (
        <AddNodePopup
          parentId={id}
          isPopupVisible={isPopupVisible}
          setIsPopupVisible={setIsPopupVisible}
          position={currentNode?.position || { x: 0, y: 0 }}
          parentType={currentNode?.type || ""}
        />
      )}
    </div>
  );
};
export const SuccessNode = ({
  data,
  id,
}: {
  data: { label: string; message: string; isDelete: boolean };
  id: string;
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { getEdges, getNodes } = useReactFlow();
  const { deleteNodeHandler } = usePlayground();
  const edges = getEdges();
  const outgoingEdge = edges.find((edge) => edge.source === id);
  const incomingEdge = edges.find((edge) => edge.target === id);
  const nodes = getNodes();
  const parentNode = nodes.find((node) => node.id === incomingEdge?.source);
  const currentNode = nodes.find((node) => node.id === id);
  return (
    <div className="relative group flex items-center gap-2">
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {data.isDelete ? (
              <>
                <div className="text-red-500 text-xs hidden group-hover:block  w-[145px] text-center cursor-pointer absolute -top-4 left-0">
                  Delete
                </div>
                {data.message && (
                  <span className="text-black text-xs block md:group-hover:hidden opacity-70 w-[145px] text-center absolute -top-5 left-0">
                    {data.message}
                  </span>
                )}
              </>
            ) : (
              data.message && (
                <span className="text-black text-xs  opacity-70 w-[145px] text-center absolute -top-5 left-0">
                  {data.message}
                </span>
              )
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-14 -ms-3 shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className={`${
                !outgoingEdge ? "text-red-500" : "text-red-100"
              } text-center text-xs ${
                !outgoingEdge ? "cursor-pointer" : "cursor-not-allowed"
              } `}
              onClick={() => {
                !outgoingEdge &&
                  deleteNodeHandler(
                    true,
                    parentNode?.id ?? "",
                    currentNode?.id ?? ""
                  );
              }}
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className={`${
                outgoingEdge ? "text-red-500" : "text-red-100"
              } text-center text-xs ${
                outgoingEdge ? "cursor-pointer" : "cursor-not-allowed"
              } `}
              onClick={() => {
                outgoingEdge &&
                  deleteNodeHandler(
                    false,
                    parentNode?.id ?? "",
                    currentNode?.id ?? ""
                  );
              }}
            >
              Delete with children
            </span>
          </PopoverContent>
        </Popover>
        <NodeContainer
          nodeCss="bg-orange-400 bg-white  w-[145px]"
          shadow="0px 0px 12px 4px #00000014"
        >
          <MdCheckCircle className="text-[green] text-base" />
          <span className="text-black text-sm">{data.label}</span>
          <CustomHandle type="target" position={Position.Left} />
          {/* <CustomHandle type="source" position={Position.Right} /> */}
        </NodeContainer>
      </div>

      <IoMdAdd
        onClick={(e) => {
          e.stopPropagation();
          setIsPopupVisible((prev) => !prev);
        }}
        className="bg-[#fff] hover:text-[#1844F0] md:hidden md:group-hover:block rounded-full h-6 w-6 p-1 cursor-pointer"
        style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
      />

      {isPopupVisible && (
        <AddNodePopup
          parentId={id}
          isPopupVisible={isPopupVisible}
          setIsPopupVisible={setIsPopupVisible}
          position={currentNode?.position || { x: 0, y: 0 }}
          parentType={currentNode?.type || ""}
        />
      )}
    </div>
  );
};
export const FailureNode = ({
  data,
  id,
}: {
  data: { label: string; message: string; isDelete: boolean };
  id: string;
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { getEdges, getNodes } = useReactFlow();
  const { deleteNodeHandler } = usePlayground();
  const edges = getEdges();
  const outgoingEdge = edges.find((edge) => edge.source === id);
  const incomingEdge = edges.find((edge) => edge.target === id);
  const nodes = getNodes();
  const parentNode = nodes.find((node) => node.id === incomingEdge?.source);
  const currentNode = nodes.find((node) => node.id === id);
  return (
    <div className="relative group flex items-center gap-2">
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {data.isDelete ? (
              <>
                <div className="text-red-500 hidden group-hover:block text-xs  w-[145px] text-center cursor-pointer absolute -top-4 left-0">
                  Delete
                </div>
                {data.message && (
                  <span className="text-black text-xs block md:group-hover:hidden  opacity-70 w-[145px] text-center absolute -top-5 left-0">
                    {data.message}
                  </span>
                )}
              </>
            ) : (
              data.message && (
                <span className="text-black text-xs  opacity-70 w-[145px] text-center absolute -top-5 left-0">
                  {data.message}
                </span>
              )
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-14 -ms-3 shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className={`${
                !outgoingEdge ? "text-red-500" : "text-red-100"
              } text-center text-xs ${
                !outgoingEdge ? "cursor-pointer" : "cursor-not-allowed"
              } `}
              onClick={() => {
                !outgoingEdge &&
                  deleteNodeHandler(
                    true,
                    parentNode?.id ?? "",
                    currentNode?.id ?? ""
                  );
              }}
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className={`${
                outgoingEdge ? "text-red-500" : "text-red-100"
              } text-center text-xs ${
                outgoingEdge ? "cursor-pointer" : "cursor-not-allowed"
              } `}
              onClick={() => {
                outgoingEdge &&
                  deleteNodeHandler(
                    false,
                    parentNode?.id ?? "",
                    currentNode?.id ?? ""
                  );
              }}
            >
              Delete with children
            </span>
          </PopoverContent>
        </Popover>
        <NodeContainer
          nodeCss="bg-white w-[145px]"
          shadow="0px 0px 12px 4px #00000014"
        >
          <MdCancel className="text-[red] text-base" />
          <span className="text-black text-sm">{data.label}</span>
          <CustomHandle type="target" position={Position.Left} />
          {/* <CustomHandle type="source" position={Position.Right} /> */}
        </NodeContainer>
      </div>

      <IoMdAdd
        onClick={(e) => {
          e.stopPropagation();
          setIsPopupVisible((prev) => !prev);
        }}
        className="bg-[#fff] md:hidden md:group-hover:block hover:text-[#1844F0] rounded-full h-6 w-6 p-1 cursor-pointer"
        style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
      />

      {isPopupVisible && (
        <AddNodePopup
          parentId={id}
          isPopupVisible={isPopupVisible}
          setIsPopupVisible={setIsPopupVisible}
          position={currentNode?.position || { x: 0, y: 0 }}
          parentType={currentNode?.type || ""}
        />
      )}
    </div>
  );
};
export const CloseChatNode = ({
  data,
  id,
}: {
  data: { label: string; message: string; isDelete: boolean };
  id: string;
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { getEdges, getNodes } = useReactFlow();
  const { deleteNodeHandler } = usePlayground();
  const edges = getEdges();
  const outgoingEdge = edges.find((edge) => edge.source === id);
  const incomingEdge = edges.find((edge) => edge.target === id);
  const nodes = getNodes();
  const parentNode = nodes.find((node) => node.id === incomingEdge?.source);
  const currentNode = nodes.find((node) => node.id === id);
  return (
    <div className="relative group flex items-center gap-2">
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {data.isDelete ? (
              <>
                <div className="text-red-500 text-xs hidden group-hover:block w-[130px] text-center cursor-pointer absolute -top-4 left-0">
                  Delete
                </div>
                {data.message && (
                  <span className="text-black text-xs block group-hover:hidden  opacity-70 w-[130px] text-center absolute -top-5 left-0">
                    {data.message}
                  </span>
                )}
              </>
            ) : (
              data.message && (
                <span className="text-black text-xs  opacity-70 w-[130px] text-center absolute -top-5 left-0">
                  {data.message}
                </span>
              )
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-14 -ms-3 shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className={`${
                !outgoingEdge ? "text-red-500" : "text-red-100"
              } text-center text-xs ${
                !outgoingEdge ? "cursor-pointer" : "cursor-not-allowed"
              } `}
              onClick={() => {
                !outgoingEdge &&
                  deleteNodeHandler(
                    true,
                    parentNode?.id ?? "",
                    currentNode?.id ?? ""
                  );
              }}
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className={`${
                outgoingEdge ? "text-red-500" : "text-red-100"
              } text-center text-xs ${
                outgoingEdge ? "cursor-pointer" : "cursor-not-allowed"
              } `}
              onClick={() => {
                outgoingEdge &&
                  deleteNodeHandler(
                    false,
                    parentNode?.id ?? "",
                    currentNode?.id ?? ""
                  );
              }}
            >
              Delete with children
            </span>
          </PopoverContent>
        </Popover>
        <NodeContainer
          nodeCss="bg-white  w-[145px]"
          shadow="0px 0px 12px 4px #00000014"
        >
          <Image
            src="/images/close_chat.svg"
            alt="close chat logo"
            width={20}
            height={20}
            quality={100}
          />
          <span className="text-black text-sm">{data.label}</span>
          <CustomHandle type="target" position={Position.Left} />
        </NodeContainer>
      </div>

      <IoMdAdd
        onClick={(e) => {
          e.stopPropagation();
          setIsPopupVisible((prev) => !prev);
        }}
        className="bg-[#fff] hover:text-[#1844F0] md:hidden md:group-hover:block rounded-full h-6 w-6 p-1 cursor-pointer"
        style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
      />

      {isPopupVisible && (
        <AddNodePopup
          parentId={id}
          isPopupVisible={isPopupVisible}
          setIsPopupVisible={setIsPopupVisible}
          position={currentNode?.position || { x: 0, y: 0 }}
          parentType={currentNode?.type || ""}
        />
      )}
    </div>
  );
};

export const FaqNode = ({
  data,
  id,
}: {
  data: { label: string; message: string; isDelete: boolean };
  id: string;
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { getEdges, getNodes } = useReactFlow();
  const { deleteNodeHandler } = usePlayground();
  const edges = getEdges();
  const outgoingEdge = edges.find((edge) => edge.source === id);
  const incomingEdge = edges.find((edge) => edge.target === id);
  const nodes = getNodes();
  const parentNode = nodes.find((node) => node.id === incomingEdge?.source);
  const currentNode = nodes.find((node) => node.id === id);
  return (
    <div className="relative group flex items-center gap-2">
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {data.isDelete ? (
              <>
                <div className="text-red-500 text-xs w-14 hidden group-hover:block   text-center cursor-pointer absolute -top-[22px] left-0">
                  Delete
                </div>
                <span className="text-black text-xs  opacity-70 block group-hover:hidden  w-14  text-center absolute -top-6 left-0">
                  {data.message}
                </span>
              </>
            ) : (
              data.message && (
                <span className="text-black text-xs  opacity-70  w-14  text-center absolute -top-6 left-0">
                  {data.message}
                </span>
              )
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-[63px] -ms-3 shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className={`${
                !outgoingEdge ? "text-red-500" : "text-red-100"
              } text-center text-xs ${
                !outgoingEdge ? "cursor-pointer" : "cursor-not-allowed"
              } `}
              onClick={() => {
                !outgoingEdge &&
                  deleteNodeHandler(
                    true,
                    parentNode?.id ?? "",
                    currentNode?.id ?? ""
                  );
              }}
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className={`${
                outgoingEdge ? "text-red-500" : "text-red-100"
              } text-center text-xs ${
                outgoingEdge ? "cursor-pointer" : "cursor-not-allowed"
              } `}
              onClick={() => {
                outgoingEdge &&
                  deleteNodeHandler(
                    false,
                    parentNode?.id ?? "",
                    currentNode?.id ?? ""
                  );
              }}
            >
              Delete with children
            </span>
          </PopoverContent>
        </Popover>
        <FAQDialog
          trigger={
            <div className="relative">
              <div
                className="relative flex items-center justify-center w-12 h-12  triangle_highlight bg-orange-400 rotate-45 mx-1 rounded-lg"
                style={{ boxShadow: "0px 0px 12px 4px #00000014" }}
              >
                <Image
                  src="/images/faq.svg"
                  className="absolute  rotate-[-45deg] "
                  alt="faq logo"
                  width={22}
                  height={22}
                  quality={100}
                />
              </div>
              {data.label === "faq" && <></>}
              <CustomHandle type="target" position={Position.Left} />
            </div>
          }
        />
      </div>
      <IoMdAdd
        onClick={(e) => {
          e.stopPropagation();
          setIsPopupVisible((prev) => !prev);
        }}
        className="bg-[#fff] hover:text-[#1844F0] md:hidden md:group-hover:block rounded-full h-6 w-6 p-1 cursor-pointer "
        style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
      />

      {isPopupVisible && (
        <AddNodePopup
          parentId={id}
          isPopupVisible={isPopupVisible}
          setIsPopupVisible={setIsPopupVisible}
          position={currentNode?.position || { x: 0, y: 0 }}
          parentType={currentNode?.type || ""}
        />
      )}
    </div>
  );
};

export const GoToStepNode = ({
  data,
  id,
}: {
  data: { label: string; message: string; isDelete: boolean };
  id: string;
}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const { getEdges, getNodes } = useReactFlow();
  const { deleteNodeHandler } = usePlayground();
  const edges = getEdges();
  const outgoingEdge = edges.find((edge) => edge.source === id);
  const incomingEdge = edges.find((edge) => edge.target === id);
  const nodes = getNodes();
  const parentNode = nodes.find((node) => node.id === incomingEdge?.source);
  const currentNode = nodes.find((node) => node.id === id);
  return (
    <div className="relative flex group items-center gap-2">
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {data.isDelete ? (
              <>
                <div className="text-red-500 text-xs hidden group-hover:block w-[145px] text-center cursor-pointer absolute -top-4 left-0">
                  Delete
                </div>
                {data.message && (
                  <span className="text-black text-xs block group-hover:hidden  opacity-70 w-[145px] text-center absolute -top-5 left-0">
                    {data.message}
                  </span>
                )}
              </>
            ) : (
              data.message && (
                <span className="text-black text-xs  opacity-70 w-[145px] text-center absolute -top-5 left-0">
                  {data.message}
                </span>
              )
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-14 -ms-3 shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className={`${
                !outgoingEdge ? "text-red-500" : "text-red-100"
              } text-center text-xs ${
                !outgoingEdge ? "cursor-pointer" : "cursor-not-allowed"
              } `}
              onClick={() => {
                !outgoingEdge &&
                  deleteNodeHandler(
                    true,
                    parentNode?.id ?? "",
                    currentNode?.id ?? ""
                  );
              }}
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className={`${
                outgoingEdge ? "text-red-500" : "text-red-100"
              } text-center text-xs ${
                outgoingEdge ? "cursor-pointer" : "cursor-not-allowed"
              } `}
              onClick={() => {
                outgoingEdge &&
                  deleteNodeHandler(
                    false,
                    parentNode?.id ?? "",
                    currentNode?.id ?? ""
                  );
              }}
            >
              Delete with children
            </span>
          </PopoverContent>
        </Popover>
        <GoToStepDialog
          trigger={
            <button>
              <NodeContainer
                nodeCss="bg-[#FFDC66]  w-[145px]"
                shadow="0px 0px 12px 4px #00000014"
              >
                <Image
                  src="/images/go_to_step.svg"
                  alt="go to step logo"
                  width={18}
                  height={18}
                  quality={100}
                />
                <span className="text-black text-sm">{data.label}</span>
                <CustomHandle type="target" position={Position.Left} />
              </NodeContainer>
            </button>
          }
        />
      </div>
      <IoMdAdd
        onClick={(e) => {
          e.stopPropagation();
          setIsPopupVisible((prev) => !prev);
        }}
        className="bg-[#fff] hover:text-[#1844F0] rounded-full md:hidden md:group-hover:block h-6 w-6 p-1 cursor-pointer"
        style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
      />
      {isPopupVisible && (
        <AddNodePopup
          parentId={id}
          isPopupVisible={isPopupVisible}
          setIsPopupVisible={setIsPopupVisible}
          position={currentNode?.position || { x: 0, y: 0 }}
          parentType={currentNode?.type || ""}
        />
      )}
    </div>
  );
};
