import { useContext } from "react";
import {
  DashboardContext,
  UseDashboardContext,
} from "../contexts/DashboardContext";

const useDashboard = () => {
  return useContext<UseDashboardContext>(DashboardContext);
};

export default useDashboard;
