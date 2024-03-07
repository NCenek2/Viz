import { ReactNode, createContext } from "react";
import useRole1 from "../hooks/useRole1";

const useChangeCycleContext = () => {
  const { currentCycle } = useRole1();
  const current_date = currentCycle?.startDate;
  return { current_date };
};

export type UseChangeCycleContext = ReturnType<typeof useChangeCycleContext>;

const initialUseChangeCycleContext: UseChangeCycleContext = {
  current_date: "",
};

export const ChangeCycleContext = createContext<UseChangeCycleContext>(
  initialUseChangeCycleContext
);

type ChildrenType = {
  children?: ReactNode | ReactNode[];
};

export const ChangeCycleProvider = ({ children }: ChildrenType) => {
  return (
    <ChangeCycleContext.Provider value={useChangeCycleContext()}>
      {children}
    </ChangeCycleContext.Provider>
  );
};
