import { DashboardResultsProvider } from "../../../../contexts/DashboardResultsContext";
import useDashboard from "../../../../hooks/useDashboard";
import DashboardResults from "./DashboardResults";
const DashboardResultsWrapper = () => {
  const { selectedCycle, selectedUser } = useDashboard();
  return (
    <DashboardResultsProvider cycle_id={selectedCycle} user_id={selectedUser}>
      <DashboardResults />
    </DashboardResultsProvider>
  );
};

export default DashboardResultsWrapper;
