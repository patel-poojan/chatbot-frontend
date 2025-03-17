'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
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
  DefaultBotResponseNode,
} from '@/app/components/playground/playgroundArea/CustomNode';
import { Button } from '@/components/ui/button';
import { IoCode, IoFlashOutline, IoPersonCircleOutline } from 'react-icons/io5';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import ActionDialog from '@/app/components/playground/playgroundArea/ActionDialog';
import {
  PlaygroundProvider,
  usePlayground,
} from '@/app/components/playground/playgroundArea/PlaygroundContext';
import useWindowDimensions from '@/utils/windowSize';
import AIKnowledge from '@/app/components/playground/AIKnowladge';
import DashboardLayout from '@/app/components/DashboardLayout';
import CustomEdge from '@/app/components/playground/playgroundArea/CustomEdge';
import { axiosInstance } from '@/utils/axiosInstance';
import { useQuery } from '@tanstack/react-query';
import { Loader } from '@/app/components/Loader';
import { useAddNode } from '@/utils/playground-api';
import { toast } from 'sonner';
import { axiosError } from '@/types/axiosTypes';
import AttributesDialog from '@/app/components/playground/AttributesDialog';
import ChatBotDialog from '@/app/components/playground/chatbot/ChatBotDialog';
import { TypePlaygroundNode } from '@/types/node';
import PublishDialog from '@/app/components/playground/PublishDialog';
import ContactGatheringDialog from '@/app/components/playground/ContactGatheringDialog';
import Image from 'next/image';

