import { DashboardProvider } from "../../../../contexts/DashboardContext";
import Reports from "./Reports";

const ReportsWrapper = () => {
  return (
    <DashboardProvider>
      <Reports />
    </DashboardProvider>
  );
};

export default ReportsWrapper;
