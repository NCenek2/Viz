import { ChangeCycleProvider } from "../../../../contexts/ChangeCycleContext";
import { DashboardProvider } from "../../../../contexts/DashboardContext";
import ChangeCurrentCycle from "./ChangeCycle";

const ChangeCycleWrapper = () => {
  return (
    <DashboardProvider>
      <ChangeCycleProvider>
        <ChangeCurrentCycle />
      </ChangeCycleProvider>
    </DashboardProvider>
  );
};

export default ChangeCycleWrapper;
