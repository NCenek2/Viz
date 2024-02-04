import { MetricsProvider } from "../../../../contexts/MetricsContext";
import Metrics from "./Metrics";

const MetricsWrapper = () => {
  return (
    <MetricsProvider>
      <Metrics />
    </MetricsProvider>
  );
};

export default MetricsWrapper;
