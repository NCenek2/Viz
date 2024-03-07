import { useAlert } from "../useAlert";
import useAxiosPrivate from "../useAxiosPrivate";
import useDashboard from "../useDashboard";
import useHandleError from "../useHandleError";
import useRole1 from "../useRole1";

const useCurrentCycleService = () => {
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const { setAlert } = useAlert();
  const { refreshRole1, currentCycle } = useRole1();
  const { selectedCycle } = useDashboard();

  async function getCurrentCycle() {
    try {
      const response = await axiosPrivate.get("current_cycles");
      return response.data;
    } catch (err) {
      handleError(err);
      return { cycleId: 0, startDate: "" };
    }
  }

  async function changeCurrentCycle() {
    const cycleId = selectedCycle;
    if (!cycleId || cycleId == 0 || cycleId == currentCycle.cycleId) return;

    try {
      await axiosPrivate({
        url: `/current_cycles`,
        method: "patch",
        data: { cycleId },
      });

      await refreshRole1();
      setAlert("Current Cycle Updated", "success");
    } catch (err) {
      handleError(err);
    }
  }

  return { getCurrentCycle, changeCurrentCycle };
};

export default useCurrentCycleService;
