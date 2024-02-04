import useDashboardResults from "../../../../hooks/useDashboardResults";
import DashboardResultsItem from "./DashboardResultsItem";
import { DashboardResultsType } from "../../../../contexts/DashboardResultsContext";
import useUpdateDashboardResults from "../../../../hooks/useUpdateDashboardResults";
import { useAlert } from "../../../../hooks/useAlert";

const Main = () => {
  const {
    dashboardResults,
    madeChanges,
    setMadeChanges,
    updatedSet,
    setUpdatedSet,
  } = useDashboardResults();
  const update = useUpdateDashboardResults();

  const { setAlert, hideAlert } = useAlert();

  if (!dashboardResults.length)
    return (
      <div className="home-container">
        <h1 className="text-white">No Cycle Data</h1>
      </div>
    );

  const startDate = dashboardResults[0].start_date;

  const notFloats = () => {
    dashboardResults.map((dashboardResult) => {
      const newValue = parseFloat(dashboardResult.metric_value.toString());
      if (!newValue) {
        setAlert("Values are not floats");
        return true;
      }
    });
    return false;
  };

  const handleUpdate = () => {
    if (notFloats()) return;

    let updated: DashboardResultsType[] = [];

    for (let dashboardResult of dashboardResults) {
      if (updatedSet.has(dashboardResult.metric_id)) {
        updated.push(dashboardResult);
      }
    }

    update({ updated });
    setMadeChanges(false);
    setUpdatedSet(new Set<number>());
    hideAlert();
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
          {dashboardResults.map((user_metric) => {
            const { metric_id } = user_metric;
            return <DashboardResultsItem key={metric_id} {...user_metric} />;
          })}
        </div>
      </div>
    </>
  );
};

export default Main;
