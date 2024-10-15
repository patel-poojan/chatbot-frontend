import React, { createContext, useContext, useState, ReactNode } from "react";

interface PlaygroundContextType {
  type: string | null;
  label: string | null;
  setType: React.Dispatch<React.SetStateAction<string | null>>;
  setLabel: React.Dispatch<React.SetStateAction<string | null>>;
  actionDialog: boolean;
  setActionDialog: React.Dispatch<React.SetStateAction<boolean>>;
  actionHandler: () => void;
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
  const [actionDialog, setActionDialog] = useState(false);

  const actionHandler = () => {
    setActionDialog((prev) => !prev);
  };

  return (
    <PlaygroundContext.Provider
      value={{
        type,
        label,
        setType,
        setLabel,
        actionDialog,
        actionHandler,
        setActionDialog,
      }}
    >
      {children}
    </PlaygroundContext.Provider>
  );
};

export const usePlayground = (): PlaygroundContextType => {
  const context = useContext(PlaygroundContext);
  if (!context) {
    throw new Error("usePlayground must be used within a PlaygroundProvider");
  }
  return context;
};
