import { Position, useReactFlow } from "@xyflow/react";
import CustomHandle from "./CustomHandle";
import { GoHomeFill } from "react-icons/go";
import { IoIosSend, IoMdAdd } from "react-icons/io";
import { useCallback, useState } from "react";
import Image from "next/image";
import { usePlayground } from "./PlaygroundContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MdCancel, MdCheckCircle, MdOutlineQuestionMark } from "react-icons/md";

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
  const [isHovered, setIsHovered] = useState(false);
  const { actionHandler } = usePlayground();
  return (
    <div
      className="relative flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {data.message && (
        <span className="text-black text-xs opacity-70 w-[145px] text-center absolute -top-5 left-0">
          {data.message}
        </span>
      )}
      <NodeContainer
        nodeCss="bg-[#424D50] w-[145px] "
        shadow="0px 0px 12px 4px #00000014"
      >
        <GoHomeFill className="text-white text-base" />
        <span className="text-white text-sm">{data.label}</span>
        <CustomHandle type="source" position={Position.Right} />
      </NodeContainer>
      {isHovered && (
        <IoMdAdd
          className="bg-[#fff] rounded-full hover:text-[#1844F0] h-6 w-6 p-1 cursor-pointer"
          onClick={() => actionHandler()}
          style={{
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
          }}
        />
      )}
    </div>
  );
};

export const DefaultNode = ({
  data,
}: {
  data: { label: string; message: string; actionHandler: () => void };
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { actionHandler } = usePlayground();
  return (
    <div
      className="relative flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {data.message && (
        <span className="text-black text-xs opacity-70 w-[152px] text-center absolute -top-5 left-0">
          {data.message}
        </span>
      )}
      <NodeContainer
        nodeCss="bg-[#9CA3A5] text-white text-sm w-[152px]"
        shadow="0px 0px 12px 4px #00000014"
      >
        {data.label}
        <CustomHandle type="target" position={Position.Left} />
      </NodeContainer>
      {isHovered && (
        <IoMdAdd
          onClick={() => actionHandler()}
          className="bg-[#fff] rounded-full hover:text-[#1844F0] h-6 w-6 p-1 cursor-pointer"
          style={{
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
          }}
        />
      )}
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
    actionHandler: () => void;
  };
  id: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { actionHandler } = usePlayground();
  const { setNodes, setEdges, getEdges } = useReactFlow();
  const deleteNodeAndChildren = useCallback(
    (nodeId: string) => {
      const edges = getEdges();
      const childEdges = edges.filter((edge) => edge.source === nodeId);

      // Get the ids of the child nodes
      const childNodeIds = childEdges.map((edge) => edge.target);

      // Remove the child edges
      setEdges((prevEdges) =>
        prevEdges.filter((edge) => edge.source !== nodeId)
      );

      // Recursively delete all child nodes
      childNodeIds.forEach((childId) => deleteNodeAndChildren(childId));

      // Finally, remove this node

      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    },
    [getEdges, setEdges, setNodes]
  );
  return (
    <div
      className="flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {isHovered ? (
              <div className="text-red-500 text-xs w-[145px]  text-center cursor-pointer absolute -top-5 left-0">
                Delete
              </div>
            ) : (
              data.message && (
                <span className="text-black text-xs  opacity-70 w-[145px] text-center absolute -top-5 left-0">
                  {data.message}
                </span>
              )
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-[60px]  shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                setNodes((nodes) => nodes.filter((node) => node.id !== id));
              }}
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                deleteNodeAndChildren(id);
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
          <IoIosSend className="text-black text-base " />
          <span className="text-black text-sm">{data.label}</span>
          <CustomHandle type="target" position={Position.Left} />
          <CustomHandle type="source" position={Position.Right} />
        </NodeContainer>
      </div>

      {isHovered && (
        <IoMdAdd
          onClick={actionHandler}
          className="bg-white text-black hover:text-[#1844F0] rounded-full h-6 w-6 p-1 cursor-pointer"
          style={{
            boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)",
          }}
        />
      )}
    </div>
  );
};

