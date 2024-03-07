import { CycleType } from "../../contexts/Role1Context";
import useAxiosPrivate from "../useAxiosPrivate";
import { useCreateCycle } from "../useCreateCycle";
import useHandleError from "../useHandleError";

const useCycleService = () => {
  const { state } = useCreateCycle();
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();

  async function getCycles() {
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

      return cyclesData;
    } catch (err) {
      handleError(err);
      return [];
    }
  }

  async function createCycle(): Promise<CycleType> {
    const { startDate } = state;
    const createCycleOptions = {
      url: "/cycles",
      method: "post",
      data: { startDate },
    };
    const newCycleResponse = await axiosPrivate(createCycleOptions);
    return newCycleResponse.data;
  }

  return { getCycles, createCycle };
};

export default useCycleService;
