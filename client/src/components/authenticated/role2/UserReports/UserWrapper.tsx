import { DashboardProvider } from "../../../../contexts/DashboardContext";
import UserReports from "./UserReports";

const UserReportsWrapper = () => {
  return (
    <DashboardProvider>
      <UserReports />
    </DashboardProvider>
  );
};

export default UserReportsWrapper;
