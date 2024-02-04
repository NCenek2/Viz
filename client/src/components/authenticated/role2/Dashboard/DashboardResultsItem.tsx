import { ChangeEvent, useState } from "react";
import { DashboardResultsType } from "../../../../contexts/DashboardResultsContext";
import useDashboardResults from "../../../../hooks/useDashboardResults";

const DashboardResultsItem = ({
  metrics_name,
  metric_value,
  metrics_unit,
  metric_id,
  weight,
  threshold,
}: Omit<DashboardResultsType, "metrics_id" | "start_date">) => {
  const [currentValue, setCurrentValue] = useState<string>(
    metric_value.toString()
  );

  const { setMadeChanges, updatedSet, setUpdatedSet, setDashboardResults } =
    useDashboardResults();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMadeChanges(true);
    const { value } = e.target;
    setCurrentValue((prev) => value);

    if (metric_id !== -1 && !updatedSet.has(metric_id)) {
      setUpdatedSet((prevUpdatedSet) => {
        prevUpdatedSet.add(metric_id);
        return prevUpdatedSet;
      });
    }

    let new_metric_id: number;
    new_metric_id = parseFloat(value);

    if (new_metric_id) {
      setDashboardResults((prevDashboardResults) =>
        prevDashboardResults.map((dashboardResult) => {
          if (dashboardResult.metric_id === metric_id) {
            return { ...dashboardResult, metric_value: new_metric_id };
          }
          return dashboardResult;
        })
      );
    }
  };

  return (
    <div className="d-flex flex-column m-2">
      <h4>
        {metrics_name}{" "}
        <span className="dashboard-results-weight">({weight})</span>
      </h4>
      <label htmlFor={metric_id.toString()}>
        {threshold} ({metrics_unit})
      </label>
      <input
        id={metric_id.toString()}
        value={currentValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default DashboardResultsItem;
