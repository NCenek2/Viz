import useDashboardResults from "../../../../hooks/useDashboardResults";
import DashboardResultsItem from "./DashboardResultsItem";
import { DashboardResultsType } from "../../../../contexts/DashboardResultsContext";
import { useAlert } from "../../../../hooks/useAlert";
import useUserMetricService from "../../../../hooks/services/useUserMetricService";

const Main = () => {
  const {
    dashboardResults,
    madeChanges,
    setMadeChanges,
    updatedSet,
    setUpdatedSet,
  } = useDashboardResults();
  const { updateDashboardUserMetrics } = useUserMetricService();

  const { setAlert } = useAlert();

  if (!dashboardResults.length)
    return (
      <div className="home-container">
        <h1 className="text-white">No Cycle Data</h1>
      </div>
    );

  const startDate = dashboardResults[0].startDate;

  const notFloats = () => {
    for (let dashboardResult of dashboardResults) {
      const newValue = parseFloat(dashboardResult.userMetricValue.toString());
      if (!newValue) {
        setAlert("Values are not floats");
        return true;
      }
    }

    return false;
  };

  const handleUpdate = async () => {
    if (notFloats()) return;

    let updated: DashboardResultsType[] = [];

    for (let dashboardResult of dashboardResults) {
      if (updatedSet.has(dashboardResult.userMetricId)) {
        updated.push(dashboardResult);
      }
    }

    await updateDashboardUserMetrics({ updated });
    setMadeChanges(false);
    setUpdatedSet(new Set<number>());
  };

  return (
    <>
      <div className="dashboard-results-container">
        {madeChanges && (
          <button className="btn add-color update-btn" onClick={handleUpdate}>
            Update
          </button>
        )}
        <h2>Cycle of {new Date(startDate).toDateString()}</h2>
        <div className="dashboard-results">
          {dashboardResults.map((user_metrics) => {
            const { userMetricId } = user_metrics;
            return (
              <DashboardResultsItem key={userMetricId} {...user_metrics} />
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Main;
