"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  Controls,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  useReactFlow,
  XYPosition,
  ReactFlowProvider,
} from "@xyflow/react";
import DashboardLayout from "../components/DashboardLayout";
import "@xyflow/react/dist/style.css";

import CustomEdge from "../components/playground/CustomEdge";
import {
  AiAssistNode,
  BotResponseNode,
  FailureNode,
  DefaultNode,
  FaqNode,
  GoToStepNode,
  QuestionNode,
  StartNode,
  SuccessNode,
  UserInputNode,
  CloseChatNode,
} from "../components/playground/CustomNode";
import { Button } from "@/components/ui/button";
import { IoCode, IoFlashOutline } from "react-icons/io5";
import { MdUpdate } from "react-icons/md";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ActionDialog from "../components/playground/ActionDialog";
import {
  PlaygroundProvider,
  usePlayground,
} from "../components/playground/PlaygroundContext";
import useWindowDimensions from "@/utils/windowSize";
import ChatBotDialog from "../components/playground/ChatBotDialog";

const ReactFlow = dynamic(
  () => import("@xyflow/react").then((mod) => mod.ReactFlow),
  { ssr: false }
);

const initialNodes: Node[] = [
  {
    id: "1",
    type: "startNode",
    data: { label: "Start Point", message: "" },
    position: { x: 10, y: 200 },
  },
  {
    id: "2",
    type: "defaultNode",
    data: { label: "Default Response", message: "" },
    position: { x: 230, y: 390 },
  },
  {
    id: "3",
    type: "botResponseNode",
    data: {
      label: "Bot Response",
      message: "Welcome message",
    },
    position: { x: 230, y: 10 },
  },
  {
    id: "4",
    type: "aiAssistNode",
    data: { label: "AI Assist", message: "Welcome message" },
    position: { x: 230, y: 200 },
  },
];
const initialEdges: Edge[] = [
  { id: "1-2", source: "1", target: "2", type: "customEdge" },
  { id: "1-3", source: "1", target: "3", type: "customEdge" },
  { id: "1-4", source: "1", target: "4", type: "customEdge" },
];

