import { useState, createContext, ReactNode, useEffect } from "react";
import { axiosPrivate } from "../api/axios";
import useAuth from "../hooks/useAuth";
import useRole1 from "../hooks/useRole1";
import useHandleError from "../hooks/useHandleError";

export type DashboardResultsType = {
  userMetricId: number;
  userMetricValue: number;
  metricId: number;
  metricName: string;
  metricUnit: string;
  startDate: string;
  weight: number;
  threshold: number;
};

const useDashboardResultsContext = (userId = 0, cycleId = 0) => {
  const { auth } = useAuth();
  const handleError = useHandleError();
  const { currentCycle } = useRole1();
  const [dashboardResults, setDashboardResults] = useState<
    DashboardResultsType[]
  >([]);
  const [madeChanges, setMadeChanges] = useState<boolean>(false);
  const [updatedSet, setUpdatedSet] = useState(new Set<number>());

  if (userId === 0) {
    userId = auth?.userInfo?.userId ?? userId;
  }

  async function refreshDashboard() {
    try {
      if (cycleId === 0) {
        if (currentCycle?.cycleId) {
          cycleId = currentCycle.cycleId ?? cycleId;
        }
      }

      const userCycleMetricsResponse = await axiosPrivate(
        `/user_metrics?userId=${userId}&cycleId=${cycleId}`
      );
      let userCycleMetricsData: DashboardResultsType[] =
        userCycleMetricsResponse.data;
      userCycleMetricsData.sort(
        (metricA, metricsB) => metricA.metricId - metricsB.metricId
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
  userId?: number;
  cycleId?: number;
};

export const DashboardResultsProvider = ({
  children,
  userId,
  cycleId,
}: ChildrenType & DashboardResultsProviderProps) => {
  return (
    <DashboardResultsContext.Provider
      value={useDashboardResultsContext(userId, cycleId)}
    >
      {children}
    </DashboardResultsContext.Provider>
  );
};
