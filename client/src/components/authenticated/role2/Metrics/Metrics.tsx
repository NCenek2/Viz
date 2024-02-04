import { ChangeEvent, useState } from "react";
import { useMetric } from "../../../../hooks/useMetric";
import MetricsItem from "./MetricsItem";
import useRole2 from "../../../../hooks/useRole2";
import { useAlert } from "../../../../hooks/useAlert";
import { METRICS } from "../../../../constants/constants";

const Metrics = () => {
  const { metrics } = useRole2();
  const { addMetric } = useMetric();
  const { setAlert } = useAlert();
  const [metricName, setMetricName] = useState("");
  const [metricUnit, setMetricUnit] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "metricsName") {
      setMetricName((prev) => value);
    } else {
      setMetricUnit((prev) => value);
    }
  };

  const handleAdd = () => {
    let newMetricName = metricName.trim();
    let newMetricUnit = metricUnit.trim();
    if (!newMetricName || !newMetricName)
      return setAlert("Metric fields cannot be empty");

    if (newMetricName.length > METRICS.METRICS_NAME)
      return setAlert(
        `Metric name cannot exceed ${METRICS.METRICS_NAME} characters`
      );
    if (newMetricUnit.length > METRICS.METRICS_UNIT)
      return setAlert(
        `Metric unit cannot exceed ${METRICS.METRICS_UNIT} characters`
      );

    addMetric(newMetricName, newMetricUnit);
    setMetricName("");
    setMetricUnit("");
  };

  const metricStyle: any =
    metrics.length <= 0
      ? {
          gridColumn: "span 2",
        }
      : {};

  return (
    <>
      <div className="center-fixed-container metrics_container">
        <h1 className="metrics-title">Metrics</h1>
        <div className={`metrics_form_container`} style={metricStyle}>
          <label htmlFor={"metricsName"}>Metric</label>
          <input
            id={"metricsName"}
            type="text"
            maxLength={METRICS.METRICS_NAME}
            value={metricName}
            onChange={handleChange}
          />
          <label htmlFor={"metricsUnit"}>Unit</label>
          <input
            id={"metricsUnit"}
            type="text"
            maxLength={METRICS.METRICS_UNIT}
            value={metricUnit}
            onChange={handleChange}
          />
          <button
            onClick={handleAdd}
            className="btn add-color"
            disabled={!metricName || !metricUnit}
          >
            Add
          </button>
        </div>
        {metrics.length > 0 && (
          <div className="metrics-column">
            <ul className="list-group bg-transparent">
              {metrics.map((metric) => {
                const { metrics_id } = metric;
                return <MetricsItem key={metrics_id} {...metric} />;
              })}
            </ul>
          </div>
        )}
      </div>
    </>
  );
};

export default Metrics;