let idCounter = 5;
const getId = () => `${idCounter++}`;
const MainComponent = () => {
  const { actionDialog, actionHandler, setActionDialog } = usePlayground();
  const [chatBotDialog, setChatBotDialog] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  const { type, label } = usePlayground();
  const { width: screenWidth } = useWindowDimensions();
  const nodeTypes = useMemo(
    () => ({
      startNode: StartNode,
      defaultNode: DefaultNode,
      botResponseNode: BotResponseNode,
      aiAssistNode: AiAssistNode,
      // flowNode: FlowNode,
      closeChatNode: CloseChatNode,
      goToStepNode: GoToStepNode,
      faqNode: FaqNode,
      userInputNode: UserInputNode,
      questionNode: QuestionNode,
      successNode: SuccessNode,
      failureNode: FailureNode,
    }),
    []
  );

  const edgeTypes = useMemo(() => ({ customEdge: CustomEdge }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const SNAP_MARGIN = 70;
  const isNearRightEdge = useCallback(
    (position: XYPosition, node: Node): boolean => {
      const { x: nodeX, y: nodeY } = node.position;
      const nodeRightEdgeX = nodeX + (node?.measured?.width || 0);
      const isWithinXRange =
        position.x >= nodeRightEdgeX - SNAP_MARGIN &&
        position.x <= nodeRightEdgeX + SNAP_MARGIN;
      const isWithinYRange =
        position.y >= nodeY - SNAP_MARGIN &&
        position.y <= nodeY + (node?.measured?.height || SNAP_MARGIN);
      return isWithinXRange && isWithinYRange;
    },
    []
  );

  const highlightDroppableArea = useCallback(
    (nodeId: string, isHighlight: boolean, nodeType: string): void => {
      const nodeElement = document.querySelector(`[data-id="${nodeId}"]`);
      if (nodeElement) {
        if (isHighlight) {
          if (nodeType === "faqNode" || nodeType === "userInputNode") {
            nodeElement.classList.add("shape_highlight");
          } else {
            nodeElement.classList.add("highlight");
          }
        } else {
          nodeElement.classList.remove("shape_highlight");
          nodeElement.classList.remove("highlight");
          nodeElement.classList.remove("non-highlight");
          nodeElement.classList.remove("shape_non-highlight");
        }
      }
    },
    []
  );

  const nonHighlightDroppableArea = useCallback(
    (nodeId: string, isNonHighlight: boolean, nodeType: string): void => {
      const nodeElement = document.querySelector(`[data-id="${nodeId}"]`);
      if (nodeElement) {
        if (isNonHighlight) {
          if (nodeType === "faqNode" || nodeType === "userInputNode") {
            nodeElement.classList.add("shape_non-highlight");
          } else {
            nodeElement.classList.add("non-highlight");
          }
        } else {
          nodeElement.classList.remove("non-highlight");
          nodeElement.classList.remove("shape_non-highlight");
        }
      }
    },
    []
  );

  const notConnectableNode = useMemo(
    () => [
      "aiAssistNode",
      "startNode",
      "defaultNode",
      "goToStepNode",
      "faqNode",
      "closeChatNode",
      "successNode",
      "failureNode",
    ],
    []
  );

  const onDragOver = useCallback(
    (event: React.DragEvent): void => {
      setActionDialog(false);
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      nodes.forEach((existingNode) => {
        const isNear = isNearRightEdge(position, existingNode);
        const hasSourceHandle = !notConnectableNode.includes(
          existingNode.type || ""
        );

        if (hasSourceHandle) {
          if (
            existingNode &&
            existingNode !== null &&
            existingNode!.type &&
            (type === "goToStepNode" ||
              type === "faqNode" ||
              type === "closeChatNode" ||
              type === "userInputNode") &&
            existingNode!.type !== "botResponseNode"
          ) {
            nonHighlightDroppableArea(
              existingNode.id || "",
              isNear,
              existingNode.type || ""
            );
          } else if (
            existingNode &&
            existingNode !== null &&
            type === "questionNode" &&
            existingNode!.type !== "botResponseNode" &&
            existingNode!.type !== "userInputNode"
          ) {
            nonHighlightDroppableArea(
              existingNode.id || "",
              isNear,
              existingNode.type || ""
            );
          } else {
            highlightDroppableArea(
              existingNode.id || "",
              isNear && hasSourceHandle,
              existingNode.type || ""
            );
          }
        } else {
          nonHighlightDroppableArea(
            existingNode.id || "",
            isNear,
            existingNode.type || ""
          );
        }
      });
    },
    [
      setActionDialog,
      screenToFlowPosition,
      nodes,
      isNearRightEdge,
      notConnectableNode,
      type,
      highlightDroppableArea,
      nonHighlightDroppableArea,
    ]
  );

  const onDrop = useCallback(
    (event: React.DragEvent): void => {
      setActionDialog(true);
      event.preventDefault();
      if (!type) return;
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const connectedNode = nodes.find(
        (existingNode) =>
          isNearRightEdge(position, existingNode) &&
          !notConnectableNode.includes(existingNode.type || "")
      );

      if (
        connectedNode &&
        connectedNode.type &&
        (((type === "goToStepNode" ||
          type === "faqNode" ||
          type === "closeChatNode" ||
          type === "userInputNode") &&
          connectedNode.type !== "botResponseNode") ||
          (type === "questionNode" &&
            connectedNode.type !== "botResponseNode" &&
            connectedNode.type !== "userInputNode"))
      ) {
        nodes.forEach((node) => highlightDroppableArea(node.id, false, ""));
        return;
      }
      if (connectedNode) {
        const positionY = connectedNode?.position?.y ?? position.y;

        const newNode: Node = {
          id: getId(),
          type,
          position: {
            x: position.x + 100,
            y: positionY,
          },
          data: { label, message: "" },
        };
        const overlappingNode = nodes.find((node) => {
          const distance = Math.hypot(
            node.position.x - newNode.position.x,
            node.position.y - newNode.position.y
          );
          return distance < 200;
        });

        if (overlappingNode) {
          newNode.position.x += 10;
          newNode.position.y += 100;
        }

        const newNodes = [newNode];

        if (type === "questionNode") {
          const successNode: Node = {
            id: getId(),
            type: "successNode",
            position: { x: position.x + 300, y: positionY - 100 },
            data: { label: "Success", message: "" },
          };

          const failureNode: Node = {
            id: getId(),
            type: "failureNode",
            position: { x: position.x + 300, y: positionY + 100 },
            data: { label: "Failure", message: "" },
          };

          newNodes.push(successNode, failureNode);

          setEdges((eds) => [
            ...eds,
            {
              id: `edge-${newNode.id}-${successNode.id}`,
              source: newNode.id,
              target: successNode.id,
              type: "customEdge",
            },
            {
              id: `edge-${newNode.id}-${failureNode.id}`,
              source: newNode.id,
              target: failureNode.id,
              type: "customEdge",
            },
          ]);
        } else if (type === "userInputNode") {
          const botResponseNode: Node = {
            id: getId(),
            type: "botResponseNode",
            position: { x: position.x + 250, y: positionY },
            data: { label: "Bot Response", message: "" },
          };

          newNodes.push(botResponseNode);

          setEdges((eds) => [
            ...eds,
            {
              id: `edge-${newNode.id}-${botResponseNode.id}`,
              source: newNode.id,
              target: botResponseNode.id,
              type: "customEdge",
            },
          ]);
        }
        setNodes((nds) => [...nds, ...newNodes]);

        setEdges((eds) => [
          ...eds,
          {
            id: `edge-${connectedNode.id}-${newNode.id}`,
            source: connectedNode.id,
            target: newNode.id,
            type: "customEdge",
          },
        ]);
      }

      nodes.forEach((node) => highlightDroppableArea(node.id, false, ""));
    },
    [
      setActionDialog,
      type,
      screenToFlowPosition,
      nodes,
      isNearRightEdge,
      notConnectableNode,
      highlightDroppableArea,
      label,
      setNodes,
      setEdges,
    ]
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((prevEdges) =>
        addEdge(
          {
            ...connection,
            id: `edge-${prevEdges.length + 1}`,
            type: "customEdge",
          },
          prevEdges
        )
      ),
    [setEdges]
  );
  const chatBotHandler = () => {
    if (chatBotDialog) {
      setChatBotDialog(false);
    } else {
      setChatBotDialog(true);
      setActionDialog(false);
    }
  };
  useEffect(() => {
    if (actionDialog) {
      setChatBotDialog(false);
    }
  }, [actionDialog, chatBotDialog]);

  return (
    <DashboardLayout>
      <div className=" sm:p-6 flex flex-1 flex-col relative bg-[#F6F6F6]">
        <div className="absolute right-6 z-10 top-6 flex items-center gap-3">
          <div
            className="flex items-center py-2 px-4 bg-white gap-3 rounded-lg"
            style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button>
                    <IoFlashOutline
                      className={`text-xl cursor-pointer ${
                        actionDialog ? "text-[#57C0DD]" : ""
                      } `}
                      onClick={actionHandler}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="center"
                  style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
                  className=" mt-3 p-1 bg-[#57C0DD] text-white !z-50"
                >
                  Action
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button>
                    <MdUpdate className="text-xl cursor-pointer" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="center"
                  style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
                  className=" mt-3 p-1 bg-[#57C0DD] text-white !z-50"
                >
                  Version History
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button>
                    <IoCode className="text-xl cursor-pointer" />
                  </button>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  align="center"
                  style={{ boxShadow: "0px 0px 4px 0px #0000001F" }}
                  className=" mt-3 p-1 bg-[#57C0DD] text-white !z-50"
                >
                  Attributes
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button
            className={`p-3 border text-xs font-normal ${
              chatBotDialog
                ? "border-[#57C0DD] text-[#57C0DD]"
                : "border-black text-black"
            } rounded-lg bg-white  hover:bg-transparent`}
            onClick={() => chatBotHandler()}
          >
            Test your bot
          </Button>
          <Button className="py-3 px-5 bg-[#57C0DD] text-white rounded-lg hover:bg-[#57C0DD]">
            Publish
          </Button>
        </div>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          // nodesDraggable={false}
          fitView={screenWidth < 768 ? true : false}
          defaultViewport={{ x: 0, y: 200, zoom: 1 }}
          className="bg-[#F6F6F6]"
        >
          <Controls showFitView />
        </ReactFlow>
        {actionDialog && <ActionDialog actionHandler={actionHandler} />}
        {chatBotDialog && <ChatBotDialog chatBotHandler={chatBotHandler} />}
      </div>
    </DashboardLayout>
  );
};
export default function Main() {
  return (
    <ReactFlowProvider>
      <PlaygroundProvider>
        <MainComponent />
      </PlaygroundProvider>
    </ReactFlowProvider>
  );
}

// const onDrop = useCallback(
//   (event: React.DragEvent): void => {
//     setActionDialog(true);
//     event.preventDefault();
//     if (!type) return;

//     const position = screenToFlowPosition({
//       x: event.clientX,
//       y: event.clientY,
//     });

//     let connectedNode: Node | null = null;

//     nodes.forEach((existingNode) => {
//       const isNear = isNearRightEdge(position, existingNode);
//       const hasSourceHandle = !notConnectableNode.includes(
//         existingNode.type || ""
//       );

//       if (isNear && hasSourceHandle) {
//         connectedNode = existingNode;
//       }
//     });

//     if (
//       connectedNode &&
//       (connectedNode as Node).type &&
//       (((type === "goToStepNode" ||
//         type === "faqNode" ||
//         type === "closeChatNode" ||
//         type === "userInputNode") &&
//         (connectedNode as Node).type !== "botResponseNode") ||
//         (type === "questionNode" &&
//           (connectedNode as Node).type !== "botResponseNode" &&
//           (connectedNode as Node).type !== "userInputNode"))
//     ) {
//       nodes.forEach((node) => highlightDroppableArea(node.id, false, ""));
//       return;
//     }

//     if (connectedNode) {
//       const positionY = (connectedNode as Node).position?.y ?? position.y;

//       const newNode: Node = {
//         id: getId(),
//         type,
//         position: {
//           x: position.x + 100,
//           y: positionY,
//         },
//         data: { label: label, message: "" },
//       };

//       const overlappingNode = nodes.find((node) => {
//         const distance = Math.sqrt(
//           Math.pow(node.position.x - newNode.position.x, 2) +
//             Math.pow(node.position.y - newNode.position.y, 2)
//         );
//         return distance < 200;
//       });

//       if (overlappingNode) {
//         newNode.position.x += 0;
//         newNode.position.y += 100;
//       }

//       setNodes((nds) => [...nds, newNode]);

//       if (type === "questionNode") {
//         const successNode: Node = {
//           id: getId(),
//           type: "successNode",
//           position: { x: position.x + 270, y: positionY - 100 },
//           data: { label: "Success", message: "" },
//         };

//         const failureNode: Node = {
//           id: getId(),
//           type: "failureNode",
//           position: { x: position.x + 270, y: positionY + 100 },
//           data: { label: "Failure", message: "" },
//         };

//         setNodes((nds) => [...nds, successNode, failureNode]);

//         setEdges((eds) => [
//           ...eds,
//           {
//             id: `edge-${newNode.id}-${successNode.id}`,
//             source: newNode.id,
//             target: successNode.id,
//             type: "customEdge",
//           },
//           {
//             id: `edge-${newNode.id}-${failureNode.id}`,
//             source: newNode.id,
//             target: failureNode.id,
//             type: "customEdge",
//           },
//         ]);
//       } else if (type === "userInputNode") {
//         const botResponseNode: Node = {
//           id: getId(),
//           type: "botResponseNode",
//           position: { x: position.x + 250, y: positionY },
//           data: { label: "Bot Response", message: "" },
//         };

//         setNodes((nds) => [...nds, botResponseNode]);

//         setEdges((eds) => [
//           ...eds,
//           {
//             id: `edge-${newNode.id}-${botResponseNode.id}`,
//             source: newNode.id,
//             target: botResponseNode.id,
//             type: "customEdge",
//           },
//         ]);
//       }

//       setEdges((eds) => [
//         ...eds,
//         {
//           id: `edge-${connectedNode?.id}-${newNode.id}`,
//           source: connectedNode?.id ?? "",
//           target: newNode.id,
//           type: "customEdge",
//         },
//       ]);
//     }

//     nodes.forEach((node) => highlightDroppableArea(node.id, false, ""));
//   },
//   [
//     setActionDialog,
//     type,
//     screenToFlowPosition,
//     label,
//     nodes,
//     isNearRightEdge,
//     notConnectableNode,
//     setNodes,
//     setEdges,
//     highlightDroppableArea,
//   ]
// );
