import { useNavigate } from "react-router";
import { useAlert } from "./useAlert";
import useAxiosPrivate from "./useAxiosPrivate";
import { useCreateCycle } from "./useCreateCycle";
import useRole1 from "./useRole1";
import useHandleError from "./useHandleError";
import { CycleType } from "../contexts/Role1Context";

type MetricsCriteria = {
  metricCriterionId: number;
};

const useCreateCycleMetrics = () => {
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const { refreshRole1 } = useRole1();
  const { setAlert } = useAlert();
  const navigate = useNavigate();
  const { state, dispatch, CREATE_CYCLE_ACTIONS } = useCreateCycle();

  const create = async () => {
    const { criteria, startDate, users, metrics } = state;
    const createCriteriaOptions = {
      url: "/metric_criteria/createcycle",
      method: "post",
      data: criteria,
    };

    const createCriteriaResponse = await axiosPrivate(createCriteriaOptions);
    const criteriaData: MetricsCriteria[] = createCriteriaResponse.data;

    const createCycleOptions = {
      url: "/cycles",
      method: "post",
      data: { startDate },
    };
    const newCycleResponse = await axiosPrivate(createCycleOptions);
    const newCycleData: CycleType = newCycleResponse.data;
    let { cycleId } = newCycleData;

    const metricItems = metrics.map((metric, index) => {
      const { metricId } = metric;
      const metricCriterionId = criteriaData[index];
      return { metricId, metricCriterionId };
    });

    const createCycleMetricsOptions = {
      url: "/user_metrics/createcycle",
      method: "post",
      data: {
        cycleId,
        metricItems,
        userIds: Array.from(users),
      },
    };

    try {
      await Promise.all([await axiosPrivate(createCycleMetricsOptions)]);
      dispatch({ type: CREATE_CYCLE_ACTIONS.CREATE });
      refreshRole1();
      setAlert("Cycle Created!", "success");
      navigate("/rankings");
    } catch (err) {
      handleError(err);
    }
  };

  return create;
};

export default useCreateCycleMetrics;
