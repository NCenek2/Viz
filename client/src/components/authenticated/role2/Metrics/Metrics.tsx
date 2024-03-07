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
    if (id === "metricName") {
      setMetricName((_) => value);
    } else {
      setMetricUnit((_) => value);
    }
  };

  const handleConfirm = () => {
    let newMetricName = metricName.trim();
    let newMetricUnit = metricUnit.trim();
    if (!newMetricName || !newMetricName)
      return setAlert("Metric fields cannot be empty");

    if (newMetricName.length > METRICS.metricName)
      return setAlert(
        `Metric name cannot exceed ${METRICS.metricName} characters`
      );
    if (newMetricUnit.length > METRICS.metricUnit)
      return setAlert(
        `Metric unit cannot exceed ${METRICS.metricUnit} characters`
      );

    setMetricName((_) => newMetricName);
    setMetricUnit((_) => newMetricUnit);
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
            <label htmlFor="metricName">
              Metric ({metricName.length}/{METRICS.metricName})
            </label>
            <input
              id="metricName"
              type="text"
              maxLength={METRICS.metricName}
              value={metricName}
              onChange={handleChange}
            />
            <label htmlFor="metricUnit">
              Unit ({metricUnit.length}/{METRICS.metricUnit})
            </label>
            <input
              id="metricUnit"
              type="text"
              maxLength={METRICS.metricUnit}
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
                  const { metricId } = metric;
                  return <MetricsItem key={metricId} {...metric} />;
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
