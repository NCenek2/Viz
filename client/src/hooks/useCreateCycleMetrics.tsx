import { useNavigate } from "react-router";
import { useAlert } from "./useAlert";
import { useCreateCycle } from "./useCreateCycle";
import useRole1 from "./useRole1";
import useHandleError from "./useHandleError";
import { CycleType } from "../contexts/Role1Context";
import useCycleService from "./services/useCycleService";
import useMetricCriterionService from "./services/useMetricCriterionService";
import useUserMetricService from "./services/useUserMetricService";
import { ROUTE_PREFIX } from "../constants/constants";

export type MetricsCriterionId = {
  metricCriterionId: number;
};

const useCreateCycleMetrics = () => {
  const handleError = useHandleError();
  const { refreshRole1 } = useRole1();
  const { setAlert } = useAlert();
  const navigate = useNavigate();
  const { dispatch, CREATE_CYCLE_ACTIONS } = useCreateCycle();

  const { createCycle } = useCycleService();
  const { getCycleCriteria } = useMetricCriterionService();
  const { createUserCycleMetrics } = useUserMetricService();

  const createCycleData = async () => {
    try {
      const criteriaData: MetricsCriterionId[] = await getCycleCriteria();
      const newCycleData: CycleType = await createCycle();
      await createUserCycleMetrics(criteriaData, newCycleData);

      dispatch({ type: CREATE_CYCLE_ACTIONS.CREATE });
      await refreshRole1();
      setAlert("Cycle Created", "success");
      navigate(`${ROUTE_PREFIX}/rankings`);
    } catch (err) {
      handleError(err);
    }
  };

  return createCycleData;
};

export default useCreateCycleMetrics;
