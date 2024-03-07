import { MetricsType } from "../../contexts/Role2Context";
import { useAlert } from "../useAlert";
import useAxiosPrivate from "../useAxiosPrivate";
import useHandleError from "../useHandleError";
import useRole2 from "../useRole2";

const useMetricService = () => {
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const { setAlert } = useAlert();
  const { refreshRole2 } = useRole2();

  async function getMetrics() {
    try {
      const metricsResponse = await axiosPrivate.get("/metrics");
      let metricsData: MetricsType[] = metricsResponse.data;
      metricsData.sort(
        (metricA, metricB) => metricA.metricId - metricB.metricId
      );

      return metricsData;
    } catch (err) {
      handleError(err);
      return [];
    }
  }

  async function createMetric(metricName: string, metricUnit: string) {
    try {
      await axiosPrivate({
        url: "/metrics",
        method: "post",
        data: { metricName, metricUnit },
      });

      await refreshRole2();
      setAlert("New Metric Created", "success");
    } catch (err) {
      handleError(err);
    }
  }

  return { getMetrics, createMetric };
};

export default useMetricService;
