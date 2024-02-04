import { DashboardProvider } from "../../../../contexts/DashboardContext";
import Dashboard from "./Dashboard";

const DashboardWrapper = () => {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
};

export default DashboardWrapper;
