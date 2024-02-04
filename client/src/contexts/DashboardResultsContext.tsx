import { useState, createContext, ReactNode, useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useAuth from "../hooks/useAuth";
import useRole1 from "../hooks/useRole1";
import useHandleError from "../hooks/useHandleError";

export type DashboardResultsType = {
  metric_id: number;
  metric_value: number;
  metrics_id: number;
  metrics_name: string;
  metrics_unit: string;
  start_date: string;
  weight: number;
  threshold: number;
};

const useDashboardResultsContext = (user_id = 0, cycle_id = 0) => {
  const { auth } = useAuth();
  const handleError = useHandleError();
  const { currentCycle } = useRole1();
  const [dashboardResults, setDashboardResults] = useState<
    DashboardResultsType[]
  >([]);
  const [madeChanges, setMadeChanges] = useState<boolean>(false);
  const [updatedSet, setUpdatedSet] = useState(new Set<number>());

  if (user_id === 0) {
    user_id = auth?.userInfo?.user_id ?? user_id;
  }

  async function refreshDashboard() {
    try {
      if (cycle_id === 0) {
        if (currentCycle?.cycle_id) {
          cycle_id = currentCycle.cycle_id ?? cycle_id;
        }
      }

      const userCycleMetricsResponse = await axiosPrivate(
        `/metric?user_id=${user_id}&cycle_id=${cycle_id}`
      );
      let userCycleMetricsData: DashboardResultsType[] =
        userCycleMetricsResponse.data;
      userCycleMetricsData.sort(
        (metricA, metricsB) => metricA.metrics_id - metricsB.metrics_id
      );

      setDashboardResults(userCycleMetricsData);
    } catch (err) {
      handleError(err);
    }
  }

  useEffect(() => {
    refreshDashboard();
  }, []);

  return {
    dashboardResults,
    setDashboardResults,
    madeChanges,
    setMadeChanges,
    updatedSet,
    setUpdatedSet,
    refreshDashboard,
  };
};

export type UseDashboardResultsContextType = ReturnType<
  typeof useDashboardResultsContext
>;

const useDashboardResultsContextType: UseDashboardResultsContextType = {
  dashboardResults: [],
  setDashboardResults: () => {},
  madeChanges: false,
  setMadeChanges: () => {},
  updatedSet: new Set<number>(),
  setUpdatedSet: () => {},
  refreshDashboard: async () => {},
};

export const DashboardResultsContext =
  createContext<UseDashboardResultsContextType>(useDashboardResultsContextType);

type ChildrenType = {
  children?: ReactNode | ReactNode[];
};

type DashboardResultsProviderProps = {
  user_id?: number;
  cycle_id?: number;
};

export const DashboardResultsProvider = ({
  children,
  user_id,
  cycle_id,
}: ChildrenType & DashboardResultsProviderProps) => {
  return (
    <DashboardResultsContext.Provider
      value={useDashboardResultsContext(user_id, cycle_id)}
    >
      {children}
    </DashboardResultsContext.Provider>
  );
};
