import { ChangeEvent, useState } from "react";
import MetricsItem from "./MetricsItem";
import useRole2 from "../../../../hooks/useRole2";
import { useAlert } from "../../../../hooks/useAlert";
import { METRICS } from "../../../../constants/constants";
import MetricsConfirm from "./MetricsConfirm";

const Metrics = () => {
  const { metrics } = useRole2();
  const { setAlert } = useAlert();
  const [confirmMetric, setConfirmMetric] = useState(false);
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

  const handleConfirm = () => {
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

    setMetricName((prevMetricName) => newMetricName);
    setMetricUnit((prevUnitName) => newMetricUnit);
    setConfirmMetric(true);
  };

  const metricStyle: any =
    metrics.length <= 0
      ? {
          gridColumn: "span 2",
        }
      : {};

  return (
    <>
      {confirmMetric ? (
        <MetricsConfirm
          metricName={metricName}
          metricUnit={metricUnit}
          setMetricName={setMetricName}
          setMetricUnit={setMetricUnit}
          setConfirmMetric={setConfirmMetric}
        />
      ) : (
        <div className="center-fixed-container metrics_container">
          <h1 className="metrics-title">Metrics</h1>
          <div className={`metrics_form_container`} style={metricStyle}>
            <label htmlFor={"metricsName"}>
              Metric ({metricName.length}/{METRICS.METRICS_NAME})
            </label>
            <input
              id={"metricsName"}
              type="text"
              maxLength={METRICS.METRICS_NAME}
              value={metricName}
              onChange={handleChange}
            />
            <label htmlFor={"metricsUnit"}>
              Unit ({metricUnit.length}/{METRICS.METRICS_UNIT})
            </label>
            <input
              id={"metricsUnit"}
              type="text"
              maxLength={METRICS.METRICS_UNIT}
              value={metricUnit}
              onChange={handleChange}
            />
            <button
              onClick={handleConfirm}
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
      )}
    </>
  );
};

export default Metrics;
