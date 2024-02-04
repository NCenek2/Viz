import { useContext } from "react";
import { MetricsContext, UseMetricsContext } from "../contexts/MetricsContext";

export const useMetric = () => {
  return useContext<UseMetricsContext>(MetricsContext);
};
