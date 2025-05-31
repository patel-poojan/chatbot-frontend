import { useReactFlow, Node } from '@xyflow/react';
import { useCallback } from 'react';

export const useWelcomeMessage = () => {
  const { getNodes } = useReactFlow();

  return useCallback(
    (node: Node): boolean => {
      if (!node) return false;

      const nodes = getNodes();
      const isFirstNode = nodes.length > 0 && nodes[0].id === node.id;

      const hasWelcomeMessage =
        typeof node.data?.message === 'string' &&
        node.data.message.toLowerCase().includes('welcome message');

      return isFirstNode || hasWelcomeMessage;
    },
    [getNodes]
  );
};
