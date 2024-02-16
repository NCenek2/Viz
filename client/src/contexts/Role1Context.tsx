import { ReactNode, createContext, useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useHandleError from "../hooks/useHandleError";

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
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const [cycles, setCycles] = useState(initRole1State.cycles);
  const [currentCycle, setCurrentCycle] = useState(initRole1State.currentCycle);

  async function refreshRole1() {
    try {
      const cyclesResponse = await axiosPrivate("/cycles");
      let cyclesData: CycleType[] = cyclesResponse.data;
      cyclesData.sort((cycleA, cycleB) => {
        return (
          new Date(cycleB.startDate).getTime() -
          new Date(cycleA.startDate).getTime()
        );
      });

      cyclesData = cyclesData.map((cycle) => {
        return {
          ...cycle,
          startDate: new Date(cycle.startDate).toDateString(),
        };
      });

      const currentCycleResponse = await axiosPrivate.get("current_cycles");
      const currentCycle: CurrentCycleType = currentCycleResponse.data;

      setCycles(cyclesData);
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
