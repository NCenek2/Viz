import { DashboardResultsType } from "../contexts/DashboardResultsContext";
import { useAlert } from "./useAlert";
import useAxiosPrivate from "./useAxiosPrivate";
import useDashboardResults from "./useDashboardResults";
import useHandleError from "./useHandleError";

type UseUpdateDashboardResults = {
  updated: DashboardResultsType[];
};

const useUpdateDashboardResults = () => {
  const axiosPrivate = useAxiosPrivate();
  const { setAlert } = useAlert();
  const handleError = useHandleError();
  const { refreshDashboard } = useDashboardResults();

  const update = async ({ updated }: UseUpdateDashboardResults) => {
    try {
      const updateUserMetricsOptions = {
        url: "/metric/all",
        method: "patch",
        data: { updated },
      };

      let promiseArray = [];

      if (updated.length > 0)
        promiseArray.push(await axiosPrivate(updateUserMetricsOptions));

      await Promise.all(promiseArray);
      setAlert("Metrics Updated", "success");
      refreshDashboard();
    } catch (err) {
      handleError(err);
    }
  };

  return update;
};

export default useUpdateDashboardResults;
