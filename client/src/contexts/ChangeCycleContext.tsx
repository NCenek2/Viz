import { ReactNode, createContext } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useDashboard from "../hooks/useDashboard";
import useRole1 from "../hooks/useRole1";
import { useAlert } from "../hooks/useAlert";
import useHandleError from "../hooks/useHandleError";

type ChangeCycleState = {
  current_cycle_date: string;
};

const initialChangeCycleContext: ChangeCycleState = {
  current_cycle_date: "",
};

const useChangeCycleContext = (initChangeCycleState: ChangeCycleState) => {
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const { setAlert } = useAlert();
  const { refreshRole1, currentCycle } = useRole1();
  const { selectedCycle } = useDashboard();

  async function changeCycle() {
    const cycleId = selectedCycle;
    if (!cycleId || cycleId == 0 || cycleId == currentCycle.cycleId) return;

    try {
      await axiosPrivate({
        url: `/current_cycles`,
        method: "patch",
        data: { cycleId },
      });

      setAlert("Current Cycle Updated", "success");
      refreshRole1();
    } catch (err) {
      handleError(err);
    }
  }

  const current_date = currentCycle?.startDate;
  return { current_date, changeCycle };
};

export type UseChangeCycleContext = ReturnType<typeof useChangeCycleContext>;

const initialUseChangeCycleContext: UseChangeCycleContext = {
  current_date: "",
  changeCycle: async () => {},
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
