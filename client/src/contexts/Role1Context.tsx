import { ReactNode, createContext, useEffect, useState } from "react";
import useHandleError from "../hooks/useHandleError";
import useCycleService from "../hooks/services/useCycleService";
import useCurrentCycleService from "../hooks/services/useCurrentCycleService";

export type CurrentCycleType = {
  cycleId: number;
  startDate: string;
};

export type CycleType = {
  cycleId: number;
  startDate: string;
};

type Role1State = {
  cycles: CycleType[];
  currentCycle: CurrentCycleType;
};

const initialRole1State: Role1State = {
  cycles: [],
  currentCycle: { cycleId: 0, startDate: "" },
};

const useRole1Context = (initRole1State: Role1State) => {
  const handleError = useHandleError();
  const [cycles, setCycles] = useState(initRole1State.cycles);
  const [currentCycle, setCurrentCycle] = useState(initRole1State.currentCycle);
  const { getCycles } = useCycleService();
  const { getCurrentCycle } = useCurrentCycleService();

  async function refreshRole1() {
    try {
      const cyclesData = await getCycles();
      setCycles(cyclesData);
      const currentCycle: CurrentCycleType = await getCurrentCycle();
      setCurrentCycle({
        ...currentCycle,
        startDate: new Date(currentCycle.startDate).toDateString(),
      });
    } catch (err) {
      handleError(err);
    }
  }

  useEffect(() => {
    refreshRole1();
  }, []);

  return {
    cycles,
    setCycles,
    currentCycle,
    setCurrentCycle,
    refreshRole1,
  };
};

export type UseRole1ContextType = ReturnType<typeof useRole1Context>;

const initialRole1ContextType: UseRole1ContextType = {
  cycles: initialRole1State.cycles,
  setCycles: () => {},
  currentCycle: initialRole1State.currentCycle,
  setCurrentCycle: () => {},
  refreshRole1: async () => {},
};

export const Role1Context = createContext<UseRole1ContextType>(
  initialRole1ContextType
);

type ChildrenType = {
  children?: ReactNode | ReactNode[];
};

export const Role1Provider = ({ children }: ChildrenType) => {
  return (
    <Role1Context.Provider value={useRole1Context(initialRole1State)}>
      {children}
    </Role1Context.Provider>
  );
};
