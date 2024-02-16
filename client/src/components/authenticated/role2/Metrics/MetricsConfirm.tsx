import { useAlert } from "../../../../hooks/useAlert";
import { useMetric } from "../../../../hooks/useMetric";

type MetricsConfirmProps = {
  metricName: string;
  metricUnit: string;
  setMetricName: React.Dispatch<React.SetStateAction<string>>;
  setMetricUnit: React.Dispatch<React.SetStateAction<string>>;
  setConfirmMetric: React.Dispatch<React.SetStateAction<boolean>>;
};

const MetricsConfirm = ({
  metricName,
  metricUnit,
  setMetricName,
  setMetricUnit,
  setConfirmMetric,
}: MetricsConfirmProps) => {
  const { addMetric } = useMetric();
  const { setAlert } = useAlert();
  const handleAdd = () => {
    if (!metricName) return setAlert("Metric name cannot be empty");
    if (!metricUnit) return setAlert("Metric unit cannot be empty");

    addMetric(metricName, metricUnit);
    setMetricName("");
    setMetricUnit("");
    setConfirmMetric(false);
  };

  return (
    <div className="center-fixed-container w-100 text-center">
      <span>
        <h3>
          Add {metricName} - {metricUnit}?
        </h3>
      </span>
      <div className="d-flex justify-content-center mt-2">
        <button
          className="btn btn-red me-3"
          onClick={() => setConfirmMetric(false)}
        >
          Back
        </button>
        <button className="btn btn-green" onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  );
};

export default MetricsConfirm;
