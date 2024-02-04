import { useContext } from "react";
import {
  DashboardResultsContext,
  UseDashboardResultsContextType,
} from "../contexts/DashboardResultsContext";

const useDashboardResults = () => {
  return useContext<UseDashboardResultsContextType>(DashboardResultsContext);
};

export default useDashboardResults;
