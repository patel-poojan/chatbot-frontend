import { Handle, HandleProps } from "@xyflow/react";
import React from "react";

const CustomHandle = (props: HandleProps) => {
  return (
    <Handle
      style={{
        height: "10px",
        width: "10px",
        background: "transparent",
        border: "0px",
      }}
      isConnectable={false}
      {...props}
    />
  );
};

export default CustomHandle;
