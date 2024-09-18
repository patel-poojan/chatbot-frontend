"use client";
import BDAQuestion from "@/app/components/BDAQuestion";
import ChooseIndustryTemplate from "@/app/components/ChooseIndustryTemplate";
import OuterTemplate from "@/app/components/OuterTemplete";
import React, { useState } from "react";

const Page = () => {
  const [step, setStep] = useState(0);
  const up = () => {
    setStep(step + 1);
  };
  const down = () => {
    setStep(step - 1);
  };
  return (
    <OuterTemplate>
      {step === 0 ? (
        <ChooseIndustryTemplate up={up} />
      ) : (
        <BDAQuestion up={up} down={down} />
      )}
    </OuterTemplate>
  );
};

export default Page;
