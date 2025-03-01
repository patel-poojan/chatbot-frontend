"use client";
import BDAQuestion from "@/app/components/BDAQuestion";
import ChooseIndustryTemplate from "@/app/components/ChooseIndustryTemplate";
import { Loader } from "@/app/components/Loader";
import OuterTemplate from "@/app/components/OuterTemplate";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface IQuestionData {
  question: string;
  answer: string;
}

type FetchBDAQuestionListResponse = {
  message: string;
  statusCode: number;
  success: boolean;
  data: {
    category: string;
    subcategory: string;
    data: { question: string; answer: string }[];
  };
};

const Page = ({ params }: { params: { id: string } }) => {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState<string>("");
  const [subIndustry, setSubIndustry] = useState<string>("");
  const [haveData, setHaveData] = useState(true);
  const [changed, setChanged] = useState(false);
  const [quesstionData, setQuesstionData] = useState<IQuestionData[]>([]);

  const up = () => {
    setStep(step + 1);
  };
  const down = () => {
    setStep(step - 1);
  };

  const fetchSubmitedQuestion = async () => {
    const response: FetchBDAQuestionListResponse = await axiosInstance.get(`/bda/retrieve-data/${params.id}`);
    if (response?.statusCode === 200) {
      setHaveData(true);
      setIndustry(response.data.category);
      setSubIndustry(response.data.subcategory);
      setQuesstionData(response.data.data);
      return response.data.data;
    } else {
      setHaveData(false);
      return [];
    }
  };

  const { isLoading: loadHaveData } = useQuery({
    queryKey: ["BDAQuestion", "HaveData"],
    queryFn: fetchSubmitedQuestion,
    enabled: true,
  });

  return (
    <OuterTemplate>
      {loadHaveData && <Loader />}
      {step === 0 ? (
        <ChooseIndustryTemplate
          up={up}
          defaultIndustry={industry}
          setIndustry={setIndustry}
          defaultSubIndustry={subIndustry}
          setSubIndustry={setSubIndustry}
          haveData={haveData}
          changed={changed}
          setChanged={setChanged}
        />
      ) : (
        <BDAQuestion
          down={down}
          type="website"
          industry={industry}
          subIndustry={subIndustry}
          chatBotId={params.id}
          haveData={haveData}
          changed={changed}
          questionData={quesstionData}
        />
      )}
    </OuterTemplate>
  );
};

export default Page;
