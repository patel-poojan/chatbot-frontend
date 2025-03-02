'use client';
import React from 'react';

interface StepIndicatorProps {
  stepNumber: number;
  isActive: boolean;
  isCompleted: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  stepNumber,
  isActive,
  isCompleted,
}) => (
  <div
    className={`rounded-full p-2 w-8 h-8 flex items-center justify-center ${
      isActive || isCompleted ? 'blue-gradient' : 'bg-[#CCCCCC]'
    } text-white`}
  >
    {stepNumber}
  </div>
);

interface StepConnectorProps {
  isActive: boolean;
}

const StepConnector: React.FC<StepConnectorProps> = ({ isActive }) => (
  <div
    className={`w-24 sm:w-64 h-px border ${
      isActive ? 'border-[#57C0DD]' : 'border-[#CCCCCC]'
    } border-dashed`}
  ></div>
);

interface Step {
  id: number;
  label: string;
  active: number;
}

interface ProgressStepperProps {
  currentStep: number;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({ currentStep }) => {
  const steps: Step[] = [
    { id: 0, label: 'Select Industry', active: 0 },
    { id: 2, label: 'Train Agent', active: 1 },
    { id: 3, label: 'Tune Agent', active: 2 },
  ];

  return (
    <div className='w-fit md:mx-5 mx-auto'>
      <div className='flex items-center gap-1 px-9'>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <StepIndicator
              stepNumber={step.active}
              isActive={currentStep >= step.id}
              isCompleted={currentStep > step.id}
            />
            {index < steps.length - 1 && (
              <StepConnector isActive={currentStep > step.id} />
            )}
          </React.Fragment>
        ))}
      </div>
      <div className='flex justify-between mt-2 text-sm sm:text-base'>
        {steps.map((step) => (
          <div key={`label-${step.id}`} className='text-black font-semibold'>
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressStepper;
