// import React, { useCallback } from "react";
// import { IoCloseOutline } from "react-icons/io5";
// import { usePlayground } from "./PlaygroundContext";
// import { IoIosSend } from "react-icons/io";
// import Image from "next/image";
// import { MdOutlineQuestionMark } from "react-icons/md";
// import { useReactFlow } from "@xyflow/react";

// const ActionDialogForMobile = ({
//   actionHandler,
// }: {
//   actionHandler: () => void;
// }) => {
//   const { connectedNodeId } = usePlayground();
//   const { screenToFlowPosition } = useReactFlow();
//   const onClick = useCallback(
//     (nodeType: string, label: string) => {
//       if (!nodeType) return;
//       //   const position = screenToFlowPosition({
//       //     x: event.clientX,
//       //     y: event.clientY,
//       //   });
//       const connectedNode = nodes.find(
//         (existingNode) =>
//           isNearRightEdge(position, existingNode) &&
//           !notConnectableNode.includes(existingNode.type || "")
//       );

//       if (
//         connectedNode &&
//         connectedNode.type &&
//         (((type === "goToStepNode" ||
//           type === "faqNode" ||
//           type === "closeChatNode" ||
//           type === "userInputNode") &&
//           connectedNode.type !== "botResponseNode") ||
//           (type === "questionNode" &&
//             connectedNode.type !== "botResponseNode" &&
//             connectedNode.type !== "userInputNode"))
//       ) {
//         nodes.forEach((node) => highlightDroppableArea(node.id, false, ""));
//         return;
//       }
//       if (connectedNode) {
//         const positionY = connectedNode?.position?.y ?? position.y;

//         const newNode: Node = {
//           id: getId(),
//           type,
//           position: {
//             x: position.x + 100,
//             y: positionY,
//           },
//           data: { label, message: "" },
//         };
//         const overlappingNode = nodes.find((node) => {
//           const distance = Math.hypot(
//             node.position.x - newNode.position.x,
//             node.position.y - newNode.position.y
//           );
//           return distance < 200;
//         });

//         if (overlappingNode) {
//           newNode.position.x += 10;
//           newNode.position.y += 100;
//         }

//         const newNodes = [newNode];

//         if (type === "questionNode") {
//           const successNode: Node = {
//             id: getId(),
//             type: "successNode",
//             position: { x: position.x + 270, y: positionY - 100 },
//             data: { label: "Success", message: "" },
//           };

//           const failureNode: Node = {
//             id: getId(),
//             type: "failureNode",
//             position: { x: position.x + 270, y: positionY + 100 },
//             data: { label: "Failure", message: "" },
//           };

//           newNodes.push(successNode, failureNode);

//           setEdges((eds) => [
//             ...eds,
//             {
//               id: `edge-${newNode.id}-${successNode.id}`,
//               source: newNode.id,
//               target: successNode.id,
//               type: "customEdge",
//             },
//             {
//               id: `edge-${newNode.id}-${failureNode.id}`,
//               source: newNode.id,
//               target: failureNode.id,
//               type: "customEdge",
//             },
//           ]);
//         } else if (type === "userInputNode") {
//           const botResponseNode: Node = {
//             id: getId(),
//             type: "botResponseNode",
//             position: { x: position.x + 250, y: positionY },
//             data: { label: "Bot Response", message: "" },
//           };

//           newNodes.push(botResponseNode);

//           setEdges((eds) => [
//             ...eds,
//             {
//               id: `edge-${newNode.id}-${botResponseNode.id}`,
//               source: newNode.id,
//               target: botResponseNode.id,
//               type: "customEdge",
//             },
//           ]);
//         }
//         setNodes((nds) => [...nds, ...newNodes]);

//         setEdges((eds) => [
//           ...eds,
//           {
//             id: `edge-${connectedNode.id}-${newNode.id}`,
//             source: connectedNode.id,
//             target: newNode.id,
//             type: "customEdge",
//           },
//         ]);
//       }

