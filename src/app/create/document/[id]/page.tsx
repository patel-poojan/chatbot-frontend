"use client";
import BDAQuestion from "@/app/components/BDAQuestion";
import ChooseIndustryTemplate from "@/app/components/ChooseIndustryTemplate";
import OuterTemplate from "@/app/components/OuterTemplate";

import React, { useState } from "react";

const Page = ({ params }: { params: { id: string } }) => {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState<string>("");
  const [subIndustry, setSubIndustry] = useState<string>("");
  const up = () => {
    if (industry && subIndustry) {
      setStep(step + 1);
    }
  };
  const down = () => {
    setStep(step - 1);
  };
  return (
    <OuterTemplate>
      {step === 0 ? (
        <ChooseIndustryTemplate
          up={up}
          setIndustry={setIndustry}
          setSubIndustry={setSubIndustry}
        />
      ) : (
        <BDAQuestion
          down={down}
          type="document"
          industry={industry}
          subIndustry={subIndustry}
          chatBotId={params.id}
        />
      )}
    </OuterTemplate>
  );
};

export default Page;
