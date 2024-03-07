import { ReactNode, createContext } from "react";
import { MetricsType } from "./Role2Context";

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
  return {};
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
