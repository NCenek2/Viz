import { useNavigate } from "react-router";
import { useAlert } from "./useAlert";
import useAxiosPrivate from "./useAxiosPrivate";
import { useCreateCycle } from "./useCreateCycle";
import useRole1 from "./useRole1";
import useHandleError from "./useHandleError";

type MetricsCriteria = {
  criteria_id: number;
  metrics_id: number;
};

const useCreateCycleMetrics = () => {
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const { refreshRole1 } = useRole1();
  const { setAlert } = useAlert();
  const navigate = useNavigate();
  const { state, dispatch, CREATE_CYCLE_ACTIONS } = useCreateCycle();

  const create = async () => {
    const createCriteriaOptions = {
      url: "/metrics_criteria/createcycle",
      method: "post",
      data: { criteria: state.criteria },
    };

    const createCriteriaResponse = await axiosPrivate(createCriteriaOptions);
    const criteriaData: MetricsCriteria[] = createCriteriaResponse.data;

    const createCycleOptions = {
      url: "/cycles",
      method: "post",
      data: { start_date: state.date },
    };
    const newCycleData = await axiosPrivate(createCycleOptions);

    const createCycleMetricsOptions = {
      url: "/metric/createcycle",
      method: "post",
      data: {
        criteria: criteriaData,
        users: Array.from(state.users),
        cycle_id: newCycleData.data,
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
