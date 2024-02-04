import { ReactNode, createContext, useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useHandleError from "../hooks/useHandleError";

export type CurrentCycleType = {
  cycle_id: number;
  start_date: string;
};

export type CyclesType = {
  cycle_id: number;
  start_date: string;
};

type Role1State = {
  cycles: CyclesType[];
  currentCycle: CurrentCycleType;
};

const initialRole1State: Role1State = {
  cycles: [],
  currentCycle: { cycle_id: 0, start_date: "" },
};

const useRole1Context = (initRole1State: Role1State) => {
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const [cycles, setCycles] = useState(initRole1State.cycles);
  const [currentCycle, setCurrentCycle] = useState(initRole1State.currentCycle);

  async function refreshRole1() {
    try {
      const cyclesResponse = await axiosPrivate("/cycles");
      let cyclesData: CyclesType[] = cyclesResponse.data;
      cyclesData.sort((cycleA, cycleB) => {
        return (
          new Date(cycleB.start_date).getTime() -
          new Date(cycleA.start_date).getTime()
        );
      });

      cyclesData = cyclesData.map((cycle) => {
        return {
          ...cycle,
          start_date: new Date(cycle.start_date).toDateString(),
        };
      });

      const currentCycleResponse = await axiosPrivate.get("current_cycle");
      const currentCycle: CurrentCycleType = currentCycleResponse.data;

      setCycles(cyclesData);
      setCurrentCycle({
        ...currentCycle,
        start_date: new Date(currentCycle.start_date).toDateString(),
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
