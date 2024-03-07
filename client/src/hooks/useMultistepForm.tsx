import React, { ReactElement } from "react";

export function useMultistepForm(steps: ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = React.useState(0);

  const next = () => {
    setCurrentStepIndex((prev) => {
      return Math.min(prev + 1, steps.length - 1);
    });
  };
  const back = () => {
    setCurrentStepIndex((prev) => {
      return Math.max(0, prev - 1);
    });
  };
  const goTo = (index: number) => {
    setCurrentStepIndex(index);
  };

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    goTo,
    next,
    back,
    steps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
  };
}