const ReactFlow = dynamic(
  () => import('@xyflow/react').then((mod) => mod.ReactFlow),
  { ssr: false }
);
type FetchPlaygroundResponse = {
  statusCode: number;
  data: {
    _id: string;
    chatbotName: string;
    chatbotId: string;
    createdAt: string;
    updatedAt: string;
    diagram: {
      nodes: {
        id: string;
        type: string;
        data: { label: string; message: string; isDelete: boolean };
        position: { x: number; y: number };
      }[];
      edges: {
        id: string;
        source: string;
        target: string;
        type: string;
      }[];
    };
  };
  message: string;
  success: boolean;
};
const MainComponent = ({ botId }: { botId: string }) => {
  const fetchInitialPlayground = async () => {
    const response: FetchPlaygroundResponse = await axiosInstance.get(
      `/playground/${botId}`
    );
    if (response.success) {
      return response.data;
    }
  };
  const {
    data: playgroundData,
    isLoading: loadPlayground,
    isError: errorInPlayground,
    refetch: refetchPlayground,
  } = useQuery({
    queryKey: ['playGround'],
    queryFn: fetchInitialPlayground,
  });

  const {
    mutate: onAddNode,
    isPending: pendingAddNode,
    // data: updatedPlaygroundData,
  } = useAddNode({
    onSuccess(data) {
      const updatedPlaygroundData = data?.data;
      if (
        updatedPlaygroundData &&
        updatedPlaygroundData?.diagram &&
        updatedPlaygroundData?.diagram.nodes &&
        updatedPlaygroundData?.diagram.edges
      ) {
        const nnn = updatedPlaygroundData?.diagram.nodes;
        const eee = updatedPlaygroundData?.diagram.edges;

        const nodesss = nnn
          .map((node) => {
            if (node.id && node.type && node.position && node.data) {
              return {
                id: node.id,
                type: node.type,
                position: node.position,
                data: node.data,
              };
            }
            return null;
          })
          .filter((node) => node !== null);
        setNodes(nodesss);
        setEdges(eee);
      }

      toast.success(data?.message);
    },

    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'failed to add';
      toast.error(errorMessage);
    },
  });

  const [actionDialog, setActionDialog] = useState(false);
  const [aiSection, setAiSection] = useState(false);
  const [chatBotDialog, setChatBotDialog] = useState(false);
  const [attributesDialog, setAttributesDialog] = useState(false);
  const [contactGatheringEnabled, setContactGatheringEnabled] = useState(false);
  const { screenToFlowPosition } = useReactFlow();
  // const { type, label } = usePlayground();
  const {
    type,
    reFetch,
    notConnectableNode,
    isPageLoader,
    setListOfPlayGroundNode,
  } = usePlayground();
  const { width: screenWidth } = useWindowDimensions();
  const nodeTypes = useMemo(
    () => ({
      startNode: StartNode,
      defaultNode: DefaultNode,
      botResponseNode: BotResponseNode,
      aiAssistNode: AiAssistNode,
      closeChatNode: CloseChatNode,
      goToStepNode: GoToStepNode,
      faqNode: FaqNode,
      userInputNode: UserInputNode,
      questionNode: QuestionNode,
      successNode: SuccessNode,
      failureNode: FailureNode,
      defaultBotResponseNode: DefaultBotResponseNode,
    }),
    []
  );

  const edgeTypes = useMemo(() => ({ customEdge: CustomEdge }), []);

  const [nodes, setNodes, onNodesChange] = useNodesState([] as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([] as Edge[]);

  useEffect(() => {
    if (
      playgroundData &&
      playgroundData?.diagram &&
      playgroundData?.diagram.nodes &&
      playgroundData?.diagram.edges
    ) {
      const updatedNodes = playgroundData?.diagram.nodes;
      const updatedEdges = playgroundData?.diagram.edges;

      const nodesss = updatedNodes.map((node) => ({
        id: node.id,
        type: node.type,
        position: node.position,
        data: node.data,
      }));
      setNodes(nodesss);
      setEdges(updatedEdges);
    }
  }, [playgroundData, setEdges, setNodes]);

  useEffect(() => {
    if (nodes && nodes.length > 0) {
      const typedNodes = nodes.map((node) => ({
        id: node.id,
        type: node.type || '', // Provide default value for optional type
        data: node.data,
        position: node.position,
      })) as TypePlaygroundNode[];
      setListOfPlayGroundNode(typedNodes);
    }
  }, [nodes, setListOfPlayGroundNode]);

  useEffect(() => {
    refetchPlayground();
  }, [reFetch, refetchPlayground]);

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
          if (nodeType === 'faqNode' || nodeType === 'userInputNode') {
            nodeElement.classList.add('shape_highlight');
          } else {
            nodeElement.classList.add('highlight');
          }
        } else {
          nodeElement.classList.remove('shape_highlight');
          nodeElement.classList.remove('highlight');
          nodeElement.classList.remove('non-highlight');
          nodeElement.classList.remove('shape_non-highlight');
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
          if (nodeType === 'faqNode' || nodeType === 'userInputNode') {
            nodeElement.classList.add('shape_non-highlight');
          } else {
            nodeElement.classList.add('non-highlight');
          }
        } else {
          nodeElement.classList.remove('non-highlight');
          nodeElement.classList.remove('shape_non-highlight');
        }
      }
    },
    []
  );

  const onDragOver = useCallback(
    (event: React.DragEvent): void => {
      setActionDialog(false);
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      nodes.forEach((existingNode) => {
        const isNear = isNearRightEdge(position, existingNode);
        const hasSourceHandle = !notConnectableNode.includes(
          existingNode!.type || ''
        );

        if (hasSourceHandle) {
          if (
            existingNode &&
            existingNode !== null &&
            existingNode!.type &&
            (type === 'goToStepNode' ||
              type === 'faqNode' ||
              type === 'closeChatNode' ||
              type === 'userInputNode') &&
            existingNode!.type !== 'botResponseNode'
          ) {
            nonHighlightDroppableArea(
              existingNode.id || '',
              isNear,
              existingNode.type || ''
            );
          } else if (
            existingNode &&
            existingNode !== null &&
            type === 'questionNode' &&
            existingNode!.type !== 'botResponseNode' &&
            existingNode!.type !== 'userInputNode'
          ) {
            nonHighlightDroppableArea(
              existingNode.id || '',
              isNear,
              existingNode.type || ''
            );
          } else {
            highlightDroppableArea(
              existingNode.id || '',
              isNear && hasSourceHandle,
              existingNode.type || ''
            );
          }
        } else {
          nonHighlightDroppableArea(
            existingNode.id || '',
            isNear,
            existingNode.type || ''
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
          !notConnectableNode.includes(existingNode.type || '')
      );

      if (
        connectedNode &&
        connectedNode.type &&
        (((type === 'goToStepNode' ||
          type === 'faqNode' ||
          type === 'closeChatNode' ||
          type === 'userInputNode') &&
          connectedNode.type !== 'botResponseNode') ||
          (type === 'questionNode' &&
            connectedNode.type !== 'botResponseNode' &&
            connectedNode.type !== 'userInputNode'))
      ) {
        nodes.forEach((node) => highlightDroppableArea(node.id, false, ''));
        return;
      } else if (connectedNode) {
        const positionY = connectedNode?.position?.y ?? position.y;

        // const newNode: Node = {
        //   id: getId(),
        //   type,
        //   position: {
        //     x: position.x + 100,
        //     y: positionY,
        //   },
        //   data: { label, message: "" },
        // };
        onAddNode({
          chatbotId: botId,
          parentNodeId: connectedNode.id,
          details: {
            type,
            nodeData: {
              message: '',
              position: {
                x: position.x + 100,
                y:
                  type === 'userInputNode' || type === 'faqNode'
                    ? positionY - 7
                    : connectedNode.type === 'userInputNode' ||
                      connectedNode.type === 'faqNode'
                    ? positionY + 7
                    : positionY,
              },
            },
          },
        });

        // const overlappingNode = nodes.find((node) => {
        //   const distance = Math.hypot(
        //     node.position.x - newNode.position.x,
        //     node.position.y - newNode.position.y
        //   );
        //   return distance < 200;
        // });

        // if (overlappingNode) {
        //   newNode.position.x += 10;
        //   newNode.position.y += 100;
        // }

        // const newNodes = [newNode];

        // if (type === "questionNode") {
        //   const successNode: Node = {
        //     id: getId(),
        //     type: "successNode",
        //     position: { x: position.x + 300, y: positionY - 100 },
        //     data: { label: "Success", message: "" },
        //   };

        //   const failureNode: Node = {
        //     id: getId(),
        //     type: "failureNode",
        //     position: { x: position.x + 300, y: positionY + 100 },
        //     data: { label: "Failure", message: "" },
        //   };

        //   newNodes.push(successNode, failureNode);

        //   setEdges((eds) => [
        //     ...eds,
        //     {
        //       id: `${newNode.id}-${successNode.id}`,
        //       source: newNode.id,
        //       target: successNode.id,
        //       type: "customEdge",
        //     },
        //     {
        //       id: `edge-${newNode.id}-${failureNode.id}`,
        //       source: newNode.id,
        //       target: failureNode.id,
        //       type: "customEdge",
        //     },
        //   ]);
        // } else if (type === "userInputNode") {
        //   const botResponseNode: Node = {
        //     id: getId(),
        //     type: "botResponseNode",
        //     position: { x: position.x + 250, y: positionY },
        //     data: { label: "Bot Response", message: "" },
        //   };

        //   newNodes.push(botResponseNode);

        //   setEdges((eds) => [
        //     ...eds,
        //     {
        //       id: `${newNode.id}-${botResponseNode.id}`,
        //       source: newNode.id,
        //       target: botResponseNode.id,
        //       type: "customEdge",
        //     },
        //   ]);
        // }
        // setNodes((nds) => [...nds, ...newNodes]);

        // setEdges((eds) => [
        //   ...eds,
        //   {
        //     id: `${connectedNode.id}-${newNode.id}`,
        //     source: connectedNode.id,
        //     target: newNode.id,
        //     type: "customEdge",
        //   },
        // ]);
      }

      nodes.forEach((node) => highlightDroppableArea(node.id, false, ''));
    },
    [
      setActionDialog,
      type,
      screenToFlowPosition,
      nodes,
      isNearRightEdge,
      notConnectableNode,
      highlightDroppableArea,
      onAddNode,
      botId,
    ]
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((prevEdges) =>
        addEdge(
          {
            ...connection,
            id: `${prevEdges.length + 1}`,
            type: 'customEdge',
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
      setAttributesDialog(false);
      setContactGatheringEnabled(false);
    }
  };
  const actionHandler = () => {
    setChatBotDialog(false);
    setAttributesDialog(false);
    setContactGatheringEnabled(false);
    if (actionDialog) {
      setActionDialog(false);
    } else {
      setActionDialog(true);
    }
  };
  const attributesHandler = () => {
    setChatBotDialog(false);
    setActionDialog(false);
    setContactGatheringEnabled(false);
    if (attributesDialog) {
      setAttributesDialog(false);
    } else {
      setAttributesDialog(true);
    }
  };
  const contactGatheringHandler = () => {
    setChatBotDialog(false);
    setActionDialog(false);
    setAttributesDialog(false);
    if (contactGatheringEnabled) {
      setContactGatheringEnabled(false);
    } else {
      setContactGatheringEnabled(true);
    }
  };
  return (
    <DashboardLayout>
      {(loadPlayground || pendingAddNode || isPageLoader) && <Loader />}
      {aiSection ? (
        <div className='p-4 sm:p-6 flex flex-1 flex-col relative '>
          <AIKnowledge
            setAiSection={setAiSection}
            chatbotId={botId}
            chatbotName={playgroundData?.chatbotName ?? ''}
          />
        </div>
      ) : (
        <div className=' sm:p-6 flex flex-1 flex-col relative bg-[#F6F6F6]'>
          <div className='absolute top-6 flex items-center justify-normal gap-3 flex-wrap-reverse md:justify-between w-full left-0 px-6 z-10'>
            <div className=' flex items-center gap-3'>
              {playgroundData?.chatbotName ? (
                <div
                  className='p-3 h-9  flex items-center cursor-pointer justify-center rounded-lg bg-white'
                  style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
                >
                  {playgroundData?.chatbotName}
                </div>
              ) : null}

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className='py-2 px-3 h-9 flex items-center justify-center bg-white rounded-lg cursor-pointer'
                      style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
                      onClick={() => setAiSection(true)}
                    >
                      <Image
                        src='/images/vector.svg'
                        alt='AI'
                        width={17}
                        height={17}
                        priority
                        quality={100}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side='bottom'
                    align='center'
                    style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
                    className=' mt-1  p-1 bg-[#57C0DD] text-white !z-50'
                  >
                    AI knowledge
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className=' flex items-center gap-3'>
              <div
                className='flex items-center py-2 px-4 bg-white gap-3 rounded-lg'
                style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button>
                        <IoFlashOutline
                          className={`text-xl cursor-pointer ${
                            actionDialog ? 'text-[#57C0DD]' : ''
                          } `}
                          onClick={actionHandler}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side='bottom'
                      align='center'
                      style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
                      className=' mt-3 p-1 bg-[#57C0DD] text-white !z-50'
                    >
                      Action
                    </TooltipContent>
                  </Tooltip>

                  {/* <Tooltip>
                    <TooltipTrigger asChild>
                      <button>
                        <MdUpdate className='text-xl cursor-pointer' />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side='bottom'
                      align='center'
                      style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
                      className=' mt-3 p-1 bg-[#57C0DD] text-white !z-50'
                    >
                      Version History
                    </TooltipContent>
                  </Tooltip> */}

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={() => contactGatheringHandler()}>
                        <IoPersonCircleOutline
                          className={`text-xl cursor-pointer ${
                            contactGatheringEnabled ? 'text-[#57C0DD]' : ''
                          } `}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side='bottom'
                      align='center'
                      style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
                      className=' mt-3 p-1 bg-[#57C0DD] text-white !z-50'
                    >
                      Contact Gathering
                    </TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button onClick={() => attributesHandler()}>
                        <IoCode
                          className={`text-xl cursor-pointer ${
                            attributesDialog ? 'text-[#57C0DD]' : ''
                          } `}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side='bottom'
                      align='center'
                      style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
                      className=' mt-3 p-1 bg-[#57C0DD] text-white !z-50'
                    >
                      Attributes
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Button
                className={`p-3 border text-xs font-normal ${
                  chatBotDialog
                    ? 'border-[#57C0DD] text-[#57C0DD]'
                    : 'border-black text-black'
                } rounded-lg bg-white  hover:bg-transparent`}
                onClick={() => chatBotHandler()}
              >
                Test your bot
              </Button>
              <PublishDialog
                chatbotId={botId}
                trigger={
                  <Button className='py-3 px-5 bg-[#57C0DD] text-white rounded-lg hover:bg-[#57C0DD]'>
                    Publish
                  </Button>
                }
              />
            </div>
          </div>
          {errorInPlayground ? (
            <div className='text-[red] m-auto'>something went wrong</div>
          ) : (
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
              nodesDraggable={false}
              fitView={screenWidth < 768 ? true : false}
              defaultViewport={{ x: 0, y: 200, zoom: 1 }}
              className='bg-[#F6F6F6]'
              proOptions={{ hideAttribution: true }}
              minZoom={0.8}
              maxZoom={1.5}
              panOnScrollSpeed={0.5}
            >
              <Controls showFitView />
            </ReactFlow>
          )}
          {actionDialog && <ActionDialog actionHandler={actionHandler} />}
          {chatBotDialog && <ChatBotDialog chatBotHandler={chatBotHandler} />}
          {attributesDialog && (
            <AttributesDialog
              attributesHandler={attributesHandler}
              chatbotId={botId}
              attributeDialog={attributesDialog}
            />
          )}
          {contactGatheringEnabled && (
            <ContactGatheringDialog
              contactGatheringHandler={contactGatheringHandler}
              isOpen={contactGatheringEnabled}
              chatbotId={botId}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
};
export default function Main({ params }: { params: { id: string } }) {
  return (
    <ReactFlowProvider>
      <PlaygroundProvider>
        <MainComponent botId={params.id} />
      </PlaygroundProvider>
    </ReactFlowProvider>
  );
}
