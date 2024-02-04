import { ReactNode, createContext, useCallback } from "react";
import { MetricsType } from "./Role2Context";
import useRole2 from "../hooks/useRole2";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useAlert } from "../hooks/useAlert";
import useHandleError from "../hooks/useHandleError";

const METRICS_ACTION_TYPE = {
  ADD_METRIC: "ADD_METRIC",
};

type METRICS_TYPE = typeof METRICS_ACTION_TYPE;

type MetricActionType = {
  type: string;
  payload?: MetricsType;
};

type MetricsState = {
  metrics: MetricsType[];
  updated: MetricsType[];
};

const initialMetricsState: MetricsState = {
  metrics: [],
  updated: [],
};

const useMetricsContext = (initMetricsState: MetricsState) => {
  const axiosPrivate = useAxiosPrivate();
  const handleError = useHandleError();
  const { setAlert } = useAlert();
  const { refreshRole2 } = useRole2();

  async function addMetric(metrics_name: string, metrics_unit: string) {
    try {
      await axiosPrivate({
        url: "/metrics",
        method: "post",
        data: { metrics_name, metrics_unit },
      });

      refreshRole2();
      setAlert("New Metric Created!", "success");
    } catch (err) {
      handleError(err);
    }
  }

  return { addMetric };
};

export type UseMetricsContext = ReturnType<typeof useMetricsContext>;

const initialUseMetricsContext: UseMetricsContext = {
  addMetric: async () => {},
};

export const MetricsContext = createContext<UseMetricsContext>(
  initialUseMetricsContext
);

type ChildrenType = {
  children?: ReactNode | ReactNode[];
};

export const MetricsProvider = ({ children }: ChildrenType) => {
  return (
    <MetricsContext.Provider value={useMetricsContext(initialMetricsState)}>
      {children}
    </MetricsContext.Provider>
  );
};