//       nodes.forEach((node) => highlightDroppableArea(node.id, false, ""));
//     },
//     [
//       setActionDialog,
//       type,
//       screenToFlowPosition,
//       label,
//       nodes,
//       isNearRightEdge,
//       notConnectableNode,
//       setNodes,
//       setEdges,
//       highlightDroppableArea,
//     ]
//   );

//   console.log("Id", connectedNodeId);
//   return (
//     <div
//       style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)" }}
//       className="absolute  bg-white px-5 min-[500px]:px-8 py-5  right-6 top-20 h-auto min-[500px]:w-[360px] rounded-lg flex flex-col gap-2"
//       aria-modal="true"
//       role="dialog"
//     >
//       <div className="flex items-center justify-between">
//         <h2 className="text-primary font-semibold text-xl">Interactions</h2>
//         <IoCloseOutline
//           className="text-2xl cursor-pointer "
//           onClick={() => actionHandler()}
//           aria-label="Close dialog"
//         />
//       </div>

//       <div className="grid grid-cols-2 gap-4 items-center">
//         <div
//           className="w-full cursor-pointer hover:bg-gray-100 h-full px-2 py-3 rounded-lg transition  flex flex-col items-center justify-center"
//           onClick={() => onClick("userInputNode", "User Input")}
//         >
//           <Image
//             src="/images/user_input.svg"
//             alt="User Input Icon"
//             width={28}
//             height={28}
//             quality={100}
//           />
//           <span className="text-black text-sm font-medium mt-1">
//             User Input
//           </span>
//         </div>

//         <div
//           className="w-full cursor-pointer hover:bg-gray-100 px-2 py-3 h-full rounded-lg transition  flex flex-col items-center justify-center"
//           onClick={() => onClick("botResponseNode", "Bot Response")}
//         >
//           <IoIosSend className="text-black text-3xl" />
//           <span className="text-black text-sm font-medium mt-1">
//             Bot Response
//           </span>
//         </div>
//       </div>

//       <h3 className="text-primary font-semibold text-xl">Action</h3>
//       <div className="grid grid-cols-2 gap-4 items-center">
//         <div
//           className="w-full cursor-pointer hover:bg-gray-100 px-2 py-3 h-full rounded-lg transition  flex flex-col items-center justify-center"
//           onClick={() => onClick("goToStepNode", "Go to step")}
//         >
//           <Image
//             src="/images/go_to_step.svg"
//             alt="go to step logo"
//             width={30}
//             height={30}
//             quality={100}
//           />
//           <span className="text-black text-sm font-medium mt-2">
//             Go To Step
//           </span>
//         </div>
//         <div
//           className="w-full cursor-pointer hover:bg-gray-100 px-2 py-3 rounded-lg transition  flex flex-col items-center justify-center"
//           onClick={() => onClick("faqNode", "FaQ")}
//         >
//           <Image
//             src="/images/faq.svg"
//             alt="faq logo"
//             width={30}
//             height={30}
//             quality={100}
//           />
//           <span className="text-black text-sm font-medium mt-1">FAQ</span>
//         </div>
//         <div
//           className="w-full cursor-pointer hover:bg-gray-100 px-2 py-3 rounded-lg transition  flex flex-col items-center justify-center"
//           onClick={() => onClick("questionNode", "Question")}
//         >
//           <MdOutlineQuestionMark className="text-black text-3xl" />
//           <span className="text-black text-sm font-medium mt-1">Question</span>
//         </div>
//         <div
//           className="w-full cursor-pointer hover:bg-gray-100 px-2 py-3 h-full rounded-lg transition  flex flex-col items-center justify-center"
//           onClick={() => onClick("closeChatNode", "Close Chat")}
//         >
//           <Image
//             src="/images/close_chat.svg"
//             alt="close chat logo"
//             width={28}
//             height={28}
//             quality={100}
//           />
//           <span className="text-black text-sm font-medium mt-1">
//             Close Chat
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ActionDialogForMobile;
