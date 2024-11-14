import { BezierEdge, EdgeProps } from "@xyflow/react";
import React from "react";

const CustomEdge = (props: EdgeProps) => {
  return (
    <BezierEdge
      {...props}
      style={{
        stroke: "#C9D3DE",
        strokeWidth: 2,
      }}
    />
  );
};

export default CustomEdge;
