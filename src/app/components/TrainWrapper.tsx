import useWindowDimensions from "@/utils/windowSize";
import React from "react";

const TrainWrapper = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const { width: screenWidth } = useWindowDimensions();
  const containerHeight =
    screenWidth > 768 ? "calc(100dvh - 248px)" : screenWidth > 640 ? "calc(100dvh - 206px)" : "calc(100dvh - 248px)";

  return (
    <div
      className="flex flex-col justify-between w-full overflow-hidden bg-white rounded-3xl p-4 sm:p-6 md:p-8 lg:px-12 lg:py-10"
      style={{
        boxShadow: "0px 0px 12px 4px #00000014",
        height: containerHeight,
      }}
    >
      <div className="w-full max-w-7xl flex-1 mx-auto h-auto flex flex-col overflow-hidden">{children}</div>
    </div>
  );
};

export default TrainWrapper;