export const AiAssistNode = ({
  data,
}: {
  data: { label: string; message: string; actionHandler: () => void };
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { actionHandler } = usePlayground();
  return (
    <div
      className="relative flex gap-2 items-center "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {data.message && (
        <span className="text-black text-xs opacity-70 w-[145px] text-center absolute -top-5 left-0">
          {data.message}
        </span>
      )}
      <NodeContainer
        nodeCss="bg-[#1844F0] w-[145px]  "
        shadow="0px 0px 12px 4px #00000014"
      >
        <Image
          src="/images/Ai_assist.svg"
          alt="ai assistant logo"
          width={16}
          height={16}
          quality={100}
        />
        <span className="text-white text-sm">{data.label}</span>
        <CustomHandle type="target" position={Position.Left} />
      </NodeContainer>
      {isHovered && (
        <IoMdAdd
          onClick={() => actionHandler()}
          className="bg-[#fff] hover:text-[#1844F0] rounded-full h-6 w-6 p-1 cursor-pointer"
          style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
        />
      )}
    </div>
  );
};

export const GoToStepNode = ({
  data,
  id,
}: {
  data: { label: string; message: string; actionHandler: () => void };
  id: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { setNodes, setEdges, getEdges } = useReactFlow();
  const deleteNodeAndChildren = useCallback(
    (nodeId: string) => {
      const edges = getEdges();
      const childEdges = edges.filter((edge) => edge.source === nodeId);

      // Get the ids of the child nodes
      const childNodeIds = childEdges.map((edge) => edge.target);

      // Remove the child edges
      setEdges((prevEdges) =>
        prevEdges.filter((edge) => edge.source !== nodeId)
      );

      // Recursively delete all child nodes
      childNodeIds.forEach((childId) => deleteNodeAndChildren(childId));

      // Finally, remove this node

      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    },
    [getEdges, setEdges, setNodes]
  );
  const { actionHandler } = usePlayground();
  return (
    <div
      className="relative flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {isHovered ? (
              <div className="text-red-500 text-xs  w-[145px] text-center cursor-pointer absolute -top-5 left-0">
                Delete
              </div>
            ) : (
              data.message && (
                <span className="text-black text-xs  opacity-70 w-[145px] text-center absolute -top-5 left-0">
                  {data.message}
                </span>
              )
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-[60px] -ms-3 shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                setNodes((nodes) => nodes.filter((node) => node.id !== id));
              }}
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                deleteNodeAndChildren(id);
              }}
            >
              Delete with children
            </span>
          </PopoverContent>
        </Popover>
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
      </div>
      {isHovered && (
        <IoMdAdd
          onClick={() => actionHandler()}
          className="bg-[#fff] hover:text-[#1844F0] rounded-full h-6 w-6 p-1 cursor-pointer"
          style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
        />
      )}
    </div>
  );
};

