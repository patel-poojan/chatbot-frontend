import ChatbotTrainTemplate from "@/app/components/ChatbotTrainTemplate";
import OuterTemplate from "@/app/components/OuterTemplate";
import React from "react";

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <OuterTemplate>
      <ChatbotTrainTemplate
        type="website"
        botId={params.id}
      ></ChatbotTrainTemplate>
    </OuterTemplate>
  );
};

export default Page;
