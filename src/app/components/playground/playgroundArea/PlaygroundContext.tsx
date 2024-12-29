import { useDeleteNode } from '@/utils/playground-api';
import { usePathname } from 'next/navigation';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useMemo,
} from 'react';
import { toast } from 'sonner';
import { axiosError } from '@/types/axiosTypes';
import { TypePlaygroundNode } from '@/types/node';

interface PlaygroundContextType {
  type: string | null;
  label: string | null;
  setType: React.Dispatch<React.SetStateAction<string | null>>;
  setLabel: React.Dispatch<React.SetStateAction<string | null>>;
  reFetch: boolean;
  refetchHandler: () => void;
  notConnectableNode: string[];
  isPageLoader: boolean;
  setIsPageLoader: React.Dispatch<React.SetStateAction<boolean>>;
  deleteNodeHandler: (
    isSingleNode: boolean,
    parentNodeId: string,
    currentNodeId: string
  ) => void;
  listOfPlayGroundNode: TypePlaygroundNode[];
  setListOfPlayGroundNode: React.Dispatch<
    React.SetStateAction<TypePlaygroundNode[]>
  >;
}

const PlaygroundContext = createContext<PlaygroundContextType | undefined>(
  undefined
);

interface PlaygroundProviderProps {
  children: ReactNode;
}

export const PlaygroundProvider: React.FC<PlaygroundProviderProps> = ({
  children,
}) => {
  const [type, setType] = useState<string | null>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [reFetch, setRefetch] = useState(false);
  const [isPageLoader, setIsPageLoader] = useState(false);
  const [listOfPlayGroundNode, setListOfPlayGroundNode] = useState<
    TypePlaygroundNode[] | []
  >([]);
  const notConnectableNode = useMemo(
    () => [
      'aiAssistNode',
      'startNode',
      'defaultNode',
      'goToStepNode',
      'faqNode',
      'closeChatNode',
      'successNode',
      'failureNode',
      'defaultBotResponseNode',
    ],
    []
  );

  const refetchHandler = () => {
    setRefetch((prev) => !prev);
  };

  const pathname = usePathname();
  const chatbotId = pathname?.split('/').pop();
  const { mutate: onDeleteNode } = useDeleteNode({
    onSuccess(data) {
      setIsPageLoader(false);
      refetchHandler();
      toast.success(data?.message, {
        duration: 2000,
      });
    },

    onError(error: axiosError) {
      setIsPageLoader(false);
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'failed to delete node';
      toast.error(errorMessage);
    },
  });
  const deleteNodeHandler = (
    isSingleNode: boolean,
    parentNodeId: string,
    currentNodeId: string
  ) => {
    if (parentNodeId && currentNodeId && chatbotId) {
      setIsPageLoader(true);
      onDeleteNode({
        chatbotId,
        parentNodeId: parentNodeId,
        currentNodeId: currentNodeId,
        isSingleNode,
      });
    } else {
      toast.error('something went wrong');
    }
  };

  return (
    <PlaygroundContext.Provider
      value={{
        type,
        label,
        setType,
        setLabel,
        reFetch,
        refetchHandler,
        notConnectableNode,
        isPageLoader,
        setIsPageLoader,
        deleteNodeHandler,
        listOfPlayGroundNode,
        setListOfPlayGroundNode,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  );
};

export const usePlayground = (): PlaygroundContextType => {
  const context = useContext(PlaygroundContext);
  if (!context) {
    throw new Error('usePlayground must be used within a PlaygroundProvider');
  }
  return context;
};
