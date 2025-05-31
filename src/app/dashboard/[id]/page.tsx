'use client';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import UpdateChatbotDialog from '@/app/components/playground/UpdateChatbotDialog';
import { MdOutlineQuickreply } from 'react-icons/md';
import Link from 'next/link';

const ReactFlow = dynamic(
  () => import('@xyflow/react').then((mod) => mod.ReactFlow),
  { ssr: false }
);
type FetchPlaygroundResponse = {
  statusCode: number;
  data: {
    _id: string;
    chatbotName: string;
    chatbotIcon: {
      url: string;
      localPath: string;
    };
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
export interface Attribute {
  _id: string;
  chatbotId: string;
  name: string;
  alias: string;
  value: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}

interface FetchAttributesResponse {
  statusCode: number;
  data: Attribute[];
  message: string;
  success: boolean;
}
const MainComponent = ({ botId }: { botId: string }) => {
  const {
    type,
    reFetch,
    notConnectableNode,
    isPageLoader,
    setListOfPlayGroundNode,
    setAttributeState,
    reFetchAttributes,
  } = usePlayground();
  const hasFitViewCalled = useRef(false);
  const [isInteractive, setIsInteractive] = useState(true);
  const fetchInitialPlayground = async () => {
    const response: FetchPlaygroundResponse = await axiosInstance.get(
      `/playground/${botId}`
    );
    if (response.success) {
      console.log('hasFitViewCalled', hasFitViewCalled.current);
      if (!hasFitViewCalled.current) {
        console.log('fitView called');
        setTimeout(() => {
          fitView({
            maxZoom: 1,
          });
        }, 400);
        hasFitViewCalled.current = true;
      }

      return response.data;
    }
  };
  const {
    data: playgroundData,
    isLoading: loadPlayground,
    isError: errorInPlayground,
    refetch: refetchPlayground,
    isRefetching: isRefetchingPlayground,
  } = useQuery({
    queryKey: ['playGround', botId],
    queryFn: fetchInitialPlayground,
    staleTime: 5 * 60 * 1000, // 5 minutes
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

      toast.success('Node updated successfully');
    },

    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'failed to add';
      toast.error(errorMessage);
    },
  });

  const fetchAttributesHandler = async () => {
    const response: FetchAttributesResponse = await axiosInstance.get(
      `/chatbot/${botId}/attributes`
    );
    if (response.success) {
      return response.data;
    } else {
      return [];
    }
  };

  const {
    data: attributesData,
    isLoading: loadFetchAttributes,
    isRefetching: refetchingAttributes,
    isError: errorInFetchAttributes,
    refetch: refetchPlaygroundAttributes,
  } = useQuery({
    queryKey: ['Attributes'],
    queryFn: fetchAttributesHandler,
    // enabled: attributeDialog === true ? true : false,
  });
  useEffect(() => {
    if (attributesData && attributesData.length > 0) {
      setAttributeState({
        attributesData: attributesData,
        attributesError: false,
        attributesLoading: loadFetchAttributes || refetchingAttributes,
      });
    } else {
      setAttributeState({
        attributesData: [],
        attributesError: false,
        attributesLoading: loadFetchAttributes || refetchingAttributes,
      });
    }
  }, [
    attributesData,
    loadFetchAttributes,
    setAttributeState,
    refetchingAttributes,
  ]);
  useEffect(() => {
    refetchPlaygroundAttributes();
  }, [reFetchAttributes, refetchPlaygroundAttributes]);
  useEffect(() => {
    if (errorInFetchAttributes) {
      setAttributeState({
        attributesData: [],
        attributesError: true,
        attributesLoading: false,
      });
      toast.error('Failed to fetch attributes');
    }
  }, [errorInFetchAttributes, setAttributeState]);

  const [actionDialog, setActionDialog] = useState(false);
  const [aiSection, setAiSection] = useState(false);
  const [chatBotDialog, setChatBotDialog] = useState(false);
  const [attributesDialog, setAttributesDialog] = useState(false);
  const [updateChatbotDialog, setUpdateChatbotDialog] = useState(false);
  const [contactGatheringEnabled, setContactGatheringEnabled] = useState(false);
  const { screenToFlowPosition, fitView } = useReactFlow();
  // const { type, label } = usePlayground();

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

      // // Only call fitView on initial load, not on refetch
      // if (!isRefetchingPlayground) {
      //   setTimeout(() => {
      //     fitView();
      //   }, 100);
      // }
    }
  }, [playgroundData, setEdges, setNodes, fitView, isRefetchingPlayground]);

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

  const isWelcomeMessage = useCallback(
    (node: Node): boolean => {
      // Check if it's the first node (nodes[0])
      const isFirstNode = nodes.length > 0 && nodes[1].id === node.id;
      console.log(
        '🚀 ~ file: page.tsx:429 ~ isWelcomeMessage ~ isFirstNode',
        isFirstNode
      );
      // Check if message contains "Welcome message" (case insensitive)
      const hasWelcomeMessage =
        typeof node.data?.message === 'string' &&
        node.data.message.toLowerCase().includes('welcome message');
      return isFirstNode && hasWelcomeMessage;
    },
    [nodes]
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
          // NEW: Check if it's a welcome message node
          if (
            existingNode.type === 'botResponseNode' &&
            isWelcomeMessage(existingNode)
          ) {
            // For welcome message nodes, only allow userInputNode
            if (type === 'userInputNode') {
              highlightDroppableArea(
                existingNode.id || '',
                isNear,
                existingNode.type || ''
              );
            } else {
              nonHighlightDroppableArea(
                existingNode.id || '',
                isNear,
                existingNode.type || ''
              );
            }
          }
          // Existing validation logic for other nodes
          else if (
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
      isWelcomeMessage, // Add this dependency
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
        // NEW: Welcome message validation - only allow userInputNode after welcome message
        ((connectedNode.type === 'botResponseNode' &&
          isWelcomeMessage(connectedNode) &&
          type !== 'userInputNode') ||
          // Existing validation logic
          ((type === 'goToStepNode' ||
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
      isWelcomeMessage, // Add this dependency
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
      setUpdateChatbotDialog(false);
    }
  };
  const actionHandler = () => {
    setChatBotDialog(false);
    setAttributesDialog(false);
    setContactGatheringEnabled(false);
    setUpdateChatbotDialog(false);
    if (actionDialog) {
      setActionDialog(false);
    } else {
      setActionDialog(true);
    }
  };
  const updateHandler = () => {
    setChatBotDialog(false);
    setAttributesDialog(false);
    setContactGatheringEnabled(false);
    setActionDialog(false);
    if (updateChatbotDialog) {
      setUpdateChatbotDialog(false);
    } else {
      setUpdateChatbotDialog(true);
    }
  };
  const attributesHandler = () => {
    setChatBotDialog(false);
    setActionDialog(false);
    setContactGatheringEnabled(false);
    setUpdateChatbotDialog(false);
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
    setUpdateChatbotDialog(false);
    if (contactGatheringEnabled) {
      setContactGatheringEnabled(false);
    } else {
      setContactGatheringEnabled(true);
    }
  };
  console.log('nodes', nodes);
  return (
    <DashboardLayout>
      {(loadPlayground ||
        pendingAddNode ||
        isPageLoader ||
        isRefetchingPlayground) && <Loader />}
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
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className='p-3 h-9  flex items-center cursor-pointer  justify-center rounded-lg bg-white'
                        style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
                        onClick={() => updateHandler()}
                      >
                        {playgroundData?.chatbotName}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      side='bottom'
                      align='center'
                      style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
                      className=' mt-1  p-1 bg-[#57C0DD] text-white !z-50'
                    >
                      ChatAgent Info
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={`/training/${botId}`}>
                      <div
                        className='py-2 px-3 h-9 flex items-center justify-center bg-white rounded-lg cursor-pointer'
                        style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
                      >
                        <MdOutlineQuickreply
                          className={`text-xl cursor-pointer `}
                        />
                      </div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent
                    side='bottom'
                    align='center'
                    style={{ boxShadow: '0px 0px 4px 0px #0000001F' }}
                    className=' mt-1  p-1 bg-[#57C0DD] text-white !z-50'
                  >
                    Training
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
              fitView={true}
              defaultViewport={{ x: 0, y: 200, zoom: 1 }}
              onInit={(instance) => {
                setTimeout(() => {
                  instance.fitView({
                    maxZoom: 1,
                  });
                }, 0);
              }}
              className='bg-[#F6F6F6]'
              proOptions={{ hideAttribution: true }}
              minZoom={0.1}
              maxZoom={1.5}
              panOnScrollSpeed={0.5}
              nodesDraggable={isInteractive}
              nodesConnectable={isInteractive}
              elementsSelectable={isInteractive}
              panOnDrag={isInteractive}
              zoomOnScroll={isInteractive}
              zoomOnPinch={isInteractive}
              zoomOnDoubleClick={isInteractive}
              panOnScroll={isInteractive}
              preventScrolling={!isInteractive}
              nodesFocusable={isInteractive}
              edgesFocusable={isInteractive}
              draggable={isInteractive}
            >
              <Controls
                showZoom={true}
                showFitView={true}
                showInteractive={true}
                onInteractiveChange={setIsInteractive}
              />
            </ReactFlow>
          )}
          {updateChatbotDialog && (
            <UpdateChatbotDialog
              updateHandler={updateHandler}
              isOpen={updateChatbotDialog}
              chatbotName={playgroundData?.chatbotName ?? ''}
              botIcon={playgroundData?.chatbotIcon?.url ?? ''}
              chatbotId={botId}
              refetchPlayground={refetchPlayground}
            />
          )}
          {actionDialog && <ActionDialog actionHandler={actionHandler} />}
          {chatBotDialog && (
            <ChatBotDialog
              chatBotHandler={chatBotHandler}
              chatbotName={playgroundData?.chatbotName ?? ''}
              botIcon={playgroundData?.chatbotIcon?.url ?? ''}
            />
          )}
          {attributesDialog && (
            <AttributesDialog
              attributesHandler={attributesHandler}
              chatbotId={botId}
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