export const QuestionNode = ({
  data,
  id,
}: {
  data: { label: string; message: string; actionHandler: () => void };
  id: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { setNodes, setEdges, getEdges } = useReactFlow();
  const deleteNodeAndChildren = useCallback(
    (nodeId: string) => {
      const edges = getEdges();
      const childEdges = edges.filter((edge) => edge.source === nodeId);

      // Get the ids of the child nodes
      const childNodeIds = childEdges.map((edge) => edge.target);

      // Remove the child edges
      setEdges((prevEdges) =>
        prevEdges.filter((edge) => edge.source !== nodeId)
      );

      // Recursively delete all child nodes
      childNodeIds.forEach((childId) => deleteNodeAndChildren(childId));

      // Finally, remove this node

      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    },
    [getEdges, setEdges, setNodes]
  );
  const { actionHandler } = usePlayground();
  return (
    <div
      className="relative flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {isHovered ? (
              <div className="text-red-500 text-xs  w-[145px] text-center cursor-pointer absolute -top-[18px] left-0">
                Delete
              </div>
            ) : (
              data.message && (
                <span className="text-black text-xs  opacity-70 w-[145px] text-center absolute -top-[18px] left-0">
                  {data.message}
                </span>
              )
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-[58px] -ms-3 shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                setNodes((nodes) => nodes.filter((node) => node.id !== id));
              }}
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                deleteNodeAndChildren(id);
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
      {isHovered && (
        <IoMdAdd
          onClick={() => actionHandler()}
          className="bg-[#fff] hover:text-[#1844F0] rounded-full h-6 w-6 p-1 cursor-pointer"
          style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
        />
      )}
    </div>
  );
};
export const SuccessNode = ({
  data,
  id,
}: {
  data: { label: string; message: string; actionHandler: () => void };
  id: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { setNodes, setEdges, getEdges } = useReactFlow();
  const deleteNodeAndChildren = useCallback(
    (nodeId: string) => {
      const edges = getEdges();
      const childEdges = edges.filter((edge) => edge.source === nodeId);

      // Get the ids of the child nodes
      const childNodeIds = childEdges.map((edge) => edge.target);

      // Remove the child edges
      setEdges((prevEdges) =>
        prevEdges.filter((edge) => edge.source !== nodeId)
      );

      // Recursively delete all child nodes
      childNodeIds.forEach((childId) => deleteNodeAndChildren(childId));

      // Finally, remove this node

      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    },
    [getEdges, setEdges, setNodes]
  );
  const { actionHandler } = usePlayground();
  return (
    <div
      className="relative flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {isHovered ? (
              <div className="text-red-500 text-xs  w-[145px] text-center cursor-pointer absolute -top-5 left-0">
                Delete
              </div>
            ) : (
              data.message && (
                <span className="text-black text-xs  opacity-70 w-[145px] text-center absolute -top-5 left-0">
                  {data.message}
                </span>
              )
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-[60px] -ms-3 shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                setNodes((nodes) => nodes.filter((node) => node.id !== id));
              }}
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                deleteNodeAndChildren(id);
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
          <CustomHandle type="source" position={Position.Right} />
        </NodeContainer>
      </div>
      {isHovered && (
        <IoMdAdd
          onClick={() => actionHandler()}
          className="bg-[#fff] hover:text-[#1844F0] rounded-full h-6 w-6 p-1 cursor-pointer"
          style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
        />
      )}
    </div>
  );
};
export const FailureNode = ({
  data,
  id,
}: {
  data: { label: string; message: string; actionHandler: () => void };
  id: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { setNodes, setEdges, getEdges } = useReactFlow();
  const deleteNodeAndChildren = useCallback(
    (nodeId: string) => {
      const edges = getEdges();
      const childEdges = edges.filter((edge) => edge.source === nodeId);

      // Get the ids of the child nodes
      const childNodeIds = childEdges.map((edge) => edge.target);

      // Remove the child edges
      setEdges((prevEdges) =>
        prevEdges.filter((edge) => edge.source !== nodeId)
      );

      // Recursively delete all child nodes
      childNodeIds.forEach((childId) => deleteNodeAndChildren(childId));

      // Finally, remove this node

      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    },
    [getEdges, setEdges, setNodes]
  );
  const { actionHandler } = usePlayground();
  return (
    <div
      className="relative flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {isHovered ? (
              <div className="text-red-500 text-xs  w-[145px] text-center cursor-pointer absolute -top-5 left-0">
                Delete
              </div>
            ) : (
              data.message && (
                <span className="text-black text-xs  opacity-70 w-[145px] text-center absolute -top-5 left-0">
                  {data.message}
                </span>
              )
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-[60px] -ms-3 shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                setNodes((nodes) => nodes.filter((node) => node.id !== id));
              }}
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                deleteNodeAndChildren(id);
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
          <CustomHandle type="source" position={Position.Right} />
        </NodeContainer>
      </div>
      {isHovered && (
        <IoMdAdd
          onClick={() => actionHandler()}
          className="bg-[#fff] hover:text-[#1844F0] rounded-full h-6 w-6 p-1 cursor-pointer"
          style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
        />
      )}
    </div>
  );
};
export const CloseChatNode = ({
  data,
  id,
}: {
  data: { label: string; message: string; actionHandler: () => void };
  id: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { setNodes, setEdges, getEdges } = useReactFlow();
  const deleteNodeAndChildren = useCallback(
    (nodeId: string) => {
      const edges = getEdges();
      const childEdges = edges.filter((edge) => edge.source === nodeId);

      // Get the ids of the child nodes
      const childNodeIds = childEdges.map((edge) => edge.target);

      // Remove the child edges
      setEdges((prevEdges) =>
        prevEdges.filter((edge) => edge.source !== nodeId)
      );

      // Recursively delete all child nodes
      childNodeIds.forEach((childId) => deleteNodeAndChildren(childId));

      // Finally, remove this node

      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    },
    [getEdges, setEdges, setNodes]
  );
  const { actionHandler } = usePlayground();
  return (
    <div
      className="relative flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {isHovered ? (
              <div className="text-red-500 text-xs  w-[130px] text-center cursor-pointer absolute -top-5 left-0">
                Delete
              </div>
            ) : (
              data.message && (
                <span className="text-black text-xs  opacity-70 w-[130px] text-center absolute -top-5 left-0">
                  {data.message}
                </span>
              )
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-[60px] -ms-3 shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                setNodes((nodes) => nodes.filter((node) => node.id !== id));
              }}
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                deleteNodeAndChildren(id);
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
      {isHovered && (
        <IoMdAdd
          onClick={() => actionHandler()}
          className="bg-[#fff] hover:text-[#1844F0] rounded-full h-6 w-6 p-1 cursor-pointer"
          style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
        />
      )}
    </div>
  );
};

