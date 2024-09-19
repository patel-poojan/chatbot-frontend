import ChatbotTrainTemplate from "@/app/components/ChatbotTrainTemplate";
import OuterTemplate from "@/app/components/OuterTemplate";
import React from "react";

const Page = () => {
  return (
    <OuterTemplate>
      <ChatbotTrainTemplate type="website"></ChatbotTrainTemplate>
    </OuterTemplate>
  );
};

export default Page;
