import { ChangeEvent, useState } from "react";
import { DashboardResultsType } from "../../../../contexts/DashboardResultsContext";
import useDashboardResults from "../../../../hooks/useDashboardResults";

const DashboardResultsItem = ({
  metricName,
  userMetricValue,
  metricUnit,
  userMetricId,
  weight,
  threshold,
}: Omit<DashboardResultsType, "metricId" | "startDate">) => {
  const [currentValue, setCurrentValue] = useState<string>(
    userMetricValue.toString()
  );

  const { setMadeChanges, updatedSet, setUpdatedSet, setDashboardResults } =
    useDashboardResults();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMadeChanges(true);
    const { value } = e.target;
    setCurrentValue((_) => value);

    if (userMetricId !== -1 && !updatedSet.has(userMetricId)) {
      setUpdatedSet((prevUpdatedSet) => {
        prevUpdatedSet.add(userMetricId);
        return prevUpdatedSet;
      });
    }

    let userMetricValue: number;
    userMetricValue = parseFloat(value);
    if (userMetricValue) {
      setDashboardResults((prevDashboardResults) =>
        prevDashboardResults.map((dashboardResult) => {
          if (dashboardResult.userMetricId === userMetricId) {
            return { ...dashboardResult, userMetricValue };
          }
          return dashboardResult;
        })
      );
    }
  };

  return (
    <div className="d-flex flex-column m-2">
      <h4>
        {metricName}{" "}
        <span className="dashboard-results-weight">({weight})</span>
      </h4>
      <label htmlFor={userMetricId.toString()}>
        {threshold} ({metricUnit})
      </label>
      <input
        id={userMetricId.toString()}
        value={currentValue}
        onChange={handleChange}
      />
    </div>
  );
};

export default DashboardResultsItem;