export const FaqNode = ({
  data,
  id,
}: {
  data: { label: string; message: string; actionHandler: () => void };
  id: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { actionHandler } = usePlayground();
  const { setNodes, setEdges, getEdges } = useReactFlow();
  const deleteNodeAndChildren = useCallback(
    (nodeId: string) => {
      const edges = getEdges();
      const childEdges = edges.filter((edge) => edge.source === nodeId);

      // Get the ids of the child nodes
      const childNodeIds = childEdges.map((edge) => edge.target);

      // Remove the child edges
      setEdges((prevEdges) =>
        prevEdges.filter((edge) => edge.source !== nodeId)
      );

      // Recursively delete all child nodes
      childNodeIds.forEach((childId) => deleteNodeAndChildren(childId));

      // Finally, remove this node

      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    },
    [getEdges, setEdges, setNodes]
  );
  return (
    <div
      className="relative flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {isHovered ? (
              <div className="text-red-500 text-xs w-14   text-center cursor-pointer absolute -top-6 left-0">
                Delete
              </div>
            ) : (
              data.message && (
                <span className="text-black text-xs  opacity-70  w-14  text-center absolute -top-6 left-0">
                  {data.message}
                </span>
              )
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-[68px] -ms-3 shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                setNodes((nodes) => nodes.filter((node) => node.id !== id));
              }}
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                deleteNodeAndChildren(id);
              }}
            >
              Delete with children
            </span>
          </PopoverContent>
        </Popover>
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
      </div>
      {isHovered ? (
        <IoMdAdd
          onClick={() => actionHandler()}
          className="bg-[#fff] hover:text-[#1844F0] rounded-full h-6 w-6 p-1 cursor-pointer "
          style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export const UserInputNode = ({
  data,
  id,
}: {
  data: { label: string; message: string; actionHandler: () => void };
  id: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { actionHandler } = usePlayground();
  const { setNodes, setEdges, getEdges } = useReactFlow();
  const deleteNodeAndChildren = useCallback(
    (nodeId: string) => {
      const edges = getEdges();
      const childEdges = edges.filter((edge) => edge.source === nodeId);

      // Get the ids of the child nodes
      const childNodeIds = childEdges.map((edge) => edge.target);

      // Remove the child edges
      setEdges((prevEdges) =>
        prevEdges.filter((edge) => edge.source !== nodeId)
      );

      // Recursively delete all child nodes
      childNodeIds.forEach((childId) => deleteNodeAndChildren(childId));

      // Finally, remove this node

      setNodes((nodes) => nodes.filter((node) => node.id !== nodeId));
    },
    [getEdges, setEdges, setNodes]
  );
  return (
    <div
      className="relative flex items-center gap-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <div className="relative flex  flex-col items-center justify-center">
        <Popover>
          <PopoverTrigger>
            {isHovered ? (
              <div className="text-red-500 text-xs w-14   text-center cursor-pointer absolute -top-6 left-0">
                Delete
              </div>
            ) : (
              data.message && (
                <span className="text-black text-xs  opacity-70  w-14  text-center absolute -top-6 left-0">
                  {data.message}
                </span>
              )
            )}
          </PopoverTrigger>
          <PopoverContent className="-mt-[68px] -ms-3 shadow-lg flex flex-col w-40 p-1 z-50 rounded-lg">
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                setNodes((nodes) => nodes.filter((node) => node.id !== id));
              }}
            >
              Delete single block
            </span>
            <div className="h-px bg-gray-300 my-1" />
            <span
              className="text-red-500 text-center text-xs cursor-pointer"
              onClick={() => {
                deleteNodeAndChildren(id);
              }}
            >
              Delete with children
            </span>
          </PopoverContent>
        </Popover>
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
      </div>
      {isHovered ? (
        <IoMdAdd
          onClick={() => actionHandler()}
          className="bg-[#fff] hover:text-[#1844F0] rounded-full h-6 w-6 p-1 cursor-pointer "
          style={{ boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.3)" }}
        />
      ) : (
        <></>
      )}
    </div>
  );
};
