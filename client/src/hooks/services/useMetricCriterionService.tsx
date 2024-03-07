import useAxiosPrivate from "../useAxiosPrivate";
import { useCreateCycle } from "../useCreateCycle";

const useMetricCriterionService = () => {
  const { state } = useCreateCycle();
  const axiosPrivate = useAxiosPrivate();

  async function getCycleCriteria() {
    const { criteria } = state;
    const createCriteriaOptions = {
      url: "/metric_criteria/createcycle",
      method: "post",
      data: criteria,
    };

    const createCriteriaResponse = await axiosPrivate(createCriteriaOptions);
    return createCriteriaResponse.data;
  }
  return { getCycleCriteria };
};

export default useMetricCriterionService;
