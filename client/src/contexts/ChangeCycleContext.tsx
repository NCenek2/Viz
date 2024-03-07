import { ReactNode, createContext } from "react";
import useRole1 from "../hooks/useRole1";

type ChangeCycleState = {
  current_cycle_date: string;
};

const initialChangeCycleContext: ChangeCycleState = {
  current_cycle_date: "",
};

const useChangeCycleContext = (initChangeCycleState: ChangeCycleState) => {
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
    <ChangeCycleContext.Provider
      value={useChangeCycleContext(initialChangeCycleContext)}
    >
      {children}
    </ChangeCycleContext.Provider>
  );
};
